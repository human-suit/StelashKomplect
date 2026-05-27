import { demoReviews } from "@/data/reviews";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Отзывы клиентов",
  description:
    "Отзывы клиентов Стеллаж Комплект: опыт покупки стеллажей, сейфов и металлической мебели.",
  openGraph: {
    title: "Отзывы клиентов — Стеллаж Комплект",
    description:
      "Реальные отзывы клиентов о качестве, доставке и сервисе Стеллаж Комплект.",
    type: "website",
  },
};

export default function ReviewsPage() {
  const average = (
    demoReviews.reduce((sum, review) => sum + review.rating, 0) / demoReviews.length
  ).toFixed(1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Отзывы клиентов</h1>
      <p className="mt-2 text-slate-600">
        Средняя оценка: <span className="font-semibold text-slate-900">{average} / 5</span>
      </p>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {demoReviews.map((review) => (
          <li key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-900">{review.author}</p>
              <p className="text-xs text-slate-500">
                {new Date(review.date).toLocaleDateString("ru-RU")}
              </p>
            </div>
            <p className="mt-1 text-xs text-slate-500">{review.city}</p>
            <p className="mt-2 text-sm text-amber-500">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </p>
            <p className="mt-2 text-sm text-slate-700">{review.text}</p>
            <p className="mt-3 text-xs font-medium text-[var(--color-primary)]">
              Товар: {review.product}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/catalog" className="text-[var(--color-primary)] underline">
          В каталог
        </Link>
        <Link href="/" className="text-[var(--color-primary)] underline">
          ← На главную
        </Link>
      </div>
    </div>
  );
}
