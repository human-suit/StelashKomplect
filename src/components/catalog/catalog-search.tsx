"use client";

import type { Product } from "@/lib/products";
import { searchProductsInList } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import { CatalogSearchField } from "@/components/catalog/catalog-search-field";
import { ListPagination } from "@/components/ui/list-pagination";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;

export function CatalogSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const results = useMemo(
    () => searchProductsInList(products, query),
    [products, query],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const visible = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return results.slice(start, start + ITEMS_PER_PAGE);
  }, [results, currentPage]);

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
  }

  return (
    <div className="mb-6">
      <CatalogSearchField value={query} onChange={handleQueryChange} />

      {query.length >= 2 && (
        <div className="mt-4">
          <p className="mb-3 text-sm text-slate-600">
            Найдено: {results.length}
          </p>
          {results.length === 0 ? (
            <p className="text-sm text-slate-500">Ничего не найдено</p>
          ) : (
            <>
              <ul
                key={`${query}-${currentPage}`}
                className="catalog-results-in grid gap-4 sm:grid-cols-2"
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
                className="mt-6"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
