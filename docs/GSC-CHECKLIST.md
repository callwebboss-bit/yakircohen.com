# Google Search Console — רשימת פעולה

עודכן: יוני 2026 · לאחר פריסת SEO ל-`yakircohen.com`

## שבוע 1 — הגדרה ואימות

### 1. שליחת Sitemap

1. [Google Search Console](https://search.google.com/search-console) → נכס `yakircohen.com`
2. **Sitemaps** → הוסף: `https://yakircohen.com/sitemap.xml`
3. וודא סטטוס **Success** (יכול לקחת 24–48 שעות)

### 2. בקשת אינדוקס — Top 7

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

### 3. Rich Results Test

[Rich Results Test](https://search.google.com/test/rich-results)

| URL | לבדוק |
|-----|--------|
| `/studio/recording-song-modiin` | Service, FAQPage, BreadcrumbList |
| `/podcast/podcast-recording` | Service, FAQPage |
| `/about/faq` | FAQPage |

> BreadcrumbList מוזרק client-side — אם לא מופיע ב-View Source, בדוק ב-Rich Results אחרי רינדור.

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

**Share hooks (מקומי):** `npm run audit:share` — Tier 1. `node scripts/audit-share-descriptions.mjs --all` — כל השירותים.

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
[ ] GSC Performance — impressions שבוע אחרון vs קודם
[ ] /thank-you — לא מופיע ב-Indexed pages
[ ] Coverage — אין spike בשגיאות 404
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
