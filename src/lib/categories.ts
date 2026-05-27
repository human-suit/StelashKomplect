export interface Category {
  slug: string;
  name: string;
  icon: string;
  description?: string;
}

export const categories: Category[] = [
  {
    slug: "stellazhi",
    name: "Металлические стеллажи",
    icon: "📦",
    description: "MS, SBE и складские системы",
  },
  {
    slug: "sejfy",
    name: "Сейфы",
    icon: "🔐",
    description: "Valberg, Aiko, MDTB",
  },
  {
    slug: "shkafy",
    name: "Металлические шкафы",
    icon: "🗄️",
    description: "Архивные, гардеробные, локеры",
  },
  {
    slug: "verstaki",
    name: "Верстаки",
    icon: "🔧",
    description: "Производственная мебель",
  },
  {
    slug: "lokery",
    name: "Локеры",
    icon: "🚪",
    description: "Раздевалки и гардеробные системы",
  },
  {
    slug: "meditsinskaya",
    name: "Медицинская мебель",
    icon: "🏥",
    description: "HILFE, Практик",
  },
  {
    slug: "korpusnaya",
    name: "Корпусная мебель",
    icon: "🪑",
    description: "Офисные решения",
  },
  {
    slug: "dveri",
    name: "Входные двери",
    icon: "🚪",
    description: "Металлические двери",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
