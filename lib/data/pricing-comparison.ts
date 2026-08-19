import {
  getPriceById,
  getPriceTransparencyById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";

export type PricingComparisonCluster = "studio" | "podcast" | "online";

export type PricingComparisonRow = {
  id: string;
  /** שם המסלול בטבלה */
  title: string;
  /** מקור המחיר והתיאור - קטלוג המחירים בלבד */
  catalogId: PriceItemId;
  /** עמוד השירות הקנוני */
  href: string;
  cluster: PricingComparisonCluster;
  /** תגית קיימת - רק אם נתמכת בנתונים (למשל featured באולפן) */
  badge?: string;
  /** יעד הזמנה כשאין מיפוי ב-pricing-book-map */
  bookHref?: string;
};

/** פירוק מחיר מטקסט הקטלוג (included / scope) - בלי נוסחאות */
export function formatComparisonBreakdown(catalogId: PriceItemId): string {
  const transparency = getPriceTransparencyById(catalogId);
  if (transparency.included.length > 0) {
    return transparency.included.slice(0, 4).join(" + ");
  }
  const item = getPriceById(catalogId);
  return [item.scope?.duration, item.scope?.includes].filter(Boolean).join(" + ");
}

export const PRICING_COMPARISON_FILTERS: readonly {
  id: "all" | PricingComparisonCluster;
  label: string;
}[] = [
  { id: "all", label: "הכל" },
  { id: "studio", label: "אולפן" },
  { id: "podcast", label: "פודקאסט" },
  { id: "online", label: "אונליין" },
];

/**
 * טבלת השוואה בין המסלולים המרכזיים - מחירים ותיאורים
 * נמשכים מ-pricing-catalog. אין כאן מחירים או הבטחות חדשות.
 */
export const PRICING_COMPARISON_ROWS: readonly PricingComparisonRow[] = [
  {
    id: "blessing",
    title: "הקלטת ברכה",
    catalogId: "blessing_recording",
    href: "/studio/blessings",
    cluster: "studio",
  },
  {
    id: "song",
    title: "שיר מוכן באולפן",
    catalogId: "cover_song",
    href: "/studio/recording-song-modiin",
    cluster: "studio",
    badge: "הכי מבוקש",
  },
  {
    id: "song-pro",
    title: "שיר Pro",
    catalogId: "song_package",
    href: "/studio/recording-song-modiin",
    cluster: "studio",
  },
  {
    id: "podcast",
    title: "פודקאסט אודיו מוכן להפצה",
    catalogId: "podcast_audio",
    href: "/podcast",
    cluster: "podcast",
  },
  {
    id: "ai-remote",
    title: "שיפור סאונד AI מרחוק",
    catalogId: "damaged_recording_rescue",
    href: "/online/vocal-fix",
    cluster: "online",
    bookHref: "/book#online",
  },
  {
    id: "mobile",
    title: "פודקאסט בבית / אולפן נייד",
    catalogId: "mobile_podcast_at_home",
    href: "/podcast/mobile-podcast-at-home",
    cluster: "podcast",
  },
] as const;
