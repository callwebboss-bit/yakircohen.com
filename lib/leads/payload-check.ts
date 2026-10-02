/**
 * בדיקת גוף הבקשה של /api/lead-notify, בלי תלות ב-Request או ב-Redis.
 *
 * קודם הראוט הריץ isLeadSpam על כל גוף המייל, והדפוס של קישור דחה כל ליד
 * שהדפדפן עצמו הוסיף לו "קישור להזמנה: https://...". כך נדחו ב-400 לידים מ-17
 * מסלולים, בלי שמירה, בלי מייל ובלי לוג (LF-01). ההודעה של הלקוח מותר שתכיל
 * קישור (שיר ביוטיוב) או "חחחחחח" (LF-16).
 *
 * הכלל: דחייה קשה רק על מה שבאמת שבור או בוט. מילות ספאם מסמנות את הליד
 * לבדיקה ("[לבדיקה] " בנושא) והמייל עדיין יוצא לבעלים.
 */
import {
  HONEYPOT_FIELD_NAME,
  SPAM_KEYWORD_PATTERNS,
  URL_PATTERN,
  validateHoneypot,
  validateIsraeliMobile,
} from "@/lib/form-validation";

export const MAX_LEAD_BODY_CHARS = 8000;
export const REVIEW_SUBJECT_PREFIX = "[לבדיקה] ";
export const FORM_ID_PATTERN = /^[a-z][a-z0-9_]{2,63}$/;

/* שורת הקישור המקומי ל-yakir-closer שהדפדפן מוסיף (buildLeadNotifyBody). היא
   מקודדת את כל הגוף ב-base64, ולכן גוף עברי מתנפח בערך פי 3.8. הודעה של 2000
   תווים (המקסימום שהטופס מאפשר) הגיעה ל-8295 תווים ונדחתה כ-body_too_long. */
const CLOSER_LINK_LINE = /\nאו פתחו מקומית: yakir-closer\.html\?lead=\S*/;

/**
 * כשהגוף ארוך מהמגבלה, מסיר את שורת הקישור המקומי בלבד. הגוף עצמו וההוראה
 * להדביק אותו ב"קליטה מהירה" נשארים, כך שהבעלים לא מאבד כלום. מכסה גם
 * דפדפנים עם JS ישן ששולחים את השורה המלאה.
 */
export function fitLeadBody(body: string): string {
  if (body.length <= MAX_LEAD_BODY_CHARS) return body;
  return body.replace(CLOSER_LINK_LINE, "");
}

export type LeadRejectReason =
  | "missing_fields"
  | "invalid_form"
  | "invalid_phone"
  | "body_too_long"
  | "rejected";

export type LeadSoftFlag = "spam_keyword";

export type LeadPayloadCheck =
  /** honeypot מלא: עונים 200 בשקט כדי שהבוט לא ילמד, ולא שומרים כלום */
  | { kind: "honeypot" }
  | { kind: "reject"; error: LeadRejectReason }
  | { kind: "accept"; flags: LeadSoftFlag[] };

export type LeadNotifyPayloadInput = {
  formId?: unknown;
  subject?: unknown;
  body?: unknown;
  name?: unknown;
  phone?: unknown;
  website_verification?: unknown;
  [key: string]: unknown;
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/** קישור בשם הוא סימן בוט מובהק, והטופס בדפדפן כבר חוסם אותו לפני שליחה. */
export function nameHasUrl(name: string): boolean {
  return URL_PATTERN.test(name);
}

/** סימונים רכים בלבד. קישורים ואותיות חוזרות לא נחשבים כאן בכוונה. */
export function leadSoftFlags(...texts: Array<string | undefined>): LeadSoftFlag[] {
  const joined = texts.filter(Boolean).join("\n");
  if (!joined.trim()) return [];
  return SPAM_KEYWORD_PATTERNS.some((re) => re.test(joined)) ? ["spam_keyword"] : [];
}

export function checkLeadNotifyPayload(p: LeadNotifyPayloadInput): LeadPayloadCheck {
  const formId = str(p.formId).trim();
  const subject = str(p.subject).trim();
  const body = str(p.body);
  if (!formId || !subject || !body.trim()) {
    return { kind: "reject", error: "missing_fields" };
  }

  const honeypotValue = p.website_verification ?? p[HONEYPOT_FIELD_NAME];
  if (typeof honeypotValue === "string" && !validateHoneypot(honeypotValue)) {
    return { kind: "honeypot" };
  }

  if (!FORM_ID_PATTERN.test(formId)) {
    return { kind: "reject", error: "invalid_form" };
  }

  if (nameHasUrl(str(p.name))) {
    return { kind: "reject", error: "rejected" };
  }

  const phone = str(p.phone).trim();
  if (phone && !validateIsraeliMobile(phone).ok) {
    return { kind: "reject", error: "invalid_phone" };
  }

  if (body.length > MAX_LEAD_BODY_CHARS) {
    return { kind: "reject", error: "body_too_long" };
  }

  return { kind: "accept", flags: leadSoftFlags(subject, body, str(p.name)) };
}
