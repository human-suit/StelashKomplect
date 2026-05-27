import { categories } from "@/lib/categories";
import Link from "next/link";

export function CategoryGrid() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-xl font-bold text-slate-900">Каталог продукции</h2>
        <p className="mt-1 text-sm text-slate-600">
          Решения для склада, офиса, производства и медучреждений
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/catalog/${cat.slug}`}
                className="card-hover flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-[var(--color-primary)]"
              >
                <span className="text-2xl" aria-hidden>
                  {cat.icon}
                </span>
                <span className="mt-2 text-sm font-semibold leading-snug text-slate-900">
                  {cat.name}
                </span>
                {cat.description && (
                  <span className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {cat.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
