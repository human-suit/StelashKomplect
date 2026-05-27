import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKnowledgeBySlug, listKnowledge } from "@/lib/content/knowledge";
import { ButtonLink } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await listKnowledge();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getKnowledgeBySlug(slug);
  if (!item) return { title: "Статья" };
  return { title: item.title, description: item.excerpt };
}

export default async function KnowledgeArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = await getKnowledgeBySlug(slug);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
        {item.category}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{item.title}</h1>
      <p className="mt-3 text-slate-600">{item.excerpt}</p>

      <div className="mt-6 space-y-3 text-sm leading-relaxed text-slate-700">
        {item.content.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/knowledge" className="text-[var(--color-primary)] underline">
          ← Все статьи
        </Link>
        <ButtonLink href="/#consultation" variant="primary" size="md">
          Задать вопрос менеджеру
        </ButtonLink>
      </div>
    </div>
  );
}
