# מחירון - עדכון מרכזי

## קובץ מקור

**`lib/data/pricing.ts`** - כל מחירי האולפן הבסיסיים:

| מפתח | סכום (לפני מע״מ) |
|------|------------------|
| `STUDIO_HALF_HOUR_NIS` | 750 ₪ - חצי שעה |
| `STUDIO_ONE_HOUR_NIS` | 980 ₪ - שעת אולפן |

מחירי אירועים/אטרקציות (נפרד): `EVENT_ATTRACTION_FROM_NIS` = 1,750 ₪

## מה מתעדכן אוטומטית

- `/studio/pricing` - `STUDIO_PRICING` ב-`lib/data/services.ts` (בונה מ-`pricing.ts`)
- פודקאסט: `PODCAST_STARTER_PRICE` ב-`lib/data/podcast-calculator.ts`
- מחשבון DJ: הקלטת שיר באולפן
- מחשבון הזמנות: פודקאסט בסיסי
- ניווט / חיפוש / Schema
- `public/llms.txt` (עדכון ידני מומלץ אחרי שינוי)

## חבילות שלא בקובץ הבסיסי

מחירי חבילות מורכבות (שיר מתנה 1,800 ₪, סינגל 3,500 ₪, אטרקציות וכו') עדיין ב-`lib/data/services.ts` או בקבצי מחשבונים ייעודיים - עדכנו שם או הרחיבו את `pricing.ts` לפי הצורך.
