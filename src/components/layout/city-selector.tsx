"use client";

import { cn } from "@/lib/cn";
import { useCities } from "@/context/cities-context";
import { useCityStore } from "@/store/city-store";
import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";

export function CitySelector({ compact }: { compact?: boolean }) {
  const cities = useCities();
  const cityId = useCityStore((s) => s.cityId);
  const setCityId = useCityStore((s) => s.setCityId);
  const [open, setOpen] = useState(false);
  const current = cities.find((c) => c.id === cityId) ?? cities[0];
  if (!current) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 rounded-lg text-left transition-colors",
          compact
            ? "max-w-[120px] truncate text-xs text-slate-600"
            : "gap-2 px-3 py-2 text-sm font-medium text-[var(--color-primary)] hover:bg-slate-100",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <MapPin className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{current.name}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <ul
            role="listbox"
            className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
          >
            {cities.map((city) => (
              <li key={city.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={city.id === cityId}
                  onClick={() => {
                    setCityId(city.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50",
                    city.id === cityId && "bg-slate-50 font-semibold text-[var(--color-primary)]",
                  )}
                >
                  {city.name}
                  <span className="block text-xs font-normal text-slate-500">
                    {city.region}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
