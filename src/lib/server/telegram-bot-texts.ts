import { company } from "@/lib/company";
import { getSiteUrl } from "@/lib/payments/config";

export function buildWelcomeText(): string {
  const lines = [
    `⚡ <b>${company.name}</b>`,
    company.tagline,
    "",
    "Металлические стеллажи · Сейфы · Шкафы · Верстаки",
    "",
    "Выберите действие кнопкой ниже или напишите вопрос — менеджер ответит.",
    "",
    `📞 <a href="tel:${company.phone}">${company.phoneDisplay}</a> (${company.contactName})`,
    `🌐 <a href="${getSiteUrl()}">${getSiteUrl().replace(/^https?:\/\//, "")}</a>`,
    "",
    "💳 Оплата выполняется только на сайте при оформлении заявки.",
  ];

  return lines.join("\n");
}

export const BOT_CONTACTS = `📍 <b>Контакты</b>

📞 ${company.phoneDisplay} — ${company.contactName}
✉️ ${company.email}
✈️ ${company.telegramHandle}

🌐 Сайт: ${getSiteUrl()}`;

export const BOT_AUTO_REPLY = `Спасибо за сообщение!

Менеджер свяжется с вами. По срочным вопросам:
📞 ${company.phoneDisplay}`;

export const BOT_MEDIA_REPLY = `Файл получен. Менеджер посмотрит и ответит.

📞 ${company.phoneDisplay}`;

export const BOT_UNKNOWN_COMMAND = `Используйте кнопки меню или команды:
/start — главное меню
/catalog — каталог
/contacts — контакты
/order — оформить заявку`;
