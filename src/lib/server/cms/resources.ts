export const CMS_RESOURCES = [
  "news",
  "knowledge",
  "brands",
  "hero-slides",
  "solutions",
  "projects",
  "products",
  "cities",
] as const;

export type CmsResource = (typeof CMS_RESOURCES)[number];

export const CMS_RESOURCE_LABELS: Record<CmsResource, string> = {
  news: "Новости",
  knowledge: "База знаний",
  brands: "Торговые марки",
  "hero-slides": "Слайдер",
  solutions: "Отраслевые решения",
  projects: "Готовые проекты",
  products: "Товары",
  cities: "Города и точки",
};

export function isCmsResource(value: string): value is CmsResource {
  return (CMS_RESOURCES as readonly string[]).includes(value);
}
