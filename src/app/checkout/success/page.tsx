"use client";

import { ButtonLink } from "@/components/ui/button";
import { company } from "@/lib/company";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const warn = searchParams.get("warn");
  const type = searchParams.get("type");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-4xl">✓</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        {type === "consultation" ? "Заявка на консультацию принята" : "Заявка принята"}
      </h1>
      {orderNumber && (
        <p className="mt-2 text-lg font-semibold text-[var(--color-primary)]">
          № {orderNumber}
        </p>
      )}
      {warn && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {warn}
        </p>
      )}
      <p className="mt-4 text-sm text-slate-600">
        {type === "consultation"
          ? "Менеджер свяжется с вами и ответит на ваш вопрос."
          : "Менеджер свяжется с вами в ближайшее время."}
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <ButtonLink href="/catalog" variant="primary" size="lg" fullWidth>
          В каталог
        </ButtonLink>
        <a
          href={company.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-[var(--color-primary)]"
        >
          Написать в Telegram
        </a>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
