import { withVat } from "@/lib/data/pricing";
import { CATALOG_VAT_RATE, getExVat, MOBILE_STUDIO_CHANNEL_RULES } from "@/lib/data/pricing-catalog";
import { buildPersonBreakdown, formatPerPersonPrice, type PersonBreakdown } from "@/lib/data/participant-cost-copy";

export type MobileGeoId = "center" | "north_south" | "eilat";

/** SoT: pricing-catalog `mobile_podcast_at_home` (priceFrom) */
export const MOBILE_STUDIO_BASE_EX_VAT = getExVat("mobile_podcast_at_home");

export const MOBILE_GEO_FEES: Record<
  MobileGeoId,
  { label: string; fee: number; detail: string }
> = {
  center: {
    label: "מרכז",
    fee: 0,
    detail: "מודיעין והמרכז",
  },
  north_south: {
    label: "צפון / דרום",
    fee: 800,
    detail: "תוספת הגעה",
  },
  eilat: {
    label: "אילת / גולן",
    fee: 1800,
    detail: "תוספת הגעה מורחבת",
  },
};

export function calcMobileStudioExVat(geoId: MobileGeoId): number {
  return MOBILE_STUDIO_BASE_EX_VAT + MOBILE_GEO_FEES[geoId].fee;
}

export function formatMobileStudioPriceLine(geoId: MobileGeoId): string {
  const exVat = calcMobileStudioExVat(geoId);
  const geo = MOBILE_GEO_FEES[geoId];
  const suffix = geo.fee > 0 ? ` (${geo.label} +${geo.fee.toLocaleString("he-IL")} ₪)` : "";
  return `אולפן נייד: ${exVat.toLocaleString("he-IL")} ₪ לפני מע״מ${suffix} - ${withVat(exVat).toLocaleString("he-IL")} ₪ כולל מע״מ`;
}

/* ─── אנשים וערוצים (החלטת הבעלים 3.10.2026, סבב שלישי) ─── */

/** ההגעה כוללת אדם אחד. כל אדם נוסף ערוץ נוסף, עד 12 בהקלטה. מהקטלוג. */
export const MOBILE_STUDIO_CHANNELS = {
  included: MOBILE_STUDIO_CHANNEL_RULES.included,
  max: MOBILE_STUDIO_CHANNEL_RULES.max,
  channelExVat: getExVat(MOBILE_STUDIO_CHANNEL_RULES.channelId),
} as const;

/** מספר אנשים תקין באולפן הנייד: שלם, 1 עד 12. קלט לא מובן נותן 1. */
export function clampMobilePeople(value: number | string | null | undefined): number {
  const n = typeof value === "string" ? Number.parseInt(value, 10) : value;
  if (n == null || !Number.isFinite(n)) return MOBILE_STUDIO_CHANNELS.included;
  return Math.min(MOBILE_STUDIO_CHANNELS.max, Math.max(MOBILE_STUDIO_CHANNELS.included, Math.trunc(n)));
}

/** תוספת הערוצים לפני מע״מ. אדם אחד: 0. 4 אנשים: 3 × 99. */
export function mobileChannelsSurchargeExVat(people: number): number {
  return (clampMobilePeople(people) - MOBILE_STUDIO_CHANNELS.included) * MOBILE_STUDIO_CHANNELS.channelExVat;
}

/** אולפן נייד בבית או במשרד לפני מע״מ: הגעה (כולל הקלטת אודיו), אזור וערוצים */
export function calcMobileStudioAtHomeExVat(geoId: MobileGeoId, people: number): number {
  return calcMobileStudioExVat(geoId) + mobileChannelsSurchargeExVat(people);
}

/** "4 אנשים: 2,950 + 117 + 117 + 117 ₪ כולל מע״מ (2,500 + 99 + 99 + 99 ₪ + מע״מ)" */
export function mobileChannelsBreakdown(people: number, baseExVat: number = MOBILE_STUDIO_BASE_EX_VAT): PersonBreakdown {
  const count = clampMobilePeople(people);
  return buildPersonBreakdown({
    count,
    baseExVat,
    extrasExVat: Array.from(
      { length: count - MOBILE_STUDIO_CHANNELS.included },
      () => MOBILE_STUDIO_CHANNELS.channelExVat,
    ),
    vatRate: CATALOG_VAT_RATE,
    noun: { one: "אדם אחד", many: "אנשים" },
  });
}

/** "כל אדם נוסף ערוץ הקלטה נוסף: +117 ₪ כולל מע״מ (99 ₪ + מע״מ), עד 12 אנשים בהקלטה" */
export function mobileChannelPriceLine(): string {
  return `${formatPerPersonPrice(MOBILE_STUDIO_CHANNELS.channelExVat, CATALOG_VAT_RATE, "כל אדם נוסף")}, עד ${MOBILE_STUDIO_CHANNELS.max} אנשים בהקלטה`;
}
