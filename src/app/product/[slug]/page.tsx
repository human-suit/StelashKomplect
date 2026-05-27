import { ProductActions } from "@/components/product/product-actions";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductImage } from "@/components/product/product-image";
import { ProductStickyBar } from "@/components/product/product-sticky-bar";
import {
  getProductBySlugFromContent,
  listProducts,
} from "@/lib/content/products";
import { formatPrice } from "@/lib/products";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromContent(slug);
  if (!product) return { title: "Товар" };

  const description = [
    product.name,
    Object.values(product.specs).slice(0, 2).join(", "),
    `Цена от ${product.price.toLocaleString("ru-RU")} ₽`,
  ].join(" · ");

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlugFromContent(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/catalog" className="hover:text-[var(--color-primary)]">
          Каталог
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/catalog/${product.categorySlug}`}
          className="hover:text-[var(--color-primary)]"
        >
          Раздел
        </Link>
      </nav>

      <div className="product-layout">
        <div className="relative aspect-square max-h-80 w-full overflow-hidden rounded-2xl bg-white lg:max-h-[480px]">
          <ProductImage
            src={product.image}
            alt={product.name}
            categorySlug={product.categorySlug}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-bold text-[var(--color-primary)]">
            {formatPrice(product.price)}
          </p>
          <p className="mt-1 text-sm text-green-700">
            В наличии: {product.inStock} шт.
          </p>

          <dl className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <dt className="text-slate-500">{key}</dt>
                <dd className="font-medium text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="hidden lg:block">
            <ProductActions product={product} />
          </div>
        </div>
      </div>
      <ProductReviews slug={product.slug} />
      <div className="h-20 lg:hidden" aria-hidden />
      <ProductStickyBar product={product} />
    </div>
  );
}
