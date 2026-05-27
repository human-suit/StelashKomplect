"use client";

import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductCard } from "@/components/product/product-card";
import {
  collectFilterOptions,
  DEFAULT_FILTERS,
  filterAndSortProducts,
  type ProductFilters,
} from "@/lib/product-filters";
import type { Product } from "@/lib/products";
import { useMemo, useState } from "react";

export function CategoryProductList({
  products: items,
  categoryName,
}: {
  products: Product[];
  categoryName: string;
}) {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  const { series, shelves } = useMemo(
    () => collectFilterOptions(items),
    [items],
  );

  const filtered = useMemo(
    () => filterAndSortProducts(items, filters),
    [items, filters],
  );

  return (
    <>
      <CatalogFilters
        filters={filters}
        onChange={setFilters}
        seriesOptions={series}
        shelvesOptions={shelves}
        resultCount={filtered.length}
        totalCount={items.length}
      />

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-medium text-slate-900">Ничего не найдено</p>
          <p className="mt-2 text-sm text-slate-600">
            Измените фильтры или сбросьте их, чтобы увидеть {categoryName}
          </p>
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="touch-target mt-4 rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id} className="product-grid-item">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
