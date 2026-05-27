/**
 * Импорт контента из файлов проекта в PostgreSQL.
 *
 *   set DATABASE_URL=postgresql://...
 *   node scripts/seed-content.mjs
 */

import { PrismaClient } from "@prisma/client";
import path from "path";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const dbUrl = process.env.DATABASE_URL?.trim();
if (!dbUrl) {
  console.error("Задайте DATABASE_URL");
  process.exit(1);
}

async function loadModule(rel) {
  const mod = await import(path.join(root, rel).replace(/\\/g, "/"));
  return mod;
}

const prisma = new PrismaClient();

const { news } = await loadModule("src/data/news.ts");
const { knowledgeArticles } = await loadModule("src/data/knowledge.ts");
const { brands } = await loadModule("src/data/brands.ts");
const { heroSlides } = await loadModule("src/data/hero-slides.ts");
const { industrySolutions } = await loadModule("src/data/industry-solutions.ts");
const { projects } = await loadModule("src/data/projects.ts");
const { cities } = await loadModule("src/lib/cities.ts");
const catalogRaw = await readFile(
  path.join(root, "src/data/products.generated.json"),
  "utf-8",
);
const staticProducts = JSON.parse(catalogRaw).products ?? [];

for (const n of news) {
  await prisma.newsPost.upsert({
    where: { slug: n.slug },
    create: {
      slug: n.slug,
      title: n.title,
      date: new Date(n.date),
      excerpt: n.excerpt,
      content: n.content,
      published: true,
    },
    update: {
      title: n.title,
      excerpt: n.excerpt,
      content: n.content,
    },
  });
}

for (const a of knowledgeArticles) {
  await prisma.knowledgeArticle.upsert({
    where: { slug: a.slug },
    create: {
      slug: a.slug,
      title: a.title,
      category: a.category,
      excerpt: a.excerpt,
      content: a.content,
      published: true,
    },
    update: {
      title: a.title,
      category: a.category,
      excerpt: a.excerpt,
      content: a.content,
    },
  });
}

let brandOrder = 0;
for (const b of brands) {
  await prisma.brand.upsert({
    where: { name: b.name },
    create: {
      name: b.name,
      note: b.note ?? null,
      published: true,
      sortOrder: brandOrder++,
    },
    update: { note: b.note ?? null, sortOrder: brandOrder++ },
  });
}

let slideOrder = 0;
for (const s of heroSlides) {
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
    update: {
      title: s.title,
      subtitle: s.subtitle,
      gradient: s.gradient,
      sortOrder: slideOrder++,
    },
  });
}

let solOrder = 0;
for (const s of industrySolutions) {
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
    update: {
      title: s.title,
      description: s.description,
      href: s.href,
      sortOrder: solOrder++,
    },
  });
}

let projOrder = 0;
for (const p of projects) {
  await prisma.project.upsert({
    where: { slug: p.slug },
    create: {
      slug: p.slug,
      title: p.title,
      tags: p.tags,
      excerpt: p.excerpt,
      bullets: p.bullets,
      published: true,
      sortOrder: projOrder++,
    },
    update: {
      title: p.title,
      tags: p.tags,
      excerpt: p.excerpt,
      bullets: p.bullets,
      sortOrder: projOrder++,
    },
  });
}

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
      specs: p.specs ?? {},
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
      specs: p.specs ?? {},
      isFeatured: Boolean(p.isFeatured),
    },
  });
}

let cityOrder = 0;
for (const c of cities) {
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
      sortOrder: cityOrder++,
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

await prisma.$disconnect();
console.log("Контент импортирован в PostgreSQL");
