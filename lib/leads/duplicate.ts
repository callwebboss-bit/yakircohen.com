import { createHash } from "node:crypto";
import { redisGet, redisSet } from "@/lib/leads/redis";

/**
 * סיווג ליד חוזר: new | repeat | update.
 *
 * הקוד הקודם סימן כל ליד שני מאותו טלפון ב-24 שעות כ"spam" ודילג על המייל.
 * כך ההזמנה האמיתית נבלעה אחרי ליד "רוח" של אותו אשף, אחרי טיוטה נטושה ב-
 * /pricing, או אחרי פנייה מטופס אחר. בעצם, ככל שהלקוח היה מעורב יותר, כך גדל
 * הסיכוי שהבעלים לא יקבל את ההזמנה (LF-03).
 *
 * עכשיו:
 * - repeat: אותה שליחה בדיוק (אותו submissionId, או אותו גוף) תוך 10 דקות,
 *   ורק אחרי שהבעלים כבר קיבל אותה (markDelivered). ניסיון חוזר אחרי כשל
 *   שליחה נשלח שוב ולא נבלע.
 * - update: אותו טלפון או מייל ב-24 שעות. הליד נשאר "new", מקבל duplicateOf,
 *   והמייל לבעלים יוצא עם "[עדכון לליד קיים]" והגוף המלא.
 * - הסיווג לעולם לא קובע status "spam".
 */

const CONTACT_TTL_SECONDS = 60 * 60 * 24; // 24h
const EXACT_TTL_SECONDS = 60 * 10; // 10 דקות
const DRAFT_TTL_SECONDS = 60 * 60 * 24;

export const UPDATE_SUBJECT_PREFIX = "[עדכון לליד קיים] ";

function hash(raw: string): string {
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

function phoneDigits(phone?: string): string | undefined {
  const d = phone?.replace(/\D/g, "");
  return d && d.length >= 9 ? d : undefined;
}

function normEmail(email?: string): string | undefined {
  const e = email?.trim().toLowerCase();
  return e && e.includes("@") ? e : undefined;
}

export type LeadRepeatInput = {
  formId: string;
  phone?: string;
  email?: string;
  body: string;
  submissionId?: string;
};

export type LeadRepeatKind = "new" | "repeat" | "update";

export type LeadRepeatResult = {
  kind: LeadRepeatKind;
  existingLeadId?: string;
  /** המפתח שיסומן ב-markDelivered אחרי שהבעלים קיבל את הליד */
  exactKey: string;
};

export function exactRepeatKey(input: LeadRepeatInput): string {
  const sid = input.submissionId?.trim();
  const raw = [
    input.formId.trim().toLowerCase(),
    phoneDigits(input.phone) ?? "",
    normEmail(input.email) ?? "",
    sid ? `sid:${sid}` : `body:${input.body.trim()}`,
  ].join("|");
  return `lead:dup:exact:${hash(raw)}`;
}

/**
 * מסווג ומעדכן את מפתחות הטלפון/מייל.
 * מפתח ה-exact לא נכתב כאן, רק ב-markDelivered.
 */
export async function classifyLeadRepeat(
  input: LeadRepeatInput,
  leadId: string,
): Promise<LeadRepeatResult> {
  const exactKey = exactRepeatKey(input);
  const exact = await redisGet(exactKey);
  if (exact) {
    return { kind: "repeat", existingLeadId: exact, exactKey };
  }

  const contactKeys: string[] = [];
  const phone = phoneDigits(input.phone);
  if (phone) contactKeys.push(`lead:dup:phone:${phone}`);
  const email = normEmail(input.email);
  if (email) contactKeys.push(`lead:dup:email:${email}`);

  let existingLeadId: string | undefined;
  for (const key of contactKeys) {
    const prior = await redisGet(key);
    if (prior && prior !== leadId && !existingLeadId) existingLeadId = prior;
  }
  /* המפתח מצביע תמיד על הליד הראשון בחלון, כדי ש-duplicateOf יוביל לשורש */
  for (const key of contactKeys) {
    await redisSet(key, existingLeadId ?? leadId, CONTACT_TTL_SECONDS);
  }

  return existingLeadId
    ? { kind: "update", existingLeadId, exactKey }
    : { kind: "new", exactKey };
}

/** נקרא רק אחרי שהבעלים קיבל את הליד. מכאן ושליחה זהה תיחשב repeat. */
export async function markDelivered(exactKey: string, leadId: string): Promise<void> {
  await redisSet(exactKey, leadId, EXACT_TTL_SECONDS);
}

/**
 * טיוטה נטושה (/api/leads/recover) במרחב משלה. לא כותבת את מפתח הטלפון,
 * כדי שההזמנה המלאה שתבוא אחריה תיחשב ליד חדש ותגיע לבעלים.
 */
export async function checkDraftRepeat(
  phone: string,
  formId: string,
  leadId: string,
): Promise<{ isRepeat: boolean; existingLeadId?: string }> {
  const key = `lead:draft:${phoneDigits(phone) ?? phone}:${formId}`;
  const prior = await redisGet(key);
  if (prior) return { isRepeat: true, existingLeadId: prior };
  await redisSet(key, leadId, DRAFT_TTL_SECONDS);
  return { isRepeat: false };
}
