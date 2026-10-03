import type { PriceItemId } from "@/lib/data/pricing-catalog";

/* המוצרים בכרטיס Google Business של העסק, ממופים לקטלוג.
   למה זה קיים: ב-4.10.2026 הוזנו בכרטיס מחירים לפי מחירון ישן (שיר 990, שלוש
   אטרקציות 5,100, קליפ 750 לפני מע״מ), בזמן שהאתר כבר הציג 590, 5,521 ו-885.
   אין לנו גישה לכרטיס, ולכן הקובץ הזה הוא מקור האמת למה שצריך להופיע בו:
   `npm run gbp:prices` מדפיס את המחיר להזנה (כולל מע״מ, מהקטלוג) לכל מוצר,
   ומסמן איפה הכרטיס לא תואם. מחיר לצרכן מוצג כולל מע״מ (סעיף 17ד,
   docs/OWNER-DECISIONS-2026-10-02.md:26-29).

   gbpPriceNow הוא מה שמופיע בכרטיס לפי הדיווח האחרון של הבעלים. כשמעדכנים את
   הכרטיס, מעדכנים גם כאן, כדי שהבדיקה הבאה תראה "תקין". */

export type GbpProduct = {
  /** השם כפי שהוא בכרטיס */
  name: string;
  /** null: אין לו פריט בקטלוג, או שהמיפוי ממתין להחלטת הבעלים */
  catalogId: PriceItemId | null;
  /** העמוד באתר שהמוצר מקשר אליו */
  path: string | null;
  /** המחיר שמופיע היום בכרטיס */
  gbpPriceNow: number | null;
  reportedAt: string;
  note?: string;
};

export const GBP_PRODUCTS: readonly GbpProduct[] = [
  { name: "בועות סבון", catalogId: "event_attraction_1", path: "/events/attractions/bubble-machine", gbpPriceNow: 2000, reportedAt: "2026-10-04" },
  { name: "תותח קונפטי", catalogId: "event_attraction_1", path: "/events/attractions/confetti-cannon", gbpPriceNow: 2000, reportedAt: "2026-10-04" },
  { name: "פודקאסט וידאו", catalogId: "podcast_video", path: "/podcast", gbpPriceNow: 1947, reportedAt: "2026-10-04" },
  { name: "חבילת 3 אטרקציות לאירועים", catalogId: "event_attraction_3", path: "/events/attractions", gbpPriceNow: 5100, reportedAt: "2026-10-04" },
  { name: "הקלטת שיר", catalogId: "song_recording", path: "/studio/recording-song-modiin", gbpPriceNow: 990, reportedAt: "2026-10-04" },
  { name: "קליפ ערוך מהסשן באולפן", catalogId: "studio_session_clip_edited", path: "/studio/recording-song-modiin", gbpPriceNow: 750, reportedAt: "2026-10-04", note: "בכרטיס הוזן המחיר לפני מע״מ" },
  { name: "מצגת תמונות", catalogId: "growth_slideshow_70", path: "/photo-slideshow", gbpPriceNow: 1450, reportedAt: "2026-10-04", note: "מצגת גדילה, 70 תמונות (יקיר אישר 4.10). בכרטיס הוזן המחיר לפני מע״מ" },
  { name: "שיפור סאונד AI", catalogId: "damaged_recording_rescue", path: "/online", gbpPriceNow: 250, reportedAt: "2026-10-04", note: "הצלת הקלטות פגומות (יקיר אישר 4.10). בכרטיס הוזן המחיר לפני מע״מ" },
  { name: "פרוטוקול NeverMind", catalogId: null, path: "/academy/stuttering-course", gbpPriceNow: null, reportedAt: "2026-10-04", note: "עדיין נמכר (יקיר 4.10). ב-/academy מוצג 1,200 למפגש, מספר כתוב ביד ולא מהקטלוג. הוספה לקטלוג היא החלטת מחיר נפרדת" },
  { name: "מפגש אפיון", catalogId: null, path: null, gbpPriceNow: null, reportedAt: "2026-10-04", note: "עדיין נמכר (יקיר 4.10). אין לו עמוד ואין מחיר באתר. הוספה לקטלוג היא החלטת מחיר נפרדת" },
];
