"use client";

import type { Product } from "@/lib/products";
import { animateToCartFromButton } from "@/lib/cart-fly";
import { useCartStore } from "@/store/cart-store";
import { Button, ButtonLink } from "@/components/ui/button";
import { CompareToggleButton } from "@/components/product/compare-toggle-button";

export function ProductActions({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={(e) => {
          animateToCartFromButton(e.currentTarget);
          addItem(product);
        }}
      >
        В корзину
      </Button>
      <ButtonLink
        href={`/checkout?product=${product.slug}`}
        variant="outline"
        size="lg"
        fullWidth
      >
        Купить в 1 клик
      </ButtonLink>
      <CompareToggleButton slug={product.slug} />
    </div>
  );
}
