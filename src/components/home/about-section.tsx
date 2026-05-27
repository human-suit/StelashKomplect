import { company } from "@/lib/company";
import { ButtonLink } from "@/components/ui/button";

const highlights = [
  "Официальный дилер Промет, Valberg, Aiko и других заводов",
  "Склад в Уфе — отгрузка в день заказа при наличии",
  "Доставка, сборка, монтаж и проектирование под ключ",
  "Работа с юрлицами: счета, договоры, тендеры",
];

export function AboutSection() {
  return (
    <section id="about" className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">О компании</h2>
            <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">
              {company.tagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              <strong>{company.name}</strong> — {company.subtitle.toLowerCase()}.
              Поставляем металлические стеллажи, сейфы, шкафы, верстаки, локеры,
              медицинскую и корпусную мебель. Работаем с организациями и частными
              клиентами по всей России.
            </p>
            <ButtonLink href="/about" variant="primary" size="lg" className="mt-6">
              Подробнее о компании
            </ButtonLink>
          </div>

          <ul className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
            {highlights.map((text) => (
              <li
                key={text}
                className="flex gap-3 text-sm text-slate-700"
              >
                <span className="text-[var(--color-accent)]" aria-hidden>
                  ✓
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
