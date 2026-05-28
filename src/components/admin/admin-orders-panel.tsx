"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { deliveryTypeLabel, deliveryTypeSummary } from "@/lib/delivery-labels";
import { formatPrice } from "@/lib/products";
import type { StoredOrder } from "@/lib/server/orders-store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;
const FILTERS_KEY = "sk-admin-filters";
const PRESETS_KEY = "sk-admin-report-presets";

type PanelMode = "orders" | "reports";
type PaymentFilter = "all" | "online_card" | "cash" | "invoice";

interface ReportFilters {
  status: string;
  paymentMethod: PaymentFilter;
  dateFrom: string;
  dateTo: string;
}

interface SavedPreset {
  id: string;
  name: string;
  filters: ReportFilters;
}

const DEFAULT_FILTERS: ReportFilters = {
  status: "all",
  paymentMethod: "all",
  dateFrom: "",
  dateTo: "",
};

function readFiltersFromStorage(): ReportFilters {
  if (typeof window === "undefined") return DEFAULT_FILTERS;
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    if (!raw) return DEFAULT_FILTERS;
    const parsed = JSON.parse(raw) as Partial<ReportFilters>;
    return { ...DEFAULT_FILTERS, ...parsed };
  } catch {
    return DEFAULT_FILTERS;
  }
}

function readPresetsFromStorage(): SavedPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedPreset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFiltersToStorage(filters: ReportFilters): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

function savePresetsToStorage(presets: SavedPreset[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function AdminOrdersPanel({ mode = "orders" }: { mode?: PanelMode }) {
  const router = useRouter();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<ReportFilters>(readFiltersFromStorage);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string>("");
  const [presets, setPresets] = useState<SavedPreset[]>(readPresetsFromStorage);
  const [presetName, setPresetName] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

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
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, [router]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const statusOk = filters.status === "all" || order.status === filters.status;
      const paymentMethod = order.paymentMethod ?? "cash";
      const paymentOk =
        filters.paymentMethod === "all" || paymentMethod === filters.paymentMethod;

      const created = new Date(order.createdAt).getTime();
      const fromOk = !filters.dateFrom || created >= new Date(filters.dateFrom).getTime();
      const toOk =
        !filters.dateTo ||
        created <= new Date(`${filters.dateTo}T23:59:59`).getTime();

      return statusOk && paymentOk && fromOk && toOk;
    });
  }, [orders, filters]);

  const visibleOrders = filteredOrders.slice(0, visibleCount);

  function patchFilters(patch: Partial<ReportFilters>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    setVisibleCount(ITEMS_PER_PAGE);
    saveFiltersToStorage(next);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const paymentMethodLabel = (m?: StoredOrder["paymentMethod"]) => {
    if (m === "online_card") return "Онлайн картой";
    if (m === "invoice") return "Безнал (счет)";
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
      // ignore
    }
  }

  function saveCurrentPreset() {
    const name = presetName.trim();
    if (!name) return;
    const preset: SavedPreset = {
      id: `${Date.now()}`,
      name,
      filters,
    };
    const next = [preset, ...presets].slice(0, 20);
    setPresets(next);
    setPresetName("");
    savePresetsToStorage(next);
  }

  function applyPreset(id: string) {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setFilters(preset.filters);
    setVisibleCount(ITEMS_PER_PAGE);
    saveFiltersToStorage(preset.filters);
  }

  function deletePreset(id: string) {
    const next = presets.filter((p) => p.id !== id);
    setPresets(next);
    savePresetsToStorage(next);
  }

  async function downloadPdfReport() {
    if (filteredOrders.length === 0) return;
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      let y = 40;
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFontSize(14);
      doc.text("StellazhKomplect - Orders report", 40, y);
      y += 24;
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString("ru-RU")}`, 40, y);
      y += 18;
      doc.text(`Total orders: ${filteredOrders.length}`, 40, y);
      y += 18;

      for (const order of filteredOrders) {
        if (y > pageHeight - 120) {
          doc.addPage();
          y = 40;
        }
        doc.setFontSize(11);
        doc.text(
          `${order.orderNumber} | ${statusLabel(order.status)} | ${new Date(order.createdAt).toLocaleDateString("ru-RU")}`,
          40,
          y,
        );
        y += 14;
        doc.setFontSize(10);
        doc.text(
          `${order.name}, ${order.phone}, ${paymentMethodLabel(order.paymentMethod)}, total ${order.calculation.total} RUB`,
          40,
          y,
        );
        y += 12;
        if (order.managerNote) {
          doc.text(`Manager note: ${order.managerNote.slice(0, 100)}`, 40, y);
          y += 12;
        }
        y += 8;
      }

      doc.save(`orders-report-${Date.now()}.pdf`);
    } finally {
      setPdfLoading(false);
    }
  }

  if (loading) return <p className="text-slate-500">Загрузка заявок…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {mode === "reports" ? "Отчеты и статусы" : "Заявки"}
          </h1>
          <p className="text-sm text-slate-500">
            Всего: {orders.length} · Показано: {filteredOrders.length}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin" variant="outline">
            Заявки
          </ButtonLink>
          <ButtonLink href="/admin/reports" variant="outline">
            Отчеты
          </ButtonLink>
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1">
          <span className="text-xs text-slate-500">Фильтр по статусу</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={filters.status}
            onChange={(e) => patchFilters({ status: e.target.value })}
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
            value={filters.paymentMethod}
            onChange={(e) =>
              patchFilters({ paymentMethod: e.target.value as PaymentFilter })
            }
          >
            <option value="all">Все способы</option>
            <option value="online_card">Онлайн картой</option>
            <option value="cash">Наличные</option>
            <option value="invoice">Безнал (счет)</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs text-slate-500">Дата от</span>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={filters.dateFrom}
            onChange={(e) => patchFilters({ dateFrom: e.target.value })}
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs text-slate-500">Дата до</span>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={filters.dateTo}
            onChange={(e) => patchFilters({ dateTo: e.target.value })}
          />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 text-sm font-semibold text-slate-900">Сохраненные фильтры</p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Название фильтра"
            className="min-w-[220px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <Button type="button" variant="primary" onClick={saveCurrentPreset}>
            Сохранить фильтр
          </Button>
          {mode === "reports" && (
            <Button
              type="button"
              variant="outline"
              disabled={pdfLoading || filteredOrders.length === 0}
              onClick={downloadPdfReport}
            >
              {pdfLoading ? "Готовим PDF…" : "Скачать PDF"}
            </Button>
          )}
        </div>
        {presets.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {presets.map((p) => (
              <li key={p.id} className="flex items-center gap-1">
                <Button type="button" variant="outline" size="sm" onClick={() => applyPreset(p.id)}>
                  {p.name}
                </Button>
                <button
                  type="button"
                  onClick={() => deletePreset(p.id)}
                  className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {saveError && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{saveError}</p>
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
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-[var(--color-primary)]">{order.orderNumber}</p>
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
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {paymentStatusLabel(order.paymentStatus)}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-2 font-medium">
                {order.name} · {order.phone}
              </p>
              {order.comment && <p className="mt-1 text-sm text-slate-600">{order.comment}</p>}
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
                          o.orderNumber === order.orderNumber ? { ...o, status } : o,
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
                <Button type="button" variant="outline" onClick={() => copyToClipboard(order)}>
                  Скопировать
                </Button>
              </div>

              {order.items.length > 0 ? (
                <ul className="mt-2 text-sm text-slate-600">
                  {order.items.map((i) => (
                    <li key={i.productId}>
                      {i.name} × {i.quantity} — {formatPrice(i.price * i.quantity)}
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
