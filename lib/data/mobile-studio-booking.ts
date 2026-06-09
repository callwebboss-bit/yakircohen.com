import { withVat } from "@/lib/data/pricing";

export type MobileGeoId = "center" | "north_south" | "eilat";

export const MOBILE_STUDIO_BASE_EX_VAT = 999;

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
  return `אולפן נייד: ${exVat.toLocaleString("he-IL")} ₪ לפני מע״מ${suffix} · ${withVat(exVat).toLocaleString("he-IL")} ₪ כולל מע״מ`;
}
