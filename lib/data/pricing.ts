/**
 * מקור אמת יחיד למחירי אולפן (לפני מע״מ).
 * לעדכון מחירים: ערכו כאן בלבד, והריצו `npm run build` לוודא שהכל תקין.
 *
 * נצרך אוטומטית ב: מחירון סטודיו, פודקאסט, מחשבונים, ניווט, שוברים, llms.txt ועוד.
 */

/** חצי שעה באולפן (30 דק׳) - פודקאסט קצר, הקלטה קצרה */
export const STUDIO_HALF_HOUR_NIS = 750;

/** שעת אולפן מלאה */
export const STUDIO_ONE_HOUR_NIS = 1500;

/** עריכת פודקאסט — לכל שעת חומר גולמי */
export const PODCAST_EDITING_PER_HOUR_NIS = 590;

/** שיעור מע״מ (להצגה במחשבונים) */
export const VAT_RATE = 0.18;

export const PRICES_EXCLUDE_VAT_NOTE = "המחירים לפני מע״מ (+18%)";

/** אטרקציה בודדת לאירוע (לא מחיר אולפן) */
export const EVENT_ATTRACTION_FROM_NIS = 1750;

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
