import { handleTelegramUpdate } from "@/lib/server/telegram-bot";
import type { TelegramUpdate } from "@/lib/server/telegram-types";
import {
  getTelegramBotToken,
  getTelegramWebhookSecret,
} from "@/lib/server/telegram";
import { NextResponse } from "next/server";

/** POST — входящие сообщения от Telegram (webhook, вариант B) */
export async function POST(request: Request) {
  const token = getTelegramBotToken();
  if (!token) {
    return NextResponse.json({ error: "Bot not configured" }, { status: 503 });
  }

  const expectedSecret = getTelegramWebhookSecret();
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && !expectedSecret) {
    return NextResponse.json(
      { error: "TELEGRAM_WEBHOOK_SECRET required in production" },
      { status: 503 },
    );
  }

  if (expectedSecret) {
    const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
    if (headerSecret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await handleTelegramUpdate(update);
  } catch (e) {
    console.error("[telegram/webhook]", e);
  }

  return NextResponse.json({ ok: true });
}
