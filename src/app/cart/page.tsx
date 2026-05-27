"use client";

import { CartCalculator } from "@/components/cart/cart-calculator";
import { CartStickyCheckout } from "@/components/cart/cart-sticky-checkout";
import { CompareToggleButton } from "@/components/product/compare-toggle-button";
import { ProductImage } from "@/components/product/product-image";
import { formatPrice, getProductBySlug } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">Корзина пуста</p>
        <p className="mt-2 text-sm text-slate-600">
          Добавьте товары из каталога
        </p>
        <ButtonLink href="/catalog" variant="primary" size="lg" className="mt-6">
          В каталог
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Корзина</h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <ul className="flex-1 space-y-4">
          {items.map((item) => {
            const product = getProductBySlug(item.slug);
            return (
            <li
              key={item.productId}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-white">
                <ProductImage
                  src={product?.image}
                  alt={item.name}
                  categorySlug={product?.categorySlug}
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-[var(--color-primary)]"
                >
                  {item.name}
                </Link>
                <p className="mt-1 font-bold text-[var(--color-primary)]">
                  {formatPrice(item.price)}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-slate-200">
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center text-slate-600 hover:bg-slate-50"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity - 1)
                      }
                      aria-label="Уменьшить"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center text-slate-600 hover:bg-slate-50"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity + 1)
                      }
                      aria-label="Увеличить"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-slate-400 hover:text-red-600"
                    aria-label="Удалить"
                  >
                    <Trash2 className="size-5" />
                  </button>
                  {product && (
                    <CompareToggleButton slug={product.slug} className="ml-auto" />
                  )}
                </div>
              </div>
              <p className="shrink-0 text-sm font-bold text-slate-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          );
          })}
        </ul>

        <div className="w-full shrink-0 space-y-4 lg:max-w-sm">
          <CartCalculator />
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="flex justify-between text-sm">
              <span className="text-slate-600">Товары</span>
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </p>
            <ButtonLink
              href="/checkout"
              variant="primary"
              size="lg"
              fullWidth
              className="mt-4"
            >
              Оформить заявку
            </ButtonLink>
            <ButtonLink
              href="/compare"
              variant="outline"
              size="md"
              fullWidth
              className="mt-3"
            >
              Перейти к сравнению
            </ButtonLink>
          </div>
        </div>
      </div>
      <div className="h-24 lg:hidden" aria-hidden />
      <CartStickyCheckout />
    </div>
  );
}
