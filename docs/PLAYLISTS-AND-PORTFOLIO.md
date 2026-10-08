# תיק עבודות YouTube + חיבור לעמודי שירות

## איפה הדברים יושבים (מקורות)

| קובץ | תפקיד |
|------|--------|
| `lib/data/video-catalog.generated.ts` | **מאגר מרכזי** -- ~270+ סרטונים (נוצר אוטומטית) |
| `scripts/import-portfolio.mjs` | ייבוא מקובץ `כותרת -> URL` לקטלוג |
| `scripts/portfolio-tag-rules.mjs` | תיוג אוטומטי + שיוך לפלייליסטים |
| `lib/data/video-playlists.ts` | הגדרת פלייליסטים לפי עמוד/שירות |
| `lib/data/video-portfolio.ts` | שליפת סרטונים לפי `playlistId` |
| `lib/data/youtube-embeds.ts` | ID בודד לכל מפתח שירות (hero / embed יחיד) |
| `lib/data/services.ts` | `playlistEmbedUrl` לעמודי registry |
| `lib/data/youtube-showcases.ts` | רשימות וידאו ידניות לעמודים ספציפיים |
| `app/portfolio/page.tsx` | עמוד תיק עבודות מרכזי `/portfolio` |

## זרימת עבודה מומלצת

1. **סרטונים חדשים בערוץ** -- הוסף לקובץ מקור (ברירת מחדל: `d:\active_portfolio.txt`):
   ```text
   כותרת הסרטון -> https://www.youtube.com/watch?v=XXXXXXXXXXX
   ```
2. הרץ: `npm run import:portfolio` (או עם נתיב לקובץ).
3. בדוק תיוגים ב-`lib/data/video-catalog.overrides.ts` אם צריך תיקון ידני.
4. וידאו ראשי לעמוד שירות בודד -- עדכן `youtube-embeds.ts` + `services.ts` אם צריך embed יחיד.
5. וידאו לעמוד עם כמה דוגמאות -- `youtube-showcases.ts` או `ShowcaseVideoSection` עם `playlistId`.
6. בדיקת תקינות: `npm run check:youtube` (מריץ `scripts/check-videos.mjs`, שסורק מפתחות וקישורים מלאים ב-lib, components ו-app; 515 IDs, 0 שבורים -- נכון ל-7.10.2026). הבדיקה רצה גם בתוך `preflight-deploy`.

## הוספת סרטון בודד או כמה סרטונים, בלי ייבוא (המסלול המומלץ, 8.10.2026)

`npm run import:portfolio` כותב מחדש את **כל** `video-catalog.generated.ts` מקובץ הטקסט. קובץ שמכיל רק סרטונים חדשים ימחק את שאר הקטלוג,
והמספר "272 סרטונים" נקרא מהקובץ הזה. לכן סרטונים בודדים נכנסים דרך `lib/data/video-catalog.supplement.ts`:

1. שורה חדשה ב-`PORTFOLIO_VIDEO_SUPPLEMENT`: `videoId` (11 תווים, מותר `-` ו-`_`), `title`, `youtubeUrl` (לשורט: `/shorts/`), `tags` (מתוך `PortfolioTag`) ו-`services`.
2. מי מציג אותו: פלייליסט שיש לו `requireAnyTag` בודק רק תגיות, וכל פלייליסט אחר בודק אם ה-id שלו נמצא ב-`services`.
   `studio-hub` מציג רק את `PLAYLIST_EXPLICIT_IDS` שלו, ולכן סרטון חדש לא יופיע בו בלי להוסיף אותו שם.
3. סדר: `PLAYLIST_FEATURED_IDS` ב-`video-catalog.overrides.ts`. מה שלא ברשימה ממוין לפי התו הראשון של המזהה ואז לפי הכותרת.
4. תאריך העלאה: `npm run sync:youtube-dates` (דורש רשת). בלעדיו ה-VideoObject מתפרסם בלי `uploadDate`, ו-Search Console מסמן אותו כלא תקף (6.10.2026).
   `lib/video-schema.test.ts` נכשל על supplement בלי תאריך.
5. בדיקות: `npm run check:youtube`, `npm run audit:portfolio-curation`, `npm test`.
6. פלייליסט חדש: `PlaylistId` ו-`VIDEO_PLAYLISTS` ב-`video-playlists.ts`, ו-`PORTFOLIO_HUB_PLAYLIST_ORDER` אם הוא מוצג ב-`/portfolio`. כשהוא מוצג בעמוד שירות: `<ShowcaseVideoSection playlistId="..." />`.

הספירה "272 סרטונים" לא כוללת את סרטוני ה-supplement.

## עמודים עם `playlistEmbedUrl: null` (מכוון)

| עמוד | סיבה |
|------|------|
| `/photography`, `/photography/wedding`, `/photography/events` | גלריית תמונות + וידאו ב-`youtube-showcases.ts` / `wedding-photography-page.ts` |

## עמודים שכבר מחוברים (לא צריך לשלוח שוב)

רוב עמודי השירות (סטודיו, ברכות, פודקאסט, קריינות, אירועים, אטרקציות, וידאו) -- יש `playlistEmbedUrl` או `ShowcaseVideoSection` עם `playlistId`.

`/studio` -- תיק עבודות דרך `StudioHubValueSection` + מאגר `studio-hub`.

`/portfolio` -- כל הפלייליסטים לפי נושא.

## פורמט לינקים

| סוג | דוגמה |
|-----|--------|
| סרטון | `https://www.youtube.com/watch?v=...` |
| פלייליסט | `https://www.youtube.com/playlist?list=PL...` → embed: `https://www.youtube.com/embed/videoseries?list=PL...` |

## תבנית שליחה (סרטונים חדשים)

```text
/portfolio או /studio/recording-song-modiin
YouTube: https://www.youtube.com/watch?v=...
הערה: [אופציונלי -- תיוג: bat-mitzvah / dj / podcast]
```

## מה עדיין מחוץ לקוד

- תיאור ערוץ YouTube, קישורי UTM בתיאורי סרטונים בערוץ
- החלפת וידאו ספציפי באולפן נייד אם יש סרטון ייעודי יותר מ-`UECS5GpAck4`
