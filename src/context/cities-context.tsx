"use client";

import { cities as staticCities, type City } from "@/lib/cities";
import { createContext, useContext, type ReactNode } from "react";

const CitiesContext = createContext<City[]>(staticCities);

export function CitiesProvider({
  cities,
  children,
}: {
  cities: City[];
  children: ReactNode;
}) {
  return (
    <CitiesContext.Provider value={cities.length > 0 ? cities : staticCities}>
      {children}
    </CitiesContext.Provider>
  );
}

export function useCities(): City[] {
  return useContext(CitiesContext);
}

export function useCityById(id: string): City | undefined {
  return useCities().find((c) => c.id === id);
}

export function useDefaultCity(): City {
  const list = useCities();
  return list.find((c) => c.isDefault) ?? list[0];
}
