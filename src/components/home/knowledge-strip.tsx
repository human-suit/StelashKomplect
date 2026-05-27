import Link from "next/link";
import type { KnowledgeArticle } from "@/data/knowledge";

export function KnowledgeStrip({ items: all }: { items: KnowledgeArticle[] }) {
  const items = all.slice(0, 3);

  return (
    <section className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">База знаний</h2>
            <p className="mt-1 text-sm text-slate-600">
              Статьи о выборе, доставке, гарантии и работе с юрлицами
            </p>
          </div>
          <Link
            href="/knowledge"
            className="shrink-0 text-sm font-semibold text-[var(--color-primary)] transition-opacity duration-200 hover:opacity-80"
          >
            Все статьи →
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <li
              key={a.slug}
              className="card-hover rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                {a.category}
              </p>
              <p className="mt-2 font-semibold text-slate-900">{a.title}</p>
              <p className="mt-2 text-sm text-slate-600">{a.excerpt}</p>
              <p className="mt-4">
                <Link
                  href={`/knowledge/${a.slug}`}
                  className="text-sm font-semibold text-[var(--color-primary)]"
                >
                  Читать →
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
