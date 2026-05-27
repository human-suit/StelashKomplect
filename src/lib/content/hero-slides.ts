import { heroSlides as staticSlides, type HeroSlide } from "@/data/hero-slides";
import { dbQuery } from "@/lib/server/db-safe";
import { prisma } from "@/lib/server/prisma";

function mapRow(row: {
  slideKey: string;
  title: string;
  subtitle: string;
  badge: string | null;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string | null;
  ctaSecondaryHref: string | null;
  gradient: string;
}): HeroSlide {
  return {
    id: row.slideKey,
    title: row.title,
    subtitle: row.subtitle,
    badge: row.badge ?? undefined,
    ctaPrimary: { label: row.ctaPrimaryLabel, href: row.ctaPrimaryHref },
    ctaSecondary:
      row.ctaSecondaryLabel && row.ctaSecondaryHref
        ? { label: row.ctaSecondaryLabel, href: row.ctaSecondaryHref }
        : undefined,
    gradient: row.gradient,
  };
}

export async function listHeroSlides(publishedOnly = true): Promise<HeroSlide[]> {
  return dbQuery(async () => {
    const rows = await prisma.heroSlide.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { slideKey: "asc" }],
    });
    if (rows.length === 0) return staticSlides;
    return rows.map(mapRow);
  }, staticSlides);
}

export type { HeroSlide };
