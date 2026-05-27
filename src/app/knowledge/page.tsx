import type { Metadata } from "next";
import Link from "next/link";
import { listKnowledge } from "@/lib/content/knowledge";

export const metadata: Metadata = {
  title: "База знаний",
  description:
    "Статьи о выборе стеллажей и сейфов, доставке, гарантии и работе с юрлицами.",
};

const ITEMS_PER_PAGE = 10;

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const knowledgeArticles = await listKnowledge();
  const totalPages = Math.max(1, Math.ceil(knowledgeArticles.length / ITEMS_PER_PAGE));
  const pageRaw = Number(params.page ?? "1");
  const currentPage = Number.isFinite(pageRaw)
    ? Math.min(Math.max(1, Math.floor(pageRaw)), totalPages)
    : 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleArticles = knowledgeArticles.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">База знаний</h1>
      <p className="mt-2 text-slate-600">
        Полезные материалы для покупателей и организаций — выбор, доставка,
        документы, сервис.
      </p>

      <ul className="mt-6 space-y-4">
        {visibleArticles.map((a) => (
          <li
            key={a.slug}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
              {a.category}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{a.title}</p>
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

      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={page === 1 ? "/knowledge" : `/knowledge?page=${page}`}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                page === currentPage
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}

      <p className="mt-10">
        <Link href="/" className="text-[var(--color-primary)] underline">
          ← На главную
        </Link>
      </p>
    </div>
  );
}
