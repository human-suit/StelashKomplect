import Link from "next/link";
import type { Brand } from "@/data/brands";

export function BrandsStrip({ brands }: { brands: Brand[] }) {
  return (
    <section id="brands" className="border-y border-slate-200 bg-white px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Торговые марки
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Официальный дилер ведущих заводов России
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-semibold text-[var(--color-primary)]"
          >
            Каталог →
          </Link>
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <li
              key={brand.name}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center"
            >
              <p className="text-xs font-semibold text-slate-800">{brand.name}</p>
              {brand.note && (
                <p className="mt-0.5 text-[10px] text-slate-500">{brand.note}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
