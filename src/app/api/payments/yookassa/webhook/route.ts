import {
  markPaymentCanceled,
  markPaymentSucceeded,
} from "@/lib/server/payments";
import type { YooKassaPayment } from "@/lib/server/yookassa";
import { NextResponse } from "next/server";

interface YooKassaWebhook {
  type: string;
  event: string;
  object: YooKassaPayment;
}

/** Уведомления ЮKassa о статусе платежа */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as YooKassaWebhook;
    if (body.type !== "notification" || !body.object) {
      return NextResponse.json({ ok: true });
    }

    const payment = body.object;
    const orderNumber = payment.metadata?.orderNumber;
    if (!orderNumber) {
      return NextResponse.json({ ok: true });
    }

    const amountRub = Number(payment.amount?.value ?? "0");

    if (body.event === "payment.succeeded" && payment.status === "succeeded") {
      await markPaymentSucceeded(orderNumber, payment.id, amountRub);
    }

    if (
      body.event === "payment.canceled" ||
      payment.status === "canceled"
    ) {
      await markPaymentCanceled(orderNumber);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[yookassa/webhook]", e);
    return NextResponse.json({ ok: true });
  }
}
