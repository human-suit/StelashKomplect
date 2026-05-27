"use client";

import {
  countActiveFilters,
  DEFAULT_FILTERS,
  type ProductFilters,
  type SortOption,
} from "@/lib/product-filters";
import { cn } from "@/lib/cn";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const PRICE_OPTIONS = [
  { id: null, label: "Любая" },
  { id: "to-5000", label: "до 5 000 ₽" },
  { id: "5000-8000", label: "5–8 тыс. ₽" },
  { id: "from-8000", label: "от 8 000 ₽" },
] as const;

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "default", label: "По умолчанию" },
  { id: "price-asc", label: "Цена ↑" },
  { id: "price-desc", label: "Цена ↓" },
  { id: "name", label: "По названию" },
];

interface CatalogFiltersProps {
  filters: ProductFilters;
  onChange: (f: ProductFilters) => void;
  seriesOptions: string[];
  shelvesOptions: string[];
  resultCount: number;
  totalCount: number;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "touch-target shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ease-out",
        active
          ? "bg-[var(--color-primary)] text-white shadow-sm"
          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300",
      )}
    >
      {children}
    </button>
  );
}

export function CatalogFilters({
  filters,
  onChange,
  seriesOptions,
  shelvesOptions,
  resultCount,
  totalCount,
}: CatalogFiltersProps) {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  function patch(partial: Partial<ProductFilters>) {
    onChange({ ...filters, ...partial });
  }

  function reset() {
    onChange(DEFAULT_FILTERS);
    setOpen(false);
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "touch-target flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-200",
            activeCount > 0
              ? "border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]"
              : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
          )}
        >
          <SlidersHorizontal className="size-4" />
          Фильтры
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-white">
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300 ease-out",
              open && "rotate-180",
            )}
          />
        </button>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="touch-target flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm text-slate-500"
          >
            <X className="size-4" />
            Сброс
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Показано{" "}
        <span className="font-semibold text-slate-900">{resultCount}</span> из{" "}
        {totalCount}
      </p>

      {/* Серия — всегда видна (горизонтальный скролл) */}
      {seriesOptions.length > 1 && (
        <div className="-mx-4 mt-3 overflow-x-auto px-4 pb-1">
          <div className="flex w-max gap-2">
            <Chip
              active={!filters.series}
              onClick={() => patch({ series: null })}
            >
              Все серии
            </Chip>
            {seriesOptions.map((s) => (
              <Chip
                key={s}
                active={filters.series === s}
                onClick={() =>
                  patch({ series: filters.series === s ? null : s })
                }
              >
                {s}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
          open
            ? "mt-4 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {shelvesOptions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Количество полок
                </p>
                <div className="flex flex-wrap gap-2">
                  <Chip
                    active={!filters.shelves}
                    onClick={() => patch({ shelves: null })}
                  >
                    Любое
                  </Chip>
                  {shelvesOptions.map((s) => (
                    <Chip
                      key={s}
                      active={filters.shelves === s}
                      onClick={() =>
                        patch({ shelves: filters.shelves === s ? null : s })
                      }
                    >
                      {s} пол.
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                Цена
              </p>
              <div className="flex flex-wrap gap-2">
                {PRICE_OPTIONS.map((opt) => (
                  <Chip
                    key={String(opt.id)}
                    active={filters.priceRange === opt.id}
                    onClick={() => patch({ priceRange: opt.id })}
                  >
                    {opt.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                Сортировка
              </p>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <Chip
                    key={opt.id}
                    active={filters.sort === opt.id}
                    onClick={() => patch({ sort: opt.id })}
                  >
                    {opt.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
