import { calculateCart } from "@/lib/calculator";
import { listProducts } from "@/lib/content/products";
import { getCityByIdFromContent } from "@/lib/content/cities";
import type { Product } from "@/lib/products";
import { normalizePhone, isValidEmail } from "@/lib/validation";
import type { OrderPayload } from "@/lib/server/orders-store";
import type { CartItem } from "@/store/cart-store";

export type OrderValidationResult =
  | { ok: true; payload: OrderPayload }
  | { ok: false; error: string };

export async function validateOrderPayload(
  raw: OrderPayload,
): Promise<OrderValidationResult> {
  const name = raw.name?.trim();
  const phone = normalizePhone(raw.phone?.trim() ?? "");

  if (!name || name.length < 2) {
    return { ok: false, error: "Укажите имя (минимум 2 символа)" };
  }
  if (!phone) {
    return { ok: false, error: "Укажите корректный номер телефона" };
  }

  const email = raw.email?.trim();
  if (email && !isValidEmail(email)) {
    return { ok: false, error: "Некорректный email" };
  }

  const city = await getCityByIdFromContent(raw.cityId);
  if (!city) {
    return { ok: false, error: "Выберите город" };
  }

  const deliveryType =
    raw.deliveryType === "delivery"
      ? "delivery"
      : raw.deliveryType === "consultation"
        ? "consultation"
        : "pickup";

  if (deliveryType === "pickup" && !raw.pickupLocationId) {
    return { ok: false, error: "Выберите пункт самовывоза" };
  }

  if (deliveryType === "pickup" && raw.pickupLocationId) {
    const loc = city.locations.find((l) => l.id === raw.pickupLocationId);
    if (!loc) {
      return { ok: false, error: "Выберите пункт самовывоза" };
    }
  }

  if (deliveryType === "delivery" && !raw.address?.trim()) {
    return { ok: false, error: "Укажите адрес доставки" };
  }

  const clientType = raw.clientType === "company" ? "company" : "person";
  if (clientType === "company" && !raw.companyName?.trim()) {
    return { ok: false, error: "Укажите название организации" };
  }

  const paymentMethod =
    raw.paymentMethod === "online_card" ||
    raw.paymentMethod === "invoice" ||
    raw.paymentMethod === "cash"
      ? raw.paymentMethod
      : "cash";

  const catalog = await listProducts();
  const validatedItems = validateCartItems(raw.items ?? [], catalog);
  if ("error" in validatedItems) {
    return { ok: false, error: validatedItems.error };
  }

  const itemCount = validatedItems.reduce((n, i) => n + i.quantity, 0);
  const subtotal = validatedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  const deliveryEnabled = deliveryType === "delivery";
  const assemblyEnabled =
    raw.assemblyEnabled ??
    (raw.calculation?.assembly != null && raw.calculation.assembly > 0);

  const calculation = calculateCart({
    subtotal,
    itemCount,
    deliveryEnabled,
    assemblyEnabled,
    isUfa: raw.cityId === "ufa",
  });

  return {
    ok: true,
    payload: {
      name,
      phone,
      email: email || undefined,
      cityId: raw.cityId,
      deliveryType,
      pickupLocationId: raw.pickupLocationId,
      address: raw.address?.trim() || undefined,
      clientType,
      companyName: raw.companyName?.trim() || undefined,
      comment: raw.comment?.trim().slice(0, 2000) || undefined,
      items: validatedItems,
      calculation,
      assemblyEnabled,
      paymentMethod,
    },
  };
}

function validateCartItems(
  items: CartItem[],
  catalog: Product[],
): CartItem[] | { error: string } {
  if (items.length === 0) return [];

  const result: CartItem[] = [];

  for (const item of items) {
    if (!item.productId && !item.slug) {
      return { error: "Некорректная позиция в корзине" };
    }

    const product = catalog.find(
      (p) => p.id === item.productId || p.slug === item.slug,
    );
    if (!product) {
      return { error: `Товар не найден: ${item.name ?? item.slug}` };
    }

    const quantity = Math.min(Math.max(1, Math.floor(item.quantity)), 999);

    result.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  return result;
}
