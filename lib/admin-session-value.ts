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
 * יחד עם השאר, ולכן אי אפשר לשנות אותה בלי הסוד.
 *
 * מ-6.10.2026 יש חידוש (shouldRenewSession, תוכנית עמדת המכירות, סעיף 9):
 * השרת מנפיק קוקי חדש לקוקי תקף שנשארו לו פחות מ-7 ימים. המשמעות: מי שמחזיק
 * קוקי תקף יכול להאריך אותו כל עוד הוא משתמש בו, בלי תקרה מרגע הכניסה. מה
 * שעוצר אותו: יציאה מהמערכת (מוחקת מהדפדפן), או החלפת ADMIN_LEADS_TOKEN
 * ב-Vercel (פוסלת כל קוקי, כולל כאלה שחודשו).
 *
 * הגרסה עלתה ל-v2, ולכן כל קוקי קיים נפסל והכניסה הבאה דורשת הקלדה אחת
 * של הסוד. זו הכוונה.
 */
const SESSION_VERSION = "admin-session-v2";

export const ADMIN_COOKIE_MAX_AGE_SEC = 30 * 24 * 60 * 60;

/* 7 ימים לפני התפוגה מתחילים לחדש (תוכנית עמדת המכירות, סעיף 9, 6.10.2026).
   בלי חידוש, הקוקי פג באמצע אירוע ויקיר צריך להקליד את הסוד בטלפון בדיוק
   כשלקוח מחכה לתשובה. */
export const ADMIN_SESSION_RENEW_THRESHOLD_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

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

/**
 * האם להנפיק קוקי חדש: רק לערך תקף שנשארו לו פחות מ-thresholdDays ימים.
 * ערך פגום, פג או חתום בסוד אחר מחזיר false, ולכן חידוש לעולם לא פותח סשן
 * למי שאין לו כבר סשן תקף.
 */
export function shouldRenewSession(
  value: string | null | undefined,
  secret: string | null,
  now = Date.now(),
  thresholdDays = ADMIN_SESSION_RENEW_THRESHOLD_DAYS,
): boolean {
  if (!value || !verifySessionValue(value, secret, now)) return false;
  /* verifySessionValue כבר וידא שיש נקודה ושהתפוגה מספר */
  const expiresAtMs = Number(value.slice(0, value.indexOf(".")));
  return expiresAtMs - now < thresholdDays * DAY_MS;
}
