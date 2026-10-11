import {
  formatPriceLine,
  getPriceById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { formatExVatWithVat, formatNis, withVat } from "@/lib/data/pricing";

export const PRICE_FALLBACK_LABEL = "הצעה מותאמת בשיחה";

export function tryGetExVat(catalogId: PriceItemId | null | undefined): number | null {
  if (!catalogId) return null;
  try {
    return getPriceById(catalogId).exVat;
  } catch {
    return null;
  }
}

export function formatLeadFlowPrice(exVat: number | null): {
  line: string;
  exVatLabel: string;
  withVatLabel: string;
  isFallback: boolean;
} {
  if (exVat === null || Number.isNaN(exVat)) {
    return {
      line: PRICE_FALLBACK_LABEL,
      exVatLabel: PRICE_FALLBACK_LABEL,
      withVatLabel: PRICE_FALLBACK_LABEL,
      isFallback: true,
    };
  }
  const dual = formatExVatWithVat(exVat);
  /* line מוצג במסלול איתור הצרכים בעמוד: מחיר אחד, כולל מע״מ (D86, 11.10.2026).
     ההודעה בוואטסאפ נבנית ב-formatLeadFlowWhatsAppPrice, ושם נשארים שני המחירים. */
  return {
    line: `${dual.withVat} כולל מע״מ`,
    exVatLabel: `${dual.exVat} + מע״מ`,
    withVatLabel: dual.withVat,
    isFallback: false,
  };
}

export function formatLeadFlowWhatsAppPrice(exVat: number | null, label?: string, from = false): string {
  if (exVat === null || Number.isNaN(exVat)) {
    return label ? `${label}: ${PRICE_FALLBACK_LABEL}` : PRICE_FALLBACK_LABEL;
  }
  return formatPriceLine(exVat, label, { from });
}

export function sumExVat(amounts: readonly (number | null)[]): number | null {
  let total = 0;
  let any = false;
  for (const a of amounts) {
    if (a === null || Number.isNaN(a)) continue;
    total += a;
    any = true;
  }
  return any ? total : null;
}

export { formatNis, withVat };
