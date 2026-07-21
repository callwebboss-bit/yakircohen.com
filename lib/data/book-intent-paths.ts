import { buildBookHref } from "@/lib/book-url";
import type { PriceItemId } from "@/lib/data/pricing-catalog";

export type BookIntentPath = {
  id: string;
  /** תווית קצרה - מה המשתמש מחפש */
  title: string;
  emoji: string;
  /** שורת הבדל אחת - מה שונה במסלול הזה */
  difference: string;
  /** עוגן מחיר מקטלוג המחירים; אם חסר - שורת הצעה במקום מחיר */
  priceId?: PriceItemId;
  /** תווית CTA תוצאתית */
  ctaLabel: string;
  href: string;
};

/**
 * כניסה לפי כוונה ב-/book - קיצור דרך לווויזארדים הקיימים.
 * ההפניות הן hash / catalog deep-links נתמכים; אין URL חדש.
 */
export const BOOK_INTENT_PATHS: readonly BookIntentPath[] = [
  {
    id: "studio",
    title: "אולפן",
    emoji: "🎤",
    difference: "מגיעים לאולפן במודיעין - שירים, ברכות וקריינות",
    priceId: "blessing_recording",
    ctaLabel: "תאמו אולפן - מחיר סופי מיד",
    href: buildBookHref("studio"),
  },
  {
    id: "podcast",
    title: "פודקאסט",
    emoji: "🎙️",
    difference: "הקלטה עד שעה, עריכה ומסירה לספוטיפיי",
    priceId: "podcast_audio",
    ctaLabel: "תאמו הקלטת פרק",
    href: buildBookHref("podcast"),
  },
  {
    id: "song",
    title: "הקלטת שיר",
    emoji: "🎵",
    difference: "עד 3 שעות אולפן, טיונינג ומיקס בסיסי",
    priceId: "song_package",
    ctaLabel: "קבלו מחיר לשיר",
    href: buildBookHref("studio", { catalog: "song_package" }),
  },
  {
    id: "mobile",
    title: "אולפן נייד",
    emoji: "🚐",
    difference: "מגיעים אליכם - הקלטה ועריכה בבית או במשרד",
    priceId: "mobile_podcast_at_home",
    ctaLabel: "קבלו הצעה להקלטה בבית",
    href: buildBookHref("podcast", { catalog: "mobile_podcast_at_home" }),
  },
  {
    id: "business",
    title: "עסק",
    emoji: "💼",
    difference: "B2B עם חשבונית מס - פודקאסט, תוכן והגברה",
    ctaLabel: "קבלו הצעת מחיר לעסק",
    href: buildBookHref("pro"),
  },
] as const;
