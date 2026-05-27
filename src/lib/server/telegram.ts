import type { InlineKeyboard } from "@/lib/server/telegram-keyboards";
import { telegramFetch } from "@/lib/server/telegram-fetch";

const TELEGRAM_API = "https://api.telegram.org";

export interface TelegramMessageOptions {
  parseMode?: "HTML" | "Markdown";
  replyToMessageId?: number;
  replyMarkup?: InlineKeyboard;
}

export interface TelegramSendResult {
  ok: boolean;
  error?: string;
}

function getConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIdsRaw = process.env.TELEGRAM_CHAT_ID?.trim() ?? "";
  const chatIds = chatIdsRaw
    .split(/[,;\s]+/)
    .map((id) => id.trim())
    .filter(Boolean);

  return { token, chatIds };
}

export function getTelegramBotToken(): string | undefined {
  return process.env.TELEGRAM_BOT_TOKEN?.trim();
}

export function getTelegramWebhookSecret(): string | undefined {
  return process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
}

export function isTelegramConfigured(): boolean {
  const { token, chatIds } = getConfig();
  return Boolean(token && chatIds.length > 0);
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegramMessage(
  text: string,
  options?: { parseMode?: "HTML" | "Markdown" },
): Promise<TelegramSendResult> {
  const { token, chatIds } = getConfig();

  if (!token || chatIds.length === 0) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы" };
  }

  const parseMode = options?.parseMode ?? "HTML";
  let lastError: string | undefined;
  let anySuccess = false;

  for (const chatId of chatIds) {
    try {
      const res = await telegramFetch(
        `${TELEGRAM_API}/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: text.slice(0, 4096),
            parse_mode: parseMode,
            disable_web_page_preview: true,
          }),
        },
      );

      const data = (await res.json()) as {
        ok: boolean;
        description?: string;
      };

      if (!data.ok) {
        lastError = data.description ?? `HTTP ${res.status}`;
        console.error(`[telegram] chat ${chatId}:`, lastError);
      } else {
        anySuccess = true;
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : "network error";
      console.error(`[telegram] chat ${chatId}:`, lastError);
    }
  }

  if (anySuccess) return { ok: true };
  return lastError ? { ok: false, error: lastError } : { ok: false, error: "unknown" };
}

/** Сообщение клиенту в чате с ботом */
export async function sendTelegramChatMessage(
  chatId: number | string,
  text: string,
  options?: TelegramMessageOptions,
): Promise<TelegramSendResult> {
  const token = getTelegramBotToken();
  if (!token) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };
  }

  const body: Record<string, unknown> = {
    chat_id: chatId,
    text: text.slice(0, 4096),
    disable_web_page_preview: true,
  };
  if (options?.parseMode) body.parse_mode = options.parseMode;
  if (options?.replyToMessageId != null) {
    body.reply_parameters = { message_id: options.replyToMessageId };
  }
  if (options?.replyMarkup) body.reply_markup = options.replyMarkup;

  try {
    const res = await telegramFetch(
      `${TELEGRAM_API}/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    const data = (await res.json()) as {
      ok: boolean;
      description?: string;
    };

    if (!data.ok) {
      return { ok: false, error: data.description ?? `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "network error";
    return { ok: false, error: msg };
  }
}

export async function replyInTelegramChat(
  chatId: number | string,
  text: string,
  replyToMessageId?: number,
): Promise<TelegramSendResult> {
  return sendTelegramChatMessage(chatId, text, { replyToMessageId });
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
): Promise<void> {
  const token = getTelegramBotToken();
  if (!token) return;

  try {
    await telegramFetch(`${TELEGRAM_API}/bot${token}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text?.slice(0, 200),
      }),
    });
  } catch {
    /* не критично */
  }
}

export async function sendTelegramTestMessage(): Promise<TelegramSendResult> {
  const text = [
    "✅ <b>Стеллаж Комплект</b>",
    "Тестовое уведомление с сайта.",
    `Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Yekaterinburg" })}`,
    "",
    "Если видите это сообщение — заявки с сайта будут приходить сюда.",
  ].join("\n");

  return sendTelegramMessage(text);
}
