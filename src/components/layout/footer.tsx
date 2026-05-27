"use client";

import { company } from "@/lib/company";
import { useCityById } from "@/context/cities-context";
import { useCityStore } from "@/store/city-store";
import Link from "next/link";

export function Footer() {
  const cityId = useCityStore((s) => s.cityId);
  const city = useCityById(cityId);

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 pb-[calc(56px+env(safe-area-inset-bottom))] text-slate-300 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <p className="text-lg font-bold text-white">{company.name}</p>
          <p className="mt-1 text-sm">{company.subtitle}</p>
        </div>

        {city && (
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              {city.name} — адреса
            </p>
            <ul className="space-y-2 text-sm">
              {city.locations.map((loc) => (
                <li key={loc.id}>
                  <span className="text-white">{loc.label}:</span> {loc.address}
                  {loc.note && (
                    <span className="text-slate-500"> ({loc.note})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-slate-700 pt-6 text-sm sm:flex-row sm:flex-wrap sm:gap-8">
          <div>
            <p className="text-slate-400">Телефон / MAX</p>
            <a
              href={`tel:${company.phone}`}
              className="text-white hover:underline"
            >
              {company.phoneDisplay} — {company.contactName}
            </a>
          </div>
          <div>
            <p className="text-slate-400">Telegram</p>
            <a
              href={company.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              {company.telegramHandle}
            </a>
          </div>
          <div>
            <p className="text-slate-400">Почта</p>
            <a
              href={`mailto:${company.email}`}
              className="text-white hover:underline"
            >
              {company.email}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/catalog" className="hover:text-white">
            Каталог
          </Link>
          <Link href="/where-to-buy" className="hover:text-white">
            Где купить
          </Link>
          <Link href="/knowledge" className="hover:text-white">
            База знаний
          </Link>
          <Link href="/about" className="hover:text-white">
            О компании
          </Link>
          <Link href="/contacts" className="hover:text-white">
            Контакты
          </Link>
          <Link href="/catalogs" className="hover:text-white">
            Каталоги PDF
          </Link>
          <Link href="/projects" className="hover:text-white">
            Готовые проекты
          </Link>
          <Link href="/news" className="hover:text-white">
            Новости
          </Link>
          <Link href="/reviews" className="hover:text-white">
            Отзывы
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Политика ПД
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          © {new Date().getFullYear()} {company.name}. Цены на сайте —
          ориентировочные, уточняйте у менеджера.
        </p>
      </div>
    </footer>
  );
}
