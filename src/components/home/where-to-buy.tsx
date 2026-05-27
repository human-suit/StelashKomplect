"use client";

import { useMemo, useState } from "react";
import { ButtonLink, Button } from "@/components/ui/button";
import { CitySelector } from "@/components/layout/city-selector";
import { useCities } from "@/context/cities-context";
import { useCityStore } from "@/store/city-store";
import { DealersMap } from "@/components/home/dealers-map";
import { company } from "@/lib/company";
import { build2GisRouteUrl, buildYandexRouteUrl } from "@/lib/map";

const storePriority = ["store", "store_new", "warehouse"] as const;

function getNearestLocation(
  cityId: string,
  cities: ReturnType<typeof useCities>,
): { label: string; address: string } | null {
  const city = cities.find((c) => c.id === cityId);
  if (!city) return null;

  const locations = [...city.locations];
  locations.sort((a, b) => {
    const ai = storePriority.indexOf(a.type);
    const bi = storePriority.indexOf(b.type);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  const loc = locations[0];
  if (!loc) return null;
  return { label: loc.label, address: loc.address };
}

export function WhereToBuy() {
  const cities = useCities();
  const cityId = useCityStore((s) => s.cityId);
  const setCityId = useCityStore((s) => s.setCityId);
  const city = useMemo(
    () => cities.find((c) => c.id === cityId) ?? cities[0],
    [cityId, cities],
  );

  const nearest = useMemo(
    () => getNearestLocation(cityId, cities),
    [cityId, cities],
  );
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="where-to-buy" className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Где купить</h2>
            <p className="mt-1 text-sm text-slate-600">
              Найдите ближайшую точку продаж и уточните наличие.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-700">
              Ваш город
            </span>
            <CitySelector compact />
            <ButtonLink
              href="/where-to-buy"
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Отдельная страница →
            </ButtonLink>
          </div>
        </div>

        <div className="mt-6">
          <DealersMap />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          {nearest ? (
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[var(--color-primary)]">
                Ближайший филиал
              </p>
              <p className="text-sm text-slate-800">{nearest.label}</p>
              <p className="text-sm text-slate-600">{nearest.address}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              В выбранном городе точки пока не настроены.
            </p>
          )}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">
              Адреса в {city.name}
            </p>
            {city.locations.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Свернуть" : "Все адреса"}
              </Button>
            )}
          </div>

          <ul className="mt-4 space-y-3">
            {(expanded ? city.locations : city.locations.slice(0, 2)).map((loc) => (
              <li
                key={loc.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {loc.label}
                  <span className="ml-2 text-xs font-medium text-slate-500">
                    ({loc.type})
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-600">{loc.address}</p>
                {loc.note && (
                  <p className="mt-1 text-xs text-slate-500">{loc.note}</p>
                )}
                {loc.coords && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={buildYandexRouteUrl(loc.coords.lat, loc.coords.lon)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] hover:bg-slate-50"
                    >
                      Маршрут в Яндекс
                    </a>
                    <a
                      href={build2GisRouteUrl(loc.coords.lat, loc.coords.lon)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] hover:bg-slate-50"
                    >
                      Маршрут в 2ГИС
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <p className="text-xs text-slate-500">
              Не нашли нужную точку? Менеджер поможет с подбором и маршрутом.
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href="/checkout"
                variant="secondary"
                size="lg"
                className="!bg-[var(--color-primary)] !text-white"
              >
                Оставить заявку
              </ButtonLink>
              <a
                href={company.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Написать менеджеру
              </a>
            </div>
          </div>
        </div>

        {/* Небольшой скрытый блок для поддержки выбранного города без пересборки */}
        <div className="sr-only">
          {cities.map((c) => (
            <button
              key={c.id}
              onClick={() => setCityId(c.id)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

