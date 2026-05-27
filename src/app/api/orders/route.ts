import { formatOrderForTelegramHtml } from "@/lib/server/order-message";
import { sendOrderEmail } from "@/lib/server/email";
import { startOrderPayment } from "@/lib/server/payments";
import { isYooKassaConfigured } from "@/lib/payments/config";
import { validateOrderPayload } from "@/lib/server/order-validation";
import { createOrder, type OrderPayload } from "@/lib/server/orders-store";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import {
  isMaxConfigured,
  isWhatsAppConfigured,
  sendMaxWebhook,
  sendWhatsAppWebhook,
} from "@/lib/server/messenger-webhooks";
import { isTelegramConfigured, sendTelegramMessage } from "@/lib/server/telegram";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`orders:${ip}`, 8, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Слишком много заявок. Повторите через ${limit.retryAfterSec ?? 60} с.`,
      },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as OrderPayload;
    const validated = await validateOrderPayload(body);

    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const order = await createOrder(validated.payload);

    let paymentUrl: string | undefined;
    let chargeAmountRub: number | undefined;
    let orderForMessage = order;

    const payOnline = validated.payload.paymentMethod === "online_card";
    if (payOnline && isYooKassaConfigured()) {
      const payment = await startOrderPayment(order);
      if (payment.ok && payment.paymentUrl) {
        paymentUrl = payment.paymentUrl;
        chargeAmountRub = payment.chargeAmountRub;
        orderForMessage = { ...order, chargeAmountRub };
      }
    }

    const messageHtml = await formatOrderForTelegramHtml(orderForMessage);
    const messagePlain = messageHtml.replace(/<[^>]+>/g, "");

    const telegram = await sendTelegramMessage(messageHtml, {
      parseMode: "HTML",
    });
    const max = await sendMaxWebhook(messagePlain);
    const whatsapp = await sendWhatsAppWebhook(messagePlain);

    const email = await sendOrderEmail(
      `Заявка ${order.orderNumber}`,
      messagePlain,
    );

    const notifyFailed =
      (isTelegramConfigured() || isMaxConfigured() || isWhatsAppConfigured()) &&
      !telegram.ok &&
      !max.ok &&
      !whatsapp.ok &&
      !email.ok &&
      !email.skipped;

    if (notifyFailed) {
      console.error("[order] All notify channels failed", {
        telegram: telegram.error,
        max: max.errors,
        whatsapp: whatsapp.errors,
        email: email.error,
      });
    }

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      telegramSent: telegram.ok,
      maxSent: max.ok,
      whatsappSent: whatsapp.ok,
      emailSent: email.ok && !email.skipped,
      paymentUrl,
      chargeAmountRub,
      paymentChannel: paymentUrl ? "site" : undefined,
      warning: notifyFailed
        ? "Заявка сохранена. Менеджер свяжется с вами — уведомление отправляется с задержкой."
        : undefined,
    });
  } catch (e) {
    console.error("[order]", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
