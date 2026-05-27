import {
  BOT_AUTO_REPLY,
  BOT_CONTACTS,
  BOT_MEDIA_REPLY,
  BOT_UNKNOWN_COMMAND,
  buildWelcomeText,
} from "@/lib/server/telegram-bot-texts";
import { mainMenuKeyboard } from "@/lib/server/telegram-keyboards";
import type {
  TelegramCallbackQuery,
  TelegramMessage,
  TelegramUpdate,
} from "@/lib/server/telegram-types";
import {
  answerCallbackQuery,
  replyInTelegramChat,
  sendTelegramChatMessage,
} from "@/lib/server/telegram";
import { getSiteUrl } from "@/lib/payments/config";

function parseCommand(text: string | undefined): string | null {
  if (!text?.startsWith("/")) return null;
  return text.trim().split(/\s+/)[0]?.split("@")[0]?.toLowerCase() ?? null;
}

function hasMedia(message: TelegramMessage): boolean {
  return Boolean(
    message.photo?.length ||
      message.document ||
      message.voice ||
      message.video ||
      message.video_note ||
      message.audio,
  );
}

async function sendMainMenu(
  chatId: number | string,
  replyTo?: number,
): Promise<void> {
  await sendTelegramChatMessage(chatId, buildWelcomeText(), {
    parseMode: "HTML",
    replyToMessageId: replyTo,
    replyMarkup: mainMenuKeyboard(),
  });
}

async function handleCommand(
  chatId: number | string,
  command: string,
  replyTo?: number,
): Promise<void> {
  const site = getSiteUrl();

  switch (command) {
    case "/start":
    case "/help":
      await sendMainMenu(chatId, replyTo);
      return;
    case "/catalog":
      await sendTelegramChatMessage(
        chatId,
        `🌐 Каталог на сайте:\n${site}/catalog`,
        { replyToMessageId: replyTo, replyMarkup: mainMenuKeyboard() },
      );
      return;
    case "/contacts":
      await sendTelegramChatMessage(chatId, BOT_CONTACTS, {
        parseMode: "HTML",
        replyToMessageId: replyTo,
        replyMarkup: mainMenuKeyboard(),
      });
      return;
    case "/order":
      await sendTelegramChatMessage(
        chatId,
        `🛒 Оформить заявку:\n${site}/checkout`,
        { replyToMessageId: replyTo, replyMarkup: mainMenuKeyboard() },
      );
      return;
    default:
      await sendTelegramChatMessage(chatId, BOT_UNKNOWN_COMMAND, {
        replyToMessageId: replyTo,
        replyMarkup: mainMenuKeyboard(),
      });
  }
}

async function handleCallback(query: TelegramCallbackQuery): Promise<void> {
  const data = query.data;
  const chatId = query.message?.chat.id;
  if (!chatId || !data) {
    await answerCallbackQuery(query.id);
    return;
  }

  await answerCallbackQuery(query.id);

  if (data === "contacts") {
    await sendTelegramChatMessage(chatId, BOT_CONTACTS, {
      parseMode: "HTML",
      replyMarkup: mainMenuKeyboard(),
    });
    return;
  }

  if (data === "menu") {
    await sendMainMenu(chatId);
  }
}

async function handleMessage(message: TelegramMessage): Promise<void> {
  const chatId = message.chat.id;
  const replyTo = message.message_id;
  const user = message.from;
  const command = parseCommand(message.text);

  if (command) {
    console.log(
      `[telegram-bot] ${command} от ${user?.id ?? "?"} (@${user?.username ?? "—"})`,
    );
    await handleCommand(chatId, command, replyTo);
    return;
  }

  if (hasMedia(message)) {
    await replyInTelegramChat(chatId, BOT_MEDIA_REPLY, replyTo);
    return;
  }

  const text = message.text?.trim();
  if (!text) return;

  const lower = text.toLowerCase();
  if (["меню", "start", "привет", "здравствуйте"].includes(lower)) {
    await sendMainMenu(chatId, replyTo);
    return;
  }

  await replyInTelegramChat(chatId, BOT_AUTO_REPLY, replyTo);
  console.log(`[telegram-bot] сообщение от ${user?.id ?? "?"}`);
}

export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (update.callback_query) {
    await handleCallback(update.callback_query);
    return;
  }
  if (update.message) {
    await handleMessage(update.message);
  }
}
