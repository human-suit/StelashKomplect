import type { Metadata } from "next";
import Link from "next/link";
import { listProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Готовые проекты",
  description:
    "Примеры решений для офиса, склада и медицинских учреждений — подберём комплектацию и рассчитаем поставку.",
};

const ITEMS_PER_PAGE = 10;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const projects = await listProjects();
  const totalPages = Math.max(1, Math.ceil(projects.length / ITEMS_PER_PAGE));
  const pageRaw = Number(params.page ?? "1");
  const currentPage = Number.isFinite(pageRaw)
    ? Math.min(Math.max(1, Math.floor(pageRaw)), totalPages)
    : 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProjects = projects.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Готовые проекты</h1>
      <p className="mt-2 text-slate-600">
        Подбор и комплектация под отрасль: офис, склад, медицина и другие задачи.
      </p>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {visibleProjects.map((p) => (
          <li
            key={p.slug}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-lg font-semibold text-slate-900">{p.title}</p>
            <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={page === 1 ? "/projects" : `/projects?page=${page}`}
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

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/checkout" className="text-[var(--color-primary)] underline">
          Получить консультацию
        </Link>
        <Link href="/" className="text-[var(--color-primary)] underline">
          ← На главную
        </Link>
      </div>
    </div>
  );
}
