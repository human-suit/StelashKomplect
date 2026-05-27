import {
  knowledgeArticles as staticKnowledge,
  type KnowledgeArticle,
} from "@/data/knowledge";
import { asStringArray } from "@/lib/server/cms/utils";
import { dbQuery } from "@/lib/server/db-safe";
import { prisma } from "@/lib/server/prisma";

function mapRow(row: {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: unknown;
}): KnowledgeArticle {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    content: asStringArray(row.content),
  };
}

export async function listKnowledge(
  publishedOnly = true,
): Promise<KnowledgeArticle[]> {
  return dbQuery(async () => {
    const rows = await prisma.knowledgeArticle.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
    if (rows.length === 0) return staticKnowledge;
    return rows.map(mapRow);
  }, staticKnowledge);
}

export async function getKnowledgeBySlug(
  slug: string,
): Promise<KnowledgeArticle | undefined> {
  const fromDb = await dbQuery(async () => {
    const row = await prisma.knowledgeArticle.findFirst({
      where: { slug, published: true },
    });
    return row ? mapRow(row) : undefined;
  }, undefined);
  return fromDb ?? staticKnowledge.find((a) => a.slug === slug);
}

export type { KnowledgeArticle };
