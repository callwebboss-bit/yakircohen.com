# תיק עבודות YouTube + חיבור לעמודי שירות

## איפה הדברים יושבים (מקורות)

| קובץ | תפקיד |
|------|--------|
| `lib/data/video-catalog.generated.ts` | **מאגר מרכזי** — ~270+ סרטונים (נוצר אוטומטית) |
| `scripts/import-portfolio.mjs` | ייבוא מקובץ `כותרת -> URL` לקטלוג |
| `scripts/portfolio-tag-rules.mjs` | תיוג אוטומטי + שיוך לפלייליסטים |
| `lib/data/video-playlists.ts` | הגדרת פלייליסטים לפי עמוד/שירות |
| `lib/data/video-portfolio.ts` | שליפת סרטונים לפי `playlistId` |
| `lib/data/youtube-embeds.ts` | ID בודד לכל מפתח שירות (hero / embed יחיד) |
| `lib/data/services.ts` | `playlistEmbedUrl` לעמודי registry |
| `lib/data/youtube-showcases.ts` | רשימות וידאו ידניות לעמודים ספציפיים |
| `app/portfolio/page.tsx` | עמוד תיק עבודות מרכזי `/portfolio` |

## זרימת עבודה מומלצת

1. **סרטונים חדשים בערוץ** — הוסף לקובץ מקור (ברירת מחדל: `d:\active_portfolio.txt`):
   ```text
   כותרת הסרטון -> https://www.youtube.com/watch?v=XXXXXXXXXXX
   ```
2. הרץ: `npm run import:portfolio` (או עם נתיב לקובץ).
3. בדוק תיוגים ב-`lib/data/video-catalog.overrides.ts` אם צריך תיקון ידני.
4. וידאו ראשי לעמוד שירות בודד — עדכן `youtube-embeds.ts` + `services.ts` אם צריך embed יחיד.
5. וידאו לעמוד עם כמה דוגמאות — `youtube-showcases.ts` או `ShowcaseVideoSection` עם `playlistId`.
6. בדיקת תקינות: `node scripts/check-youtube-ids.mjs` (325 IDs, 0 שבורים — נכון ליוני 2026).

## עמודים עם `playlistEmbedUrl: null` (מכוון)

| עמוד | סיבה |
|------|------|
| `/photography`, `/photography/wedding`, `/photography/events` | גלריית תמונות + וידאו ב-`youtube-showcases.ts` / `wedding-photography-page.ts` |

## עמודים שכבר מחוברים (לא צריך לשלוח שוב)

רוב עמודי השירות (סטודיו, ברכות, פודקאסט, קריינות, אירועים, אטרקציות, וידאו) — יש `playlistEmbedUrl` או `ShowcaseVideoSection` עם `playlistId`.

`/studio` — תיק עבודות דרך `StudioHubValueSection` + מאגר `studio-hub`.

`/portfolio` — כל הפלייליסטים לפי נושא.

## פורמט לינקים

| סוג | דוגמה |
|-----|--------|
| סרטון | `https://www.youtube.com/watch?v=...` |
| פלייליסט | `https://www.youtube.com/playlist?list=PL...` → embed: `https://www.youtube.com/embed/videoseries?list=PL...` |

## תבנית שליחה (סרטונים חדשים)

```text
/portfolio או /studio/recording-song-modiin
YouTube: https://www.youtube.com/watch?v=...
הערה: [אופציונלי — תיוג: bat-mitzvah / dj / podcast]
```

## מה עדיין מחוץ לקוד

- תיאור ערוץ YouTube, קישורי UTM בתיאורי סרטונים בערוץ
- החלפת וידאו ספציפי באולפן נייד אם יש סרטון ייעודי יותר מ-`UECS5GpAck4`
