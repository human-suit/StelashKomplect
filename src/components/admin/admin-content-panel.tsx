"use client";

import {
  CMS_RESOURCES,
  CMS_RESOURCE_LABELS,
  type CmsResource,
} from "@/lib/server/cms/resources";
import { specsToText } from "@/lib/specs";
import { asStringArray } from "@/lib/server/cms/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

type CmsItem = Record<string, unknown> & { id: string };

const emptyForms: Record<CmsResource, Record<string, string>> = {
  news: {
    slug: "",
    title: "",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    content: "",
    sortOrder: "0",
  },
  knowledge: {
    slug: "",
    title: "",
    category: "Общее",
    excerpt: "",
    content: "",
    sortOrder: "0",
  },
  brands: { name: "", note: "", sortOrder: "0" },
  "hero-slides": {
    slideKey: "",
    title: "",
    subtitle: "",
    badge: "",
    ctaPrimaryLabel: "Подробнее",
    ctaPrimaryHref: "/catalog",
    ctaSecondaryLabel: "",
    ctaSecondaryHref: "",
    gradient: "from-[var(--color-primary)] to-[#0f2744]",
    sortOrder: "0",
  },
  solutions: {
    solutionKey: "",
    title: "",
    description: "",
    href: "/catalog",
    icon: "📦",
    sortOrder: "0",
  },
  projects: {
    slug: "",
    title: "",
    tags: "",
    excerpt: "",
    bullets: "",
    sortOrder: "0",
  },
  products: {
    id: "",
    slug: "",
    name: "",
    categorySlug: "stellazhi",
    price: "0",
    inStock: "0",
    image: "",
    specs: "",
    sortOrder: "0",
  },
  cities: {
    id: "",
    name: "",
    region: "",
    sortOrder: "0",
  },
};

const FIELD_LABELS: Partial<Record<CmsResource, Record<string, string>>> = {
  news: {
    slug: "Ссылка (slug)",
    title: "Заголовок",
    date: "Дата",
    excerpt: "Краткое описание",
    content: "Текст (по строкам)",
    sortOrder: "Номер показа (число)",
    published: "Опубликовано",
  },
  knowledge: {
    slug: "Ссылка (slug)",
    title: "Заголовок",
    category: "Категория",
    excerpt: "Краткое описание",
    content: "Текст (по строкам)",
    sortOrder: "Номер показа (число)",
    published: "Опубликовано",
  },
  brands: {
    name: "Название",
    note: "Примечание",
    sortOrder: "Номер показа (число)",
    published: "Опубликовано",
  },
  "hero-slides": {
    slideKey: "Ключ слайда",
    title: "Заголовок",
    subtitle: "Подзаголовок",
    badge: "Бейдж",
    ctaPrimaryLabel: "Текст основной кнопки",
    ctaPrimaryHref: "Ссылка основной кнопки",
    ctaSecondaryLabel: "Текст второй кнопки",
    ctaSecondaryHref: "Ссылка второй кнопки",
    gradient: "Градиент (Tailwind-классы)",
    sortOrder: "Номер показа (число)",
    published: "Опубликовано",
  },
  solutions: {
    solutionKey: "Ключ решения",
    title: "Заголовок",
    description: "Описание",
    href: "Ссылка",
    icon: "Иконка (emoji)",
    sortOrder: "Номер показа (число)",
    published: "Опубликовано",
  },
  projects: {
    slug: "Ссылка (slug)",
    title: "Заголовок",
    tags: "Теги (по строкам)",
    excerpt: "Краткое описание",
    bullets: "Пункты (по строкам)",
    sortOrder: "Номер показа (число)",
    published: "Опубликовано",
  },
  products: {
    id: "ID товара",
    slug: "Ссылка (slug)",
    name: "Название",
    categorySlug: "Категория (slug)",
    price: "Цена, ₽",
    inStock: "В наличии, шт",
    image: "Ссылка на изображение",
    specs: "Характеристики (формат: ключ: значение)",
    sortOrder: "Номер показа (число)",
    published: "Опубликовано",
    isFeatured: "Лидер продаж",
  },
  cities: {
    id: "ID города",
    name: "Название города",
    region: "Регион",
    sortOrder: "Номер показа (число)",
    isDefault: "Город по умолчанию",
  },
};

const LOCATION_FIELD_LABELS: Record<string, string> = {
  id: "ID точки",
  type: "Тип (store / store_new / warehouse)",
  label: "Название точки",
  address: "Адрес",
  note: "Примечание",
  lat: "Широта",
  lon: "Долгота",
  sortOrder: "Порядок сортировки",
};

const NUMERIC_FIELDS = new Set(["sortOrder", "price", "inStock", "lat", "lon"]);
const ITEMS_PER_PAGE = 10;

function itemTitle(resource: CmsResource, item: CmsItem): string {
  if (resource === "brands") return String(item.name ?? item.id);
  if (resource === "products") {
    return `${item.name ?? item.slug} — ${item.price ?? 0} ₽`;
  }
  if (resource === "hero-slides") return String(item.title ?? item.slideKey);
  if (resource === "cities") return String(item.name ?? item.id);
  return String(item.title ?? item.slug ?? item.id);
}

function getFieldLabel(resource: CmsResource, key: string): string {
  return FIELD_LABELS[resource]?.[key] ?? key;
}

function itemToForm(resource: CmsResource, item: CmsItem): Record<string, string> {
  const published = item.published !== false ? "1" : "0";

  switch (resource) {
    case "news":
      return {
        slug: String(item.slug ?? ""),
        title: String(item.title ?? ""),
        date: item.date
          ? new Date(String(item.date)).toISOString().slice(0, 10)
          : "",
        excerpt: String(item.excerpt ?? ""),
        content: asStringArray(item.content).join("\n"),
        sortOrder: String(item.sortOrder ?? 0),
        published,
      };
    case "knowledge":
      return {
        slug: String(item.slug ?? ""),
        title: String(item.title ?? ""),
        category: String(item.category ?? ""),
        excerpt: String(item.excerpt ?? ""),
        content: asStringArray(item.content).join("\n"),
        sortOrder: String(item.sortOrder ?? 0),
        published,
      };
    case "brands":
      return {
        name: String(item.name ?? ""),
        note: String(item.note ?? ""),
        sortOrder: String(item.sortOrder ?? 0),
        published,
      };
    case "hero-slides":
      return {
        slideKey: String(item.slideKey ?? ""),
        title: String(item.title ?? ""),
        subtitle: String(item.subtitle ?? ""),
        badge: String(item.badge ?? ""),
        ctaPrimaryLabel: String(item.ctaPrimaryLabel ?? ""),
        ctaPrimaryHref: String(item.ctaPrimaryHref ?? ""),
        ctaSecondaryLabel: String(item.ctaSecondaryLabel ?? ""),
        ctaSecondaryHref: String(item.ctaSecondaryHref ?? ""),
        gradient: String(item.gradient ?? ""),
        sortOrder: String(item.sortOrder ?? 0),
        published,
      };
    case "solutions":
      return {
        solutionKey: String(item.solutionKey ?? ""),
        title: String(item.title ?? ""),
        description: String(item.description ?? ""),
        href: String(item.href ?? ""),
        icon: String(item.icon ?? ""),
        sortOrder: String(item.sortOrder ?? 0),
        published,
      };
    case "projects":
      return {
        slug: String(item.slug ?? ""),
        title: String(item.title ?? ""),
        tags: asStringArray(item.tags).join("\n"),
        excerpt: String(item.excerpt ?? ""),
        bullets: asStringArray(item.bullets).join("\n"),
        sortOrder: String(item.sortOrder ?? 0),
        published,
      };
    case "products":
      return {
        id: String(item.id ?? ""),
        slug: String(item.slug ?? ""),
        name: String(item.name ?? ""),
        categorySlug: String(item.categorySlug ?? "stellazhi"),
        price: String(item.price ?? 0),
        inStock: String(item.inStock ?? 0),
        image: String(item.image ?? ""),
        specs: specsToText(item.specs),
        sortOrder: String(item.sortOrder ?? 0),
        published,
        isFeatured: item.isFeatured ? "1" : "0",
      };
    case "cities":
      return {
        id: String(item.id ?? ""),
        name: String(item.name ?? ""),
        region: String(item.region ?? ""),
        sortOrder: String(item.sortOrder ?? 0),
        isDefault: item.isDefault ? "1" : "0",
      };
    default:
      return {};
  }
}

function formToBody(
  resource: CmsResource,
  form: Record<string, string>,
): Record<string, unknown> {
  const published = form.published === "1";
  const sortOrder = Number(form.sortOrder || 0);

  const base = { ...form, published, sortOrder };

  if (resource === "cities") {
    return {
      ...base,
      isDefault: form.isDefault === "1",
    };
  }

  if (resource === "products") {
    return {
      ...base,
      isFeatured: form.isFeatured === "1",
    };
  }

  return base;
}

export function AdminContentPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const [resource, setResource] = useState<CmsResource>("news");
  const [items, setItems] = useState<CmsItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>(emptyForms.news);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "hidden">("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const selected = items.find((i) => i.id === selectedId);
  const filteredItems = items.filter((item) => {
    if (publishedFilter === "published" && item.published === false) return false;
    if (publishedFilter === "hidden" && item.published !== false) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const title = itemTitle(resource, item).toLowerCase();
    return title.includes(q);
  });
  const visibleItems = filteredItems.slice(0, visibleCount);

  async function reloadList(currentResource: CmsResource = resource) {
    const listRes = await fetch(`/api/admin/cms/${currentResource}`);
    const listData = await listRes.json();
    if (listRes.ok) {
      setItems((listData.items ?? []) as CmsItem[]);
    }
  }

  useEffect(() => {
    fetch(`/api/admin/cms/${resource}`)
      .then((res) => {
        if (res.status === 401) {
          router.replace("/admin/login");
          return null;
        }
        return res.json().then((data) => ({ res, data }));
      })
      .then((payload) => {
        if (!payload) return;
        const { res, data } = payload;
        if (!res.ok) throw new Error(data.error ?? "Ошибка загрузки");
        setItems((data.items ?? []) as CmsItem[]);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setLoading(false));
  }, [resource, router]);

  function selectItem(item: CmsItem) {
    setSelectedId(item.id);
    setForm(itemToForm(resource, item));
    setMessage("");
  }

  function startCreate() {
    setSelectedId(null);
    setForm({ ...emptyForms[resource], published: "1" });
    setMessage("");
  }

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const body = formToBody(resource, form);
      const url = selectedId
        ? `/api/admin/cms/${resource}/${selectedId}`
        : `/api/admin/cms/${resource}`;
      const res = await fetch(url, {
        method: selectedId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка сохранения");
      setMessage(selectedId ? "Сохранено" : "Создано");
      await reloadList(resource);
      if (data.item?.id) setSelectedId(String(data.item.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selectedId || !confirm("Удалить запись?")) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/cms/${resource}/${selectedId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка удаления");
      setSelectedId(null);
      setForm({ ...emptyForms[resource] });
      await reloadList(resource);
      setMessage("Удалено");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  async function seedContent() {
    if (!confirm("Импортировать контент из файлов проекта в БД?")) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/cms/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка импорта");
      setMessage(`Импорт OK: ${JSON.stringify(data.counts)}`);
      await reloadList(resource);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const fields = Object.keys(emptyForms[resource]);
  const chooseResource = (next: CmsResource) => {
    setResource(next);
    setSelectedId(null);
    setForm({ ...emptyForms[next] });
    setVisibleCount(ITEMS_PER_PAGE);
    setSearch("");
    setPublishedFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Управление контентом</h1>
          <p className="text-sm text-slate-500">
            Редактирование главной, новостей, базы знаний, городов
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
            CMS
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

      <div className="flex flex-wrap gap-2">
        {CMS_RESOURCES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => chooseResource(r)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              resource === r
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
          >
            {CMS_RESOURCE_LABELS[r]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="primary" onClick={startCreate}>
          + Новая запись
        </Button>
        <Button type="button" variant="outline" onClick={seedContent} disabled={saving}>
          Импорт из файлов
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block space-y-1">
          <span className="text-xs font-medium text-slate-600">Поиск по записям</span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            placeholder="Введите заголовок, slug или название"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-slate-600">Фильтр публикации</span>
          <select
            value={publishedFilter}
            onChange={(e) =>
              {
                setPublishedFilter(e.target.value as "all" | "published" | "hidden");
                setVisibleCount(ITEMS_PER_PAGE);
              }
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">Все</option>
            <option value="published">Только опубликованные</option>
            <option value="hidden">Только скрытые</option>
          </select>
        </label>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>
      )}
      {message && (
        <p className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
          {message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            Записи ({filteredItems.length} из {items.length})
          </p>
          {loading ? (
            <p className="text-sm text-slate-500">Загрузка…</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-sm text-slate-500">Пусто. Создайте или импортируйте.</p>
          ) : (
            <ul className="max-h-[480px] divide-y divide-slate-200 overflow-y-auto rounded-lg border border-slate-200">
              {visibleItems.map((item) => (
                <li key={item.id} className="bg-white">
                  <button
                    type="button"
                    onClick={() => selectItem(item)}
                    className={`w-full px-3 py-3 text-left text-sm ${
                      selectedId === item.id
                        ? "bg-blue-50 font-semibold text-[var(--color-primary)]"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {itemTitle(resource, item)}
                    {item.published === false && (
                      <span className="ml-1 text-xs text-slate-400">(скрыто)</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {filteredItems.length > visibleCount && (
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full"
              onClick={() =>
                setVisibleCount((prev) =>
                  Math.min(prev + ITEMS_PER_PAGE, filteredItems.length),
                )
              }
            >
              Показать еще ({Math.min(ITEMS_PER_PAGE, filteredItems.length - visibleCount)})
            </Button>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">
            {selectedId ? "Редактирование" : "Новая запись"} —{" "}
            {CMS_RESOURCE_LABELS[resource]}
          </h2>

          <div className="mt-4 space-y-3">
            {fields.map((key) => (
              <label key={key} className="block space-y-1">
                <span className="text-xs font-medium text-slate-600">
                  {getFieldLabel(resource, key)}
                </span>
                {key === "content" ||
                key === "bullets" ||
                key === "tags" ||
                key === "specs" ||
                key === "description" ||
                key === "subtitle" ? (
                  <textarea
                    value={form[key] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    rows={key === "content" || key === "bullets" ? 6 : 3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder={getFieldLabel(resource, key)}
                  />
                ) : (
                  <input
                    type={NUMERIC_FIELDS.has(key) ? "number" : "text"}
                    value={form[key] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder={getFieldLabel(resource, key)}
                  />
                )}
              </label>
            ))}

            {resource !== "cities" && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published !== "0"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      published: e.target.checked ? "1" : "0",
                    }))
                  }
                  className="size-4"
                />
                Опубликовано на сайте
              </label>
            )}

            {resource === "products" && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isFeatured === "1"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      isFeatured: e.target.checked ? "1" : "0",
                    }))
                  }
                  className="size-4"
                />
                Показывать на главной (лидеры продаж)
              </label>
            )}

            {resource === "cities" && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isDefault === "1"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      isDefault: e.target.checked ? "1" : "0",
                    }))
                  }
                  className="size-4"
                />
                Город по умолчанию
              </label>
            )}
          </div>

          {resource === "cities" && selected && (
            <CityLocationsEditor
              city={selected}
              onChanged={() => {
                void reloadList(resource);
              }}
              onError={setError}
            />
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Сохранение…" : "Сохранить"}
            </Button>
            {selectedId && (
              <Button
                type="button"
                variant="outline"
                onClick={remove}
                disabled={saving}
              >
                Удалить
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CityLocationsEditor({
  city,
  onChanged,
  onError,
}: {
  city: CmsItem;
  onChanged: () => void;
  onError: (msg: string) => void;
}) {
  const locations = (city.locations as CmsItem[] | undefined) ?? [];
  const [locForm, setLocForm] = useState({
    id: "",
    type: "store",
    label: "",
    address: "",
    note: "",
    lat: "",
    lon: "",
    sortOrder: "0",
  });
  const [editLocId, setEditLocId] = useState<string | null>(null);

  async function saveLocation() {
    try {
      const body = { cityId: city.id, ...locForm };
      const url = editLocId
        ? `/api/admin/cms/locations/${editLocId}`
        : `/api/admin/cms/locations`;
      const res = await fetch(url, {
        method: editLocId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      setLocForm({
        id: "",
        type: "store",
        label: "",
        address: "",
        note: "",
        lat: "",
        lon: "",
        sortOrder: "0",
      });
      setEditLocId(null);
      onChanged();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Ошибка точки");
    }
  }

  async function deleteLocation(id: string) {
    if (!confirm("Удалить точку?")) return;
    try {
      const res = await fetch(`/api/admin/cms/locations/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      onChanged();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Ошибка");
    }
  }

  return (
    <div className="mt-8 border-t border-slate-200 pt-6">
      <h3 className="font-semibold text-slate-900">Точки на карте</h3>
      <ul className="mt-3 space-y-2">
        {locations.map((loc) => (
          <li
            key={loc.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
          >
            <span>
              {String(loc.label)} — {String(loc.address)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-[var(--color-primary)]"
                onClick={() => {
                  setEditLocId(String(loc.id));
                  setLocForm({
                    id: String(loc.id),
                    type: String(loc.type),
                    label: String(loc.label),
                    address: String(loc.address),
                    note: String(loc.note ?? ""),
                    lat: loc.lat != null ? String(loc.lat) : "",
                    lon: loc.lon != null ? String(loc.lon) : "",
                    sortOrder: String(loc.sortOrder ?? 0),
                  });
                }}
              >
                Изменить
              </button>
              <button
                type="button"
                className="text-red-600"
                onClick={() => deleteLocation(String(loc.id))}
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {(["id", "type", "label", "address", "note", "lat", "lon", "sortOrder"] as const).map(
          (key) => (
            <input
              key={key}
              type={NUMERIC_FIELDS.has(key) ? "number" : "text"}
              placeholder={LOCATION_FIELD_LABELS[key]}
              value={locForm[key]}
              onChange={(e) =>
                setLocForm((f) => ({ ...f, [key]: e.target.value }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          ),
        )}
      </div>
      <Button
        type="button"
        variant="secondary"
        className="mt-3"
        onClick={saveLocation}
      >
        {editLocId ? "Сохранить точку" : "Добавить точку"}
      </Button>
    </div>
  );
}
