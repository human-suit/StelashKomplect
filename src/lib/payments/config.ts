/** Настройки оплаты (ЮKassa) */

export function isYooKassaConfigured(): boolean {
  return Boolean(
    process.env.YOOKASSA_SHOP_ID?.trim() &&
      process.env.YOOKASSA_SECRET_KEY?.trim(),
  );
}

export function isPaymentTestMode(): boolean {
  return process.env.PAYMENT_TEST_MODE !== "false";
}

/** Сумма списания в рублях (в тесте — фиксированная маленькая) */
export function getChargeAmountRub(orderTotalRub: number): number {
  if (isPaymentTestMode()) {
    const test = Number(process.env.PAYMENT_TEST_AMOUNT_RUB ?? "10");
    return Number.isFinite(test) && test > 0 ? test : 10;
  }
  return Math.max(1, Math.round(orderTotalRub));
}

export function getSiteUrl(): string {
  return (
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
