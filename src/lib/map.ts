import type { City, Location } from "@/lib/cities";

export function getLocationsWithCoords(city: City): Location[] {
  return city.locations.filter((l) => l.coords);
}

/** URL виджета Яндекс.Карт для iframe */
export function buildYandexMapEmbedUrl(city: City): string {
  const points = getLocationsWithCoords(city);
  if (points.length === 0) {
    return "https://yandex.ru/map-widget/v1/?ll=55.9587,54.7352&z=11";
  }

  const center = points[0].coords!;
  const pt = points
    .map((p) => `${p.coords!.lon},${p.coords!.lat},pm2rdm`)
    .join("~");

  return `https://yandex.ru/map-widget/v1/?ll=${center.lon},${center.lat}&z=12&pt=${pt}`;
}

export function buildYandexRouteUrl(lat: number, lon: number): string {
  return `https://yandex.ru/maps/?rtext=~${lat},${lon}&rtt=auto`;
}

export function build2GisRouteUrl(lat: number, lon: number): string {
  return `https://2gis.ru/routeSearch/rsType/car/to/${lon},${lat}`;
}
