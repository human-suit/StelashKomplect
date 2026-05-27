import { news as staticNews, type NewsItem } from "@/data/news";
import { asStringArray } from "@/lib/server/cms/utils";
import { dbQuery } from "@/lib/server/db-safe";
import { prisma } from "@/lib/server/prisma";

function mapRow(row: {
  slug: string;
  title: string;
  date: Date;
  excerpt: string;
  content: unknown;
}): NewsItem {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date.toISOString().slice(0, 10),
    excerpt: row.excerpt,
    content: asStringArray(row.content),
  };
}

export async function listNews(publishedOnly = true): Promise<NewsItem[]> {
  return dbQuery(async () => {
    const rows = await prisma.newsPost.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ date: "desc" }, { sortOrder: "asc" }],
    });
    if (rows.length === 0) return staticNews;
    return rows.map(mapRow);
  }, staticNews);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  const fromDb = await dbQuery(async () => {
    const row = await prisma.newsPost.findFirst({
      where: { slug, published: true },
    });
    return row ? mapRow(row) : undefined;
  }, undefined);
  return fromDb ?? staticNews.find((n) => n.slug === slug);
}

export type { NewsItem };
