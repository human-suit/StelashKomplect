"use client";

import { CartCalculator } from "@/components/cart/cart-calculator";
import { company } from "@/lib/company";
import { useCityById } from "@/context/cities-context";
import { calculateCart } from "@/lib/calculator";
import { formatPrice, getProductBySlug } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";
import { useCityStore } from "@/store/city-store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const deliveryEnabled = useCartStore((s) => s.deliveryEnabled);
  const assemblyEnabled = useCartStore((s) => s.assemblyEnabled);
  const subtotal = useCartStore((s) => s.subtotal);
  const clear = useCartStore((s) => s.clear);
  const cityId = useCityStore((s) => s.cityId);
  const city = useCityById(cityId);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">(
    "pickup",
  );
  const [pickupId, setPickupId] = useState("");
  const [address, setAddress] = useState("");
  const [clientType, setClientType] = useState<"person" | "company">("person");
  const [companyName, setCompanyName] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "online_card" | "cash" | "invoice"
  >("cash");
  const [paymentTestMode, setPaymentTestMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/payments/config")
      .then((r) => r.json())
      .then((d) => {
        setPaymentEnabled(Boolean(d.enabled));
        setPaymentTestMode(d.testMode ?? true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const slug = searchParams.get("product");
    if (!slug) return;
    const product = getProductBySlug(slug);
    if (!product) return;
    const inCart = useCartStore
      .getState()
      .items.some((i) => i.productId === product.id);
    if (!inCart) addItem(product, 1);
  }, [searchParams, addItem]);

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const calc = calculateCart({
    subtotal: subtotal(),
    itemCount,
    deliveryEnabled: deliveryType === "delivery" || deliveryEnabled,
    assemblyEnabled,
    isUfa: cityId === "ufa",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Укажите имя и телефон");
      return;
    }
    if (!consent) {
      setError("Необходимо согласие на обработку данных");
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
          deliveryType,
          pickupLocationId: pickupId || undefined,
          address: address.trim() || undefined,
          clientType,
          companyName: companyName.trim() || undefined,
          comment: comment.trim() || undefined,
          items,
          calculation: calc,
          assemblyEnabled,
          paymentMethod: paymentEnabled ? paymentMethod : "cash",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка отправки");

      clear();

      if (data.paymentUrl) {
        window.location.assign(data.paymentUrl);
        return;
      }

      const warn = data.warning
        ? `&warn=${encodeURIComponent(data.warning)}`
        : "";
      router.push(`/checkout/success?order=${data.orderNumber}${warn}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-28 sm:py-8 lg:pb-8">
      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
        Оформление заявки
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Менеджер свяжется с вами для подтверждения цены и сроков
      </p>

      {items.length > 0 ? (
        <div className="mt-6">
          <CartCalculator />
        </div>
      ) : (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Корзина пуста — можно отправить заявку на консультацию или подбор
          оборудования.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <fieldset className="space-y-4">
          <legend className="text-sm font-bold text-slate-900">Контакты</legend>
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-slate-900">
            Город: {city?.name}
          </legend>
          <label className="flex min-h-[44px] items-center gap-3">
            <input
              type="radio"
              name="delivery"
              checked={deliveryType === "pickup"}
              onChange={() => setDeliveryType("pickup")}
              className="touch-auto size-5"
            />
            <span className="text-sm">Самовывоз</span>
          </label>
          {deliveryType === "pickup" && city && (
            <select
              value={pickupId}
              onChange={(e) => setPickupId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
              required
            >
              <option value="">Выберите пункт</option>
              {city.locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.label} — {loc.address}
                </option>
              ))}
            </select>
          )}
          <label className="flex min-h-[44px] items-center gap-3">
            <input
              type="radio"
              name="delivery"
              checked={deliveryType === "delivery"}
              onChange={() => setDeliveryType("delivery")}
              className="touch-auto size-5"
            />
            <span className="text-sm">Доставка</span>
          </label>
          {deliveryType === "delivery" && (
            <input
              placeholder="Адрес доставки"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
            />
          )}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-slate-900">Клиент</legend>
          <label className="flex min-h-[44px] items-center gap-3">
            <input
              type="radio"
              checked={clientType === "person"}
              onChange={() => setClientType("person")}
              className="touch-auto size-5"
            />
            <span className="text-sm">Физическое лицо</span>
          </label>
          <label className="flex min-h-[44px] items-center gap-3">
            <input
              type="radio"
              checked={clientType === "company"}
              onChange={() => setClientType("company")}
              className="touch-auto size-5"
            />
            <span className="text-sm">Юридическое лицо</span>
          </label>
          {clientType === "company" && (
            <input
              placeholder="Название организации / ИНН"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
            />
          )}
        </fieldset>

        <textarea
          placeholder="Комментарий к заказу"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
        />

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-slate-900">Оплата</legend>

          {paymentEnabled ? (
            <>
              <label className="flex min-h-[44px] items-center gap-3">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "online_card"}
                  onChange={() => setPaymentMethod("online_card")}
                  className="touch-auto size-5"
                />
                <span className="text-sm">
                  Онлайн картой (сразу списание)
                  {paymentTestMode ? (
                    <span className="ml-2 text-xs text-amber-700">
                      тестовый режим
                    </span>
                  ) : null}
                </span>
              </label>

              <label className="flex min-h-[44px] items-center gap-3">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="touch-auto size-5"
                />
                <span className="text-sm">Наличными при получении</span>
              </label>

              <label className="flex min-h-[44px] items-center gap-3">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "invoice"}
                  onChange={() => setPaymentMethod("invoice")}
                  className="touch-auto size-5"
                />
                <span className="text-sm">Безналичный расчёт (счёт)</span>
              </label>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              Способ оплаты уточнит менеджер после подтверждения заявки.
            </p>
          )}
        </fieldset>

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

        {items.length > 0 && (
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            Итого (расчёт): {formatPrice(calc.total)}
          </p>
        )}

        {/* способ оплаты выбирается выше в секции "Оплата" */}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
        >
          {loading ? "Отправка…" : "Отправить заявку"}
        </Button>

        <p className="text-center text-xs text-slate-500">
          Или{" "}
          <a
            href={company.telegram}
            className="text-[var(--color-primary)] underline"
          >
            Telegram
          </a>
          {" · "}
          <a href={`tel:${company.phone}`} className="underline">
            {company.phoneDisplay}
          </a>
        </p>
      </form>
    </div>
  );
}
