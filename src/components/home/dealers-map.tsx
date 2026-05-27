"use client";

import { useMemo } from "react";
import { LazyWhenVisible } from "@/components/ui/lazy-when-visible";
import { useCities } from "@/context/cities-context";
import { buildYandexMapEmbedUrl, buildYandexRouteUrl } from "@/lib/map";
import { useCityStore } from "@/store/city-store";

export function DealersMap() {
  const cities = useCities();
  const cityId = useCityStore((s) => s.cityId);
  const city = useMemo(
    () => cities.find((c) => c.id === cityId) ?? cities[0],
    [cityId, cities],
  );
  const mapUrl = useMemo(
    () => (city ? buildYandexMapEmbedUrl(city) : ""),
    [city],
  );

  const pointsWithCoords = city?.locations.filter((l) => l.coords) ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <LazyWhenVisible
        minHeight="280px"
        className="min-h-[280px] bg-slate-100 sm:min-h-[360px]"
      >
        <iframe
          title={`Карта — ${city?.name ?? "Уфа"}`}
          src={mapUrl}
          className="h-[280px] w-full sm:h-[360px]"
          loading="lazy"
          allowFullScreen
        />
      </LazyWhenVisible>
      {pointsWithCoords.length > 0 && (
        <ul className="flex flex-wrap gap-2 border-t border-slate-200 bg-white p-3">
          {pointsWithCoords.map((loc) => (
            <li key={loc.id}>
              <a
                href={buildYandexRouteUrl(loc.coords!.lat, loc.coords!.lon)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] hover:bg-slate-50"
              >
                Маршрут: {loc.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
