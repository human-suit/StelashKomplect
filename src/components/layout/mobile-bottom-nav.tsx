"use client";

import { company } from "@/lib/company";
import { Home, LayoutGrid, Newspaper, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/catalog", label: "Каталог", icon: LayoutGrid },
  { href: "/contacts", label: "Контакты", icon: MapPin },
  { href: "/news", label: "Новости", icon: Newspaper },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Мобильная навигация"
      style={{ viewTransitionName: "site-mobile-nav" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors duration-200",
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-slate-500",
                )}
              >
                <Icon className="size-6" strokeWidth={active ? 2.5 : 2} />
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
