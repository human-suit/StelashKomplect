import { company } from "@/lib/company";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Обработка персональных данных на сайте Стеллаж Комплект в соответствии с законодательством РФ.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 prose prose-slate">
      <h1 className="text-2xl font-bold text-slate-900">
        Политика обработки персональных данных
      </h1>
      <p className="mt-4 text-sm text-slate-500">
        Дата публикации: {new Date().toLocaleDateString("ru-RU")}
      </p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          Настоящая политика определяет порядок обработки персональных данных
          пользователей сайта{" "}
          <a href={company.site} className="text-[var(--color-primary)]">
            {company.site.replace("https://", "")}
          </a>{" "}
          (далее — «Сайт»), оператором которого является {company.name}.
        </p>

        <h2 className="text-lg font-bold text-slate-900">
          1. Какие данные мы собираем
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>имя, телефон, email (при оформлении заявки);</li>
          <li>адрес доставки или пункт самовывоза;</li>
          <li>состав заказа и комментарий;</li>
          <li>технические данные: IP, cookies сессии аналитики на Сайте.</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900">
          2. Цели обработки
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>обработка заявок и обратная связь с менеджером;</li>
          <li>расчёт доставки и консультация по товарам;</li>
          <li>улучшение работы Сайта (внутренняя аналитика).</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900">
          3. Передача третьим лицам
        </h2>
        <p>
          Данные могут передаваться сервисам доставки уведомлений (Telegram,
          электронная почта) и хостинг-провайдеру исключительно для целей,
          указанных в п. 2. Данные не продаются третьим лицам.
        </p>

        <h2 className="text-lg font-bold text-slate-900">4. Срок хранения</h2>
        <p>
          Заявки хранятся в течение срока, необходимого для исполнения заказа и
          учёта, но не менее срока, установленного законодательством РФ.
        </p>

        <h2 className="text-lg font-bold text-slate-900">5. Ваши права</h2>
        <p>
          Вы вправе запросить уточнение, блокировку или удаление персональных
          данных, направив обращение на{" "}
          <a
            href={`mailto:${company.email}`}
            className="text-[var(--color-primary)]"
          >
            {company.email}
          </a>{" "}
          или по телефону{" "}
          <a href={`tel:${company.phone}`} className="text-[var(--color-primary)]">
            {company.phoneDisplay}
          </a>
          .
        </p>

        <h2 className="text-lg font-bold text-slate-900">6. Контакты</h2>
        <p>
          {company.name}
          <br />
          Email: {company.email}
          <br />
          Телефон: {company.phoneDisplay}
        </p>
      </section>

      <p className="mt-10">
        <Link href="/" className="text-[var(--color-primary)] underline">
          ← На главную
        </Link>
      </p>
    </div>
  );
}
