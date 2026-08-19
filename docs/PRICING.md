# מחירון - עדכון מרכזי

## קובץ מקור

**`lib/data/pricing-catalog.ts`** - כל מחירי השירות (לפני מע״מ).

**`lib/data/pricing.ts`** - קבועים נגזרים (אולפן, אטרקציות, עריכת פודקאסט) + פונקציות `withVat()` / `formatExVatWithVat()`.

חבילות אשף ההקלטה (`/book`) נמשכות מהקטלוג. אין מחירון שני.

### זהות אולפן לצרכן (לפי תוצאה)

| מזהה | סכום (לפני מע״מ) | סכום (כולל מע״מ 18%) |
|------|------------------|----------------------|
| `blessing_recording` | 590 ₪ | 696 ₪ |
| `studio_remote` | 590 ₪ | 696 ₪ |
| `cover_song` (שיר מוכן / classic) | 990 ₪ | 1,168 ₪ |
| `song_package` (שיר Pro) | 1,480 ₪ | 1,746 ₪ |
| `studio_viral` | 1,950 ₪ | 2,301 ₪ |
| `studio_all_in` | 2,380 ₪ | 2,808 ₪ |
| `single_production` | 3,500 ₪ | 4,130 ₪ |

### שעת חדר (בלי עריכה) ופודקאסט

| מזהה | סכום (לפני מע״מ) | סכום (כולל מע״מ 18%) |
|------|------------------|----------------------|
| `studio_half_hour` | 750 ₪ | 885 ₪ |
| `studio_hour` | 1,500 ₪ | 1,770 ₪ |
| `podcast_audio` | 950 ₪ | 1,121 ₪ |
| `podcast_video` | 1,650 ₪ | 1,947 ₪ |
| `content_package` | 2,800 ₪ | 3,304 ₪ |
| `event_attraction_1` | 1,750 ₪ | 2,065 ₪ |

רשימה מלאה: `PRICING_CATALOG` ב-`lib/data/pricing-catalog.ts`.

## בדיקת תקינות

```bash
npm run audit:pricing
```

הסקריפט מאמת:
- חישוב מע״מ (18%) לכל מחיר בקטלוג
- התאמה בין `pricing.ts` ל-`pricing-catalog.ts`
- אזהרות על מחירים קשיחים כפולים ב-`lib/data/`

## מה מתעדכן אוטומטית

- `/studio/pricing` - `STUDIO_PRICING` ב-`lib/data/services.ts`
- אשף `/book` - `STUDIO_RECORDING_PACKAGES` ב-`lib/data/studio-recording-booking.ts`
- פודקאסט: `PODCAST_PACKAGES` ב-`lib/data/podcast-calculator.ts`
- מחשבון אטרקציות: `PRICING_TIERS` ב-`lib/data/attractions-calculator.ts`
- `/pricing` - `PRICING_HUB_SECTIONS` ב-`lib/data/pricing-hub.ts`
- הודעות WhatsApp - `lib/whatsapp-closing.ts` + `lib/booking-messages.ts`
- `public/llms.txt` (עדכון ידני מומלץ אחרי שינוי)
