import type { PriceItemId } from "@/lib/data/pricing-catalog";
import { getExVat } from "@/lib/data/pricing-catalog";

export type MashupBundleId =
  | "ready_3"
  | "ready_5"
  | "ready_10"
  | "custom_3";

export type MashupBundleOffer = {
  id: MashupBundleId;
  title: string;
  description: string;
  count: number;
  pricingId: PriceItemId;
  singlePricingId: PriceItemId;
  tags?: readonly string[];
};

export const MASHUP_BUNDLE_OFFERS: readonly MashupBundleOffer[] = [
  {
    id: "ready_3",
    title: "3 מאשאפים מוכנים",
    description: "שלושה שילובים מהמאגר — לפתיחת עונה או לסט חדש בלי לשבת שבוע על עריכה.",
    count: 3,
    pricingId: "mashup_ready_pack_3",
    singlePricingId: "mashup_ready_single",
    tags: ["מוכן", "חיסכון"],
  },
  {
    id: "ready_5",
    title: "5 מאשאפים — עונת אירועים",
    description: "לדיג'יי עם לוח שנה מלא: חמישה קבצים מוכנים, כל אחד נבדק לפני מסירה.",
    count: 5,
    pricingId: "mashup_ready_pack_5",
    singlePricingId: "mashup_ready_single",
    tags: ["מוכן", "הכי נפוץ"],
  },
  {
    id: "ready_10",
    title: "10 מאשאפים — מאגר אישי",
    description: "בונים ספרייה משלך לשנה. הנחה משמעותית על רכישה בודדת.",
    count: 10,
    pricingId: "mashup_ready_pack_10",
    singlePricingId: "mashup_ready_single",
    tags: ["מוכן", "מקסימום חיסכון"],
  },
  {
    id: "custom_3",
    title: "3 מאשאפים מותאמים",
    description: "שלושה שילובים לפי בחירה — עד 3 ימי עסקים לכל אחד, עם סבב תיקון.",
    count: 3,
    pricingId: "mashup_custom_pack_3",
    singlePricingId: "mashup_custom_planned",
    tags: ["מותאם", "אולפן"],
  },
] as const;

export function getBundleRetailTotal(offer: MashupBundleOffer): number {
  return getExVat(offer.singlePricingId) * offer.count;
}

export function getBundleSaving(offer: MashupBundleOffer): number {
  return getBundleRetailTotal(offer) - getExVat(offer.pricingId);
}

export function getBundleById(id: MashupBundleId): MashupBundleOffer | undefined {
  return MASHUP_BUNDLE_OFFERS.find((b) => b.id === id);
}
