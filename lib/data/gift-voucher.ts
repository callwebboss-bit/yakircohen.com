import { getExVat } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";

export type GiftVoucherChoice =
  | { kind: "amount"; id: string; label: string; amountNis: number }
  | {
      kind: "package";
      id: string;
      label: string;
      note: string;
      amountNis: number;
    };

/** סכומי שובר חופשיים. הבעלים קובע אילו סכומים מוצעים. */
export const GIFT_VOUCHER_AMOUNTS_NIS = [300, 500, 1000] as const;

/** חבילות מהקטלוג. הסכום כולל מע״מ ונגזר מהקטלוג, לא נכתב ביד. */
const PACKAGE_DEFS = [
  {
    id: "half-hour",
    catalogId: "studio_half_hour",
    label: "חצי שעה באולפן",
    note: "הקלטה קצרה במודיעין: שיר, ברכה או קטע מיוחד",
  },
  {
    id: "one-hour",
    catalogId: "studio_hour",
    label: "שעה באולפן",
    note: "שעת הקלטה מלאה במודיעין",
  },
] as const;

export const GIFT_VOUCHER_CHOICES: readonly GiftVoucherChoice[] = [
  ...GIFT_VOUCHER_AMOUNTS_NIS.map(
    (amountNis): GiftVoucherChoice => ({
      kind: "amount",
      id: `amount-${amountNis}`,
      label: "סכום לשימוש באולפן",
      amountNis,
    }),
  ),
  ...PACKAGE_DEFS.map(
    (pkg): GiftVoucherChoice => ({
      kind: "package",
      id: `package-${pkg.id}`,
      label: pkg.label,
      note: pkg.note,
      amountNis: withVat(getExVat(pkg.catalogId)),
    }),
  ),
];

/**
 * תוקף השובר. אותו כלל כמו שובר עמדת המכירות: GIFT_VALIDITY_YEARS ב-
 * lib/sales/voucher.ts (שנתיים, החלטת הבעלים 7.10.2026, חוק הגנת הצרכן).
 * הערך כאן מקביל ולא מיובא, כדי שהרכיב בצד הלקוח לא יסחב את כל מודול המכירות.
 * lib/gift-voucher.test.ts נכשל אם המספרים לא זהים.
 *
 * סיכון משפטי פתוח (נקרא ב-8.10.2026 מנוסח תקנות שירותי תשלום (פטור מהוראות
 * החוק), התשפ"ב-2022, תקנה 2(א), https://www.nevo.co.il/law_html/law00/208503.htm,
 * דרך WebFetch, לא אומת מול עורך דין): שובר לשירות מסוים הוא שנתיים לפחות, אבל
 * שובר בסכום כסף (תו קנייה, כרטיס מתנה) הוא 5 שנים לפחות. הסכומים 300/500/1,000
 * הם שוברי סכום. לפני הפעלה מול לקוחות לאשר עם עורך דין, או להשאיר חבילות בלבד.
 */
export const GIFT_VOUCHER_VALIDITY_YEARS = 2;

export const GIFT_VOUCHER_VALIDITY_LABEL = "תוקף: שנתיים מיום הרכישה";

export const GIFT_VOUCHER_LIMITS = {
  name: 40,
  message: 220,
} as const;
