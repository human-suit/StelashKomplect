"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDefaultCity } from "@/lib/cities";

interface CityState {
  cityId: string;
  setCityId: (id: string) => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      cityId: getDefaultCity().id,
      setCityId: (cityId) => set({ cityId }),
    }),
    { name: "sk-city" },
  ),
);
