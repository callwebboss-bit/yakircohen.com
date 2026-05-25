# רשימת בדיקה לפני פריסה סופית

עודכן: מאי 2026 · פרויקט `yakircohen-site`

## פריסה (GitHub + Cloudflare)

מדריך מלא: **[docs/DEPLOY.md](./DEPLOY.md)**

## סטטוס טכני (נבדק)

| בדיקה | סטטוס |
|--------|--------|
| `npm run build` (אחרי מחיקת `.next`) | ✅ עובר |
| ~91 עמודים סטטיים | ✅ |
| Breadcrumbs גלובליים + JSON-LD | ✅ |
| `npm run audit:headings` | הרץ לפני פריסה |
| `sitemap.xml` + `robots.txt` | ✅ |
| Redirects ישנים (`legacy-redirects`) | ✅ |
| דומיין קנוני `https://yakircohen.com` | ✅ ב-metadata |

---

## מה אתה עושה (תמונות)

ראה **[public/images/services/README.md](../public/images/services/README.md)** — תיקיות ריקות מוכנות עם `.gitkeep`.

**עדיפות העלאה:**

1. `events/dj-events/`
2. `events/equipment/` + `events/equipment/singer-amplification/`
3. `events/wedding-packages/`
4. `video/photo-slideshow/`
5. השלמה: `studio/blessings/bride-groom-blessing/`, `dj-course/`

---

## מה אפשר לעשות לפני פריסה (מלבד תמונות)

### חובה / מומלץ מאוד

- [ ] **פריסה ל-Cloudflare Pages** — ראה [DEPLOY.md](./DEPLOY.md) · חיבור דומיין `yakircohen.com`
- [ ] **בדיקת redirects** — דגימה מ-Google Search Console / Analytics (נתיבים ישנים)
- [ ] **טופס צור קשר** — היום מוביל לוואטסאפ; אין API לשליחת מייל — לוודא שזה מכוון
- [ ] **מספר וואטסאפ** — `lib/constants.ts` (`058-7555456`)
- [ ] **Google Search Console** — שליחת sitemap אחרי עלייה לאוויר
- [ ] **בדיקה ידנית בנייד** — דף בית, פודקאסט, DJ, contact, מחשבונים

### SEO ותוכן

- [ ] **מאמרי בלוג** — `lib/data/blog.ts` (מוגדרים בקוד, לא MDX)
- [ ] עמודים דקים יחסית (registry בלבד): `/events/host`, חלק מעמודי וידאו/צילום — אופציונלי להעשיר
- [ ] **Spotify בקריינות** — פלייליסטים מוטמעים; לוודא שהם שלך ולא דמו

### אנליטיקס ומעקב (חסר בקוד כרגע)

- [ ] Google Analytics 4 / Tag Manager — להוסיף ב-`app/layout.tsx` אם צריך
- [ ] Meta Pixel — אם יש קמפיינים בפייסבוק
- [ ] המרות וואטסאפ — UTM כבר בקישורים (`utm_campaign`)

### איכות קוד (לא חוסם build)

- [ ] `npm run lint` — 7 שגיאות (בעיקר `react/no-unescaped-entities` ב-`StageLedDjPageContent.tsx`)
- [ ] 14 אזהרות ESLint — אופציונלי לתקן

### אחרי העלאת תמונות

```bash
node scripts/audit-images.mjs
npm run build
```

בדיקה ויזואלית בעמודים שהיו עם "גלריה בקרוב".

---

## וידאו (YouTube)

כל ה-IDs ב-`lib/data/youtube-embeds.ts` — אין PLACEHOLDERים. עדכון סרטונים = עריכת הקובץ בלבד.

---

## פודקאסט — מחירון

- חבילת פתיחה: **750 ₪ / חצי שעה** (`PODCAST_STARTER_PRICE`)
- הפקה מלאה: **2,500 ₪** — עמוד `podcast-recording` בלבד

---

## פריסה (Cloudflare Pages)

```bash
npm run build
# חיבור Git → Cloudflare Pages — ראה DEPLOY.md
```

אין `.env` נדרש לבנייה בסיסית.
