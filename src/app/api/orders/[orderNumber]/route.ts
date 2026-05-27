import { getOrderByNumber } from "@/lib/server/orders-store";
import { getYooKassaPayment } from "@/lib/server/yookassa";
import { markPaymentSucceeded } from "@/lib/server/payments";
import { NextResponse } from "next/server";

/** GET — статус заявки (для страницы возврата с оплаты) */
export async function GET(
  _request: Request,
  context: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await context.params;
  const order = await getOrderByNumber(decodeURIComponent(orderNumber));

  if (!order) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  if (
    order.paymentStatus === "pending" &&
    order.paymentId
  ) {
    const remote = await getYooKassaPayment(order.paymentId);
    if (remote?.status === "succeeded") {
      const paid = Number(remote.amount?.value ?? "0");
      await markPaymentSucceeded(order.orderNumber, order.paymentId, paid);
      const updated = await getOrderByNumber(order.orderNumber);
      return NextResponse.json({ order: updated ?? order });
    }
  }

  return NextResponse.json({ order });
}
