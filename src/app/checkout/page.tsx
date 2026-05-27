import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Оформление заявки",
};

function CheckoutFallback() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-500">
      Загрузка формы…
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutForm />
    </Suspense>
  );
}
