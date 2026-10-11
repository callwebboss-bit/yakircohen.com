# קבצי אודיו -- דוגמאות "לפני / אחרי"

התיקייה מכילה קבצי MP3 לנגני לפני/אחרי באתר. מקור האמת למיפוי: `lib/data/audio-demos.ts`.

כל קובץ: MP3, 20–60 שניות, מומלץ עד 2MB (נבדק ב-`npm run audit:audio-weight`). **שמות קבצים רגישים לאותיות גדולות/קטנות** (Linux/Vercel).

## קבצים קיימים (מוכנים)

| קובץ | שימוש | עמודים עיקריים |
|------|--------|----------------|
| `podcast-raw-sample.mp3` / `podcast-clean-sample.mp3` | ניקוי זום/פודקאסט | `/podcast`, עריכת פודקאסט, Online פודקאסט |
| `weber-before_01.mp3` / `weber-AFTER_01.mp3` | שחזור הקלטה פגומה/ישנה (קשה) | שחזור ארכיון, בלוג |
| `recording-raw-sample.mp3` / `recording-clean-sample.mp3` | ווקאל אולפן → מיקס+פיץ' | הקלטת שיר, הזמנה |
| `pitch-raw.mp3` / `pitch-tuned.mp3` | תיקון זיופים (דוגמה כללית) | תיקון זיופים Online |
| `Befor-pitch-yakir.mp3` / `After-Pitch-Present.mp3` | תיקון זיופים - שיר מתנה/מתננה (לפני קליפ) | תיקון זיופים, מתנות, הזמנה, מחירון אולפן |
| `pitch-remote-before.mp3` / `pitch-remote-after.mp3` | תיקון זיופים מרחוק (הקלטה שלא אצלנו) | תיקון זיופים Online |
| `bride-blessing-raw.mp3` / `bride-blessing-tuned.mp3` | ברכה + מוזיקת רקע | ברכת חתן/כלה |
| `dry-vocal-raw.mp3` / `full-production.mp3` | הפקה מלאה | הקלטת שיר |
| `before-rengtone.mp3` / `after-ringtone.mp3` | רינגטון | רינגטון מצחיק |
| `AI-patch-recommendation.mp3` | דמו AI (לא לפני/אחרי) | תיקון זיופים |
| `voiceover-other-narrator.mp3` / `voiceover-yakir-cohen.mp3` | השוואת זהות: קריין אחר מול יקיר כהן (לא לפני/אחרי עיבוד) | `/portfolio`, `/voiceover`, `/voiceover/services` |
> קבצי המקור של השוואת הקריינות (`NO+YAKIR`, `Yes_Vocal_Yakircohen`) הועתקו לשמות ה-URL-בטוחים למעלה. שמות עם רווחים או `+` לא עולים לאתר ישירות.

## מצב נוכחי: ייצוא מחדש של הבעלים, 11.10.2026

כל 21 הקבצים יוצאו מחדש (קוצרו ודויקו). הנפח הכולל ירד מ-31MB ל-16MB.
האורכים נמדדו בפענוח מלא (`afinfo`) והם גם מה ש-`audit:audio-weight` מדווח.

| זוג | לפני | אחרי |
|-----|------|------|
| שחזור הקלטה פגומה (`weber-*`) | 0:40 | 0:40 |
| פודקאסט זום (`podcast-*-sample`) | 0:06 | 0:07 |
| ווקאל באולפן (`recording-*-sample`) | 0:12 | 0:25 |
| תיקון זיופים כללי (`pitch-raw` / `pitch-tuned`) | 0:30 | 0:29 |
| שיר מתנה (`Befor-pitch-yakir` / `After-Pitch-Present`) | 0:47 | 0:47 |
| תיקון זיופים מרחוק (`pitch-remote-*`) | 0:39 | 0:45 |
| ברכת כלה (`bride-blessing-*`) | 1:15 | 1:35 |
| הפקה מלאה (`dry-vocal-raw` / `full-production`) | 1:10 | 1:15 |
| רינגטון (`before-rengtone` / `after-ringtone`) | 0:15 | 0:33 |
| דמו AI (`AI-patch-recommendation`) | 0:15 | |
| השוואת קריינות (`voiceover-other-narrator` / `voiceover-yakir-cohen`) | 0:22 | 0:36 |

ארבעה קבצים עדיין מעל 60 שניות והם רשומים ב-`KNOWN` ב-`scripts/audit-audio-weight.mjs`:
`bride-blessing-raw`, `bride-blessing-tuned`, `dry-vocal-raw`, `full-production`.
כולם מתחת ל-2MB. ההחלטה אם לקצר אותם היא של הבעלים.

## ממתינים להעלאה

| קובץ | שימוש | סטטוס |
|------|--------|--------|
| `voiceover-yakir-cohen-warm.mp3` | גרסה חמה ואנרגטית של יקיר להשוואת הקריינות (מקור: `YES YAKIR 2.mp3` - להעתיק לשם הזה) | מוסתר עד ש-`VOICEOVER_YAKIR_WARM_READY=true` ב-`voiceover-narrator-compare.ts` |

> **הערה מ-2.10.2026:** הדגמת כיוון ההגברה החיה (`singer-live-raw` / `singer-live-tuned`)
> הוסרה מהקוד. שני הקבצים מעולם לא הועלו, ובינתיים העמוד
> `/events/equipment/singer-amplification` רינדר שני נגנים שבורים.
> בהחלטת הבעלים: לא מחזיקים בקוד הדגמה בלי קבצים. אם הקבצים יופקו,
> מוסיפים את ההדגמה מחדש ל-`lib/data/audio-demos.ts` יחד איתם.
> `audit:audio-demo-coverage` אוכף את זה.

> **YouTube לדמו פודקאסט:** אחרי העלאה ליוטיוב, עדכנו `youtubeVideoId` ב-`lib/data/podcast-proof.ts`.

## איך מעלים

1. גררו MP3 ל-`public/audio/`.
2. ודאו שהשם **זהה** ל-registry (כולל `_`, מקפים, `.mp3`).
3. לדוגמת תיקון זיופים מרחוק: `Before-Pich.mp3` → `pitch-remote-before.mp3`, `After-Pich.mp3` → `pitch-remote-after.mp3`.
4. הריצו `npm run audit:audio` -- בודק יתומים, הפניות שבורות ו-case mismatch.

> עד ש-`singer-live-*` יועלו, העמוד הרלוונטי מציג "בקרוב". לפודקאסט -- חובה את `podcast-raw-sample` / `podcast-clean-sample` (ראו `podcast-proof.ts`).
