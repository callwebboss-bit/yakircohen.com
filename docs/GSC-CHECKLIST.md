# Google Search Console -- רשימת פעולה

עודכן: יוני 2026 · לאחר פריסת SEO ל-`yakircohen.com`

## שבוע 1 -- הגדרה ואימות

### 1. שליחת Sitemap

1. [Google Search Console](https://search.google.com/search-console) → נכס `yakircohen.com`
2. **Sitemaps** → הוסף: `https://yakircohen.com/sitemap.xml`
3. וודא סטטוס **Success** (יכול לקחת 24–48 שעות)

### 2. בקשת אינדוקס -- Top 7

בכל URL: **URL Inspection** → **Request indexing**

| עדיפות | URL |
|--------|-----|
| 1 | `/studio/recording-song-modiin` |
| 2 | `/studio/recording-studio` |
| 3 | `/podcast/podcast-recording` |
| 4 | `/podcast/podcast-studio-modiin` |
| 5 | `/events/dj-events` |
| 6 | `/events/wedding-attractions-packages` |
| 7 | `/pricing` |

### 2b. בקשת אינדוקס -- B2B חדש (שלב 1)

| עדיפות | URL |
|--------|-----|
| 1 | `/business` |
| 2 | `/business/content-studio` |
| 3 | `/podcast/self-service-studio` |

### 2d. בקשת אינדוקס -- B2B שלב 2+3 (חדש)

| עדיפות | URL |
|--------|-----|
| 1 | `/business/on-site-studio` |
| 2 | `/business/corporate-songs` |
| 3 | `/business/audio-branding` |
| 4 | `/business/audiobooks` |
| 5 | `/online/legacy-digitization` |

### 2e. בקשת אינדוקס -- שלב 4 (חדש)

| עדיפות | URL |
|--------|-----|
| 1 | `/academy/ulpan` |
| 2 | `/academy/workshops` |
| 3 | `/online/transcription` |
| 4 | `/online/voice-cloning` |
| 5 | `/business/employer-branding` |

### 2f. בקשת אינדוקס -- מאמרי בלוג B2B (שלב 3c)

| עדיפות | URL |
|--------|-----|
| 1 | `/blog/corporate-content-studio-guide` |
| 2 | `/blog/on-site-podcast-studio-business` |
| 3 | `/blog/corporate-song-production-guide` |
| 4 | `/blog/audiobook-recording-israel-guide` |
| 5 | `/blog/audio-branding-for-business` |
| 6 | `/blog/vhs-tape-digitization-ai-guide` |

### 2c. בקשת אינדוקס -- שירותים מקצועיים (חדש)

| עדיפות | URL |
|--------|-----|
| 1 | `/pro` |
| 2 | `/events/dj/voice-tags` |
| 3 | `/events/equipment/dry-hire` |
| 4 | `/podcast/bulk-production` |
| 5 | `/online/mashup-fixer` |
| 6 | `/podcast/studio-in-a-box` |
| 7 | `/events/dj/pre-built-sets` |
| 8 | `/events/equipment/system-tuning` |
| 9 | `/pro/event-index` |

### 3. Rich Results Test

[Rich Results Test](https://search.google.com/test/rich-results)

| URL | לבדוק |
|-----|--------|
| `/studio/recording-song-modiin` | Service, FAQPage, BreadcrumbList |
| `/podcast/podcast-recording` | Service, FAQPage |
| `/about/faq` | FAQPage |
| `/events/dj/voice-tags` | Service, FAQPage |
| `/pro` | Hub + קישורים לשירותים |

> BreadcrumbList מוזרק client-side -- אם לא מופיע ב-View Source, בדוק ב-Rich Results אחרי רינדור.

### 4. Facebook Sharing Debugger

[Sharing Debugger](https://developers.facebook.com/tools/debug/)

| URL | לבדוק |
|-----|--------|
| `/` | hook במודיעין ב-60 תווים ראשונים |
| `/book` | OG image 1200×630, `images/og/book.webp` |
| `/studio` | `images/og/studio.webp` |
| `/podcast` | `images/og/podcast.webp` |
| `/events` | `images/og/events.webp` (אם קיים) |
| `/pricing` | `images/og/pricing.webp` |

לחץ **Scrape Again** אחרי כל deploy.

**Share hooks (מקומי):** `npm run audit:share` -- Tier 1. `node scripts/audit-share-descriptions.mjs --all` -- כל השירותים.

---

## מעקב שבועי (KPIs)

| מדד | איפה | מטרה |
|-----|------|------|
| Impressions לפי hub | Performance → Pages (סנן `/studio`, `/podcast`, `/events`, `/book`) | עלייה שבועית |
| `/thank-you` | Coverage / Removals | יורד מאינדוקס (noindex) |
| שגיאות Schema | Enhancements | 0 שגיאות חדשות |
| CTR לפי hub | Performance | מעקב, לא חובה בשבוע 1 |

### תבנית בדיקה שבועית (~15 דק)

```
[ ] GSC Performance -- impressions שבוע אחרון vs קודם
[ ] /thank-you -- לא מופיע ב-Indexed pages
[ ] Coverage -- אין spike בשגיאות 404
[ ] דף אחד ב-Rich Results (רוטציה)
[ ] מאמר בלוג חדש? → sync:blog-slugs → IndexNow
```

---

## אחרי כל Deploy

```bash
npm run verify:seo
```

POST ל-IndexNow (ראה [DEPLOY.md](./DEPLOY.md#8-indexnow-אחרי-deploy)):

```bash
curl -X POST https://yakircohen.com/api/indexnow \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## חודשי

- `npm run audit:orphans` + `npm run audit:links`
- עדכון קישורים פנימיים בעמודים דקים (`/events/host`, וידאו/צילום)

---

## ניקוי 404 / Sitemaps ישנים / Noindex

דוחות SEO גנריים (כולל ChatGPT/Gemini) נוטים להציע פעולות בסגנון WordPress
שלא רלוונטיות לאתר Next.js הזה. הנה איך לקרוא נכון את הדוח ולמה שכן צריך לתקן:

### Sitemaps ישנים (sitemap2.xml–sitemap9.xml)

אלו שרידים מה-WordPress/HTTP הישן ואינם מוזכרים בקוד בכלל -- ה-sitemap הקנוני
היחיד הוא `https://yakircohen.com/sitemap.xml` (נוצר דינמית ב-`app/sitemap.ts`).
**אין שינוי קוד** -- יש למחוק את ה-sitemaps הישנים ידנית ב-GSC → Sitemaps.

### דפי noindex

בקוד יש בדיוק 4 דפים עם `noindex` מכוון:

| דף | קובץ |
|----|------|
| `/thank-you` | `app/thank-you/page.tsx` |
| 404 (כל דף לא קיים) | `app/not-found.tsx` |
| `/online/vocal-fix/send-file` | `app/online/vocal-fix/send-file/page.tsx` |
| `/blog` עמוד 2+ | `app/(blog)/blog/page.tsx` |

אם GSC מציג רשימת noindex גדולה יותר (למשל 62 דפים) -- אלו כנראה דפים ישנים
מהמיגרציה או preview deployments של Vercel, ולא משהו לתקן בקוד. ההצגה
תתעדכן לאחר recrawl.

### 404 cleanup workflow

1. GSC → **Page indexing → Not found (404)** → ייצוא הרשימה (CSV)
2. הרץ: `npm run audit:404 -- path/to/export.csv`
   - **"Already handled"** = רשומה ישנה ב-GSC, redirect/route כבר קיים, תיעלם אחרי recrawl
   - **"Needs a new redirect"** = פער אמיתי -- הוסף ערך מתאים ל-`LEGACY_PATH_MAP`/`OLD_ENGLISH_SLUGS`/`HEBREW_SERVICE_SLUGS` ב-`lib/legacy-redirects.ts`
3. הרץ `npm run audit:redirects` -- מאתר שרשראות redirect (A→B→C) ומקורות כפולים שנוצרו בטעות
4. בקש reindex לדפים שתוקנו

### robots.txt

ההצעות הגנריות (`Disallow: /wp-admin/`, `/cart/`, `/checkout/`, `/wp-includes/` וכו')
**לא רלוונטיות** -- אין WordPress באתר הזה. `app/robots.ts` הוא מקור האמת,
מוגדר נכון (allow הכל, disallow רק `/api/`, sitemap מוצהר), ואין לשנות אותו
לפי הצעות גנריות כאלה.
