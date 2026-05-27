# StelashKomplect

Сайт «Стеллаж Комплект» на **Next.js 16** (каталог, корзина, сравнение, отзывы, CMS-админка, аналитика).

## Демо (бесплатный хостинг)

| Платформа | Что работает |
|----------|--------------|
| [Netlify](https://www.netlify.com/) | Сайт + API routes (нужны env в панели Netlify) |
| [Render](https://render.com/) | Полный Next.js + PostgreSQL (рекомендуется для демо) |

Подробно: [docs/deploy-netlify-render.md](docs/deploy-netlify-render.md). Продакшен: [docs/deploy-timeweb.md](docs/deploy-timeweb.md).

## Локальный запуск

```bash
npm install
cp .env.example .env.local
# заполните .env.local
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## `.env.local` (минимум)

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_WEBHOOK_SECRET=случайная_строка_32+
SITE_URL=https://stellazhkomplect.ru
ADMIN_PASSWORD=надёжный_пароль
ORDER_EMAIL=stellazh.komplekt@inbox.ru
```

Опционально SMTP — см. `.env.example`.

## Страницы

| URL | Описание |
|-----|----------|
| `/` | Главная |
| `/catalog`, `/catalog/[slug]` | Каталог |
| `/product/[slug]` | Товар |
| `/cart`, `/checkout` | Корзина и заявка |
| `/privacy` | Политика ПД |
| `/admin` | Заявки (пароль `ADMIN_PASSWORD`) |

## Telegram-бот (только Next.js)

| Сценарий | Как |
|----------|-----|
| Заявка с сайта | `/api/orders` → `TELEGRAM_CHAT_ID` |
| Клиент пишет боту | Webhook `/api/telegram/webhook` — меню, кнопки, `/start` |

После деплоя: `npm run telegram:webhook` (нужны `callback_query`).

Python **не используется**.

## Оплата на сайте (ЮKassa)

Оплата происходит на страницах сайта при оформлении заявки в `/checkout` (галочка
«Оплатить онлайн сейчас»). В Telegram уходит только информация из заказа (сумма,
кто/куда, состав).

Для проверки на маленькую сумму включите тестовый режим:

```env
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
PAYMENT_TEST_MODE=true
PAYMENT_TEST_AMOUNT_RUB=10
```

Webhook в кабинете ЮKassa: `https://ваш-домен.ru/api/payments/yookassa/webhook`

## Заявки

- **Продакшен:** PostgreSQL (`DATABASE_URL` в `.env`)
- **Локально без БД:** `data/orders.json`
- Миграции: `npm run db:migrate`, импорт заявок: `npm run db:import-orders`
- Контент (CMS): `/admin/content` — новости, база знаний, бренды, слайдер, города
- Импорт контента в БД: `npm run db:seed-content` или кнопка в админке
- Цены проверяются на сервере по каталогу
- Rate limit: 8 заявок / 15 мин с одного IP
- Просмотр: `/admin`

## Каталог

```bash
npm run catalog:merge      # пересобрать JSON
npm run catalog:images     # фото + merge
```

## Деплой (Timeweb VPS)

Пошагово: [docs/deploy-timeweb.md](docs/deploy-timeweb.md) — Nginx, SSL, PM2, PostgreSQL, webhook Telegram и ЮKassa.

## Дальше

- Роли manager/admin
- SMTP на Timeweb
