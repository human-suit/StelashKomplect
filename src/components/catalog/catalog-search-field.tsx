"use client";

import { Search, X } from "lucide-react";

interface CatalogSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CatalogSearchField({
  value,
  onChange,
  placeholder = "Поиск по каталогу…",
  className,
}: CatalogSearchFieldProps) {
  return (
    <div className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-base shadow-sm outline-none transition-[border-color,box-shadow] duration-200 focus:border-[var(--color-primary)] focus:shadow-md"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="touch-auto absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Очистить"
          >
            <X className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
