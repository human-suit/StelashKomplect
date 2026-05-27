"use client";

import { deliveryTypeLabel, deliveryTypeSummary } from "@/lib/delivery-labels";
import { formatPrice } from "@/lib/products";
import type { StoredOrder } from "@/lib/server/orders-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

export function AdminOrdersPanel() {
  const router = useRouter();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => {
        if (r.status === 401) {
          router.replace("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.error) throw new Error(data.error);
        setOrders(data.orders ?? []);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Ошибка загрузки"),
      )
      .finally(() => setLoading(false));
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  if (loading) {
    return <p className="text-slate-500">Загрузка заявок…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  const filteredOrders = orders.filter((order) => {
    const statusOk = statusFilter === "all" || order.status === statusFilter;
    const paymentOk =
      paymentFilter === "all" || (order.paymentMethod ?? "cash") === paymentFilter;
    return statusOk && paymentOk;
  });
  const visibleOrders = filteredOrders.slice(0, visibleCount);

  const paymentMethodLabel = (m?: StoredOrder["paymentMethod"]) => {
    if (m === "online_card") return "Онлайн картой";
    if (m === "invoice") return "Безнал (счёт)";
    return "Наличные";
  };

  const statusLabel = (s: StoredOrder["status"]) => {
    if (s === "new") return "Новая";
    if (s === "processing") return "В работе";
    if (s === "done") return "Завершена";
    return "Отменена";
  };

  const paymentStatusLabel = (s?: StoredOrder["paymentStatus"]) => {
    if (!s || s === "none") return "Без оплаты";
    if (s === "pending") return "Ожидает оплаты";
    if (s === "succeeded") return "Оплачена";
    if (s === "canceled") return "Отменена";
    return "Ошибка оплаты";
  };

  async function saveOrder(order: StoredOrder) {
    setSaveError("");
    setSaving(order.orderNumber);
    try {
      const res = await fetch(
        `/api/admin/orders/${encodeURIComponent(order.orderNumber)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: order.status,
            managerNote: order.managerNote ?? "",
          }),
        },
      );
      const data = await res.json();
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Ошибка сохранения");
      setOrders((prev) =>
        prev.map((o) => (o.orderNumber === order.orderNumber ? data.order : o)),
      );
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setSaving(null);
    }
  }

  async function copyToClipboard(order: StoredOrder) {
    const delivery = deliveryTypeSummary(order);

    const text = [
      `${order.orderNumber}`,
      `${order.name} · ${order.phone}${order.email ? ` · ${order.email}` : ""}`,
      `Город: ${order.cityId}`,
      delivery,
      `Оплата: ${paymentMethodLabel(order.paymentMethod)}`,
      `Итого: ${formatPrice(order.calculation.total)}`,
      order.comment ? `Комментарий: ${order.comment}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback: nothing
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Заявки</h1>
          <p className="text-sm text-slate-500">
            Всего: {orders.length} · Показано: {filteredOrders.length}
          </p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href="/admin/content" variant="outline">
            CMS (CRUD)
          </ButtonLink>
          <ButtonLink href="/admin/analytics" variant="outline">
            Аналитика
          </ButtonLink>
          <Button type="button" variant="outline" onClick={logout}>
            Выйти
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs text-slate-500">Фильтр по статусу</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
          >
            <option value="all">Все статусы</option>
            <option value="new">Новая</option>
            <option value="processing">В работе</option>
            <option value="done">Завершена</option>
            <option value="cancelled">Отменена</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs text-slate-500">Фильтр по оплате</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
          >
            <option value="all">Все способы</option>
            <option value="online_card">Онлайн картой</option>
            <option value="cash">Наличные</option>
            <option value="invoice">Безнал (счёт)</option>
          </select>
        </label>
      </div>

      {saveError && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          {saveError}
        </p>
      )}

      {filteredOrders.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-6 text-slate-600">
          По текущим фильтрам заявок нет.
        </p>
      ) : (
        <ul className="space-y-4">
          {visibleOrders.map((order) => (
            <li
              key={order.orderNumber}
              className="rounded-xl border-t-4 border-t-slate-300 border-x border-b border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-[var(--color-primary)]">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString("ru-RU", {
                      timeZone: "Asia/Yekaterinburg",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                    {statusLabel(order.status)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {deliveryTypeLabel(order.deliveryType)}
                  </span>
                  {order.paymentStatus && order.paymentStatus !== "none" && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.paymentStatus === "succeeded"
                          ? "bg-green-50 text-green-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      💳 {paymentStatusLabel(order.paymentStatus)}
                      {order.paidAmountRub != null &&
                        ` ${order.paidAmountRub} ₽`}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-2 font-medium">
                {order.name} · {order.phone}
              </p>
              {order.comment && (
                <p className="mt-1 text-sm text-slate-600">{order.comment}</p>
              )}
              <p className="mt-1 text-sm text-slate-600">
                Способ оплаты: {paymentMethodLabel(order.paymentMethod)}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs text-slate-500">Статус</span>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    value={order.status}
                    onChange={(e) => {
                      const status = e.target.value as StoredOrder["status"];
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.orderNumber === order.orderNumber
                            ? { ...o, status }
                            : o,
                        ),
                      );
                    }}
                  >
                    <option value="new">Новая</option>
                    <option value="processing">В работе</option>
                    <option value="done">Завершена</option>
                    <option value="cancelled">Отменена</option>
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs text-slate-500">Заметка менеджера</span>
                  <textarea
                    value={order.managerNote ?? ""}
                    onChange={(e) => {
                      const managerNote = e.target.value;
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.orderNumber === order.orderNumber
                            ? { ...o, managerNote }
                            : o,
                        ),
                      );
                    }}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Например: перезвонить после 18:00, уточнить размер…"
                  />
                </label>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => saveOrder(order)}
                  disabled={saving === order.orderNumber}
                >
                  {saving === order.orderNumber ? "Сохранение…" : "Сохранить"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copyToClipboard(order)}
                >
                  Скопировать
                </Button>
              </div>

              {order.items.length > 0 ? (
                <ul className="mt-2 text-sm text-slate-600">
                  {order.items.map((i) => (
                    <li key={i.productId}>
                      {i.name} × {i.quantity} —{" "}
                      {formatPrice(i.price * i.quantity)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm italic text-slate-500">
                  Консультация без корзины
                </p>
              )}
              <p className="mt-2 text-sm font-semibold">
                Итого: {formatPrice(order.calculation.total)}
              </p>
            </li>
          ))}
        </ul>
      )}
      {filteredOrders.length > visibleCount && (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setVisibleCount((prev) =>
              Math.min(prev + ITEMS_PER_PAGE, filteredOrders.length),
            )
          }
        >
          Показать еще ({Math.min(ITEMS_PER_PAGE, filteredOrders.length - visibleCount)})
        </Button>
      )}
    </div>
  );
}
