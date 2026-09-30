import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * ערך קוקי הסשן של האדמין: הצפנה בלבד, בלי תלות ב-Next.
 *
 * למה מודול נפרד: lib/admin-auth.ts מייבא server-only ו-next/headers, ולכן
 * אי אפשר לבדוק אותו בבדיקת יחידה רגילה. הלוגיקה שכאן היא החלק שטעות בו
 * נועלת את הבעלים מחוץ ל-/admin או משאירה קוקי תקף לנצח, ולכן דווקא הוא
 * חייב כיסוי. lib/admin-session-value.test.ts בודק אותו.
 *
 * המבנה: `<תפוגה>.<HMAC של הגרסה והתפוגה>`.
 *
 * עד 30.9.2026 הערך היה HMAC של מחרוזת קבועה, ולכן אותו סוד ייצר תמיד
 * בדיוק אותו ערך. יציאה מהמערכת מחקה את הקוקי מהדפדפן אבל לא פסלה עותק
 * שנשמר במקום אחר, ורק החלפת הסוד ב-Vercel פסלה אותו. חותמת התפוגה חתומה
 * יחד עם השאר, ולכן אי אפשר להאריך אותה בלי הסוד.
 *
 * הגרסה עלתה ל-v2, ולכן כל קוקי קיים נפסל והכניסה הבאה דורשת הקלדה אחת
 * של הסוד. זו הכוונה.
 */
const SESSION_VERSION = "admin-session-v2";

export const ADMIN_COOKIE_MAX_AGE_SEC = 30 * 24 * 60 * 60;

function signSession(expiresAtMs: number, secret: string): string {
  return createHmac("sha256", secret).update(`${SESSION_VERSION}.${expiresAtMs}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export function issueSessionValue(secret: string | null, now = Date.now()): string | null {
  if (!secret) return null;
  const expiresAtMs = now + ADMIN_COOKIE_MAX_AGE_SEC * 1000;
  return `${expiresAtMs}.${signSession(expiresAtMs, secret)}`;
}

/** מאמת מבנה, תפוגה וחתימה. כל כשל מחזיר false בלי להסגיר איזה מהם. */
export function verifySessionValue(
  value: string | null | undefined,
  secret: string | null,
  now = Date.now(),
): boolean {
  if (!secret || !value) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const expiresAtMs = Number(value.slice(0, dot));
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= now) return false;
  return safeEqual(value.slice(dot + 1), signSession(expiresAtMs, secret));
}
