/**
 * תמחור אטרקציות לעמודי שיווק - מסונכרן עם events-booking.ts ו-/book#events.
 */

import { getExVat } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";
import { formatPrice } from "@/lib/data/pricing-display";
import type { ServicePricingTier } from "@/lib/data/services";
import {
  DOUBLE_QUANTITY_SURCHARGE,
  EVENT_BOOKING_ITEMS,
  EVENT_GIFT_THRESHOLD,
  EVENT_SINGLE_PRICE_NIS,
  LIQUID_FREQUENCY_OPTIONS,
  RIGID_ACTIVATION_OPTIONS,
  type EventBookingItem,
  type EventBookingItemId,
} from "@/lib/data/events-booking";

export type AttractionPricingTier = {
  name: string;
  description: string;
  priceExVat: number;
  featured?: boolean;
  priceNote?: string;
};

export type BundlePricingRow = {
  count: number;
  priceExVat: number;
  saving: string;
  highlight?: boolean;
};

/** נתיבי עמוד → מזהה אשף (כולל וריאנטים שלא ב-href של EVENT_BOOKING_ITEMS) */
const ATTRACTION_PATH_OVERRIDES: Record<string, EventBookingItemId> = {
  "/events/attractions/bubble-machine/smoke-bubble-machine-events": "event_bubbles",
  "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events": "event_smoke",
};

const VALID_EVENT_ITEM_IDS = new Set<string>(
  EVENT_BOOKING_ITEMS.map((i) => i.id),
);

function normalizePath(path: string): string {
  const trimmed = path.trim().replace(/\/+$/, "");
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/** מזהה אטרקציה לפי נתיב עמוד שיווק */
export function resolveEventItemIdFromPath(pathname: string): EventBookingItemId | null {
  const path = normalizePath(pathname);
  const override = ATTRACTION_PATH_OVERRIDES[path];
  if (override) return override;

  const fromHref = EVENT_BOOKING_ITEMS.find((item) => item.href === path);
  if (fromHref) return fromHref.id;

  return null;
}

export function parseBookEventItemFromSearch(
  value: string | null,
): EventBookingItemId | null {
  if (!value?.trim()) return null;
  const id = value.trim();
  return VALID_EVENT_ITEM_IDS.has(id) ? (id as EventBookingItemId) : null;
}

/**
 * חיסכון מול אטרקציות בודדות, מחושב מהקטלוג וכולל מע״מ כמו המחיר שמוצג לצרכן.
 * WP4 (PI-08): היה "חיסכון 300" ו"חיסכון 800" כתובים, בזמן שההפרש בקטלוג הוא
 * 339 ו-763 לפני מע״מ (400 ו-900 כולל).
 */
export function bundleSavingWithVat(count: number): number {
  const single = getExVat("event_attraction_1");
  const id = `event_attraction_${count}` as "event_attraction_2" | "event_attraction_3";
  return withVat(single) * count - withVat(getExVat(id));
}

function savingLabel(count: number): string {
  return `חיסכון ${bundleSavingWithVat(count).toLocaleString("he-IL")} ₪ כולל מע״מ`;
}

export function getBundlePricingTable(): readonly BundlePricingRow[] {
  return [
    {
      count: 1,
      priceExVat: getExVat("event_attraction_1"),
      saving: "",
    },
    {
      count: 2,
      priceExVat: getExVat("event_attraction_2"),
      saving: savingLabel(2),
    },
    {
      count: 3,
      priceExVat: getExVat("event_attraction_3"),
      saving: savingLabel(3),
    },
    {
      count: EVENT_GIFT_THRESHOLD,
      priceExVat: getExVat("event_attraction_4"),
      saving: "+ קליפ מתנה",
      highlight: true,
    },
  ] as const;
}

function tiersForItem(item: EventBookingItem): AttractionPricingTier[] {
  const base = EVENT_SINGLE_PRICE_NIS;

  if (item.pricingType === "rigid") {
    return RIGID_ACTIVATION_OPTIONS.map((opt) => ({
      name: opt.label,
      description: item.desc,
      priceExVat: base + opt.addOnPrice,
      featured: opt.key === "act_2",
      priceNote:
        opt.addOnPrice === 0
          ? "מחיר לאטרקציה בודדת בחבילה"
          : `+${withVat(opt.addOnPrice).toLocaleString("he-IL")} ₪ כולל מע״מ מעל הבסיס`,
    }));
  }

  if (item.pricingType === "liquid") {
    return LIQUID_FREQUENCY_OPTIONS.map((opt) => ({
      name: opt.label,
      description: item.desc,
      priceExVat: base + opt.addOnPrice,
      featured: opt.key === "freq_graduated",
      priceNote: opt.addOnPercent ? `תוספת ${opt.addOnPercent}` : undefined,
    }));
  }

  if (item.quantityLabel) {
    return [
      {
        name: item.quantityLabel.standard,
        description: item.desc,
        priceExVat: base,
      },
      {
        name: item.quantityLabel.double,
        description: item.desc,
        /* יחידה שנייה נספרת כאטרקציה שנייה בסולם, ולכן המחיר הוא מחיר
           שתי האטרקציות ולא תוספת שטוחה. */
        priceExVat: getExVat("event_attraction_2"),
        priceNote: "מחיר שתי אטרקציות, הנחה 10%",
      },
    ];
  }

  return [
    {
      name: item.name,
      description: item.desc,
      priceExVat: base,
    },
  ];
}

export function getAttractionPricingTiers(
  itemId: EventBookingItemId,
): AttractionPricingTier[] {
  const item = EVENT_BOOKING_ITEMS.find((i) => i.id === itemId);
  if (!item) return [];
  return tiersForItem(item);
}

export function getAttractionItemName(itemId: EventBookingItemId): string {
  return EVENT_BOOKING_ITEMS.find((i) => i.id === itemId)?.name ?? "אטרקציה";
}

/** טקסט מחירון לצ'אטבוט - מסונכרן עם האשף */
export function formatAttractionPricingForChatbot(): string {
  const rows = getBundlePricingTable();
  const bundleLines = rows
    .map((r) => {
      const label =
        r.count >= EVENT_GIFT_THRESHOLD
          ? `${r.count}+ אטרקציות`
          : `${r.count} אטרקציה${r.count > 1 ? "ות" : ""}`;
      const extra = r.saving ? ` (${r.saving})` : "";
      return `• ${label} - ${formatPrice(r.priceExVat).inline}${extra}`;
    })
    .join("\n");

  const base = EVENT_SINGLE_PRICE_NIS;
  const act2 = getExVat("event_extra_activation");
  const grad = LIQUID_FREQUENCY_OPTIONS.find((o) => o.key === "freq_graduated");

  return [
    `אטרקציה אחת - ${formatPrice(base).inline}. חבילות:`,
    bundleLines,
    "",
    "לכל אטרקציה בוחרים כמות הפעלות:",
    `• זיקוקים קרים / קונפטי - לפי רגעי שיא (הפעלה שנייה/שלישית = +${formatPrice(act2).inline} כל אחת)`,
    `• עשן כבד / בועות - לפי תדירות: הפעלה אחת · 2 מדורגות (+${grad?.addOnPercent ?? "35%"}) · 2 מלאות (+50%) · אקסטרים (+100%)`,
    "",
    "מה האירוע שלכם ואיזה רגעים הכי חשוב לכם לצלם?",
  ].join("\n");
}

function toServicePricingTier(tier: AttractionPricingTier): ServicePricingTier {
  return {
    name: tier.name,
    price: `${tier.priceExVat.toLocaleString("he-IL")} ₪`,
    priceExVat: tier.priceExVat,
    /* המחיר עצמו מוצג כולל מע״מ ב-ServicePricingBlock (WP10). "לפני מע״מ" כאן
       היה מתאר את המספר הקטן ולא את הגדול. */
    priceNote: tier.priceNote,
    description: tier.description,
    featured: tier.featured,
    badge: tier.featured ? "הכי נמכר" : undefined,
  };
}

/** מזהה שירות ב-services.ts → מזהה אשף */
export const ATTRACTION_SERVICE_ITEM_IDS: Record<string, EventBookingItemId> = {
  "attractions-bubble-machine": "event_bubbles",
  "attractions-smoke-bubble-machine": "event_bubbles",
  "attractions-heavy-smoke-large": "event_smoke",
  "attractions-wedding-smoke": "event_smoke",
  "attractions-confetti-cannon": "event_confetti",
  "attractions-cold-fireworks": "event_sparklers",
  "attractions-giant-balloons": "event_balloons",
  "attractions-smoke-cannons": "event_smoke_cannon",
};

export function servicePricingForEventItem(
  itemId: EventBookingItemId,
): readonly ServicePricingTier[] {
  return getAttractionPricingTiers(itemId).map(toServicePricingTier);
}

export function servicePricingForAttractionService(
  serviceId: string,
): readonly ServicePricingTier[] | undefined {
  const itemId = ATTRACTION_SERVICE_ITEM_IDS[serviceId];
  if (!itemId) return undefined;
  return servicePricingForEventItem(itemId);
}

/** חבילות משולבות - לשירותים ללא פריט ייעודי ב-/book (למשל LED) */
export function servicePricingForEventBundles(): readonly ServicePricingTier[] {
  return getBundlePricingTable().map((row) => ({
    name:
      row.count >= EVENT_GIFT_THRESHOLD
        ? `חבילת ${row.count}+ אטרקציות`
        : `חבילת ${row.count} אטרקציות`,
    price: `${row.priceExVat.toLocaleString("he-IL")} ₪`,
    priceExVat: row.priceExVat,
    priceNote: row.saving || undefined,
    description:
      row.count >= EVENT_GIFT_THRESHOLD
        ? "שלבו אפקטים בעמוד ההזמנה - כולל קליפ מתנה."
        : "מחיר חבילה משולבת, כמו בעמוד ההזמנה.",
    featured: row.highlight,
    badge: row.highlight ? "מתנה" : undefined,
  }));
}

/** שורת מחירון חבילות לטקסטי FAQ (דינמי מהקטלוג) */
export function formatEventBundlePriceSummary(): string {
  return getBundlePricingTable()
    .map((row) => {
      const label =
        row.count >= EVENT_GIFT_THRESHOLD ? `${row.count}+ אטרקציות` : `${row.count} אטרקציות`;
      return `${label} ${formatPrice(row.priceExVat).headline}`;
    })
    .join(" · ");
}

export function ledBoothPriceFaqAnswer(): string {
  return [
    "עמדת LED מצוטטת בוואטסאפ לפי גודל מסך, משך האירוע ומיקום.",
    `אפקטים משולבים (עשן, קונפטי, בועות) - אותו מחירון כמו בעמוד ההזמנה: ${formatEventBundlePriceSummary()}.`,
  ].join(" ");
}

export function ledBoothPurchaseCopy(): string {
  return "למפיקים, אולמות ותקליטנים - מחיר לפי מפרט (ארון מוכן או עמדה מלאה). הצעה בוואטסאפ, אחריות שנה, הדרכה ותמיכה.";
}

export const LED_BOOTH_SUBTITLE_TRAIL = `חבילות אפקטים משולבות - מאותו מחירון כמו עמוד ההזמנה, מאטרקציה אחת ${formatPrice(EVENT_SINGLE_PRICE_NIS).headline}.`;
