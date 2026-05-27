"use client";

import Link from "next/link";

const catalogs = [
  {
    title: "Каталог продукции — Стеллаж Комплект (PDF)",
    href: "/catalogs/Каталог_продукции_Стеллаж_Комплект.pdf",
    sizeMb: 21,
  },
] as const;

export function PdfCatalogs() {
  return (
    <section className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Каталоги PDF</h2>
          <p className="mt-1 text-sm text-slate-600">
            Скачайте полный каталог для удобного просмотра и отправки клиентам.
          </p>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {catalogs.map((c) => (
            <li
              key={c.href}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm font-semibold text-slate-900">{c.title}</p>
              <p className="mt-1 text-xs text-slate-500">≈ {c.sizeMb} МБ</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href={c.href}
                  download
                  className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
                >
                  Скачать PDF
                </a>
                <Link
                  href="/catalogs"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Все каталоги →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

