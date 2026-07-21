import type { PriceItemId } from "@/lib/data/pricing-catalog";

export type PricingComparisonRow = {
  id: string;
  /** שם המסלול בטבלה */
  title: string;
  /** מקור המחיר והתיאור - קטלוג המחירים בלבד */
  catalogId: PriceItemId;
  /** עמוד השירות הקנוני */
  href: string;
  /** תגית קיימת - רק אם נתמכת בנתונים (למשל featured באולפן) */
  badge?: string;
  /** יעד הזמנה כשאין מיפוי ב-pricing-book-map */
  bookHref?: string;
};

/**
 * טבלת השוואה בין המסלולים המרכזיים - מחירים ותיאורים
 * נמשכים מ-pricing-catalog. אין כאן מחירים או הבטחות חדשות.
 */
export const PRICING_COMPARISON_ROWS: readonly PricingComparisonRow[] = [
  {
    id: "studio-short",
    title: "אולפן - הקלטה קצרה",
    catalogId: "studio_half_hour",
    href: "/studio/recording-studio",
    // תואם ל-featured בחבילות האולפן
    badge: "הכי מבוקש",
  },
  {
    id: "blessing",
    title: "הקלטת ברכה",
    catalogId: "blessing_recording",
    href: "/studio/blessings",
  },
  {
    id: "podcast",
    title: "פודקאסט",
    catalogId: "podcast_audio",
    href: "/podcast",
  },
  {
    id: "song",
    title: "הקלטת שיר",
    catalogId: "song_package",
    href: "/studio/recording-song-modiin",
  },
  {
    id: "ai-remote",
    title: "שיפור סאונד AI מרחוק",
    catalogId: "damaged_recording_rescue",
    href: "/online/vocal-fix",
    // אין מיפוי ישיר ב-pricing-book-map - אותו יעד כמו מקטע ה-AI במחירון
    bookHref: "/book#online",
  },
  {
    id: "mobile",
    // תואם לתווית בקטלוג המחירים
    title: "פודקאסט בבית / אולפן נייד",
    catalogId: "mobile_podcast_at_home",
    href: "/podcast/mobile-podcast-at-home",
  },
] as const;
