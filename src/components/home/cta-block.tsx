import { company } from "@/lib/company";
import { ButtonLink } from "@/components/ui/button";

export function CtaBlock() {
  return (
    <section className="mx-4 mb-10 rounded-2xl bg-[var(--color-primary)] px-6 py-8 text-center text-white">
      <h2 className="text-lg font-bold">Нужна консультация?</h2>
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
    </section>
  );
}
