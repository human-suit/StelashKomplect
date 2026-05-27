import { getCityByIdFromContent } from "@/lib/content/cities";
import { formatPrice } from "@/lib/products";
import type { StoredOrder } from "@/lib/server/orders-store";
import { isPaymentTestMode } from "@/lib/payments/config";
import { escapeHtml } from "@/lib/server/telegram";

async function resolvePickupLabel(
  cityId: string,
  locationId?: string,
): Promise<string> {
  const city = await getCityByIdFromContent(cityId);
  if (!city || !locationId) return locationId ?? "—";
  const loc = city.locations.find((l) => l.id === locationId);
  return loc ? `${loc.label}: ${loc.address}` : locationId;
}

export async function formatOrderForTelegramHtml(
  order: StoredOrder,
): Promise<string> {
  const city = await getCityByIdFromContent(order.cityId);
  const cityName = city?.name ?? order.cityId;
  const phoneClean = order.phone.replace(/\D/g, "");
  const phoneLink =
    phoneClean.length >= 10
      ? `+${phoneClean.startsWith("7") ? phoneClean : `7${phoneClean.slice(-10)}`}`
      : order.phone;

  const lines: string[] = [
    `🛒 <b>Заявка ${escapeHtml(order.orderNumber)}</b>`,
    "",
    `👤 <b>${escapeHtml(order.name)}</b>`,
    `📞 <a href="tel:${phoneLink}">${escapeHtml(order.phone)}</a>`,
  ];

  if (order.email) {
    lines.push(`✉️ ${escapeHtml(order.email)}`);
  }

  const pickupLabel = await resolvePickupLabel(
    order.cityId,
    order.pickupLocationId,
  );

  lines.push(`📍 ${escapeHtml(cityName)}`);

  if (order.deliveryType === "consultation") {
    lines.push("💬 Заявка на консультацию");
  } else if (order.deliveryType === "pickup") {
    lines.push(`🏪 Самовывоз: ${escapeHtml(pickupLabel)}`);
  } else {
    lines.push(`🚚 Доставка: ${escapeHtml(order.address ?? "—")}`);
  }

  lines.push(
    order.clientType === "company"
      ? `🏢 ${escapeHtml(order.companyName ?? "Юридическое лицо")}`
      : "👤 Физическое лицо",
  );

  if (order.paymentMethod) {
    const paymentLabel =
      order.paymentMethod === "online_card"
        ? "Онлайн картой (сразу списание)"
        : order.paymentMethod === "invoice"
          ? "Безналичный расчёт (счёт)"
          : "Наличными при получении";
    lines.push(`💳 Оплата: ${escapeHtml(paymentLabel)}`);
  }

  if (order.items.length > 0) {
    lines.push("", "<b>Товары:</b>");
    for (const item of order.items) {
      const sum = item.price * item.quantity;
      lines.push(
        `• ${escapeHtml(item.name)} × ${item.quantity} — ${formatPrice(sum)}`,
      );
    }
  } else {
    lines.push("", "<i>Корзина пуста — заявка на консультацию</i>");
  }

  lines.push(
    "",
    formatCalculationHtml(order),
  );

  if (order.comment) {
    lines.push("", `💬 ${escapeHtml(order.comment)}`);
  }

  lines.push(
    "",
    `<i>${new Date(order.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Yekaterinburg" })}</i>`,
  );

  return lines.join("\n");
}

function formatCalculationHtml(order: StoredOrder): string {
  const calc = order.calculation;
  const parts = [`💰 <b>Итого (расчёт сайта): ${formatPrice(calc.total)}</b>`];

  if (calc.delivery > 0) parts.push(`Доставка: ${formatPrice(calc.delivery)}`);
  if (calc.assembly > 0) parts.push(`Сборка: ${formatPrice(calc.assembly)}`);
  if (calc.discount > 0) parts.push(`Скидка: −${formatPrice(calc.discount)}`);

  // Если заказ попал в онлайн-оплату, покажем сумму к списанию.
  if (
    order.paymentMethod === "online_card" &&
    order.chargeAmountRub != null &&
    Number.isFinite(order.chargeAmountRub) &&
    order.chargeAmountRub > 0
  ) {
    const suffix = isPaymentTestMode() ? " (тест)" : "";
    parts.push(`💳 К оплате: ${formatPrice(order.chargeAmountRub)}${suffix}`);
  }

  return parts.join("\n");
}

/** Plain text fallback */
export async function formatOrderForTelegramPlain(
  order: StoredOrder,
): Promise<string> {
  const html = await formatOrderForTelegramHtml(order);
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
