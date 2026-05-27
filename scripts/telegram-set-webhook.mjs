/**
 * Регистрация webhook для бота (вариант B — без Python polling)
 *
 * На сервере или локально с публичным URL (ngrok):
 *
 *   set TELEGRAM_BOT_TOKEN=...
 *   set SITE_URL=https://stellazhkomplect.ru
 *   set TELEGRAM_WEBHOOK_SECRET=случайная_строка_32_символа
 *   node scripts/telegram-set-webhook.mjs
 *
 * TELEGRAM_WEBHOOK_SECRET должен совпадать с .env на сервере.
 */

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const siteUrl = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  ""
).replace(/\/$/, "");
const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();

if (!token) {
  console.error("Задайте TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

if (!siteUrl) {
  console.error("Задайте SITE_URL=https://ваш-домен.ru");
  process.exit(1);
}

const webhookUrl = `${siteUrl}/api/telegram/webhook`;

const body = {
  url: webhookUrl,
  allowed_updates: ["message", "callback_query"],
  drop_pending_updates: false,
};
if (secret) body.secret_token = secret;

const res = await fetch(
  `https://api.telegram.org/bot${token}/setWebhook`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  },
);

const data = await res.json();
if (!data.ok) {
  console.error("setWebhook ошибка:", data.description);
  process.exit(1);
}

console.log("Webhook установлен:", webhookUrl);
if (secret) console.log("Секрет (TELEGRAM_WEBHOOK_SECRET): задан");

const infoRes = await fetch(
  `https://api.telegram.org/bot${token}/getWebhookInfo`,
);
const info = await infoRes.json();
if (info.ok) {
  console.log("Статус:", info.result.url ? "OK" : "пусто");
  if (info.result.last_error_message) {
    console.warn("Последняя ошибка:", info.result.last_error_message);
  }
}

console.log(`
Важно:
1. Бот только в Next.js (webhook), Python не нужен.
2. На сервере в .env: TELEGRAM_WEBHOOK_SECRET (если использовали).
3. Сайт должен быть доступен по HTTPS.
`);
