# Деплой на Timeweb VPS (Nginx + SSL + PostgreSQL)

Домен: **stellazhkomplect.ru** (подставьте свой).

## 1. Сервер

- Ubuntu 22.04+, 1–2 GB RAM.
- Открыты порты **22**, **80**, **443**.
- DNS: A-запись домена → IP VPS.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx certbot python3-certbot-nginx postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 2. PostgreSQL

```bash
sudo -u postgres psql
```

```sql
CREATE USER stellazh WITH PASSWORD 'надёжный_пароль';
CREATE DATABASE stellazh_komplekt OWNER stellazh;
\q
```

В `.env` на сервере:

```env
DATABASE_URL=postgresql://stellazh:надёжный_пароль@127.0.0.1:5432/stellazh_komplekt
```

## 3. Код и сборка

```bash
sudo mkdir -p /var/www/stellazh-komplekt
sudo chown $USER:$USER /var/www/stellazh-komplekt
cd /var/www/stellazh-komplekt
git clone <ваш-репозиторий> .
cp .env.example .env
nano .env   # все переменные — см. .env.example
npm ci
npm run db:migrate
npm run db:seed-content
# если были заявки в data/orders.json — скопируйте файл и:
npm run db:import-orders
npm run build
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup
```

## 4. Nginx + HTTPS

```bash
sudo cp deploy/nginx-stellazh.conf.example /etc/nginx/sites-available/stellazhkomplect.ru
sudo ln -sf /etc/nginx/sites-available/stellazhkomplect.ru /etc/nginx/sites-enabled/
sudo nginx -t
sudo certbot --nginx -d stellazhkomplect.ru -d www.stellazhkomplect.ru
sudo systemctl reload nginx
```

Проверка: `https://stellazhkomplect.ru` открывается, `/admin` — по паролю.

## 5. Webhook Telegram

На сервере в `.env` должны быть:

```env
SITE_URL=https://stellazhkomplect.ru
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=случайная_строка_32+
```

```bash
cd /var/www/stellazh-komplekt
export $(grep -v '^#' .env | xargs)
npm run telegram:webhook
```

Проверка: напишите боту `/start` — должен ответить меню.

## 6. Webhook ЮKassa

В кабинете [yookassa.ru](https://yookassa.ru) → Настройки → Уведомления:

| Поле | Значение |
|------|----------|
| URL | `https://stellazhkomplect.ru/api/payments/yookassa/webhook` |
| События | `payment.succeeded`, `payment.canceled` |

В `.env` на сервере:

```env
YOOKASSA_SHOP_ID=...
YOOKASSA_SECRET_KEY=...
PAYMENT_TEST_MODE=false
```

После тестов отключите тестовый режим оплаты.

## 7. Обновление сайта

```bash
cd /var/www/stellazh-komplekt
git pull
npm ci
npm run db:migrate
npm run build
pm2 restart stellazh-site
```

## 8. SMTP (опционально)

Timeweb: `smtp.timeweb.ru`, порт **465**, SSL — см. `.env.example`.

## Хранение заявок

| Режим | Когда |
|-------|--------|
| `data/orders.json` | `DATABASE_URL` не задан (локальная разработка) |
| PostgreSQL | `DATABASE_URL` задан (продакшен) |

Импорт старых заявок: `npm run db:import-orders`.
