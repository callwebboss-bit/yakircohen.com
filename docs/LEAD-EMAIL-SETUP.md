# התראות מייל על לידים (Resend)

כל פנייה מטופס באתר נשלחת במייל לבעלים ונשמרת ב-`/admin/leads`. בלי מפתח תקין הטפסים מציגים מסך גיבוי (ראו Rollback).

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

אחרי 5 עד 15 דקות: Resend → Domains → `yakircohen.com` → **verified**.

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

## Webhook של Resend (עודכן 11.10.2026)

כתובת: `https://yakircohen.com/api/webhooks/resend`, עם הסוד `whsec_...` ב-`RESEND_WEBHOOK_SECRET`.
בלוח של Resend מסמנים את האירועים:

| אירוע | מה קורה באתר |
|---|---|
| `email.delivered` | נרשם "נמסר" על הליד (`deliveredAt`) |
| `email.opened`, `email.clicked` | נרשם "נפתח" (`openedAt`). הסטטוס לא משתנה, כי פתיחת המייל של הבעלים אינה פנייה ללקוח (D34) |
| `email.bounced`, `email.failed`, `email.complained`, `email.suppressed` | נרשם על הליד (`deliveryIssue`) ונשלחת התראה ל-Sentry (`[lead-delivery]`, תג `route=resend-webhook`) |
| `email.delivery_delayed` | נרשם על הליד, בלי התראה. Resend ממשיך לנסות |

רק המייל לבעלים נשמר על הליד (`resendEmailId`), ולכן רק הוא מעדכן את הליד.
בעמודה "מייל אליך" ב-`/admin/leads` רואים: נשלח, נמסר, נפתח, מתעכב, או ⚠ עם סוג הבעיה.

כשהשליחה עצמה נכשלת, הסטטוס והשגיאה של Resend נכתבים ללוג (`[lead-email-fail]`) ול-Sentry, בלי כתובות מייל ובלי פרטי לקוח.

**התזכורת היומית "[תזכורת 24ש] ליד לא נפתח" בוטלה ב-11.10.2026 (D95).** היא יצאה על כל ליד, כי מעקב הפתיחות של Resend כבוי כברירת מחדל.

## Rollback מיילים

- בלי `RESEND_API_KEY`, וגם בלי `ADMIN_WHATSAPP_ALERT` שעונה 2xx, הטפסים עונים 503 והגולש רואה את מסך הגיבוי (וואטסאפ, טלפון, ניסיון חוזר). זו לא כבר דרך שקטה לכבות מיילים.
- אל תמחק MX/SPF של Cloudflare Email Routing.

## פרטיות

- הלידים נשמרים ב-Upstash ל-90 יום (`LEAD_TTL_SECONDS`, `lib/leads/types.ts`). בלי Upstash הם נשמרים רק בזיכרון של ה-instance, ו-`/admin/leads` כמעט ריק.
- גוף ההודעה הוא אותו טקסט שנשלח לוואטסאפ.
- כשל מייל מדווח ל-Sentry, בלי שם, טלפון או גוף ההודעה.
