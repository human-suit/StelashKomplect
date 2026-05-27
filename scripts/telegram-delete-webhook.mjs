/**
 * Снять webhook (перед локальным polling или сменой URL)
 * node scripts/telegram-delete-webhook.mjs
 */

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
if (!token) {
  console.error("Задайте TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

const res = await fetch(
  `https://api.telegram.org/bot${token}/deleteWebhook`,
  { method: "POST" },
);
const data = await res.json();
console.log(data.ok ? "Webhook удалён" : data.description);
