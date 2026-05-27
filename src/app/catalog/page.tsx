import { CatalogSearch } from "@/components/catalog/catalog-search";
import { CategoryChips } from "@/components/catalog/category-chips";
import { categories } from "@/lib/categories";
import { listProducts } from "@/lib/content/products";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Каталог",
};

export default async function CatalogPage() {
  const products = await listProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Каталог продукции</h1>
      <div className="mt-4">
        <CategoryChips />
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Металлическая мебель для склада, офиса и бизнеса
      </p>
      <div className="mt-6">
        <CatalogSearch products={products} />
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/catalog/${cat.slug}`}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[var(--color-primary)]"
            >
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <h2 className="font-semibold text-slate-900">{cat.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{cat.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
