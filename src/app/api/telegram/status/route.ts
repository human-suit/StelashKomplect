import {
  getTelegramBotToken,
  getTelegramWebhookSecret,
  isTelegramConfigured,
} from "@/lib/server/telegram";
import { telegramFetch } from "@/lib/server/telegram-fetch";
import { NextResponse } from "next/server";

/** GET /api/telegram/status — проверка без секретов */
export async function GET() {
  const token = getTelegramBotToken();
  const ordersOk = isTelegramConfigured();
  const webhookSecretSet = Boolean(getTelegramWebhookSecret());

  let webhookUrl: string | null = null;
  let webhookError: string | null = null;

  if (token) {
    try {
      const res = await telegramFetch(
        `https://api.telegram.org/bot${token}/getWebhookInfo`,
      );
      const data = (await res.json()) as {
        ok: boolean;
        result?: { url?: string; last_error_message?: string };
      };
      if (data.ok && data.result) {
        webhookUrl = data.result.url || null;
        webhookError = data.result.last_error_message ?? null;
      }
    } catch {
      webhookError = "не удалось запросить getWebhookInfo";
    }
  }

  return NextResponse.json({
    orders: {
      configured: ordersOk,
      hint: ordersOk
        ? "Заявки с сайта уходят в TELEGRAM_CHAT_ID"
        : "Заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID",
    },
    bot: {
      tokenSet: Boolean(token),
      webhookUrl,
      webhookSecretSet,
      webhookError,
      endpoint: "/api/telegram/webhook",
      hint: webhookUrl
        ? "Бот на webhook (вариант B). Не запускайте python bot.py"
        : "После деплоя: npm run telegram:webhook",
    },
  });
}
