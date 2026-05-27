"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCityById } from "@/context/cities-context";
import { useCityStore } from "@/store/city-store";

const CONFIRM_KEY = "sk-city-confirmed";

export function CityConfirmBanner() {
  const cityId = useCityStore((s) => s.cityId);
  const city = useCityById(cityId);
  const [confirmed, setConfirmed] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return localStorage.getItem(CONFIRM_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (confirmed) return null;

  return (
    <section className="animate-hero-in mx-4 mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <p className="text-sm font-semibold text-slate-900">
        Ваш город: {city?.name ?? cityId}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Чтобы цены и точки выдачи отображались корректно, подтвердите город.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            try {
              localStorage.setItem(CONFIRM_KEY, "1");
            } catch {
              // ignore
            }
            setConfirmed(true);
          }}
        >
          Да, продолжить
        </Button>
      </div>
    </section>
  );
}

