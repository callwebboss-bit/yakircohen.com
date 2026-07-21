import type { PriceItemId } from "@/lib/data/pricing-catalog";

export type HomeIntentPath = {
  id: string;
  /** כותרת קצרה - מה המשתמש מחפש */
  title: string;
  /** תוצאה - מה מקבלים בסוף */
  outcome: string;
  /** עוגן מחיר מקטלוג המחירים */
  priceId?: PriceItemId;
  /** מחיר התחלתי כשאין פריט קטלוג מתאים (לפני מע״מ) */
  fromPriceExVat?: number;
  href: string;
};

/** 5 מסלולי כניסה לפי כוונת משתמש - מוצג מעל הקפל בדף הבית */
export const HOME_INTENT_PATHS: readonly HomeIntentPath[] = [
  {
    id: "studio",
    title: "אולפן הקלטות",
    outcome: "מקליטים באולפן במודיעין, יוצאים עם קובץ מוכן",
    priceId: "blessing_recording",
    href: "/studio",
  },
  {
    id: "podcast",
    title: "פודקאסט",
    outcome: "פרק מוקלט וערוך, מוכן להעלאה לספוטיפיי",
    priceId: "podcast_audio",
    href: "/podcast",
  },
  {
    id: "song",
    title: "הקלטת שיר",
    outcome: "קאבר או שיר מקורי, כולל ליווי מקצועי",
    priceId: "cover_song",
    href: "/studio/recording-song-modiin",
  },
  {
    id: "ai-sound",
    title: "שיפור סאונד AI",
    outcome: "שולחים קובץ, מקבלים אותו נקי - הכל מרחוק",
    priceId: "damaged_recording_rescue",
    href: "/online",
  },
  {
    id: "mobile-studio",
    title: "אולפן נייד",
    outcome: "מגיעים עם הציוד אליכם הביתה או למשרד",
    // מחיר הפתיחה מדף /studio/mobile-studio - אין פריט קטלוג תואם
    fromPriceExVat: 999,
    href: "/studio/mobile-studio",
  },
] as const;
