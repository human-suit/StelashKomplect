"use client";

import { ProductImage } from "@/components/product/product-image";
import { animateToCartFromButton } from "@/lib/cart-fly";
import { getProductSeries } from "@/lib/product-filters";
import { formatPrice, type Product } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompareToggleButton } from "@/components/product/compare-toggle-button";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article className="card-hover flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Link href={`/product/${product.slug}`} className="group block p-4 pb-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white transition-transform duration-300 ease-out group-hover:scale-[1.02]">
          <ProductImage
            src={product.image}
            alt={product.name}
            categorySlug={product.categorySlug}
          />
        </div>
        {product.categorySlug === "stellazhi" && (
          <span className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
            {getProductSeries(product)}
          </span>
        )}
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-[var(--color-primary)]">
          {formatPrice(product.price)}
        </p>
        <p className="mt-1 text-xs text-green-700">
          В наличии: {product.inStock}
        </p>
      </Link>
      <div className="mt-auto grid grid-cols-2 gap-2 p-4 pt-3 sm:flex">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          className="col-span-2 sm:col-span-1"
          onClick={(e) => {
            animateToCartFromButton(e.currentTarget);
            addItem(product);
          }}
        >
          В корзину
        </Button>
        <CompareToggleButton
          slug={product.slug}
          className="w-full justify-center sm:w-auto"
        />
        <Link
          href={`/product/${product.slug}`}
          className="flex items-center justify-center rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50 sm:shrink-0"
        >
          →
        </Link>
      </div>
    </article>
  );
}
