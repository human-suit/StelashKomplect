# Деплой на Render (демо, полный функционал)

1. [Render](https://dashboard.render.com/) → New → Web Service → Connect repo
2. **PostgreSQL** (Free) → Create database → скопировать Internal Database URL
3. Environment:

```
NODE_VERSION=20
SITE_URL=https://stellazhkomplekt.onrender.com
DATABASE_URL=<из Render PostgreSQL>
ADMIN_PASSWORD=demo123
ORDER_EMAIL=your@email.com
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

4. Build: `npm install && npx prisma generate && npm run build`
5. Start: `npm start`
6. После деплоя: `npm run db:migrate` и `npm run db:seed-content` (в Render Shell или локально с DATABASE_URL)

URL: `https://stellazhkomplekt.onrender.com`
