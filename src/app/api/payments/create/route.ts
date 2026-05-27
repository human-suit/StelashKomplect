import { getChargeAmountRub, isYooKassaConfigured } from "@/lib/payments/config";
import { startOrderPayment } from "@/lib/server/payments";
import { getOrderByNumber } from "@/lib/server/orders-store";
import { NextResponse } from "next/server";

/** POST { orderNumber } — создать платёж ЮKassa для заявки */
export async function POST(request: Request) {
  if (!isYooKassaConfigured()) {
    return NextResponse.json(
      { error: "Оплата не настроена (YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY)" },
      { status: 503 },
    );
  }

  try {
    const { orderNumber } = (await request.json()) as { orderNumber?: string };
    if (!orderNumber?.trim()) {
      return NextResponse.json({ error: "orderNumber обязателен" }, { status: 400 });
    }

    const order = await getOrderByNumber(orderNumber.trim());
    if (!order) {
      return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
    }

    const payment = await startOrderPayment(order);
    if (!payment.ok) {
      return NextResponse.json(
        { error: payment.error ?? "Ошибка создания платежа" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      paymentUrl: payment.paymentUrl,
      chargeAmountRub: payment.chargeAmountRub,
      orderTotalRub: order.calculation.total,
      testCharge: getChargeAmountRub(order.calculation.total) !== order.calculation.total,
    });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
