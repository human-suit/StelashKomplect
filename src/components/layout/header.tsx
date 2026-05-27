"use client";

import { company } from "@/lib/company";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cart-store";
import { Menu, Phone, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CitySelector } from "./city-selector";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/where-to-buy", label: "Где купить" },
  { href: "/knowledge", label: "База знаний" },
  { href: "/about", label: "О компании" },
  { href: "/news", label: "Новости" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/projects", label: "Проекты" },
  { href: "/compare", label: "Сравнение" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <header
      className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="min-w-0 shrink">
          <span className="block truncate text-sm font-bold leading-tight text-[var(--color-primary)]">
            {company.name}
          </span>
          <span className="hidden text-[10px] text-slate-500 sm:block">
            {company.tagline}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <CitySelector compact />

          <a
            href={`tel:${company.phone}`}
            className="flex size-10 items-center justify-center rounded-lg text-[var(--color-primary)] transition-colors duration-200 hover:bg-slate-100"
            aria-label="Позвонить"
          >
            <Phone className="size-5" />
          </a>

          <Link
            href="/cart"
            data-cart-target="true"
            className="relative flex size-10 items-center justify-center rounded-lg text-[var(--color-primary)] hover:bg-slate-100"
            aria-label="Корзина"
          >
            <ShoppingCart className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg text-[var(--color-primary)] hover:bg-slate-100 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <nav
        className={cn(
          "border-t border-slate-100 bg-white lg:block",
          menuOpen ? "block" : "hidden lg:block",
        )}
      >
        <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2 lg:flex-row lg:gap-6 lg:py-0">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                data-compare-target={link.href === "/compare" ? "true" : undefined}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-[var(--color-primary)] lg:py-3"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="border-t border-slate-100 py-3 lg:hidden lg:border-0">
            <CitySelector />
          </li>
        </ul>
      </nav>
    </header>
  );
}
