# קבצי אודיו -- דוגמאות "לפני / אחרי"

התיקייה מכילה קבצי MP3 לנגני לפני/אחרי באתר. מקור האמת למיפוי: `lib/data/audio-demos.ts`.

כל קובץ: MP3, 20–60 שניות, מומלץ עד 2MB. **שמות קבצים רגישים לאותיות גדולות/קטנות** (Linux/Vercel).

## קבצים קיימים (מוכנים)

| קובץ | שימוש | עמודים עיקריים |
|------|--------|----------------|
| `podcast-raw-sample.mp3` / `podcast-clean-sample.mp3` | ניקוי זום/פודקאסט | `/podcast`, עריכת פודקאסט, Online פודקאסט |
| `weber-before_01.mp3` / `weber-AFTER_01.mp3` | שחזור הקלטה פגומה/ישנה (קשה) | שחזור ארכיון, בלוג |
| `recording-raw-sample.mp3` / `recording-clean-sample.mp3` | ווקאל אולפן → מיקס+פיץ' | הקלטת שיר, הזמנה |
| `pitch-raw.mp3` / `pitch-tuned.mp3` | תיקון זיופים | תיקון זיופים Online |
| `pitch-remote-before.mp3` / `pitch-remote-after.mp3` | תיקון זיופים מרחוק (הקלטה שלא אצלנו) | תיקון זיופים Online |
| `bride-blessing-raw.mp3` / `bride-blessing-tuned.mp3` | ברכה + מוזיקת רקע | ברכת חתן/כלה |
| `dry-vocal-raw.mp3` / `full-production.mp3` | הפקה מלאה | הקלטת שיר |
| `before-rengtone.mp3` / `after-ringtone.mp3` | רינגטון | רינגטון מצחיק |
| `AI-patch-recommendation.mp3` | דמו AI (לא לפני/אחרי) | תיקון זיופים |

## ממתינים להעלאה

| קובץ | שימוש | סטטוס |
|------|--------|--------|
| `singer-live-raw.mp3` / `singer-live-tuned.mp3` | כיוון הגברה חיה | placeholder + "בקרוב" בעמוד |

> **YouTube לדמו פודקאסט:** אחרי העלאה ליוטיוב, עדכנו `youtubeVideoId` ב-`lib/data/podcast-proof.ts`.

## איך מעלים

1. גררו MP3 ל-`public/audio/`.
2. ודאו שהשם **זהה** ל-registry (כולל `_`, מקפים, `.mp3`).
3. לדוגמת תיקון זיופים מרחוק: `Before-Pich.mp3` → `pitch-remote-before.mp3`, `After-Pich.mp3` → `pitch-remote-after.mp3`.
4. הריצו `npm run audit:audio` -- בודק יתומים, הפניות שבורות ו-case mismatch.

> עד ש-`singer-live-*` יועלו, העמוד הרלוונטי מציג "בקרוב". לפודקאסט -- חובה את `podcast-raw-sample` / `podcast-clean-sample` (ראו `podcast-proof.ts`).
