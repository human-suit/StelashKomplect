"use client";

import { categories } from "@/lib/categories";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CategoryChips() {
  const pathname = usePathname();
  const activeSlug = pathname.startsWith("/catalog/")
    ? pathname.split("/")[2]
    : null;

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:hidden">
      <ul className="flex w-max gap-2">
        <li>
          <Link
            href="/catalog"
            className={cn(
              "touch-target flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium",
              pathname === "/catalog"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200",
            )}
          >
            Все
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/catalog/${cat.slug}`}
              className={cn(
                "touch-target flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium",
                activeSlug === cat.slug
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200",
              )}
            >
              {cat.icon} {cat.name.split(" ")[0]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
