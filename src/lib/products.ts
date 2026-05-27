import { staticProducts } from "@/lib/content/products";

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  inStock: number;
  image: string;
  specs: Record<string, string>;
  isFeatured?: boolean;
}

/** Статический каталог (fallback и клиентский поиск до загрузки props) */
export const products = staticProducts;

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function searchProducts(query: string): Product[] {
  return searchProductsInList(products, query);
}

export function searchProductsInList(
  items: Product[],
  query: string,
): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      Object.values(p.specs).some((v) => v.toLowerCase().includes(q)),
  );
}
