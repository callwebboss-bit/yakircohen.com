import type { PriceScope, PriceWithEditing } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";

export type PriceScopeDisplayLines = {
  primary: string;
  scopeLine?: string;
  vatLine: string;
  /** שורה אחת לכרטיסים צרים */
  compactLine: string;
};

export type DualPriceDisplayLines = {
  recordingOnly: string;
  withEditing: string;
  socialProof: string;
};

/** מחבר משך + כולל/לא כולל + סוג תשלום לשורת היקף אחת */
export function formatScopeLine(scope?: PriceScope): string | undefined {
  if (!scope) return undefined;
  const parts: string[] = [];
  if (scope.duration) parts.push(scope.duration);
  if (scope.includes) parts.push(`כולל ${scope.includes}`);
  if (scope.excludes) {
    parts.push(
      scope.excludes.startsWith("לא כולל")
        ? scope.excludes
        : `לא כולל ${scope.excludes}`,
    );
  }
  parts.push(scope.billingLabel ?? "חד-פעמי");
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

/** שני מחירים: הקלטה בלבד מול הקלטה + עריכה */
export function formatDualPriceLines(
  baseExVat: number,
  withEditing: PriceWithEditing,
): DualPriceDisplayLines {
  const base = baseExVat.toLocaleString("he-IL");
  const edit = withEditing.exVat.toLocaleString("he-IL");
  return {
    recordingOnly: `הקלטה בלבד - ${base} ₪ + מע״מ`,
    withEditing: `${withEditing.label} - ${edit} ₪ + מע״מ`,
    socialProof: "רוב הלקוחות בוחרים באפשרות השנייה",
  };
}

/** ממפה תווית תשלום ל-data-billing-type */
export function billingLabelToDataAttr(billingLabel?: string): string {
  switch (billingLabel) {
    case "חודשי":
      return "monthly";
    case "לכל פרק":
      return "per-episode";
    case "ליום":
      return "per-day";
    default:
      return "one-time";
  }
}

export function formatPriceScopeDisplay({
  exVat,
  scope,
  showFromPrefix = false,
}: {
  exVat: number;
  scope?: PriceScope;
  showFromPrefix?: boolean;
}): PriceScopeDisplayLines {
  const amount = exVat.toLocaleString("he-IL");
  const prefix = showFromPrefix ? "מ-" : "";
  const primary = `${prefix}${amount} ₪ + מע״מ`;
  const scopeLine = formatScopeLine(scope);
  const total = withVat(exVat).toLocaleString("he-IL");
  const vatLine = `כולל מע״מ: ${total} ₪`;
  const compactLine = scopeLine ? `${primary} · ${scopeLine}` : primary;
  return { primary, scopeLine, vatLine, compactLine };
}

const HUB_DESCRIPTION_MAX = 72;

/** תיאור קצר ואחיד לשורות במחירון */
export function formatHubRowDescription(text?: string): string | undefined {
  if (!text?.trim()) return undefined;
  const firstSentence = text.trim().split(/[.。!]/)[0]?.trim();
  if (!firstSentence) return undefined;
  if (firstSentence.length <= HUB_DESCRIPTION_MAX) return firstSentence;
  const cut = firstSentence.slice(0, HUB_DESCRIPTION_MAX);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > 40 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed.trim()}…`;
}

/** שורת מחיר לכפתור הזמנה במחירון */
export function formatHubPriceDual(exVat: number, priceFrom = false): string {
  const amount = exVat.toLocaleString("he-IL");
  const total = withVat(exVat).toLocaleString("he-IL");
  const prefix = priceFrom ? "מ-" : "";
  return `${prefix}${amount} ₪ + מע״מ = ${total} ₪`;
}
