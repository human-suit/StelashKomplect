# Деплой на Netlify (демо)

1. Репозиторий: https://github.com/human-suit/StelashKomplect
2. [Netlify](https://app.netlify.com/) → Add new site → Import from Git
3. Build: `npm run build`, Publish: `.next`
4. **Environment variables** (Site settings):

```
SITE_URL=https://YOUR-SITE.netlify.app
ADMIN_PASSWORD=demo123
ORDER_EMAIL=your@email.com
```

Без `DATABASE_URL` CMS и заявки работают из файлов/fallback (демо-режим).

5. Deploy → получите URL вида `https://stellazhkomplekt.netlify.app`

Telegram webhook: `https://YOUR-SITE.netlify.app/api/telegram/webhook`
