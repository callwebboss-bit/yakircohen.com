/**
 * מקור אמת יחיד למחירי אולפן (לפני מע״מ).
 * לעדכון מחירים: ערכו ב-`pricing-catalog.ts`, והריצו `npm run audit:pricing`.
 *
 * נצרך אוטומטית ב: מחירון סטודיו, פודקאסט, מחשבונים, ניווט, שוברים, llms.txt ועוד.
 */

import { getExVat } from "./pricing-catalog";

/** חצי שעה באולפן (30 דק׳) - פודקאסט קצר, הקלטה קצרה */
export const STUDIO_HALF_HOUR_NIS = getExVat("studio_half_hour");

/** שעת אולפן מלאה */
export const STUDIO_ONE_HOUR_NIS = getExVat("studio_hour");

/** עריכת פודקאסט - לכל שעת חומר גולמי */
export const PODCAST_EDITING_PER_HOUR_NIS = getExVat("podcast_editing_hour");

/** שיעור מע״מ (להצגה במחשבונים) */
export const VAT_RATE = 0.18;

export const PRICES_EXCLUDE_VAT_NOTE = "המחירים לפני מע״מ (+18%)";

/** אטרקציה בודדת לאירוע (לא מחיר אולפן) */
export const EVENT_ATTRACTION_FROM_NIS = getExVat("event_attraction_1");

export const STUDIO_RATES = {
  halfHour: STUDIO_HALF_HOUR_NIS,
  oneHour: STUDIO_ONE_HOUR_NIS,
} as const;

/** תווית לגריד וידאו: כמה דוגמאות לפני "הצג עוד" */
export const VIDEO_EXAMPLES_INITIAL_VISIBLE = 3;

/** טקסט על placeholder לפני טעינת YouTube */
export const VIDEO_WATCH_LABEL = "לצפייה בדוגמא";

export function formatNis(
  amount: number,
  options?: { withSymbol?: boolean; prefix?: string },
): string {
  const formatted = amount.toLocaleString("he-IL");
  if (options?.prefix) return `${options.prefix}${formatted}`;
  if (options?.withSymbol === false) return formatted;
  return `₪${formatted}`;
}

export function formatHaMeNis(amount: number): string {
  return `החל מ-${amount.toLocaleString("he-IL")} ₪`;
}

export function formatMeNis(amount: number): string {
  return `מ-${amount.toLocaleString("he-IL")} ₪`;
}

/** מחיר כולל מע״מ (מעוגל לשקל) */
export function withVat(amountExVat: number): number {
  return Math.round(amountExVat * (1 + VAT_RATE));
}

/** תצוגה דו-שורתית: לפני מע״מ + כולל מע״מ */
export function formatExVatWithVat(amountExVat: number): {
  exVat: string;
  withVat: string;
} {
  return {
    exVat: formatNis(amountExVat),
    withVat: formatNis(withVat(amountExVat)),
  };
}
