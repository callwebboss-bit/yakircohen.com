import type { DoorId } from "@/lib/data/intent-nav";
import type { PriceItemId } from "@/lib/data/pricing-catalog";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";

/**
 * ארבע הדלתות בראש דף הבית (D84) בסדר ובגודל של D93 (11.10.2026): שיר ומתנה
 * ופודקאסט ראשונות וגדולות, אירוע ולעסקים אחריהן וקטנות. בדלת השיר גם ברכה
 * מוקלטת ושובר מתנה, ובדלת הפודקאסט גם האולפן הנייד. השירותים שמחוץ לדלתות
 * יושבים בשורת "עוד" (D85), ושם גם הפקת סינגל (D93).
 *
 * המודול הזה לא נכנס למטען של כל עמוד: רק HomeHero (שרת) ו-SmartFormClient
 * (/book בלבד) מייבאים אותו. לכן הוא מייבא טיפוסים בלבד מהקטלוג, והמחירים
 * עצמם מחושבים ברכיב דרך ערוץ "page" (D86).
 *
 * כל קישור נושא data-door ו-data-door-item, ו-OutboundLeadTracker סופר ממנו
 * door_select. מזהי הפריטים זהים למזהי רצועת הכוונה כשזה אותו יעד.
 */

/** משפטי הדלתות במילים של הבעלים, מילה במילה, גם ב-/book. שיר ומתנה לפי D107 (12.10.2026): השעה ו"ביד" נאמרים על השיר בלבד, כי ברכה בלי הגבלת זמן ומוכנה תוך 24-48 שעות. פודקאסט: הנוסח שנבחר 11.10, כי "באותה שנייה" חל גם בבית (S1003-01) */
export const DOOR_SENTENCES = {
  "song-gift": "שיר, ברכה או שובר מתנה. את השיר מקליטים בשעה אחת, ויוצאים איתו ביד.",
  podcast: "מקליטים באולפן או אצלכם, ואת הפרק מקבלים באותה שנייה שמסיימים להקליט.",
} as const;

export type HomeDoorLink = {
  /** data-door-item */
  id: string;
  label: string;
  href: string;
};

export type HomeDoor = {
  door: Exclude<DoorId, "more">;
  prominence: "primary" | "secondary";
  /** מזהה הפריט של הקישור הראשי (data-door-item) */
  itemId: string;
  title: string;
  sentence: string;
  /** מחיר מהקטלוג, כולל מע״מ בלבד (D86). label אומר מה המחיר קונה */
  price?: { id: PriceItemId; from: boolean; label: string };
  /** כשאין מחיר: שורת עוגן בלי מספר */
  priceNote?: string;
  href: string;
  /** הכפתור היחיד של דלת גדולה. בדלת קטנה הכותרת עצמה היא הקישור */
  cta?: string;
  links: readonly HomeDoorLink[];
};

export const HOME_DOORS: readonly HomeDoor[] = [
  {
    door: "song-gift",
    prominence: "primary",
    itemId: "song",
    title: "שיר ומתנה",
    sentence: DOOR_SENTENCES["song-gift"],
    price: { id: "song_recording", from: false, label: "הקלטת שיר" },
    href: "/studio/recording-song-modiin",
    cta: "לפרטים על הקלטת שיר",
    links: [
      { id: "blessing", label: "ברכה מוקלטת", href: "/studio/blessings" },
      { id: "voucher", label: "שובר מתנה", href: "/matanot/gift-voucher" },
      { id: "gifts", label: "מתנות לפי אירוע", href: "/matanot" },
    ],
  },
  {
    door: "podcast",
    prominence: "primary",
    itemId: "podcast",
    title: "פודקאסט",
    sentence: DOOR_SENTENCES.podcast,
    /* D98: "פרק ערוך מ-1,121" */
    price: { id: "podcast_audio", from: true, label: "פרק ערוך" },
    href: "/podcast",
    cta: "לפרטים על הקלטת פודקאסט",
    links: [
      { id: "podcast-studio", label: "הקלטה באולפן", href: "/podcast/podcast-recording" },
      { id: "podcast-mobile", label: "אולפן נייד אצלכם", href: "/podcast/mobile-podcast-at-home" },
    ],
  },
  {
    door: "event",
    prominence: "secondary",
    itemId: "events",
    title: "אירוע",
    /* הנוסח של כרטיס החתונה ברצועת הכוונה בדף הבית, עד 11.10.2026 */
    sentence: "DJ, אטרקציות והגברה בחבילה אחת מספק אחד.",
    price: { id: "dj_premium", from: true, label: "DJ מהצוות" },
    href: "/events",
    links: [
      { id: "wedding", label: "חתונה", href: "/events/wedding-attractions-packages" },
      { id: "barmitzvah", label: "בר ובת מצווה", href: "/events/bar-mitzvah" },
    ],
  },
  {
    door: "business",
    prominence: "secondary",
    itemId: "business",
    title: "לעסקים",
    /* הנוסח של כרטיס העסקים ברצועת הכוונה בדף הבית, עד 11.10.2026 */
    sentence: "רילז, קריינות ופודקאסט עם חשבונית מס.",
    /* /business מתומחר לפני מע״מ (D86), ולכן בדף הבית בלי מספר. D62 */
    priceNote: `הצעה ${TIME_CLAIMS.quoteHour}`,
    href: "/business",
    links: [],
  },
] as const;

/** שורת "עוד" (D85, ו-D93 להפקת סינגל). data-door="more" */
export const HOME_MORE_LINKS: readonly HomeDoorLink[] = [
  { id: "online", label: "תיקון מרחוק", href: "/online" },
  { id: "voiceover", label: "קריינות", href: "/voiceover" },
  { id: "academy", label: "קורסים", href: "/academy" },
  { id: "video", label: "וידאו וצילום", href: "/video" },
  { id: "pricing", label: "מחירון", href: "/pricing" },
  { id: "single", label: "הפקת סינגל", href: "/studio/recording-studio" },
] as const;
