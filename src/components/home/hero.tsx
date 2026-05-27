import { company } from "@/lib/company";
import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[#0f2744] px-4 py-12 text-white">
      <div className="relative mx-auto max-w-7xl">
        <p className="mb-2 text-sm font-medium text-blue-200">
          ⚡ {company.tagline}
        </p>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
          {company.name}
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-blue-100 sm:text-base">
          {company.subtitle}
        </p>
        <p className="mt-4 text-sm text-blue-200">
          Металлические стеллажи · Сейфы · Шкафы · Верстаки · Медицинская мебель
        </p>
        <p className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
          🚚 Доставка по Уфе · отгрузка со склада в день заказа
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href="/catalog"
            variant="secondary"
            size="lg"
            className="!bg-white !text-[var(--color-primary)] hover:!opacity-95"
          >
            Открыть каталог
          </ButtonLink>
          <ButtonLink
            href="/contacts"
            variant="outline"
            size="lg"
            className="!border-white !text-white hover:!bg-white/10"
          >
            Связаться с нами
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
