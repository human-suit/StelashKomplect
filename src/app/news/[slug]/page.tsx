import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, listNews } from "@/lib/content/news";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const news = await listNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "Новость" };
  return { title: item.title, description: item.excerpt };
}

export default async function NewsItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs text-slate-500">
        {new Date(item.date).toLocaleDateString("ru-RU")}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{item.title}</h1>
      <p className="mt-3 text-slate-600">{item.excerpt}</p>

      <div className="mt-6 space-y-3 text-sm leading-relaxed text-slate-700">
        {item.content.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/news" className="text-[var(--color-primary)] underline">
          ← Все новости
        </Link>
        <Link href="/checkout" className="text-[var(--color-primary)] underline">
          Оставить заявку
        </Link>
      </div>
    </div>
  );
}
