import { company } from "@/lib/company";
import { ButtonLink } from "@/components/ui/button";

export function CtaBlock() {
  return (
    <section className="px-4 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl bg-[var(--color-primary)] px-6 py-8 text-center text-white shadow-sm sm:px-8 sm:py-10">
          <h2 className="text-lg font-bold sm:text-xl">Нужна консультация?</h2>
          <p className="mt-2 text-sm text-blue-100">
            Подберём стеллажи, сейфы и мебель под вашу задачу
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <ButtonLink
              href="/checkout"
              variant="secondary"
              className="!bg-white !text-[var(--color-primary)]"
            >
              Оставить заявку
            </ButtonLink>
            <a
              href={company.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
