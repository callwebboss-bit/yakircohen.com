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

- [ ] Google Search Console — הוסף נכס + שלח sitemap
- [ ] בדיקת 10 URLs מ-Search Console (ישנים מ-Google Sites)
- [ ] Meta Pixel / GA4 — אם יש קמפיינים (עדיין לא בקוד)

---

## מה לא חוסם DNS

- תמונות חסרות בתיקיות (גלריה "בקרוב" — האתר עובד)
- Spotify / פלייליסטים חסרים בחלק מהעמודים
- Meta Pixel
