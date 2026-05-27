export type LocationType = "store" | "store_new" | "warehouse";

export interface LocationCoords {
  lat: number;
  lon: number;
}

export interface Location {
  id: string;
  type: LocationType;
  label: string;
  address: string;
  note?: string;
  coords?: LocationCoords;
}

export interface City {
  id: string;
  name: string;
  region: string;
  isDefault?: boolean;
  locations: Location[];
}

export const cities: City[] = [
  {
    id: "ufa",
    name: "Уфа",
    region: "Республика Башкортостан",
    isDefault: true,
    locations: [
      {
        id: "ufa-store-1",
        type: "store",
        label: "Магазин",
        address: "д. Бурцево, ул. Трактовая, 24А",
        coords: { lat: 54.6828, lon: 55.9186 },
      },
      {
        id: "ufa-store-2",
        type: "store_new",
        label: "Магазин",
        address: "г. Уфа, пр. Октября, 68",
        coords: { lat: 54.7355, lon: 55.9578 },
      },
      {
        id: "ufa-wh-1",
        type: "warehouse",
        label: "Склад",
        address: "ул. Новоженова, 90в",
        coords: { lat: 54.7352, lon: 55.9871 },
      },
      {
        id: "ufa-wh-2",
        type: "warehouse",
        label: "Склад",
        address: "ул. Силикатная, 3к1",
        coords: { lat: 54.7518, lon: 56.0124 },
      },
    ],
  },
  {
    id: "kazan",
    name: "Казань",
    region: "Республика Татарстан",
    locations: [
      {
        id: "kazan-store-1",
        type: "store",
        label: "Пункт выдачи",
        address: "г. Казань, ул. Спартаковская, 35",
        note: "Выдача заказов по предварительной записи",
        coords: { lat: 55.7961, lon: 49.1064 },
      },
      {
        id: "kazan-wh-1",
        type: "warehouse",
        label: "Склад",
        address: "г. Казань, ул. Промышленная, 52",
        coords: { lat: 55.7812, lon: 49.1523 },
      },
    ],
  },
];

export function getCityById(id: string): City | undefined {
  return cities.find((c) => c.id === id);
}

export function getDefaultCity(): City {
  return cities.find((c) => c.isDefault) ?? cities[0];
}
