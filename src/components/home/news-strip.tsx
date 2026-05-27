"use client";

import Link from "next/link";
import type { NewsItem } from "@/data/news";

export function NewsStrip({ items: all }: { items: NewsItem[] }) {
  const items = all.slice(0, 3);

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Новости</h2>
            <p className="mt-1 text-sm text-slate-600">
              Пресс‑релизы, обновления ассортимента и склада
            </p>
          </div>
          <Link
            href="/news"
            className="shrink-0 text-sm font-semibold text-[var(--color-primary)] transition-opacity duration-200 hover:opacity-80"
          >
            Все →
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <li
              key={n.slug}
              className="card-hover rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-xs text-slate-500">
                {new Date(n.date).toLocaleDateString("ru-RU")}
              </p>
              <p className="mt-2 font-semibold text-slate-900">{n.title}</p>
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
      </div>
    </section>
  );
}

