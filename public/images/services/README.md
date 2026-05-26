# העלאת תמונות לשירותים — מדריך

האתר טוען תמונות אוטומטית מתיקיות כאן. **אין צורך לערוך קוד** — רק לשים קבצים בנתיב הנכון.

## כללים טכניים

| נושא | המלצה |
|------|--------|
| פורמט | **WebP** (מועדף), או JPG/PNG |
| יחס | **4:3** (הגלריה חותכת ל-cover) |
| רוחב | 1200–1600px מספיק |
| שם קובץ | עברית או אנגלית עם מקפים — לדוגמה: `תקליטן בחתונה.webp` |
| כמות | 4–12 תמונות לעמוד שירות; 3–6 לעמוד משני |

שמות הקבצים הופכים לטקסט alt אוטומטי (נגישות + SEO).

## גלריה ראשית + ארכיון (בלי לערוך קוד)

| מיקום | מה מוצג באתר |
|--------|----------------|
| `public/images/services/{תיקייה}/` (קבצים **ישירות** בתיקייה, לא בתת-תיקייה) | תמונות ראשיות — מוצגות ראשונות בגלריה וב-Hero |
| שם עם `hero`, `cover`, `banner` או `ראש` | עדיפות לתמונת ה-Hero (אם יש כמה בשורש) |
| `public/images/services/{תיקייה}/archive/` **או** `.../arcive/` | תמונות נוספות — נטענות בלחיצה על **«הצג עוד … מהארכיון»** |

**איך לסדר מחדש:** העבר תמונות בין התיקייה הראשית ל-`archive` (או `arcive`) — האתר יזהה אוטומטית בבנייה הבאה. אין צורך לעדכן קוד.

**סדר התמונות:** בתוך כל תיקייה — מיון לפי שם קובץ (עברית). לשליטה בסדר: קידומות מספריות בשם, למשל `01-אולפן.webp`, `02-הקלטה.webp`.

**קישורים פנימיים בטקסט:** עריכה ב-`lib/internal-links/intro-segments.ts` (2–3 קישורים טבעיים לעמוד) — בלי לגעת ב-JSX של כל עמוד.

**דוגמה פודקאסט:** `/podcast` — 15 תמונות בשורש, 10 ב-`arcive/`.

**נתיב באתר:** `/images/services/{תיקייה}/{שם-קובץ}`  
לדוגמה: `public/images/services/events/dj-events/DJ בחתונה.webp` →  
`https://yakircohen.com/images/services/events/dj-events/DJ%20בחתונה.webp`

---

## תיקיות שחסרות תמונות (עדיפות להעלאה)

העלה לתיקיות האלה — כרגע מוצג "גלריה בקרוב" או רק וידאו:

| תיקייה | עמודים באתר |
|--------|-------------|
| `events/dj-events/` | [/events/dj-events](https://yakircohen.com/events/dj-events) |
| `events/equipment/` | [/events/equipment](https://yakircohen.com/events/equipment) |
| `events/equipment/singer-amplification/` | [/events/equipment/singer-amplification](https://yakircohen.com/events/equipment/singer-amplification) |
| `events/wedding-packages/` | [/events/wedding-attractions-packages](https://yakircohen.com/events/wedding-attractions-packages) |
| `video/photo-slideshow/` | [/photo-slideshow](https://yakircohen.com/photo-slideshow) |
| `voiceover/` | *(אופציונלי)* — כרגע קריינות משתמשת ב-`podcast/`; אם תרצה גלריה נפרדת, העלה לכאן ועדכן אותנו בקוד |
| `photography/events/` | *(אופציונלי)* — כרגע [/photography/events](https://yakircohen.com/photography/events) משתמש ב-`photography/wedding/` |
| `academy/music-production/` | *(אופציונלי)* — [/academy/music-production](https://yakircohen.com/academy/music-production) ללא גלריה כרגע (רק YouTube) |

---

## תיקיות שכבר מכילות תמונות (אפשר להשלים)

| תיקייה | כמות נוכחית | הערה |
|--------|-------------|------|
| `podcast/` | ראשי + `archive` או `arcive` | כל עמודי הפודקאסט — ראשי בגלריה, ארכיון ב«הצג עוד» |
| `studio/recording-song-modiin/` | 26 | הקלטת שיר, חלק מעמודי וידאו |
| `events/attractions/led-booth/` | 22 | במה LED + DJ — [/events/stage-led-dj](https://yakircohen.com/events/stage-led-dj) |
| `events/attractions/wedding-smoking-machine/` | 22 | עשן לחתונה + עשן כבד גדול |
| `events/attractions/cold-fireworks/` | 9 | |
| `events/attractions/confetti-cannon/` | 9 | |
| `events/attractions/bubble-machine/` | 7 | |
| `studio/blessings/video-clip/` | 6 | |
| `photography/wedding/` | 5+ | **שורש** = Best of Weddings (עד 12) · **`archive/`** = אירועים קטנים (עד 12) |
| `events/attractions/giant-balloons/` | 5 | |
| `studio/blessings/bar-mitzvah/` | 5 | |
| `studio/jerusalem/` | 4 | |
| `events/attractions/smoke-cannons-for-events/` | 4 | |
| `studio/hub/` | 8 | מרכז סטודיו + חלק מוידאו |
| `studio/blessings/bride-groom-blessing/` | 2 | **מומלץ להוסיף** |
| `dj-course/` | 1 | קורס DJ + קורס קריינות — **מומלץ להוסיף** |

`video/corporate-video/` — תיקייה קיימת; אם ריקה, העלה תמונות לסרטי תדמית.

---

## מיפוי מלא: תיקייה → שירות

| `assetsFolder` | דף עיקרי |
|----------------|----------|
| `studio/hub` | /studio, /video |
| `studio/recording-song-modiin` | /studio/recording-song-modiin, /video/event-filming |
| `studio/jerusalem` | /studio/studio-jerusalem |
| `studio/blessings/bar-mitzvah` | /studio/blessings/bar-mitzvah |
| `studio/blessings/bride-groom-blessing` | /studio/blessings/bride-groom-blessing |
| `studio/blessings/video-clip` | /studio/blessings/video-clip |
| `podcast` | כל /podcast/* |
| `dj-course` | /academy/dj-course, /voiceover/course |
| `events/dj-events` | /events/dj-events |
| `events/equipment` | /events/equipment |
| `events/equipment/singer-amplification` | /events/equipment/singer-amplification |
| `events/wedding-packages` | /events/wedding-attractions-packages |
| `events/attractions/*` | עמודי אטרקציות תחת /events/attractions/ |
| `video/photo-slideshow` | /photo-slideshow |
| `photography/wedding` | /photography/wedding (גלריה כפולה: שורש + archive), /photography/events |

---

## בדיקה אחרי העלאה

```bash
node scripts/audit-images.mjs
```

מציג תיקיות עלה עם מספר קבצים. אחר כך:

```bash
npm run build
```

---

## תיקייה `heavy-smoke/` (שורש services)

קיימת בדיסק אבל **לא מחוברת בקוד** — עשן כבד גדול משתמש ב-`events/attractions/wedding-smoking-machine/`. אפשר להעביר תמונות לשם או למחוק את התיקייה הישנה.
