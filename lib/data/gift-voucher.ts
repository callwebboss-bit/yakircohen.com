import { getExVat } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";

/**
 * כתובת דף התשלום אצל ספק הסליקה הקיים (GROW).
 * הבעלים ממלא כאן. ריק = הכפתור "לרכישה" מושבת והמסך מציג הודעה במקומו.
 * אפשר לשלב {amount} (הסכום בשקלים, מספר שלם) אם הספק תומך בסכום בכתובת.
 * לא מועברים בכתובת שם הנותן, שם המקבל וההודעה: פרטים אישיים לא עוברים ב-URL.
 */
export const GIFT_VOUCHER_CHECKOUT_URL = "";

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
 * שורת התוקף שמודפסת על התמונה. מקור: שאלות ותשובות החנות (shop-vouchers.ts,
 * "בדרך כלל שנה ממועד הרכישה"). הבעלים צריך לאשר שזה התוקף הקבוע.
 */
export const GIFT_VOUCHER_VALIDITY_LABEL = "תוקף: שנה מיום הרכישה";

export const GIFT_VOUCHER_LIMITS = {
  name: 40,
  message: 220,
} as const;

/** כתובת הרכישה לבחירה נתונה, או null כשהכתובת עוד לא הוגדרה. */
export function buildGiftVoucherCheckoutUrl(
  template: string,
  amountNis: number,
): string | null {
  const trimmed = template.trim();
  if (!trimmed) return null;
  const filled = trimmed.replaceAll("{amount}", String(amountNis));
  try {
    const url = new URL(filled);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
