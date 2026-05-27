import {
  getChargeAmountRub,
  isYooKassaConfigured,
  isPaymentTestMode,
} from "@/lib/payments/config";
import {
  getOrderByNumber,
  updateOrderPayment,
  type StoredOrder,
} from "@/lib/server/orders-store";
import { createYooKassaPayment } from "@/lib/server/yookassa";
import { sendTelegramMessage } from "@/lib/server/telegram";
import { escapeHtml } from "@/lib/server/telegram";

export interface CreatePaymentResult {
  ok: boolean;
  paymentUrl?: string;
  paymentId?: string;
  chargeAmountRub?: number;
  error?: string;
}

export async function startOrderPayment(
  order: StoredOrder,
): Promise<CreatePaymentResult> {
  if (!isYooKassaConfigured()) {
    return { ok: false, error: "ЮKassa не настроена" };
  }

  if (order.paymentStatus === "succeeded") {
    return { ok: false, error: "Заказ уже оплачен" };
  }

  const chargeAmountRub = getChargeAmountRub(order.calculation.total);
  const testNote = isPaymentTestMode()
    ? ` (тест ${chargeAmountRub} ₽, заказ ${order.calculation.total} ₽)`
    : "";

  const description = `Заявка ${order.orderNumber}${testNote}`;

  const result = await createYooKassaPayment({
    amountRub: chargeAmountRub,
    description,
    orderNumber: order.orderNumber,
    customerEmail: order.email,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  const url = result.payment.confirmation?.confirmation_url;
  if (!url) {
    return { ok: false, error: "Нет ссылки на оплату" };
  }

  await updateOrderPayment(order.orderNumber, {
    paymentStatus: "pending",
    paymentId: result.payment.id,
    chargeAmountRub,
  });

  return {
    ok: true,
    paymentUrl: url,
    paymentId: result.payment.id,
    chargeAmountRub,
  };
}

export async function markPaymentSucceeded(
  orderNumber: string,
  paymentId: string,
  paidAmountRub: number,
): Promise<void> {
  const order = await getOrderByNumber(orderNumber);
  if (!order) return;

  if (order.paymentStatus === "succeeded") return;

  await updateOrderPayment(orderNumber, {
    paymentStatus: "succeeded",
    paymentId,
    paidAmountRub,
    status: "processing",
  });

  const text = [
    `💳 <b>Оплата получена</b>`,
    `Заявка ${escapeHtml(orderNumber)}`,
    `Сумма: <b>${paidAmountRub} ₽</b>`,
    `👤 ${escapeHtml(order.name)} · ${escapeHtml(order.phone)}`,
  ].join("\n");

  await sendTelegramMessage(text, { parseMode: "HTML" });
}

export async function markPaymentCanceled(orderNumber: string): Promise<void> {
  await updateOrderPayment(orderNumber, { paymentStatus: "canceled" });
}
