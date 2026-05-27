"use client";

import { formatPrice, type Product } from "@/lib/products";
import { animateToCartFromButton } from "@/lib/cart-fly";
import { useCartStore } from "@/store/cart-store";
import { useState, type MouseEvent } from "react";

export function ProductStickyBar({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd(event: MouseEvent<HTMLButtonElement>) {
    animateToCartFromButton(event.currentTarget);
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="fixed bottom-[calc(56px+env(safe-area-inset-bottom))] left-0 right-0 z-30 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-slate-500">Цена</p>
          <p className="text-lg font-bold text-[var(--color-primary)]">
            {formatPrice(product.price)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="min-h-[48px] shrink-0 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-semibold text-white active:scale-[0.98]"
        >
          {added ? "✓ Добавлено" : "В корзину"}
        </button>
      </div>
    </div>
  );
}
