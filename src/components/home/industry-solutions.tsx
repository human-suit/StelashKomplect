import Link from "next/link";
import { industrySolutions as staticSolutions } from "@/data/industry-solutions";
import type { IndustrySolution } from "@/data/industry-solutions";

export function IndustrySolutions({ items }: { items: IndustrySolution[] }) {
  const list = items.length > 0 ? items : staticSolutions;
  return (
    <section id="solutions" className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Отраслевые решения
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Подбор оборудования под задачу: склад, офис, торговля, производство,
            медицина.
          </p>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="card-hover flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md"
              >
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <p className="mt-3 font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 flex-1 text-sm text-slate-600">
                  {item.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-[var(--color-primary)]">
                  В каталог →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
