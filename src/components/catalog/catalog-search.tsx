"use client";

import type { Product } from "@/lib/products";
import { searchProductsInList } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export function CatalogSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => searchProductsInList(products, query),
    [products, query],
  );

  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по каталогу…"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-base shadow-sm outline-none focus:border-[var(--color-primary)]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="touch-auto absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-slate-400"
            aria-label="Очистить"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {query.length >= 2 && (
        <div className="mt-4">
          <p className="mb-3 text-sm text-slate-600">
            Найдено: {results.length}
          </p>
          {results.length === 0 ? (
            <p className="text-sm text-slate-500">Ничего не найдено</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {results.slice(0, 12).map((p) => (
                <li key={p.id} className="product-grid-item">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
