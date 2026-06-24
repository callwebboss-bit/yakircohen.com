# מחירון - עדכון מרכזי

## קובץ מקור

**`lib/data/pricing-catalog.ts`** - כל מחירי השירות (לפני מע״מ).

**`lib/data/pricing.ts`** - קבועים נגזרים (אולפן, אטרקציות, עריכת פודקאסט) + פונקציות `withVat()` / `formatExVatWithVat()`.

| מזהה | סכום (לפני מע״מ) | סכום (כולל מע״מ 18%) |
|------|------------------|----------------------|
| `studio_half_hour` | 750 ₪ | 885 ₪ |
| `studio_hour` | 1,500 ₪ | 1,770 ₪ |
| `blessing_recording` | 590 ₪ | 696 ₪ |
| `podcast_audio` | 950 ₪ | 1,121 ₪ |
| `podcast_video` | 1,650 ₪ | 1,947 ₪ |
| `content_package` | 2,800 ₪ | 3,304 ₪ |
| `song_package` | 1,800 ₪ | 2,124 ₪ |
| `single_production` | 3,500 ₪ | 4,130 ₪ |
| `event_attraction_1` | 1,750 ₪ | 2,065 ₪ |

רשימה מלאה: `PRICING_CATALOG` ב-`lib/data/pricing-catalog.ts`.

## בדיקת תקינות

```bash
npm run audit:pricing
```

הסקריפט מאמת:
- חישוב מע״מ (18%) לכל מחיר בקטalog
- התאמה בין `pricing.ts` ל-`pricing-catalog.ts`
- אזהרות על מחירים קשיחים כפולים ב-`lib/data/`

## מה מתעדכן אוטומטית

- `/studio/pricing` - `STUDIO_PRICING` ב-`lib/data/services.ts`
- פודקאסט: `PODCAST_PACKAGES` ב-`lib/data/podcast-calculator.ts`
- מחשבון אטרקציות: `PRICING_TIERS` ב-`lib/data/attractions-calculator.ts`
- `/pricing` - `PRICING_HUB_SECTIONS` ב-`lib/data/pricing-hub.ts`
- הודעות WhatsApp - `lib/whatsapp-closing.ts` + `lib/booking-messages.ts`
- `public/llms.txt` (עדכון ידני מומלץ אחרי שינוי)

## חבילות שלא בקטalog

מחירי booking wizard (חבילות הקלטה מורכבות, שדרוגים) עדיין ב-`lib/data/studio-recording-booking.ts` ו-`lib/data/booking-calculator-services.ts`. להוספת מחיר חדש לקטalog -- עדכנו `pricing-catalog.ts` והריצו `npm run audit:pricing`.
