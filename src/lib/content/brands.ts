import { brands as staticBrands, type Brand } from "@/data/brands";
import { dbQuery } from "@/lib/server/db-safe";
import { prisma } from "@/lib/server/prisma";

export async function listBrands(publishedOnly = true): Promise<Brand[]> {
  return dbQuery(async () => {
    const rows = await prisma.brand.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    if (rows.length === 0) return staticBrands;
    return rows.map((r) => ({
      name: r.name,
      note: r.note ?? undefined,
    }));
  }, staticBrands);
}

export type { Brand };
