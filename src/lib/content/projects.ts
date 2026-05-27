import { projects as staticProjects, type ProjectItem } from "@/data/projects";
import { asStringArray } from "@/lib/server/cms/utils";
import { dbQuery } from "@/lib/server/db-safe";
import { prisma } from "@/lib/server/prisma";

function mapRow(row: {
  slug: string;
  title: string;
  tags: unknown;
  excerpt: string;
  bullets: unknown;
}): ProjectItem {
  return {
    slug: row.slug,
    title: row.title,
    tags: asStringArray(row.tags),
    excerpt: row.excerpt,
    bullets: asStringArray(row.bullets),
  };
}

export async function listProjects(publishedOnly = true): Promise<ProjectItem[]> {
  return dbQuery(async () => {
    const rows = await prisma.project.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
    if (rows.length === 0) return staticProjects;
    return rows.map(mapRow);
  }, staticProjects);
}

export type { ProjectItem };
