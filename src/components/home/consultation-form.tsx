"use client";

import { useCityStore } from "@/store/city-store";
import { useCityById } from "@/context/cities-context";
import { company } from "@/lib/company";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const requestTypes = [
  "Сервисная служба",
  "Отдел корпоративных продаж",
  "Отдел по работе с дилерами",
  "Отдел розничных продаж",
] as const;

export function ConsultationForm() {
  const router = useRouter();
  const cityId = useCityStore((s) => s.cityId);
  const city = useCityById(cityId);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState<(typeof requestTypes)[number]>(
    requestTypes[1],
  );
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleRequestTypeChange(value: string) {
    if ((requestTypes as readonly string[]).includes(value)) {
      setRequestType(value as (typeof requestTypes)[number]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Укажите имя и телефон");
      return;
    }
    if (!consent) {
      setError("Необходимо согласие на обработку персональных данных");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          cityId,
          deliveryType: "consultation",
          clientType: "person",
          items: [],
          calculation: {
            subtotal: 0,
            delivery: 0,
            assembly: 0,
            discount: 0,
            total: 0,
          },
          comment: `Консультация: ${requestType}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка отправки");

      router.push(`/checkout/success?order=${data.orderNumber}&type=consultation`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="consultation" className="scroll-mt-20 bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/80 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Консультация</h2>
              <p className="mt-1 text-sm text-slate-600">
                Оставьте заявку — менеджер свяжется с вами по вашему вопросу.
              </p>
            </div>
            <p className="text-sm font-medium text-slate-500">
              {city ? `Город: ${city.name}` : `Город: ${cityId}`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Имя *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
            />
            <input
              required
              type="tel"
              placeholder="Телефон *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
            />
            <input
              type="email"
              placeholder="Email (для связи)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm sm:col-span-2"
            />
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-900">
              Кто вам нужен?
            </span>
            <select
              value={requestType}
              onChange={(e) => handleRequestTypeChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
            >
              {requestTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="flex gap-3 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="touch-auto mt-0.5 size-5 shrink-0"
            />
            Согласен на{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] underline"
            >
              обработку персональных данных
            </a>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? "Отправка…" : "Отправить заявку"}
          </Button>

          <p className="text-center text-xs text-slate-500">
            Или{" "}
            <a
              href={company.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] underline"
            >
              написать в Telegram
            </a>
          </p>
          </form>
        </div>
      </div>
    </section>
  );
}

