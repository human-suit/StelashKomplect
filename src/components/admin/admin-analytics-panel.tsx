"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";

interface Snapshot {
  onlineNow: number;
  todayUnique: number;
  todayPageViews: number;
  avgDurationSec: number;
  hourlyPageViews: { hour: number; count: number }[];
  recentVisits: {
    sessionId: string;
    firstSeenAt: number;
    lastSeenAt: number;
    durationSec: number;
  }[];
  topPages: { path: string; count: number }[];
  topReferrers?: { value: string; count: number }[];
  topUtmSources?: { value: string; count: number }[];
  topUtmCampaigns?: { value: string; count: number }[];
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Главная",
  "/catalog": "Каталог",
  "/cart": "Корзина",
  "/compare": "Сравнение",
  "/checkout": "Оформление заявки",
  "/checkout/payment": "Страница оплаты",
  "/checkout/success": "Успешная заявка",
  "/contacts": "Контакты",
  "/where-to-buy": "Где купить",
  "/about": "О компании",
  "/news": "Новости",
  "/knowledge": "База знаний",
  "/projects": "Проекты",
  "/reviews": "Отзывы",
  "/catalogs": "PDF каталоги",
  "/privacy": "Политика конфиденциальности",
  "/admin": "Панель администратора",
  "/admin/login": "Вход в админку",
  "/admin/content": "CMS контент",
  "/admin/analytics": "Аналитика",
  "/admin/reports": "Отчеты",
};

function getPageLabel(pathWithQuery: string): string {
  const cleanPath = pathWithQuery.split("?")[0] || "/";
  if (PAGE_LABELS[cleanPath]) return PAGE_LABELS[cleanPath];
  if (cleanPath.startsWith("/product/")) return "Карточка товара";
  if (cleanPath.startsWith("/catalog/")) return "Категория каталога";
  if (cleanPath.startsWith("/news/")) return "Новость";
  if (cleanPath.startsWith("/knowledge/")) return "Статья базы знаний";
  if (cleanPath.startsWith("/api/")) return "API запрос";
  return "Страница сайта";
}

export function AdminAnalyticsPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => {
        if (r.status === 401) {
          router.replace("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setLoading(false));
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  if (loading) return <p className="text-slate-500">Загрузка аналитики…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-slate-600">Нет данных.</p>;

  const maxHourly = Math.max(1, ...data.hourlyPageViews.map((i) => i.count));
  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec} сек`;
    const min = Math.floor(sec / 60);
    const rest = sec % 60;
    return `${min} мин ${rest} сек`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Аналитика</h1>
          <p className="text-sm text-slate-500">
            Данные за сегодня (временно in-memory)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin" variant={pathname === "/admin" ? "primary" : "outline"}>
            Заявки
          </ButtonLink>
          <ButtonLink
            href="/admin/reports"
            variant={pathname === "/admin/reports" ? "primary" : "outline"}
          >
            Отчеты
          </ButtonLink>
          <ButtonLink
            href="/admin/content"
            variant={pathname === "/admin/content" ? "primary" : "outline"}
          >
            Контент
          </ButtonLink>
          <ButtonLink
            href="/admin/analytics"
            variant={pathname === "/admin/analytics" ? "primary" : "outline"}
          >
            Аналитика
          </ButtonLink>
          <Button type="button" variant="outline" onClick={logout}>
            Выйти
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Сейчас на сайте</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {data.onlineNow}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Уникальные за сегодня</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {data.todayUnique}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Просмотры за сегодня</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {data.todayPageViews}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Среднее время на сайте</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatDuration(data.avgDurationSec)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="font-semibold text-slate-900">График просмотров по часам</p>
        <p className="mt-1 text-xs text-slate-500">Сегодня, локальное время сервера</p>
        <div className="mt-4 space-y-2">
          {data.hourlyPageViews.map((item) => (
            <div key={item.hour} className="grid grid-cols-[48px_1fr_44px] items-center gap-2 text-xs">
              <span className="text-slate-500">{String(item.hour).padStart(2, "0")}:00</span>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${(item.count / maxHourly) * 100}%` }}
                />
              </div>
              <span className="text-right font-semibold text-slate-700">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="font-semibold text-slate-900">Топ страниц</p>
        {data.topPages.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Пока нет просмотров.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {data.topPages.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {getPageLabel(p.path)}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {p.path.split("?")[0] || "/"} — {getPageLabel(p.path)}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  {p.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-semibold text-slate-900">Источники (referrer)</p>
          {!data.topReferrers?.length ? (
            <p className="mt-2 text-sm text-slate-600">Пока нет данных.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {data.topReferrers.map((r) => (
                <li
                  key={r.value}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="truncate text-slate-700">{r.value}</span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {r.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-semibold text-slate-900">utm_source</p>
          {!data.topUtmSources?.length ? (
            <p className="mt-2 text-sm text-slate-600">Нет UTM-меток.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {data.topUtmSources.map((r) => (
                <li
                  key={r.value}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="truncate text-slate-700">{r.value}</span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {r.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-semibold text-slate-900">utm_campaign</p>
          {!data.topUtmCampaigns?.length ? (
            <p className="mt-2 text-sm text-slate-600">Нет UTM-кампаний.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {data.topUtmCampaigns.map((r) => (
                <li
                  key={r.value}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="truncate text-slate-700">{r.value}</span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {r.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="font-semibold text-slate-900">Последние визиты</p>
        {!data.recentVisits.length ? (
          <p className="mt-2 text-sm text-slate-600">Пока нет данных.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                  <th className="px-2 py-2">Сессия</th>
                  <th className="px-2 py-2">Первый заход</th>
                  <th className="px-2 py-2">Последняя активность</th>
                  <th className="px-2 py-2">Время на сайте</th>
                </tr>
              </thead>
              <tbody>
                {data.recentVisits.map((visit) => (
                  <tr key={visit.sessionId} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-mono text-xs text-slate-600">
                      {visit.sessionId.slice(0, 8)}…
                    </td>
                    <td className="px-2 py-2 text-slate-700">
                      {new Date(visit.firstSeenAt).toLocaleString("ru-RU")}
                    </td>
                    <td className="px-2 py-2 text-slate-700">
                      {new Date(visit.lastSeenAt).toLocaleString("ru-RU")}
                    </td>
                    <td className="px-2 py-2 font-semibold text-slate-900">
                      {formatDuration(visit.durationSec)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

