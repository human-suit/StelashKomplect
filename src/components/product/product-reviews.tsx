"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
}

const DEMO_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Иван, Уфа",
    rating: 5,
    text: "Хорошая упаковка и быстрая доставка. Полки встали ровно.",
    createdAt: "2026-05-12T10:00:00.000Z",
  },
  {
    id: "r2",
    author: "ООО Логистик",
    rating: 4,
    text: "Брали партию на склад, качество хорошее, собрали за один день.",
    createdAt: "2026-05-03T10:00:00.000Z",
  },
];

export function ProductReviews({ slug }: { slug: string }) {
  const storageKey = `sk-reviews-${slug}`;
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [extraReviews, setExtraReviews] = useState<Review[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      return JSON.parse(raw) as Review[];
    } catch {
      return [];
    }
  });

  const reviews = [...extraReviews, ...DEMO_REVIEWS];
  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  function save(review: Review) {
    const next = [review, ...extraReviews].slice(0, 20);
    setExtraReviews(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore storage issues
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Отзывы</h2>
        <p className="text-sm text-slate-600">
          Рейтинг: <span className="font-semibold text-slate-900">{average}/5</span> ({reviews.length})
        </p>
      </div>

      <ul className="mt-4 space-y-3">
        {reviews.slice(0, 6).map((r) => (
          <li key={r.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-slate-900">{r.author}</p>
              <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString("ru-RU")}</p>
            </div>
            <p className="mt-1 text-sm text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
            <p className="mt-1 text-sm text-slate-700">{r.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Оставить отзыв</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Ваше имя"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value={5}>5 — отлично</option>
            <option value={4}>4 — хорошо</option>
            <option value={3}>3 — нормально</option>
            <option value={2}>2 — слабо</option>
            <option value={1}>1 — плохо</option>
          </select>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ваш комментарий"
            rows={3}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
          />
        </div>
        <Button
          className="mt-3"
          onClick={() => {
            if (!author.trim() || !text.trim()) return;
            save({
              id: `${Date.now()}`,
              author: author.trim(),
              text: text.trim(),
              rating,
              createdAt: new Date().toISOString(),
            });
            setAuthor("");
            setText("");
            setRating(5);
          }}
        >
          Отправить отзыв
        </Button>
      </div>
    </section>
  );
}
