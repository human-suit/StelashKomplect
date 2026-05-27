# Демо: Netlify + Render

## Важно

- **GitHub Pages** — только статика, без API/БД/админки. Для этого проекта не подходит.
- **Netlify** — хорошо для Next.js (SSR + serverless API), но БД нужна отдельно.
- **Render** — бесплатный web + PostgreSQL (удобно для полной демки).

Рекомендуемая схема для демо:

| Что | Где |
|-----|-----|
| Сайт Next.js | Netlify **или** Render Web Service |
| PostgreSQL | Render PostgreSQL (free) / Neon / Supabase free |

---

## 1. Репозиторий GitHub

Репозиторий: https://github.com/human-suit/StelashKomplect

---

## 2. Netlify (сайт)

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → Import from GitHub → `StelashKomplect`.
2. Build settings подхватятся из `netlify.toml`.
3. **Site settings → Environment variables** (обязательно для демо с БД):

| Переменная | Пример |
|------------|--------|
| `DATABASE_URL` | `postgresql://...` (Neon/Render/Supabase) |
| `ADMIN_PASSWORD` | пароль админки |
| `SITE_URL` | `https://ваш-сайт.netlify.app` |
| `TELEGRAM_BOT_TOKEN` | опционально |
| `TELEGRAM_CHAT_ID` | опционально |
| `ORDER_EMAIL` | опционально |

4. Deploy → после билда в Netlify shell (или локально с `DATABASE_URL`):

```bash
npx prisma migrate deploy
npm run db:seed-content
```

Без `DATABASE_URL` сайт откроется, но CMS/заявки из БД не заработают (fallback на файлы в репозитории).

---

## 3. Render (сайт + PostgreSQL на одном месте)

1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint** → подключить репозиторий, указать `render.yaml`.
2. Задать секреты в Dashboard: `ADMIN_PASSWORD`, Telegram, `SITE_URL` (URL Render-сервиса).
3. После деплоя — **Shell** на web-сервисе:

```bash
npx prisma migrate deploy
npm run db:seed-content
```

Free PostgreSQL на Render имеет лимиты; для долгой демки лучше Neon.

---

## 4. Бесплатная PostgreSQL (вне Render)

- [Neon](https://neon.tech) — удобно для Netlify + Prisma
- [Supabase](https://supabase.com) — free tier

Строку подключения вставить в `DATABASE_URL` на Netlify/Render.
