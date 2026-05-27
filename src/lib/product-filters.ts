import type { Product } from "@/lib/products";

export type SortOption = "default" | "price-asc" | "price-desc" | "name";

export interface ProductFilters {
  series: string | null;
  shelves: string | null;
  priceRange: string | null;
  sort: SortOption;
}

export const DEFAULT_FILTERS: ProductFilters = {
  series: null,
  shelves: null,
  priceRange: null,
  sort: "default",
};

export function getProductSeries(product: Product): string {
  if (product.specs["Серия"]) return product.specs["Серия"];
  const n = product.name;
  if (n.includes("MS Strong")) return "MS Strong";
  if (n.includes("MS Hard")) return "MS Hard";
  if (n.includes("MS Pro")) return "MS Pro";
  if (n.includes("MS Standart")) return "MS Standart";
  if (n.includes(" SBE") || n.includes("SBE ")) return "SBE";
  if (n.includes(" ES") || n.startsWith("Стеллаж ES")) return "ES";
  return "Другое";
}

export function getProductShelves(product: Product): string | null {
  return product.specs["Полок"] ?? null;
}

export function collectFilterOptions(items: Product[]) {
  const seriesSet = new Set<string>();
  const shelvesSet = new Set<string>();

  for (const p of items) {
    seriesSet.add(getProductSeries(p));
    const sh = getProductShelves(p);
    if (sh) shelvesSet.add(sh);
  }

  const seriesOrder = [
    "MS Standart",
    "MS Strong",
    "MS Hard",
    "MS Pro",
    "ES",
    "SBE",
    "Другое",
  ];

  const series = [...seriesSet].sort((a, b) => {
    const ia = seriesOrder.indexOf(a);
    const ib = seriesOrder.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b, "ru");
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const shelves = [...shelvesSet].sort((a, b) => Number(a) - Number(b));

  return { series, shelves };
}

function matchesPriceRange(price: number, range: string | null): boolean {
  if (!range) return true;
  if (range === "to-5000") return price < 5000;
  if (range === "5000-8000") return price >= 5000 && price <= 8000;
  if (range === "from-8000") return price > 8000;
  return true;
}

export function filterAndSortProducts(
  items: Product[],
  filters: ProductFilters,
): Product[] {
  let result = items.filter((p) => {
    if (filters.series && getProductSeries(p) !== filters.series) return false;
    if (filters.shelves && getProductShelves(p) !== filters.shelves) return false;
    if (!matchesPriceRange(p.price, filters.priceRange)) return false;
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "name":
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, "ru"));
      break;
    default:
      break;
  }

  return result;
}

export function countActiveFilters(filters: ProductFilters): number {
  let n = 0;
  if (filters.series) n++;
  if (filters.shelves) n++;
  if (filters.priceRange) n++;
  if (filters.sort !== "default") n++;
  return n;
}
