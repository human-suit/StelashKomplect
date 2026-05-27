"use client";

import { calculateCart } from "@/lib/calculator";
import { formatPrice } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";
import { useCityStore } from "@/store/city-store";
import Link from "next/link";

export function CartStickyCheckout() {
  const items = useCartStore((s) => s.items);
  const deliveryEnabled = useCartStore((s) => s.deliveryEnabled);
  const assemblyEnabled = useCartStore((s) => s.assemblyEnabled);
  const subtotal = useCartStore((s) => s.subtotal());
  const cityId = useCityStore((s) => s.cityId);

  if (items.length === 0) return null;

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const calc = calculateCart({
    subtotal,
    itemCount,
    deliveryEnabled,
    assemblyEnabled,
    isUfa: cityId === "ufa",
  });

  return (
    <div className="fixed bottom-[calc(56px+env(safe-area-inset-bottom))] left-0 right-0 z-30 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500">Итого</p>
          <p className="text-lg font-bold text-[var(--color-primary)]">
            {formatPrice(calc.total)}
          </p>
        </div>
        <Link
          href="/checkout"
          className="flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Оформить
        </Link>
      </div>
    </div>
  );
}
