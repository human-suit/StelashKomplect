"use client";

import { formatPrice } from "@/lib/products";
import { ButtonLink } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "unknown">(
    orderNumber ? "loading" : "unknown",
  );
  const [charge, setCharge] = useState<number | null>(null);

  useEffect(() => {
    if (!orderNumber) return;

    fetch(`/api/orders/${encodeURIComponent(orderNumber)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.order?.paymentStatus === "succeeded") {
          setStatus("paid");
          setCharge(d.order.paidAmountRub ?? d.order.chargeAmountRub);
        } else {
          setStatus("pending");
          setCharge(d.order?.chargeAmountRub ?? null);
        }
      })
      .catch(() => setStatus("unknown"));
  }, [orderNumber]);

  if (!orderNumber) {
    return (
      <p className="text-slate-600">
        Номер заявки не указан.{" "}
        <ButtonLink href="/checkout" variant="primary">
          К оформлению
        </ButtonLink>
      </p>
    );
  }

  if (status === "loading") {
    return <p className="text-slate-500">Проверяем статус оплаты…</p>;
  }

  if (status === "paid") {
    return (
      <>
        <p className="text-4xl">✓</p>
        <h1 className="mt-4 text-2xl font-bold text-green-800">Оплата прошла</h1>
        <p className="mt-2 text-lg font-semibold text-[var(--color-primary)]">
          № {orderNumber}
        </p>
        {charge != null && (
          <p className="mt-2 text-slate-600">
            Списано: {formatPrice(charge)}
          </p>
        )}
        <p className="mt-4 text-sm text-slate-600">
          Менеджер свяжется с вами для уточнения доставки и сборки.
        </p>
        <div className="mt-8">
          <ButtonLink href="/catalog" variant="primary" fullWidth>
            В каталог
          </ButtonLink>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-3xl">⏳</p>
      <h1 className="mt-4 text-xl font-bold text-slate-900">
        Ожидаем подтверждение
      </h1>
      <p className="mt-2 text-[var(--color-primary)] font-semibold">
        № {orderNumber}
      </p>
      <p className="mt-4 text-sm text-slate-600">
        Если оплата прошла, статус обновится через минуту. Заявка уже сохранена —
        менеджер свяжется с вами.
      </p>
      {charge != null && (
        <p className="mt-2 text-sm text-slate-500">
          К оплате было: {formatPrice(charge)}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3">
        <ButtonLink
          href={`/checkout/success?order=${orderNumber}`}
          variant="primary"
          fullWidth
        >
          Страница заявки
        </ButtonLink>
        <ButtonLink href="/catalog" variant="outline" fullWidth>
          В каталог
        </ButtonLink>
      </div>
    </>
  );
}

export default function CheckoutPaymentPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <Suspense fallback={<p className="text-slate-500">Загрузка…</p>}>
        <PaymentReturnContent />
      </Suspense>
    </div>
  );
}
