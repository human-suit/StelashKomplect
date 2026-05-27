import { listKnowledge } from "@/lib/content/knowledge";
import { listNews } from "@/lib/content/news";
import { categories } from "@/lib/categories";
import { listProducts } from "@/lib/content/products";
import type { MetadataRoute } from "next";

const BASE = "https://stellazhkomplect.ru";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, knowledge, products] = await Promise.all([
    listNews(),
    listKnowledge(),
    listProducts(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/catalog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/where-to-buy`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/knowledge`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contacts`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/catalogs`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/compare`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/reviews`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/projects`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/news`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages = categories.map((c) => ({
    url: `${BASE}/catalog/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const productPages = products.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const newsPages = news.map((n) => ({
    url: `${BASE}/news/${n.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  const knowledgePages = knowledge.map((a) => ({
    url: `${BASE}/knowledge/${a.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...newsPages,
    ...knowledgePages,
  ];
}
