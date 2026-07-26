/** Hold שמירת תאריך - צד לקוח בלבד (אין hold שרת). */
export const HOLD_DURATION_MS = 5 * 3600 * 1000;

export const HOLD_STORAGE_KEY = "yc-lead-flow-hold-expires-at";

export const HOLD_POLICY_TEXT =
  "שמירת תאריך ביומן (Hold) תקפה ל-5 שעות בלבד. התשלום מבוצע מראש להבטחת הציוד והצוות. לאחר 5 שעות ללא אישור, התאריך נפתח מחדש.";

export const HOLD_EXPIRED_TEXT =
  "חלפו 5 השעות. התאריך נפתח מחדש. אפשר לבחור חבילה שוב ולבקש Hold חדש.";

export const HOLD_ACTIVE_LABEL = "Hold פעיל עד";

export function computeHoldExpiresAt(fromMs: number = Date.now()): number {
  return fromMs + HOLD_DURATION_MS;
}
