import { company } from "@/lib/company";
import { getSiteUrl } from "@/lib/payments/config";

export type InlineKeyboard = {
  inline_keyboard: { text: string; url?: string; callback_data?: string }[][];
};

export function mainMenuKeyboard(): InlineKeyboard {
  const site = getSiteUrl();
  const rows: InlineKeyboard["inline_keyboard"] = [
    [
      { text: "🌐 Каталог", url: `${site}/catalog` },
      { text: "📞 Контакты", callback_data: "contacts" },
    ],
    [{ text: "🛒 Оформить заявку", url: `${site}/checkout` }],
    [{ text: "💳 Оплата на сайте", url: `${site}/checkout` }],
  ];

  rows.push([{ text: "✈️ Написать менеджеру", url: company.telegram }]);

  return { inline_keyboard: rows };
}
