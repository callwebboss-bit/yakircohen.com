# פריסה — GitHub + Vercel + DNS ב-Cloudflare

מדריך ל-`yakircohen-site` (Next.js 16). **מבנה repo: א׳** — שורש ה-repo = שורש האתר (אין `root directory`).

**אסטרטגיית URLs:** [SEO-URL-STRATEGY.md](./SEO-URL-STRATEGY.md)  
**לפני עלייה:** [PRE-DEPLOY-CHECKLIST.md](./PRE-DEPLOY-CHECKLIST.md)

---

## 1. GitHub (פעם ראשונה)

```bash
cd yakircohen-site
git add .
git commit -m "Production site ready for yakircohen.com"
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

**שוטף:** `git add .` → `git commit` → `git push` — CI יריץ lint + audits + build.

---

## 2. Vercel — פרויקט **אחד** בלבד

### הבעיה שכבר תוקנה בתיעוד
אם נוצרו 3 פרויקטים על אותו repo (`yakircohen`, `yakircohen-com`, `yakircohen-com-rikr`) — כולם נכשלים / מתנגשים. **השאר רק `yakircohen-com`.**

### הגדרות (חובה)

1. [vercel.com](https://vercel.com) → פרויקט **`yakircohen-com`**
2. **Settings → General**
   - Framework Preset: **Next.js**
   - Root Directory: **ריק** (לא `yakircohen-site`)
   - Production Branch: **`main`**
3. **Settings → Build & Development**
   - Build Command: **ריק** (Vercel יריץ אוטומטית `vercel-build` מ-`package.json`)
   - או במפורש: `npm run build:full`
   - Install Command: `npm ci` (ברירת מחדל)
4. **Environment Variables** (Production + Preview):
   - `NODE_VERSION` = `22` (אופציונלי אם Vercel כבר על Node 22)

> **`vercel-build`** ב-`package.json` = `next build` + Pagefind (חיפוש באתר). בלי זה החיפוש לא יעבוד בפרודקשן.

### מחיקת פרויקטים מיותרים

Settings → **Delete Project** על:
- `yakircohen`
- `yakircohen-com-rikr`

### Deploy

Deployments → **Redeploy** (אחרי push ל-`main`).

**Preview:** כל push יוצר `https://yakircohen-com-*.vercel.app` — לבדוק לפני DNS.

---

## 3. DNS — Cloudflare (מ-Google Sites → Vercel)

הדומיין **כבר** ב-Cloudflare; מעבירים את התעבורה לאתר החדש.

### שלב א — חיבור דומיין ב-Vercel

1. Vercel → `yakircohen-com` → **Settings → Domains**
2. הוסף: `yakircohen.com` ו-`www.yakircohen.com`
3. Vercel יציג רשומות DNS נדרשות (לרוב CNAME / A)

### שלב ב — עדכון ב-Cloudflare DNS

[Cloudflare Dashboard](https://dash.cloudflare.com) → `yakircohen.com` → **DNS → Records**

| שם | סוג | ערך | Proxy |
|----|-----|------|-------|
| `@` | לפי מה ש-Vercel נתן | `cname.vercel-dns.com` או A records | לפי Vercel |
| `www` | CNAME | `cname.vercel-dns.com` | לפי Vercel |

**מחק / עדכן** רשומות ישנות של Google Sites (A/CNAME לכתובות Google).

### שלב ג — Redirect `www` → ללא www (מומלץ)

Cloudflare → **Rules → Redirect Rules** (או Page Rules):

- `www.yakircohen.com/*` → `https://yakircohen.com/$1` (301)

או השאר את Vercel לטפל ב-www אם הוגדר שם.

### SSL

Cloudflare → **SSL/TLS** → **Full (strict)**.

### מתי להחליף (מחר)

1. וודא ש-Preview / Production ב-Vercel **ירוק**
2. בדוק 5 עמודים ב-`*.vercel.app`
3. עדכן DNS ב-Cloudflare (שלב ב)
4. המתן 5–60 דק להפצה
5. בדוק `https://yakircohen.com`

---

## 4. אחרי עלייה לאוויר (10 דקות)

- [ ] `https://yakircohen.com/sitemap.xml`
- [ ] `https://yakircohen.com/robots.txt`
- [ ] חיפוש באתר (מילה: "פודקאסט")
- [ ] וואטסאפ מדף `/contact`
- [ ] Google Search Console → נכס → שליחת sitemap
- [ ] GA4 Realtime (`G-PVW4GMPNS4`)

---

## 5. פקודות מקומיות

| פקודה | מתי |
|--------|-----|
| `npm ci` | אחרי clone |
| `npm run lint` | לפני push |
| `npm run audit:images` | אחרי העלאת תמונות |
| `npm run audit:links` | לפני פריסה |
| `npm run audit:headings` | לפני פריסה |
| `npm run build:full` | לפני פריסה גדולה / אימות Pagefind |

---

## 6. משתני סביבה

| משתנה | חובה? | שימוש |
|--------|--------|--------|
| `GOOGLE_SITE_VERIFICATION` | לא | קוד אימות מ-Google Search Console → meta tag ב-`app/layout.tsx` |
| `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` | לא | מייל גיבוי ללידים |

אין `.env` חובה לפריסה. הקנוני: `lib/site-url.ts` → `https://yakircohen.com`.

---

## 7. תמונות

העלאה ל-`public/images/services/{תיקייה}/` — ללא שינוי קוד.  
מדריך: [public/images/services/README.md](../public/images/services/README.md)

---

עודכן: מאי 2026 · Vercel + Cloudflare DNS
