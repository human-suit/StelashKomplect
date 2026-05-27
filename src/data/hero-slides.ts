export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  gradient: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "catalog",
    title: "Стеллажи, сейфы и мебель для хранения",
    subtitle:
      "Федеральный поставщик. Подбор под задачу, доставка и сборка. Отгрузка со склада в Уфе — день в день.",
    badge: "Решения для хранения №1",
    ctaPrimary: { label: "Открыть каталог", href: "/catalog" },
    ctaSecondary: { label: "Где купить", href: "/where-to-buy" },
    gradient: "from-[var(--color-primary)] to-[#0f2744]",
  },
  {
    id: "projects",
    title: "Готовые проекты под ключ",
    subtitle:
      "Склады, архивы, мастерские и торговые зоны — проектируем, поставляем и монтируем.",
    badge: "Отраслевые решения",
    ctaPrimary: { label: "Смотреть проекты", href: "/projects" },
    ctaSecondary: { label: "Консультация", href: "/#consultation" },
    gradient: "from-[#153d6f] to-[#0a1628]",
  },
  {
    id: "brands",
    title: "Официальный дилер ведущих заводов",
    subtitle:
      "Промет, Valberg, Aiko, Практик, HILFE, MDTB и другие бренды — в наличии и под заказ.",
    badge: "Торговые марки",
    ctaPrimary: { label: "Подобрать оборудование", href: "/checkout" },
    ctaSecondary: { label: "Каталоги PDF", href: "/catalogs" },
    gradient: "from-[#1e3a5f] to-[var(--color-primary)]",
  },
  {
    id: "knowledge",
    title: "База знаний для покупателей",
    subtitle:
      "Как выбрать стеллаж, рассчитать нагрузку, оформить доставку и документы для юрлиц.",
    badge: "Полезные статьи",
    ctaPrimary: { label: "Читать базу знаний", href: "/knowledge" },
    ctaSecondary: { label: "Новости", href: "/news" },
    gradient: "from-[var(--color-primary)] to-[#1a365d]",
  },
];
