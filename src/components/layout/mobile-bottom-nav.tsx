"use client";

import { company } from "@/lib/company";
import { useCartStore } from "@/store/cart-store";
import { useCompareStore } from "@/store/compare-store";
import { Home, LayoutGrid, Phone, ShoppingCart, MapPin, Scale } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/catalog", label: "Каталог", icon: LayoutGrid },
  { href: "/cart", label: "Корзина", icon: ShoppingCart, badge: true },
  { href: "/compare", label: "Сравнить", icon: Scale, compareBadge: true },
  { href: "/contacts", label: "Контакты", icon: MapPin },
  { href: "/news", label: "Новости", icon: LayoutGrid },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const compareCount = useCompareStore((s) => s.slugs.length);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Мобильная навигация"
      style={{ viewTransitionName: "site-mobile-nav" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {links.map(({ href, label, icon: Icon, ...rest }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          const showCartBadge = "badge" in rest && itemCount > 0;
          const showCompareBadge = "compareBadge" in rest && compareCount > 0;
          const badgeValue =
            "badge" in rest
              ? itemCount > 9
                ? "9+"
                : `${itemCount}`
              : compareCount > 9
                ? "9+"
                : `${compareCount}`;

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                data-compare-target={href === "/compare" ? "true" : undefined}
                data-cart-target={href === "/cart" ? "true" : undefined}
                className={cn(
                  "relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors duration-200",
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-slate-500",
                )}
              >
                <span className="relative">
                  <Icon className="size-6" strokeWidth={active ? 2.5 : 2} />
                  {(showCartBadge || showCompareBadge) && (
                    <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-white">
                      {badgeValue}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <a
            href={`tel:${company.phone}`}
            className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium text-slate-500"
          >
            <Phone className="size-6" />
            Звонок
          </a>
        </li>
      </ul>
    </nav>
  );
}
