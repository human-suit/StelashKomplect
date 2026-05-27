import { brands as staticBrands } from "@/data/brands";
import { heroSlides as staticHeroSlides } from "@/data/hero-slides";
import { industrySolutions as staticSolutions } from "@/data/industry-solutions";
import { knowledgeArticles as staticKnowledge } from "@/data/knowledge";
import { news as staticNews } from "@/data/news";
import { projects as staticProjects } from "@/data/projects";
import { cities as staticCities } from "@/lib/cities";
import catalogData from "@/data/products.generated.json";
import { isDatabaseConfigured, prisma } from "@/lib/server/prisma";
import { parseSpecs, parseLines, slugify, toJson } from "@/lib/server/cms/utils";
import type { CmsResource } from "@/lib/server/cms/resources";

export function cmsDbRequired() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL не задан — CMS доступен только с PostgreSQL");
  }
}

export async function adminList(resource: CmsResource) {
  cmsDbRequired();

  switch (resource) {
    case "news":
      return prisma.newsPost.findMany({ orderBy: [{ date: "desc" }] });
    case "knowledge":
      return prisma.knowledgeArticle.findMany({ orderBy: [{ sortOrder: "asc" }] });
    case "brands":
      return prisma.brand.findMany({ orderBy: [{ sortOrder: "asc" }] });
    case "hero-slides":
      return prisma.heroSlide.findMany({ orderBy: [{ sortOrder: "asc" }] });
    case "solutions":
      return prisma.industrySolution.findMany({ orderBy: [{ sortOrder: "asc" }] });
    case "projects":
      return prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }] });
    case "products":
      return prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }] });
    case "cities":
      return prisma.cmsCity.findMany({
        include: { locations: { orderBy: { sortOrder: "asc" } } },
        orderBy: { sortOrder: "asc" },
      });
    default:
      throw new Error("Unknown resource");
  }
}

export async function adminCreate(resource: CmsResource, body: Record<string, unknown>) {
  cmsDbRequired();

  switch (resource) {
    case "news": {
      const slug = String(body.slug ?? slugify(String(body.title ?? "")));
      return prisma.newsPost.create({
        data: {
          slug,
          title: String(body.title ?? ""),
          date: body.date ? new Date(String(body.date)) : new Date(),
          excerpt: String(body.excerpt ?? ""),
          content: toJson(parseLines(String(body.content ?? ""))),
          published: body.published !== false,
          sortOrder: Number(body.sortOrder ?? 0),
        },
      });
    }
    case "knowledge": {
      const slug = String(body.slug ?? slugify(String(body.title ?? "")));
      return prisma.knowledgeArticle.create({
        data: {
          slug,
          title: String(body.title ?? ""),
          category: String(body.category ?? "Общее"),
          excerpt: String(body.excerpt ?? ""),
          content: toJson(parseLines(String(body.content ?? ""))),
          published: body.published !== false,
          sortOrder: Number(body.sortOrder ?? 0),
        },
      });
    }
    case "brands":
      return prisma.brand.create({
        data: {
          name: String(body.name ?? ""),
          note: body.note ? String(body.note) : null,
          published: body.published !== false,
          sortOrder: Number(body.sortOrder ?? 0),
        },
      });
    case "hero-slides": {
      const slideKey = String(body.slideKey ?? slugify(String(body.title ?? "slide")));
      return prisma.heroSlide.create({
        data: {
          slideKey,
          title: String(body.title ?? ""),
          subtitle: String(body.subtitle ?? ""),
          badge: body.badge ? String(body.badge) : null,
          ctaPrimaryLabel: String(body.ctaPrimaryLabel ?? "Подробнее"),
          ctaPrimaryHref: String(body.ctaPrimaryHref ?? "/catalog"),
          ctaSecondaryLabel: body.ctaSecondaryLabel
            ? String(body.ctaSecondaryLabel)
            : null,
          ctaSecondaryHref: body.ctaSecondaryHref
            ? String(body.ctaSecondaryHref)
            : null,
          gradient: String(
            body.gradient ?? "from-[var(--color-primary)] to-[#0f2744]",
          ),
          published: body.published !== false,
          sortOrder: Number(body.sortOrder ?? 0),
        },
      });
    }
    case "solutions": {
      const solutionKey = String(
        body.solutionKey ?? slugify(String(body.title ?? "solution")),
      );
      return prisma.industrySolution.create({
        data: {
          solutionKey,
          title: String(body.title ?? ""),
          description: String(body.description ?? ""),
          href: String(body.href ?? "/catalog"),
          icon: String(body.icon ?? "📦"),
          published: body.published !== false,
          sortOrder: Number(body.sortOrder ?? 0),
        },
      });
    }
    case "projects": {
      const slug = String(body.slug ?? slugify(String(body.title ?? "")));
      return prisma.project.create({
        data: {
          slug,
          title: String(body.title ?? ""),
          tags: toJson(
            Array.isArray(body.tags)
              ? body.tags
              : parseLines(String(body.tags ?? "")),
          ),
          excerpt: String(body.excerpt ?? ""),
          bullets: toJson(parseLines(String(body.bullets ?? ""))),
          published: body.published !== false,
          sortOrder: Number(body.sortOrder ?? 0),
        },
      });
    }
    case "products": {
      const slug = String(body.slug ?? slugify(String(body.name ?? "product")));
      const id = String(body.id ?? slug);
      return prisma.product.create({
        data: {
          id,
          slug,
          name: String(body.name ?? ""),
          categorySlug: String(body.categorySlug ?? "stellazhi"),
          price: Number(body.price ?? 0),
          inStock: Number(body.inStock ?? 0),
          image: String(body.image ?? ""),
          specs: toJson(parseSpecs(String(body.specs ?? ""))),
          isFeatured: body.isFeatured === true || body.isFeatured === "1",
          published: body.published !== false,
          sortOrder: Number(body.sortOrder ?? 0),
        },
      });
    }
    case "cities": {
      const id = String(body.id ?? slugify(String(body.name ?? "city")));
      return prisma.cmsCity.create({
        data: {
          id,
          name: String(body.name ?? ""),
          region: String(body.region ?? ""),
          isDefault: Boolean(body.isDefault),
          sortOrder: Number(body.sortOrder ?? 0),
        },
      });
    }
    default:
      throw new Error("Unknown resource");
  }
}

export async function adminUpdate(
  resource: CmsResource,
  id: string,
  body: Record<string, unknown>,
) {
  cmsDbRequired();

  switch (resource) {
    case "news":
      return prisma.newsPost.update({
        where: { id },
        data: {
          slug: body.slug != null ? String(body.slug) : undefined,
          title: body.title != null ? String(body.title) : undefined,
          date: body.date ? new Date(String(body.date)) : undefined,
          excerpt: body.excerpt != null ? String(body.excerpt) : undefined,
          content:
            body.content != null
              ? toJson(parseLines(String(body.content)))
              : undefined,
          published:
            body.published != null ? Boolean(body.published) : undefined,
          sortOrder:
            body.sortOrder != null ? Number(body.sortOrder) : undefined,
        },
      });
    case "knowledge":
      return prisma.knowledgeArticle.update({
        where: { id },
        data: {
          slug: body.slug != null ? String(body.slug) : undefined,
          title: body.title != null ? String(body.title) : undefined,
          category: body.category != null ? String(body.category) : undefined,
          excerpt: body.excerpt != null ? String(body.excerpt) : undefined,
          content:
            body.content != null
              ? toJson(parseLines(String(body.content)))
              : undefined,
          published:
            body.published != null ? Boolean(body.published) : undefined,
          sortOrder:
            body.sortOrder != null ? Number(body.sortOrder) : undefined,
        },
      });
    case "brands":
      return prisma.brand.update({
        where: { id },
        data: {
          name: body.name != null ? String(body.name) : undefined,
          note: body.note !== undefined ? String(body.note) || null : undefined,
          published:
            body.published != null ? Boolean(body.published) : undefined,
          sortOrder:
            body.sortOrder != null ? Number(body.sortOrder) : undefined,
        },
      });
    case "hero-slides":
      return prisma.heroSlide.update({
        where: { id },
        data: {
          slideKey:
            body.slideKey != null ? String(body.slideKey) : undefined,
          title: body.title != null ? String(body.title) : undefined,
          subtitle: body.subtitle != null ? String(body.subtitle) : undefined,
          badge: body.badge !== undefined ? String(body.badge) || null : undefined,
          ctaPrimaryLabel:
            body.ctaPrimaryLabel != null
              ? String(body.ctaPrimaryLabel)
              : undefined,
          ctaPrimaryHref:
            body.ctaPrimaryHref != null
              ? String(body.ctaPrimaryHref)
              : undefined,
          ctaSecondaryLabel:
            body.ctaSecondaryLabel !== undefined
              ? String(body.ctaSecondaryLabel) || null
              : undefined,
          ctaSecondaryHref:
            body.ctaSecondaryHref !== undefined
              ? String(body.ctaSecondaryHref) || null
              : undefined,
          gradient: body.gradient != null ? String(body.gradient) : undefined,
          published:
            body.published != null ? Boolean(body.published) : undefined,
          sortOrder:
            body.sortOrder != null ? Number(body.sortOrder) : undefined,
        },
      });
    case "solutions":
      return prisma.industrySolution.update({
        where: { id },
        data: {
          solutionKey:
            body.solutionKey != null ? String(body.solutionKey) : undefined,
          title: body.title != null ? String(body.title) : undefined,
          description:
            body.description != null ? String(body.description) : undefined,
          href: body.href != null ? String(body.href) : undefined,
          icon: body.icon != null ? String(body.icon) : undefined,
          published:
            body.published != null ? Boolean(body.published) : undefined,
          sortOrder:
            body.sortOrder != null ? Number(body.sortOrder) : undefined,
        },
      });
    case "projects":
      return prisma.project.update({
        where: { id },
        data: {
          slug: body.slug != null ? String(body.slug) : undefined,
          title: body.title != null ? String(body.title) : undefined,
          tags:
            body.tags != null
              ? toJson(
                  Array.isArray(body.tags)
                    ? body.tags
                    : parseLines(String(body.tags)),
                )
              : undefined,
          excerpt: body.excerpt != null ? String(body.excerpt) : undefined,
          bullets:
            body.bullets != null
              ? toJson(parseLines(String(body.bullets)))
              : undefined,
          published:
            body.published != null ? Boolean(body.published) : undefined,
          sortOrder:
            body.sortOrder != null ? Number(body.sortOrder) : undefined,
        },
      });
    case "products":
      return prisma.product.update({
        where: { id },
        data: {
          slug: body.slug != null ? String(body.slug) : undefined,
          name: body.name != null ? String(body.name) : undefined,
          categorySlug:
            body.categorySlug != null ? String(body.categorySlug) : undefined,
          price: body.price != null ? Number(body.price) : undefined,
          inStock: body.inStock != null ? Number(body.inStock) : undefined,
          image: body.image != null ? String(body.image) : undefined,
          specs:
            body.specs != null
              ? toJson(parseSpecs(String(body.specs)))
              : undefined,
          isFeatured:
            body.isFeatured != null
              ? body.isFeatured === true || body.isFeatured === "1"
              : undefined,
          published:
            body.published != null ? Boolean(body.published) : undefined,
          sortOrder:
            body.sortOrder != null ? Number(body.sortOrder) : undefined,
        },
      });
    case "cities":
      return prisma.cmsCity.update({
        where: { id },
        data: {
          name: body.name != null ? String(body.name) : undefined,
          region: body.region != null ? String(body.region) : undefined,
          isDefault:
            body.isDefault != null ? Boolean(body.isDefault) : undefined,
          sortOrder:
            body.sortOrder != null ? Number(body.sortOrder) : undefined,
        },
      });
    default:
      throw new Error("Unknown resource");
  }
}

export async function adminDelete(resource: CmsResource, id: string) {
  cmsDbRequired();

  switch (resource) {
    case "news":
      return prisma.newsPost.delete({ where: { id } });
    case "knowledge":
      return prisma.knowledgeArticle.delete({ where: { id } });
    case "brands":
      return prisma.brand.delete({ where: { id } });
    case "hero-slides":
      return prisma.heroSlide.delete({ where: { id } });
    case "solutions":
      return prisma.industrySolution.delete({ where: { id } });
    case "projects":
      return prisma.project.delete({ where: { id } });
    case "products":
      return prisma.product.delete({ where: { id } });
    case "cities":
      return prisma.cmsCity.delete({ where: { id } });
    default:
      throw new Error("Unknown resource");
  }
}

export async function adminCreateLocation(
  cityId: string,
  body: Record<string, unknown>,
) {
  cmsDbRequired();
  const id = String(body.id ?? `${cityId}-loc-${Date.now()}`);
  return prisma.cmsLocation.create({
    data: {
      id,
      cityId,
      type: String(body.type ?? "store"),
      label: String(body.label ?? ""),
      address: String(body.address ?? ""),
      note: body.note ? String(body.note) : null,
      lat: body.lat != null && body.lat !== "" ? Number(body.lat) : null,
      lon: body.lon != null && body.lon !== "" ? Number(body.lon) : null,
      sortOrder: Number(body.sortOrder ?? 0),
    },
  });
}

export async function adminUpdateLocation(
  id: string,
  body: Record<string, unknown>,
) {
  cmsDbRequired();
  return prisma.cmsLocation.update({
    where: { id },
    data: {
      type: body.type != null ? String(body.type) : undefined,
      label: body.label != null ? String(body.label) : undefined,
      address: body.address != null ? String(body.address) : undefined,
      note: body.note !== undefined ? String(body.note) || null : undefined,
      lat:
        body.lat !== undefined
          ? body.lat === "" || body.lat == null
            ? null
            : Number(body.lat)
          : undefined,
      lon:
        body.lon !== undefined
          ? body.lon === "" || body.lon == null
            ? null
            : Number(body.lon)
          : undefined,
      sortOrder:
        body.sortOrder != null ? Number(body.sortOrder) : undefined,
    },
  });
}

export async function adminDeleteLocation(id: string) {
  cmsDbRequired();
  return prisma.cmsLocation.delete({ where: { id } });
}

export async function seedAllContent(): Promise<Record<string, number>> {
  cmsDbRequired();
  const counts: Record<string, number> = {};

  for (const n of staticNews) {
    await prisma.newsPost.upsert({
      where: { slug: n.slug },
      create: {
        slug: n.slug,
        title: n.title,
        date: new Date(n.date),
        excerpt: n.excerpt,
        content: toJson(n.content),
        published: true,
      },
      update: {},
    });
  }
  counts.news = staticNews.length;

  for (const a of staticKnowledge) {
    await prisma.knowledgeArticle.upsert({
      where: { slug: a.slug },
      create: {
        slug: a.slug,
        title: a.title,
        category: a.category,
        excerpt: a.excerpt,
        content: toJson(a.content),
        published: true,
      },
      update: {},
    });
  }
  counts.knowledge = staticKnowledge.length;

  let brandOrder = 0;
  for (const b of staticBrands) {
    await prisma.brand.upsert({
      where: { name: b.name },
      create: {
        name: b.name,
        note: b.note ?? null,
        published: true,
        sortOrder: brandOrder++,
      },
      update: {},
    });
  }
  counts.brands = staticBrands.length;

  let slideOrder = 0;
  for (const s of staticHeroSlides) {
    await prisma.heroSlide.upsert({
      where: { slideKey: s.id },
      create: {
        slideKey: s.id,
        title: s.title,
        subtitle: s.subtitle,
        badge: s.badge ?? null,
        ctaPrimaryLabel: s.ctaPrimary.label,
        ctaPrimaryHref: s.ctaPrimary.href,
        ctaSecondaryLabel: s.ctaSecondary?.label ?? null,
        ctaSecondaryHref: s.ctaSecondary?.href ?? null,
        gradient: s.gradient,
        published: true,
        sortOrder: slideOrder++,
      },
      update: {},
    });
  }
  counts.heroSlides = staticHeroSlides.length;

  let solOrder = 0;
  for (const s of staticSolutions) {
    await prisma.industrySolution.upsert({
      where: { solutionKey: s.id },
      create: {
        solutionKey: s.id,
        title: s.title,
        description: s.description,
        href: s.href,
        icon: s.icon,
        published: true,
        sortOrder: solOrder++,
      },
      update: {},
    });
  }
  counts.solutions = staticSolutions.length;

  let projOrder = 0;
  for (const p of staticProjects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        tags: toJson(p.tags),
        excerpt: p.excerpt,
        bullets: toJson(p.bullets),
        published: true,
        sortOrder: projOrder++,
      },
      update: {},
    });
  }
  counts.projects = staticProjects.length;

  const staticProducts = catalogData.products as unknown as Array<{
    id: string;
    slug: string;
    name: string;
    categorySlug: string;
    price: number;
    inStock: number;
    image?: string;
    specs: Record<string, string>;
    isFeatured?: boolean;
  }>;

  let productOrder = 0;
  for (const p of staticProducts) {
    await prisma.product.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        categorySlug: p.categorySlug,
        price: p.price,
        inStock: p.inStock ?? 0,
        image: p.image ?? "",
        specs: toJson(p.specs ?? {}),
        isFeatured: Boolean(p.isFeatured),
        published: true,
        sortOrder: productOrder++,
      },
      update: {
        name: p.name,
        categorySlug: p.categorySlug,
        price: p.price,
        inStock: p.inStock ?? 0,
        image: p.image ?? "",
        specs: toJson(p.specs ?? {}),
        isFeatured: Boolean(p.isFeatured),
      },
    });
  }
  counts.products = staticProducts.length;

  let cityOrder = 0;
  for (const c of staticCities) {
    await prisma.cmsCity.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        name: c.name,
        region: c.region,
        isDefault: Boolean(c.isDefault),
        sortOrder: cityOrder++,
      },
      update: {
        name: c.name,
        region: c.region,
        isDefault: Boolean(c.isDefault),
      },
    });

    let locOrder = 0;
    for (const loc of c.locations) {
      await prisma.cmsLocation.upsert({
        where: { id: loc.id },
        create: {
          id: loc.id,
          cityId: c.id,
          type: loc.type,
          label: loc.label,
          address: loc.address,
          note: loc.note ?? null,
          lat: loc.coords?.lat ?? null,
          lon: loc.coords?.lon ?? null,
          sortOrder: locOrder++,
        },
        update: {
          type: loc.type,
          label: loc.label,
          address: loc.address,
          note: loc.note ?? null,
          lat: loc.coords?.lat ?? null,
          lon: loc.coords?.lon ?? null,
          sortOrder: locOrder++,
        },
      });
    }
  }
  counts.cities = staticCities.length;

  return counts;
}
