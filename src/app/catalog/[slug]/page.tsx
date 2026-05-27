import { CategoryChips } from "@/components/catalog/category-chips";
import { CategoryProductList } from "@/components/catalog/category-product-list";
import { categories, getCategoryBySlug } from "@/lib/categories";
import {
  getProductsByCategoryFromContent,
  listProducts,
} from "@/lib/content/products";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Каталог" };
  return {
    title: cat.name,
    description: cat.description ?? `Каталог: ${cat.name}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const [categoryProducts, allProducts] = await Promise.all([
    getProductsByCategoryFromContent(slug),
    listProducts(),
  ]);
  const showPlaceholder = categoryProducts.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <CategoryChips />
      <nav className="mb-4 mt-4 text-sm text-slate-500">
        <Link href="/catalog" className="hover:text-[var(--color-primary)]">
          Каталог
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{category.name}</span>
      </nav>
      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
        {category.name}
      </h1>
      {category.description && (
        <p className="mt-2 text-sm text-slate-600">{category.description}</p>
      )}

      {showPlaceholder ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-600">
            Товары раздела скоро появятся. Пока смотрите{" "}
            <Link
              href="/catalog/stellazhi"
              className="font-semibold text-[var(--color-primary)]"
            >
              стеллажи
            </Link>{" "}
            или{" "}
            <Link href="/contacts" className="font-semibold text-[var(--color-primary)]">
              свяжитесь с менеджером
            </Link>
            .
          </p>
        </div>
      ) : (
        <CategoryProductList
          products={categoryProducts}
          categoryName={category.name}
        />
      )}

      {slug !== "stellazhi" && allProducts.length > 0 && (
        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/catalog/stellazhi" className="text-[var(--color-primary)]">
            ← Стеллажи в наличии
          </Link>
        </p>
      )}
    </div>
  );
}
