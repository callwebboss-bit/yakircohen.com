# רשימת בדיקה לפני העברת DNS (yakircohen.com)

עשה לפי הסדר. סמן ✓ רק אחרי שבדקת בדפדפן.

---

## 1. Vercel Production (חובה)

- [ ] ב-[Vercel Dashboard](https://vercel.com) → פרויקט **yakircohen-com** → **Deployments**
- [ ] הדיפלוי האחרון מ-`main` = **Ready** (לא Failed / Canceled)
- [ ] **Promote to Production** על הדיפלוי הנכון אם צריך
- [ ] פתח `https://yakircohen-com.vercel.app` — רואים **דף בית אמיתי** (לא "Create Next App")
- [ ] בדוק: `/book`, `/pricing`, `/studio/pricing`, `/podcast`, `/events/dj-events`

---

## 2. Build מקומי / CI

- [ ] `npm run build:full` עובר (כולל Pagefind)
- [ ] GitHub Actions ירוק על `main`

---

## 3. חיפוש באתר (Pagefind)

אחרי `build:full` או על האתר החי:

- [ ] פתח חיפוש באתר (אייקון חיפוש / שדה חיפוש)
- [ ] חפש: `מחירון` → מופיע `/pricing` או `/studio/pricing`
- [ ] חפש: `הזמנה` → מופיע `/book`
- [ ] חפש: `פודקאסט` → עמודי podcast
- [ ] חפש כותרת מאמר חדש (למשל `הזמנת פודקאסט`)

---

## 4. טפסים ולידים

- [ ] `/book` — אשף הקלטות: שליחה לוואטסאפ + מסך אישור
- [ ] `/book#podcast` ו-`/book#events` — אותו דבר
- [ ] `/contact` — וואטסאפ
- [ ] (אופציונלי) מייל גיבוי — ראה [LEAD-EMAIL-SETUP.md](./LEAD-EMAIL-SETUP.md)

---

## 5. SEO טכני

- [ ] `https://yakircohen-com.vercel.app/sitemap.xml` נפתח
- [ ] `https://yakircohen-com.vercel.app/robots.txt` — Allow + sitemap
- [ ] דגימה: View Source על דף בית — יש `og:title`, `og:description`, canonical
- [ ] Redirect ישן: `/order` → `/book`, `/price` → `/pricing` (בדפדפן)

---

## 6. נייד ומהירות

- [ ] דף בית + `/book` בטלפון (גלילה, כפתורים, וואטסאפ)
- [ ] Lighthouse מהיר (אופציונלי) — דף בית

---

## 7. תוכן (מלבד תמונות)

- [ ] מחירים עקביים: `/pricing`, `/studio/pricing`, מחשבונים
- [ ] ביקורות Google / מקומי — דף בית
- [ ] עמודים מרכזיים לא "ריקים" מדי

---

## 8. משתני סביבה ב-Vercel (לפני DNS)

| משתנה | נדרש? |
|--------|--------|
| `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` | רק למייל לידים |
| `SITE_URL` | בדרך כלל לא — קנוני בקוד |

---

## 9. Cloudflare DNS (רק אחרי שסעיף 1 עבר)

- [ ] ב-Vercel: Domains → `yakircohen.com` + `www` מחוברים
- [ ] ב-Cloudflare: CNAME `@` או A לפי הוראות Vercel
- [ ] **Proxy: DNS only (ענן אפור)** — לא כתום בהתחלה
- [ ] המתן 5–60 דקות → בדוק `https://yakircohen.com`

---

## 10. אחרי שהאתר חי על הדומיין

### Google Search Console (חובה)

1. [ ] [search.google.com/search-console](https://search.google.com/search-console) → הוסף נכס `https://yakircohen.com`
2. [ ] אימות דומיין — העתק את קוד האימות מ-GSC ל-Vercel:
   - **Settings → Environment Variables** → `GOOGLE_SITE_VERIFICATION` = הקוד (בלי `google-site-verification=` prefix)
   - פרוס מחדש → בדוק View Source שיש `<meta name="google-site-verification" ...>`
3. [ ] **Sitemaps** → שלח `https://yakircohen.com/sitemap.xml` (חייב להחזיר 200)
4. [ ] **URL Inspection** — בדוק 10 כתובות ישנות מ-Google Sites (ראה `lib/legacy-redirects.ts`)
5. [ ] **Pages / Coverage** — ודא שאין שגיאות אינדוקס המוניות אחרי שבוע

### Google Business Profile (חובה ל-Local SEO)

1. [ ] [business.google.com](https://business.google.com) — עדכן שעות, תמונות, שירותים, קישור לאתר
2. [ ] ודא שכתובת `עמק איילון 34, מודיעין` תואמת ל-schema באתר
3. [ ] פרסם פוסט שבועי (מחירון, מאמר חדש, וידאו מיוטיוב)
4. [ ] עודד 2–3 ביקורות חדשות בחודש מלקוחות מרוצים
5. [ ] ודא שדירוג באתר (`4.9` / `150+`) תואם ל-GBP — עדכן `lib/constants.ts` אם השתנה

### תוכן שוטף (SEO לאורך זמן)

1. [ ] **2–4 מאמרי בלוג בחודש** — `content/blog-queue.json` → `npm run ingest:blog` → `npm run sync:blog-slugs`
2. [ ] כל מאמר חדש: 2–3 קישורים פנימיים לעמודי שירות (`/book`, `/studio/...`, `/podcast/...`)
3. [ ] עמודי גיאו נוספים לפי ביקוש (דוגמה קיימת: `/dj-events/cities/jerusalem`)
4. [ ] תיאורי YouTube עם קישור לעמוד הרלוונטי באתר (לא רק לדף הבית)

### אנליטיקס

- [ ] GA4 Realtime (`G-PVW4GMPNS4`) — כבר בקוד
- [ ] Meta Pixel — אם יש קמפיינים (עדיין לא בקוד)

---

## מה לא חוסם DNS

- תמונות חסרות בתיקיות (גלריה "בקרוב" — האתר עובד)
- Spotify / פלייליסטים חסרים בחלק מהעמודים
- Meta Pixel
