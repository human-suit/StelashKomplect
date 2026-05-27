import { cities as staticCities, type City, type Location } from "@/lib/cities";
import { dbQuery } from "@/lib/server/db-safe";
import { isDatabaseConfigured, prisma } from "@/lib/server/prisma";

function mapLocation(row: {
  id: string;
  type: string;
  label: string;
  address: string;
  note: string | null;
  lat: number | null;
  lon: number | null;
}): Location {
  return {
    id: row.id,
    type: row.type as Location["type"],
    label: row.label,
    address: row.address,
    note: row.note ?? undefined,
    coords:
      row.lat != null && row.lon != null
        ? { lat: row.lat, lon: row.lon }
        : undefined,
  };
}

function mapCity(row: {
  id: string;
  name: string;
  region: string;
  isDefault: boolean;
  locations: Parameters<typeof mapLocation>[0][];
}): City {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    isDefault: row.isDefault,
    locations: row.locations.map(mapLocation),
  };
}

export async function listCities(): Promise<City[]> {
  return dbQuery(async () => {
    if (!isDatabaseConfigured() || !prisma.cmsCity) return staticCities;

    const rows = await prisma.cmsCity.findMany({
      include: { locations: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticCities;
    return rows.map(mapCity);
  }, staticCities);
}

export async function getCityByIdFromContent(id: string): Promise<City | undefined> {
  const all = await listCities();
  return all.find((c) => c.id === id);
}

export async function getDefaultCityFromContent(): Promise<City> {
  const all = await listCities();
  return all.find((c) => c.isDefault) ?? all[0];
}

export type { City, Location };
