import { company } from "@/lib/company";
import { ButtonLink } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О компании",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">О компании</h1>
      <p className="mt-4 text-lg font-semibold text-[var(--color-primary)]">
        {company.tagline}
      </p>
      <p className="mt-4 leading-relaxed text-slate-700">
        <strong>{company.name}</strong> — {company.subtitle.toLowerCase()}.
        Поставляем металлические стеллажи, сейфы, шкафы, верстаки, локеры,
        медицинскую и корпусную мебель, входные двери.
      </p>
      <p className="mt-4 leading-relaxed text-slate-700">
        Работаем с организациями и частными клиентами. Доставка, сборка, монтаж,
        замеры и проектирование. Доставка по Уфе и России — в день заказа при
        наличии на складе.
      </p>
      <ul className="mt-8 space-y-3 text-sm text-slate-700">
        <li>🏭 Официальный представитель ведущих заводов</li>
        <li>📦 Большой складской запас</li>
        <li>🔧 Сборка и монтаж под ключ</li>
        <li>📋 Документы для юрлиц и тендеров</li>
      </ul>
      <ButtonLink href="/contacts" variant="primary" size="lg" className="mt-8">
        Связаться с нами
      </ButtonLink>
    </div>
  );
}
