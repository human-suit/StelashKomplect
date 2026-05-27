export interface IndustrySolution {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}

export const industrySolutions: IndustrySolution[] = [
  {
    id: "warehouse",
    title: "Склад и логистика",
    description:
      "Стеллажи MS, паллетные системы, стеллажи для длинномеров и комплектация склада.",
    href: "/catalog/stellazhi",
    icon: "📦",
  },
  {
    id: "office",
    title: "Офис и архив",
    description:
      "Архивные стеллажи, шкафы для документов, сейфы и локеры для персонала.",
    href: "/catalog/shkafy",
    icon: "🏢",
  },
  {
    id: "retail",
    title: "Торговля и шоурум",
    description:
      "Торговое оборудование, витрины, стеллажи для зала и зоны выдачи.",
    href: "/catalog",
    icon: "🛒",
  },
  {
    id: "production",
    title: "Производство и мастерская",
    description:
      "Верстаки, инструментальные шкафы, стеллажи для цеха и зоны хранения.",
    href: "/catalog/verstaki",
    icon: "🔧",
  },
  {
    id: "medical",
    title: "Медицина и лаборатории",
    description:
      "Медицинская мебель, шкафы для медикаментов, стеллажи для клиник.",
    href: "/catalog/meditsinskaya",
    icon: "🏥",
  },
  {
    id: "security",
    title: "Безопасность",
    description:
      "Сейфы, огнестойкие модели, шкафы для оружия и ценностей.",
    href: "/catalog/sejfy",
    icon: "🔐",
  },
];
