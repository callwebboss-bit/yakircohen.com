# Vercel Firewall — Attack Challenge Mode

## Baseline latency (לפני ACM)

נמדד ב-2026-07-12 (3 דגימות ל-`https://yakircohen.com`):

| Sample | Time |
|--------|------|
| 1 | ~0.48s |
| 2 | ~0.40s |
| 3 | ~0.40s |

מדידה חוזרת:

```bash
curl -o /dev/null -s -w "Time: %{time_total}s code=%{http_code}\n" https://yakircohen.com
```

סף פעולה: אם אחרי ACM ה-delta מעל ~**500ms** → כבה ACM.

## Whitelist Configuration (חובה לפני ACM)

**מיקום:** Vercel → Project `yakircohen-site` → Firewall → Custom Rules  
(Hobby: עד **3** חוקים — לכן חוק אחד עם OR על כל הבוטים.)

### חוק פעיל

- **Name:** `Allow legitimate crawlers`
- **Action:** Bypass
- **User-Agent contains (OR):**  
  `Googlebot`, `bingbot`, `Applebot`, `DuckDuckBot`,  
  `facebookexternalhit`, `Twitterbot`, `LinkedInBot`, `WhatsApp`, `Slackbot`

### בדיקה

```bash
curl -H "User-Agent: Googlebot/2.1" -I https://yakircohen.com
# ציפיה: HTTP 200 (לא challenge)
```

## הפעלה / כיבוי ACM

**חשוב (Vercel):**
- הפעלה דרך Agent/API מוגבלת ל־**עד 24 שעות** (`attackModeActiveUntil`).
- CLI חוסם הפעלה non-interactive (`dangerous_operation_requires_user`) — צריך להריץ **בטרמינל אינטראקטיבי**.
- בדיקת `curl -H "User-Agent: Googlebot"` **אינה** Googlebot אמיתי (אין IP מאומת). ACM אמור לאפשר known bots אמיתיים; ספופינג UA עלול לקבל 403.

```bash
# הפעלה (אינטראקטיבי, עד 24h)
npx vercel firewall attack-mode enable --duration 24h

# כיבוי מיידי (rollback)
npx vercel firewall attack-mode disable --yes
```

**סטטוס נוכחי:** ACM **כבוי** אחרי ניסוי קצר (2026-07-13) — האתר חזר ל־200. Whitelist crawlers נשאר פעיל. להפעלה מחדש: רק אחרי שאתה מאשר, מהטרמינל שלך.

## ACM Checklist

- [ ] Whitelist (`Allow legitimate crawlers`) פעיל
- [ ] Latency בסיסית נמדדה
- [ ] ACM מופעל
- [ ] Googlebot עובר ללא challenge
- [ ] Link previews (Facebook / LinkedIn / WhatsApp)
- [ ] `/book` → WhatsApp + מייל
- [ ] Latency אחרי ACM: delta < 500ms
- [ ] מעקב GSC 24–48 שעות

## Rollback Plan

| תרחיש | פעולה |
|-------|--------|
| Googlebot / SEO נחסם | תקן whitelist; אם לא → `attack-mode disable` |
| Link preview ריק | הוסף UA לחוק; אם לא → disable |
| Latency > 500ms | `npx vercel firewall attack-mode disable --yes` |
| תלונות משתמשים על challenge | disable → בדיקה → הפעלה מחדש |

## Monitoring

- כשלי מייל / API: Sentry (Production alerts)
- Firewall: Vercel Dashboard → Firewall
- מיילים: Resend Dashboard → delivery
