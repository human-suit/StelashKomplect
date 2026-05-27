import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Каталоги PDF",
  description: "Каталоги продукции Стеллаж Комплект в формате PDF.",
};

const catalogs = [
  {
    title: "Каталог продукции — Стеллаж Комплект (PDF)",
    href: "/catalogs/Каталог_продукции_Стеллаж_Комплект.pdf",
    sizeMb: 21,
  },
] as const;

export default function CatalogsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Каталоги PDF</h1>
      <p className="mt-2 text-slate-600">
        Скачайте каталоги для удобного просмотра, печати и отправки клиентам.
      </p>

      <ul className="mt-6 space-y-4">
        {catalogs.map((c) => (
          <li
            key={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="font-semibold text-slate-900">{c.title}</p>
            <p className="mt-1 text-sm text-slate-500">≈ {c.sizeMb} МБ</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={c.href}
                download
                className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
              >
                Скачать PDF
              </a>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Открыть в браузере
              </a>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-10">
        <Link href="/" className="text-[var(--color-primary)] underline">
          ← На главную
        </Link>
      </p>
    </div>
  );
}

