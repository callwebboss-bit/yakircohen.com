# התראות מייל על לידים (Resend)

גיבוי אוטומטי בנוסף לוואטסאפ. בלי מפתחות -- האתר ממשיך לעבוד רק עם וואטסאפ.

## מצב Production (יעד)

| משתנה | ערך |
|-------|-----|
| `RESEND_API_KEY` | מפתח מהחשבון |
| `LEAD_NOTIFY_EMAIL` | `callwebboss@gmail.com` |
| `RESEND_FROM_EMAIL` | `יקיר כהן הפקות <mail@yakircohen.com>` |

פרויקט: **yakircohen-site** (לא `yakircohen-com`). אחרי שינוי env: **Redeploy**.

## אימות דומיין (חובה ל-Inbox)

Resend מוסיף רשומות על **`send`** ו-**`resend._domainkey`** — **לא** על ה-root.

### מה לא לגעת בו

- MX של Cloudflare Email Routing על `yakircohen.com`
- SPF root: `v=spf1 include:_spf.mx.cloudflare.net ~all`

### מה להוסיף (DNS only / grey cloud)

| Type | Name | Content | Priority |
|------|------|---------|----------|
| TXT | `resend._domainkey` | (הערך מ-Resend Dashboard / API) | — |
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | — |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:callwebboss@gmail.com` | — |

סקריפט (דורש טוקן Cloudflare עם **Zone → DNS → Edit**):

```bash
node scripts/add-resend-dns.mjs
```

אחרי 5–15 דק': Resend → Domains → `yakircohen.com` → **verified**.

## Lead Intelligence

ראה [LEAD-INTELLIGENCE.md](./LEAD-INTELLIGENCE.md) — ציון איכות, enrichment, כפילויות, תבניות אדמין, `/admin/leads`, webhooks ו-cron.

`mirrorWhatsAppLeadToEmail` מחבר וואטסאפ מורכב (book audience / pro wizard / escapes) גם ל-Resend.

## Checklist

- [ ] SPF על `send` בלבד (root SPF לא הוחלף)
- [ ] DKIM `resend._domainkey`
- [ ] DMARC `p=none`
- [ ] Domain status: verified
- [ ] env ב-Vercel Production
- [ ] Redeploy
- [ ] `/book` → מייל ב-Inbox (לא Spam)
- [ ] קבלת מייל ל-`mail@yakircohen.com` עדיין עובדת

## Rollback מיילים

- השבת/מחק `RESEND_API_KEY` ב-Vercel → האתר ממשיך על WhatsApp (`skipped: true`).
- אל תמחק MX/SPF של Cloudflare Email Routing.

## פרטיות

- לא שומרים לידים בבסיס נתונים -- רק שליחה ל-Resend.
- גוף ההודעה הוא אותו טקסט שנשלח לוואטסאפ.
- כשל מייל מדווח ל-Sentry; WhatsApp נפתח קודם בזרימת הטופס.
