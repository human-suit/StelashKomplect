/**
 * Узнать chat_id для TELEGRAM_CHAT_ID
 *
 * 1. Создайте бота: @BotFather → /newbot → скопируйте токен
 * 2. Напишите боту любое сообщение (или добавьте в группу и напишите там)
 * 3. Запуск:
 *    set TELEGRAM_BOT_TOKEN=123456:ABC...
 *    node scripts/telegram-get-chat-id.mjs
 */
const token = process.env.TELEGRAM_BOT_TOKEN?.trim();

if (!token) {
  console.error("Задайте TELEGRAM_BOT_TOKEN в окружении");
  process.exit(1);
}

const res = await fetch(
  `https://api.telegram.org/bot${token}/getUpdates?limit=10`,
);
const data = await res.json();

if (!data.ok) {
  console.error("Ошибка API:", data.description);
  process.exit(1);
}

if (!data.result?.length) {
  console.log(`
Нет сообщений. Сделайте так:
1. Откройте вашего бота в Telegram
2. Нажмите Start и напишите «привет»
3. Запустите скрипт снова
`);
  process.exit(0);
}

console.log("\nНайденные чаты (скопируйте id в TELEGRAM_CHAT_ID):\n");

const seen = new Set();
for (const u of data.result) {
  const chat = u.message?.chat ?? u.my_chat_member?.chat;
  if (!chat || seen.has(chat.id)) continue;
  seen.add(chat.id);

  const title =
    chat.title ??
    [chat.first_name, chat.last_name].filter(Boolean).join(" ") ??
  chat.username;

  console.log(`  TELEGRAM_CHAT_ID=${chat.id}`);
  console.log(`    Тип: ${chat.type}, Имя: ${title ?? "—"}\n`);
}
