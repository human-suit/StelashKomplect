import type { Metadata } from "next";
import Link from "next/link";
import { listNews } from "@/lib/content/news";

export const metadata: Metadata = {
  title: "Новости",
  description: "Новости и обновления компании Стеллаж Комплект.",
};

const ITEMS_PER_PAGE = 10;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const news = await listNews();
  const totalPages = Math.max(1, Math.ceil(news.length / ITEMS_PER_PAGE));
  const pageRaw = Number(params.page ?? "1");
  const currentPage = Number.isFinite(pageRaw)
    ? Math.min(Math.max(1, Math.floor(pageRaw)), totalPages)
    : 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleNews = news.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Новости</h1>
      <p className="mt-2 text-slate-600">
        Обновления ассортимента, склад, отгрузки и полезные заметки.
      </p>

      <ul className="mt-6 space-y-4">
        {visibleNews.map((n) => (
          <li
            key={n.slug}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-xs text-slate-500">
              {new Date(n.date).toLocaleDateString("ru-RU")}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {n.title}
            </p>
            <p className="mt-2 text-sm text-slate-600">{n.excerpt}</p>
            <p className="mt-4">
              <Link
                href={`/news/${n.slug}`}
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
              href={page === 1 ? "/news" : `/news?page=${page}`}
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
