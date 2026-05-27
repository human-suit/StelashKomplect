import { ComparePageClient } from "@/components/product/compare-page-client";
import { listProducts } from "@/lib/content/products";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Сравнение товаров",
  description: "Сравнение характеристик товаров по цене, наличию и параметрам.",
};

export default async function ComparePage() {
  const products = await listProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Сравнение товаров</h1>
      <p className="mt-2 text-slate-600">
        Сравнивайте товары по ключевым параметрам, цене и наличию.
      </p>
      <div className="mt-6">
        <ComparePageClient products={products} />
      </div>
      <p className="mt-8">
        <Link href="/catalog" className="text-[var(--color-primary)] underline">
          ← Вернуться в каталог
        </Link>
      </p>
    </div>
  );
}
