"use client";

import { formatPrice, type Product } from "@/lib/products";
import { useCompareStore } from "@/store/compare-store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product/product-image";
import { Trash2 } from "lucide-react";

function Bar({ value, max }: { value: number; max: number }) {
  const width = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-2 rounded-full bg-slate-100">
      <div className="h-2 rounded-full bg-[var(--color-primary)]" style={{ width: `${width}%` }} />
    </div>
  );
}

export function ComparePageClient({ products }: { products: Product[] }) {
  const slugs = useCompareStore((s) => s.slugs);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const selected = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  if (selected.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-slate-700">Вы еще не добавили товары для сравнения.</p>
        <Link href="/catalog" className="mt-3 inline-block text-[var(--color-primary)] underline">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  const maxPrice = Math.max(...selected.map((p) => p.price));
  const maxStock = Math.max(...selected.map((p) => p.inStock));
  const specKeys = Array.from(new Set(selected.flatMap((p) => Object.keys(p.specs))));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">Сравниваются: {selected.length}</p>
        <Button variant="outline" onClick={clear}>Очистить сравнение</Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-2 text-left">Параметр</th>
              {selected.map((p) => (
                <th key={p.slug} className="px-3 py-2 text-left min-w-[220px]">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/product/${p.slug}`} className="font-semibold text-[var(--color-primary)] hover:underline">
                      {p.name}
                    </Link>
                    <button
                      type="button"
                      aria-label={`Убрать ${p.name} из сравнения`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                      onClick={() => remove(p.slug)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-2 font-medium">Изображение</td>
              {selected.map((p) => (
                <td key={`${p.slug}-image`} className="px-3 py-2">
                  <div className="relative h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <ProductImage
                      src={p.image}
                      alt={p.name}
                      categorySlug={p.categorySlug}
                      sizes="200px"
                    />
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-2 font-medium">Цена</td>
              {selected.map((p) => (
                <td key={p.slug} className="px-3 py-2">
                  <p className="font-semibold text-slate-900">{formatPrice(p.price)}</p>
                  <Bar value={p.price} max={maxPrice} />
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-2 font-medium">В наличии</td>
              {selected.map((p) => (
                <td key={p.slug} className="px-3 py-2">
                  <p className="font-semibold text-slate-900">{p.inStock} шт.</p>
                  <Bar value={p.inStock} max={maxStock} />
                </td>
              ))}
            </tr>
            {specKeys.map((key) => (
              <tr key={key} className="border-b border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-700">{key}</td>
                {selected.map((p) => (
                  <td key={`${p.slug}-${key}`} className="px-3 py-2 text-slate-700">
                    {p.specs[key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
