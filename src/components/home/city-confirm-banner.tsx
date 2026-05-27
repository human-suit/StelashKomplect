"use client";

import { useSyncExternalStore, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCityById } from "@/context/cities-context";
import { useCityStore } from "@/store/city-store";

const CONFIRM_KEY = "sk-city-confirmed";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function isCityConfirmed(): boolean {
  try {
    return localStorage.getItem(CONFIRM_KEY) === "1";
  } catch {
    return false;
  }
}

export function CityConfirmBanner() {
  const cityId = useCityStore((s) => s.cityId);
  const city = useCityById(cityId);
  const [dismissed, setDismissed] = useState(false);
  const confirmed = useSyncExternalStore(
    subscribe,
    isCityConfirmed,
    () => true,
  );

  if (confirmed || dismissed) return null;

  function confirmCity() {
    try {
      localStorage.setItem(CONFIRM_KEY, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  }

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[var(--color-primary)]">
            <MapPin className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ваш город
            </p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">
              {city?.name ?? cityId}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Подтвердите город, чтобы цены и точки выдачи отображались корректно.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          className="w-full shrink-0 sm:w-auto"
          onClick={confirmCity}
        >
          Да, всё верно
        </Button>
      </div>
    </section>
  );
}
