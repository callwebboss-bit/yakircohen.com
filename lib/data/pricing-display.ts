import type { PriceAudience, PriceScope, PriceWithEditing } from "@/lib/data/pricing-catalog";
import { PRICES_BEFORE_VAT_18, withVat } from "@/lib/data/pricing";

export type { PriceAudience };

/**
 * קהל המחיר לפי נתיב או קטגוריית קטלוג (החלטת הבעלים 2.10.2026, תוכנית שלב 4
 * WP10-WP11). /business, /pro וקטגוריית הקטלוג pro הם עסקים, ורואים לפני מע״מ
 * קודם. כל השאר צרכן, ורואה כולל מע״מ קודם (סעיף 17ד לחוק הגנת הצרכן).
 */
export function getPriceAudience(pathOrCategory?: string | null): PriceAudience {
  const key = pathOrCategory?.trim() ?? "";
  if (key === "pro" || key === "business") return "business";
  if (/^\/(business|pro)(\/|$)/.test(key)) return "business";
  return "consumer";
}

export type FormattedPrice = {
  /** השורה הגדולה: "מ-590 ₪ כולל מע״מ" לצרכן, "מ-500 ₪ + מע״מ" לעסק */
  headline: string;
  /** השורה הקטנה: "500 ₪ + מע״מ" לצרכן, "590 ₪ כולל מע״מ" לעסק */
  vatNote: string;
  /** שורה אחת: "מ-590 ₪ כולל מע״מ (500 ₪ + מע״מ)" */
  inline: string;
  exVat: number;
  totalWithVat: number;
};

/** מקור אחד לכל תצוגת מחיר באתר. ה-[YC:] וה-closer נשארים לפני מע״מ (נתון פנימי). */
/* מחיר לפני מע״מ יכול להיות לא שלם: 41.5 לפני מע״מ הוא בדיוק 49 ₪ כולל מע״מ (שמירה
   קבועה בענן, 6.10.2026). אז מציגים שתי ספרות אחרי הנקודה, "1,291.50", ולא "1,291.5".
   מחיר שלם נשאר כמו שהיה. */
function amountText(amount: number): string {
  return Number.isInteger(amount)
    ? amount.toLocaleString("he-IL")
    : amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPrice(
  exVat: number,
  { from = false, audience = "consumer" }: { from?: boolean; audience?: PriceAudience } = {},
): FormattedPrice {
  const prefix = from ? "מ-" : "";
  const totalWithVat = withVat(exVat);
  const ex = `${amountText(exVat)} ₪ + מע״מ`;
  const total = `${totalWithVat.toLocaleString("he-IL")} ₪ כולל מע״מ`;
  const headline = audience === "business" ? `${prefix}${ex}` : `${prefix}${total}`;
  const vatNote = audience === "business" ? total : ex;
  return { headline, vatNote, inline: `${headline} (${vatNote})`, exVat, totalWithVat };
}

export type PriceScopeDisplayLines = {
  primary: string;
  scopeLine?: string;
  vatLine: string;
  beforeVatLine: string;
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
  audience: PriceAudience = "consumer",
): DualPriceDisplayLines {
  return {
    recordingOnly: `הקלטה בלבד - ${formatPrice(baseExVat, { audience }).inline}`,
    withEditing: `${withEditing.label} - ${formatPrice(withEditing.exVat, { audience }).inline}`,
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
  audience = "consumer",
}: {
  exVat: number;
  scope?: PriceScope;
  showFromPrefix?: boolean;
  audience?: PriceAudience;
}): PriceScopeDisplayLines {
  const price = formatPrice(exVat, { from: showFromPrefix, audience });
  const primary = price.headline;
  const scopeLine = formatScopeLine(scope);
  const vatLine = price.vatNote;
  /* "לפני מע״מ 18%" רק כשהמחיר הגדול הוא לפני מע״מ (עסקים) */
  const beforeVatLine = audience === "business" ? PRICES_BEFORE_VAT_18 : "";
  const compactLine = scopeLine ? `${primary} · ${scopeLine}` : primary;
  return { primary, scopeLine, vatLine, beforeVatLine, compactLine };
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
  return `${trimmed.trim()}...`;
}

/** שורת מחיר לכפתור הזמנה במחירון: כולל מע״מ קודם לצרכן, לפני מע״מ קודם לעסק */
export function formatHubPriceDual(
  exVat: number,
  priceFrom = false,
  audience: PriceAudience = "consumer",
): string {
  return formatPrice(exVat, { from: priceFrom, audience }).inline;
}

/** "מ-590 ₪ כולל מע״מ (500 ₪ + מע״מ)", שורת מחיר לצרכן בטבלאות */
export function formatConsumerPriceLine(exVat: number, priceFrom = false): string {
  return formatPrice(exVat, { from: priceFrom }).inline;
}

export type ConsumerPriceDisplay = {
  /** "590 ₪" */
  total: string;
  /** "590 ₪ כולל מע״מ" */
  totalLabel: string;
  /** "500 ₪ + מע״מ" */
  exVatNote: string;
  /** "+590 ₪", לשורת תוספת */
  delta: string;
};

/**
 * מחיר לצרכן: כולל מע״מ קודם, ולפני מע״מ בקטן מתחת (החלטת הבעלים 2.10.2026,
 * סעיף 17ד לחוק הגנת הצרכן). מוצרים לעסקים נשארים לפני מע״מ.
 */
export function formatConsumerPrice(exVat: number): ConsumerPriceDisplay {
  const total = `${withVat(exVat).toLocaleString("he-IL")} ₪`;
  return {
    total,
    totalLabel: `${total} כולל מע״מ`,
    exVatNote: `${amountText(exVat)} ₪ + מע״מ`,
    delta: `+${total}`,
  };
}
