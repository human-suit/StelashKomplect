"use client";

import { calculateCart } from "@/lib/calculator";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cart-store";
import { useCityStore } from "@/store/city-store";

export function CartCalculator() {
  const items = useCartStore((s) => s.items);
  const deliveryEnabled = useCartStore((s) => s.deliveryEnabled);
  const assemblyEnabled = useCartStore((s) => s.assemblyEnabled);
  const setDeliveryEnabled = useCartStore((s) => s.setDeliveryEnabled);
  const setAssemblyEnabled = useCartStore((s) => s.setAssemblyEnabled);
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

  const rows = [
    { label: "Товары", value: calc.subtotal },
    deliveryEnabled && { label: "Доставка", value: calc.delivery },
    assemblyEnabled && { label: "Сборка", value: calc.assembly },
    calc.discount > 0 && { label: "Скидка", value: -calc.discount },
  ].filter(Boolean) as { label: string; value: number }[];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-bold text-slate-900">Калькулятор заказа</h2>
      <p className="mt-1 text-xs text-slate-500">
        Предварительный расчёт. Окончательную цену подтверждает менеджер.
      </p>

      <div className="mt-4 space-y-3">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={deliveryEnabled}
            onChange={(e) => setDeliveryEnabled(e.target.checked)}
            className="size-4 rounded border-slate-300"
          />
          <span className="text-sm text-slate-700">Доставка</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={assemblyEnabled}
            onChange={(e) => setAssemblyEnabled(e.target.checked)}
            className="size-4 rounded border-slate-300"
          />
          <span className="text-sm text-slate-700">Сборка / монтаж</span>
        </label>
      </div>

      <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-2">
            <dt className="text-slate-600">{row.label}</dt>
            <dd
              className={cn(
                "font-medium",
                row.value < 0 ? "text-green-600" : "text-slate-900",
              )}
            >
              {formatPrice(Math.abs(row.value))}
              {row.value < 0 && " −"}
            </dd>
          </div>
        ))}
        <div className="flex justify-between gap-2 border-t border-slate-200 pt-2 text-base font-bold">
          <dt>Итого</dt>
          <dd className="text-[var(--color-primary)]">
            {formatPrice(calc.total)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
