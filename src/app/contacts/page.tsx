"use client";

import { company } from "@/lib/company";
import { CitySelector } from "@/components/layout/city-selector";
import { useCities, useCityById } from "@/context/cities-context";
import { useCityStore } from "@/store/city-store";
export default function ContactsPage() {
  const cities = useCities();
  const cityId = useCityStore((s) => s.cityId);
  const city = useCityById(cityId) ?? cities[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Контакты</h1>
      <p className="mt-2 text-slate-600">Свяжитесь с нами удобным способом</p>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-slate-700">Ваш город</p>
        <CitySelector />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href={`tel:${company.phone}`}
          className="rounded-xl border border-slate-200 bg-white p-5 hover:border-[var(--color-primary)]"
        >
          <p className="text-sm text-slate-500">Телефон / MAX</p>
          <p className="mt-1 font-bold text-[var(--color-primary)]">
            {company.phoneDisplay}
          </p>
          <p className="text-sm text-slate-600">{company.contactName}</p>
        </a>
        <a
          href={company.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-slate-200 bg-white p-5 hover:border-[var(--color-primary)]"
        >
          <p className="text-sm text-slate-500">Telegram</p>
          <p className="mt-1 font-bold text-[var(--color-primary)]">
            {company.telegramHandle}
          </p>
        </a>
        <a
          href={`mailto:${company.email}`}
          className="rounded-xl border border-slate-200 bg-white p-5 hover:border-[var(--color-primary)] sm:col-span-2"
        >
          <p className="text-sm text-slate-500">Почта</p>
          <p className="mt-1 font-bold text-[var(--color-primary)]">
            {company.email}
          </p>
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">
          Адреса в {city.name}
        </h2>
        <ul className="mt-4 space-y-3">
          {city.locations.map((loc) => (
            <li
              key={loc.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="font-semibold text-slate-900">{loc.label}</p>
              <p className="mt-1 text-sm text-slate-600">{loc.address}</p>
              {loc.note && (
                <p className="mt-1 text-xs text-slate-500">{loc.note}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
