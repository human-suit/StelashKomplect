"use client";

import Link from "next/link";
import type { ProjectItem } from "@/data/projects";

export function ProjectsStrip({ projects }: { projects: ProjectItem[] }) {
  const items = projects.slice(0, 3);

  return (
    <section className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Готовые проекты</h2>
            <p className="mt-1 text-sm text-slate-600">
              Решения под отрасли — офис, склад, медицина
            </p>
          </div>
          <Link
            href="/projects"
            className="shrink-0 text-sm font-semibold text-[var(--color-primary)] transition-opacity duration-200 hover:opacity-80"
          >
            Все →
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li
              key={p.slug}
              className="card-hover rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="font-semibold text-slate-900">{p.title}</p>
              <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.slice(0, 3).map((t) => (
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
      </div>
    </section>
  );
}

