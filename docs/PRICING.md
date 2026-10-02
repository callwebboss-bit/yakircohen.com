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
| `song_recording` (הקלטת שיר: הקלטה, מיקס ומאסטר, סשן של שעה, בלי תיקון זיופים) | 500 ₪ | 590 ₪ |
| `single_production` | 3,500 ₪ | 4,130 ₪ |

### הקלטת שיר: בסיס ושלוש תוספות (מ-2.10.2026)

לצרכן מציגים כולל מע״מ קודם, ובקטן לפני מע״מ. הסדר והרשימה מ-`PRICING_ADDON_LINKS.song_recording`.

| מזהה | סכום (לפני מע״מ) | סכום (כולל מע״מ 18%) | הערה |
|------|------------------|----------------------|------|
| `song_recording` | 500 ₪ | 590 ₪ | הבסיס, תמיד כלול |
| `song_pitch_coaching` | 300 ₪ | 354 ₪ | תיקון זיופים וטכנאי שמכוון ומנחה |
| `studio_session_clip_edited` | 750 ₪ | 885 ₪ | קליפ ערוך מהסשן |
| `song_pre_session_interview` | 500 ₪ | 590 ₪ | ראיון במתחם הפודקאסט, רק עם הקליפ (`requires`) |

הסכום הכולל הוא סכום השורות כולל מע״מ: 590 / 944 / 1,475 / 1,829 / 2,065 / 2,419 לששת השילובים החוקיים. בדיקה ב-`lib/data/song-offer.test.ts` מוודאת שהוא שווה ל-`withVat` של הסכום לפני מע״מ בכל שילוב.

### שעת חדר (בלי עריכה) ופודקאסט

| מזהה | סכום (לפני מע״מ) | סכום (כולל מע״מ 18%) |
|------|------------------|----------------------|
| `studio_half_hour` | 750 ₪ | 885 ₪ |
| `studio_hour` | 1,500 ₪ | 1,770 ₪ |
| `podcast_audio` | 950 ₪ | 1,121 ₪ |
| `podcast_video` | 1,650 ₪ | 1,947 ₪ |
| `content_package` | 2,800 ₪ | 3,304 ₪ |
| `event_attraction_1` | 1,750 ₪ | 2,065 ₪ |
| `studio_pitch_correction` | 300 ₪ | 354 ₪ |

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
- הקלטת שיר (הטופס בעמוד השיר, `/studio`, `/studio/pricing`, עמוד המתנות ו-`/book`) - `lib/data/song-offer.ts`, שקורא מהקטלוג בלבד
- אשף `/book` לברכה, הקלטה מרחוק וקריינות - `STUDIO_RECORDING_PACKAGES` ב-`lib/data/studio-recording-booking.ts`
- פודקאסט: `PODCAST_PACKAGES` ב-`lib/data/podcast-calculator.ts`
- מחשבון אטרקציות: `PRICING_TIERS` ב-`lib/data/attractions-calculator.ts`
- `/pricing` - `PRICING_HUB_SECTIONS` ב-`lib/data/pricing-hub.ts`
- הודעות WhatsApp - `lib/whatsapp-closing.ts` + `lib/booking-messages.ts`
- `public/llms.txt` - בלוק מחירי הפתיחה: `npm run sync:llms`, ונבדק ב-`npm run audit:llms-prices`
- JSON-LD של האתר - `npm run generate:schema`, ונבדק ב-`npm run audit:schema-prices`
- כלי הצעות המחיר של הבעלים - `npm run export:closer` (כותב ל-`../local-tools`, כולל `songOffer`)

## Overlay 2026-08-19 (החלטות נעולות לפרוסה הצרה)

- ברכה 590: בלי תיקון זיופים. שיר במתנה 990: עם מיקס, מאסטר ותיקון זיופים.
- הקלטה מרחוק 590: ניקוי + מיקס, בלי תיקון זיופים. תוספת `studio_pitch_correction` 300 ₪ (ברכה ומרחוק). `express` 300 ₪ נשאר קדימות בשיבוץ.
- שיר Pro: רשימת הסטילס נשארת. אין החלפה לטקסט המאסטר בלי אישור.
- כרטיסי שירות נשארים עם CTA וואטסאפ יחיד. אין sticky נוסף. אשף האולפן נשאר 3 שלבים.
- תצוגה: נוספת שורה `לפני מע״מ 18%` בלי למחוק `+ מע״מ` / כולל מע״מ.
- `CONTENT_REVIEW` בכותרת `lib/data/pricing-catalog.ts`.

## Overlay 2026-10-02 (הקלטת שיר: בסיס ותוספות)

ההחלטות המלאות והשאלות הפתוחות: `docs/OWNER-DECISIONS-2026-10-02.md`.

- `cover_song` (990), `song_package` (1,480), `studio_viral` (1,950) ו-`studio_all_in` (2,380) נמחקו מהקטלוג. קישורים ישנים עם `?catalog=` ממופים לבסיס ותוספות ב-`lib/data/song-offer-aliases.ts`.
- הקלטת שיר היא `song_recording` 500 ₪ לפני מע״מ (590 ₪ כולל): הקלטה, מיקס ומאסטר. תיקון זיופים לא כלול.
- תוספות: `song_pitch_coaching` 300, `studio_session_clip_edited` 750, `song_pre_session_interview` 500 (רק עם הקליפ).
- `studio_pitch_correction` 300 נשאר לברכה ולהקלטה מרחוק. `express_delivery` נשאר לצילום, ולא מוצע עם שיר.
- `studio_session_clip` 450 (גלם) נשאר לברכה ולאולפן נייד. הקליפ הערוך (750) עבר למזהה משלו, ו-`withEditing` ירד.
- תצוגה: כל עמוד שמציג את טופס השיר מציג את כל המחירים בו כולל מע״מ קודם. בעמודים העסקיים התצוגה נשארת לפני מע״מ.
- JSON-LD: הצעת השיר ב-590 עם `priceSpecification` של 500 ו-`valueAddedTaxIncluded: false`. ההצעה "מחירון מרכזי" ירדה (S28).
- llms.txt: שורת השיר ושלוש התוספות כולל מע״מ, עם המחיר לפני מע״מ בסוגריים.
- בלוג: טבלאות מחיר שמציגות שיר נבנות מהקטלוג עם כותרת "(כולל מע״מ)", ובפוסטים עם טווחי שוק נוספה פסקת "ומה אנחנו גובים".
- שומרים: `audit:prose-prices` מחפש גם ערכים של מזהים שנמחקו ומזהה סכום תלת-ספרתי ליד ₪. `audit:schema-prices` ו-`audit:llms-prices` מקבלים `withVat(exVat)` של אותו פריט.
