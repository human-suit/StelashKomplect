import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.isFeatured).slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Лидеры продаж</h2>
            <p className="mt-1 text-sm text-slate-600">Популярные стеллажи MS</p>
          </div>
          <Link
            href="/catalog/stellazhi"
            className="shrink-0 text-sm font-semibold text-[var(--color-primary)] transition-opacity duration-200 hover:opacity-80"
          >
            Все →
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <li key={product.id} className="product-grid-item">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
