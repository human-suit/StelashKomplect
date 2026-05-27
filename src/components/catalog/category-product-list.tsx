"use client";

import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CatalogSearchField } from "@/components/catalog/catalog-search-field";
import { ProductCard } from "@/components/product/product-card";
import { ListPagination } from "@/components/ui/list-pagination";
import {
  collectFilterOptions,
  DEFAULT_FILTERS,
  filterAndSortProducts,
  type ProductFilters,
} from "@/lib/product-filters";
import type { Product } from "@/lib/products";
import { searchProductsInList } from "@/lib/products";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;

export function CategoryProductList({
  products: items,
  categoryName,
}: {
  products: Product[];
  categoryName: string;
}) {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { series, shelves } = useMemo(
    () => collectFilterOptions(items),
    [items],
  );

  const filtered = useMemo(() => {
    let list = filterAndSortProducts(items, filters);
    const q = searchQuery.trim();
    if (q.length >= 2) {
      list = searchProductsInList(list, q);
    }
    return list;
  }, [items, filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const visible = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const resultsKey = `${searchQuery}|${JSON.stringify(filters)}|${currentPage}`;

  function handleSearchChange(nextQuery: string) {
    setSearchQuery(nextQuery);
    setPage(1);
  }

  function handleFiltersChange(nextFilters: ProductFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    document.getElementById("catalog-products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <CatalogSearchField
        value={searchQuery}
        onChange={handleSearchChange}
        className="mt-4"
      />

      <CatalogFilters
        filters={filters}
        onChange={handleFiltersChange}
        seriesOptions={series}
        shelvesOptions={shelves}
        resultCount={filtered.length}
        totalCount={items.length}
      />

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-medium text-slate-900">Ничего не найдено</p>
          <p className="mt-2 text-sm text-slate-600">
            Измените фильтры, поиск или сбросьте их, чтобы увидеть {categoryName}
          </p>
          <button
            type="button"
            onClick={() => {
              setFilters(DEFAULT_FILTERS);
              setSearchQuery("");
            }}
            className="touch-target mt-4 rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white"
          >
            Сбросить всё
          </button>
        </div>
      ) : (
        <>
          <ul
            id="catalog-products"
            key={resultsKey}
            className="catalog-results-in mt-6 grid scroll-mt-24 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((p) => (
              <li key={p.id} className="product-grid-item">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>

          <ListPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        </>
      )}
    </>
  );
}
