import {
  industrySolutions as staticSolutions,
  type IndustrySolution,
} from "@/data/industry-solutions";
import { dbQuery } from "@/lib/server/db-safe";
import { prisma } from "@/lib/server/prisma";

function mapRow(row: {
  solutionKey: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}): IndustrySolution {
  return {
    id: row.solutionKey,
    title: row.title,
    description: row.description,
    href: row.href,
    icon: row.icon,
  };
}

export async function listIndustrySolutions(
  publishedOnly = true,
): Promise<IndustrySolution[]> {
  return dbQuery(async () => {
    const rows = await prisma.industrySolution.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
    if (rows.length === 0) return staticSolutions;
    return rows.map(mapRow);
  }, staticSolutions);
}

export type { IndustrySolution };
