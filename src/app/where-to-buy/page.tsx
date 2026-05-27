import type { Metadata } from "next";
import Link from "next/link";
import { WhereToBuy } from "@/components/home/where-to-buy";

export const metadata: Metadata = {
  title: "Где купить",
  description:
    "Адреса магазинов и складов Стеллаж Комплект на карте. Уфа, Казань и другие города.",
};

export default function WhereToBuyPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <h1 className="text-2xl font-bold text-slate-900">Где купить</h1>
        <p className="mt-2 text-slate-600">
          Выберите город — на карте отметим ближайшие точки продаж и складов.
        </p>
      </div>
      <WhereToBuy />
      <p className="mx-auto max-w-7xl px-4 pb-10">
        <Link href="/" className="text-[var(--color-primary)] underline">
          ← На главную
        </Link>
      </p>
    </div>
  );
}
