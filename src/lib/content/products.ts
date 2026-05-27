import catalogData from "@/data/products.generated.json";
import type { Product } from "@/lib/products";
import { dbQuery } from "@/lib/server/db-safe";
import { prisma } from "@/lib/server/prisma";

const staticProducts = catalogData.products as unknown as Product[];

function mapRow(row: {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  inStock: number;
  image: string;
  specs: unknown;
  isFeatured: boolean;
}): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categorySlug: row.categorySlug,
    price: row.price,
    inStock: row.inStock,
    image: row.image,
    specs:
      row.specs && typeof row.specs === "object" && !Array.isArray(row.specs)
        ? (row.specs as Record<string, string>)
        : {},
    isFeatured: row.isFeatured,
  };
}

export async function listProducts(publishedOnly = true): Promise<Product[]> {
  return dbQuery(async () => {
    const rows = await prisma.product.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    if (rows.length === 0) return staticProducts;
    return rows.map(mapRow);
  }, staticProducts);
}

export async function getProductBySlugFromContent(
  slug: string,
): Promise<Product | undefined> {
  const fromDb = await dbQuery(async () => {
    const row = await prisma.product.findFirst({
      where: { slug, published: true },
    });
    return row ? mapRow(row) : undefined;
  }, undefined);
  return fromDb ?? staticProducts.find((p) => p.slug === slug);
}

export async function getProductsByCategoryFromContent(
  categorySlug: string,
): Promise<Product[]> {
  const all = await listProducts();
  return all.filter((p) => p.categorySlug === categorySlug);
}

export async function getFeaturedProductsFromContent(): Promise<Product[]> {
  const all = await listProducts();
  return all.filter((p) => p.isFeatured);
}

export { staticProducts };
