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
 * השרת מנפיק קוקי חדש לקוקי תקף שנשארו לו פחות מ-7 ימים, כדי שהקוקי לא
 * יפוג באמצע אירוע כשלקוח מחכה לתשובה.
 *
 * מ-7.10.2026 יש גם תקרה (החלטת הבעלים: "תוקף 90"): רגע הכניסה חתום בתוך
 * הקוקי, החידוש שומר אותו, ואחרי 90 יום מהכניסה הקוקי פג גם אם השתמשו בו כל
 * יום. אז מקלידים את הסוד שוב. בלי התקרה, קוקי שדלף היה מתחדש לנצח.
 *
 * המבנה: `<תפוגה>.<רגע הכניסה>.<HMAC של הגרסה, התפוגה ורגע הכניסה>`.
 * הגרסה עלתה ל-v3, ולכן כל קוקי קיים נפסל והכניסה הבאה דורשת הקלדה אחת
 * של הסוד. זו הכוונה.
 */
const SESSION_VERSION = "admin-session-v3";

export const ADMIN_COOKIE_MAX_AGE_SEC = 30 * 24 * 60 * 60;

/* 7 ימים לפני התפוגה מתחילים לחדש (תוכנית עמדת המכירות, סעיף 9, 6.10.2026). */
export const ADMIN_SESSION_RENEW_THRESHOLD_DAYS = 7;

/* תקרה מרגע הכניסה, החלטת הבעלים 7.10.2026. */
export const ADMIN_SESSION_ABSOLUTE_MAX_DAYS = 90;

const DAY_MS = 24 * 60 * 60 * 1000;

type ParsedSession = { expiresAtMs: number; loginAtMs: number; signature: string };

function signSession(expiresAtMs: number, loginAtMs: number, secret: string): string {
  return createHmac("sha256", secret)
    .update(`${SESSION_VERSION}.${expiresAtMs}.${loginAtMs}`)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

function parseSession(value: string): ParsedSession | null {
  const parts = value.split(".");
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;
  const expiresAtMs = Number(parts[0]);
  const loginAtMs = Number(parts[1]);
  if (!Number.isFinite(expiresAtMs) || !Number.isFinite(loginAtMs)) return null;
  return { expiresAtMs, loginAtMs, signature: parts[2] };
}

/** סוף התקרה: 90 יום מרגע הכניסה. */
function absoluteEndMs(loginAtMs: number): number {
  return loginAtMs + ADMIN_SESSION_ABSOLUTE_MAX_DAYS * DAY_MS;
}

/**
 * מנפיק ערך חדש. loginAtMs הוא רגע הכניסה: בכניסה הוא now, ובחידוש מעבירים את
 * רגע הכניסה המקורי (readSessionLoginAt), כדי שהתקרה לא תזוז. התפוגה היא 30
 * יום מעכשיו, אבל לא אחרי התקרה.
 */
export function issueSessionValue(
  secret: string | null,
  now = Date.now(),
  loginAtMs = now,
): string | null {
  if (!secret) return null;
  const expiresAtMs = Math.min(now + ADMIN_COOKIE_MAX_AGE_SEC * 1000, absoluteEndMs(loginAtMs));
  return `${expiresAtMs}.${loginAtMs}.${signSession(expiresAtMs, loginAtMs, secret)}`;
}

/** מאמת מבנה, תפוגה, תקרה וחתימה. כל כשל מחזיר false בלי להסגיר איזה מהם. */
export function verifySessionValue(
  value: string | null | undefined,
  secret: string | null,
  now = Date.now(),
): boolean {
  if (!secret || !value) return false;
  const parsed = parseSession(value);
  if (!parsed) return false;
  const { expiresAtMs, loginAtMs, signature } = parsed;
  if (expiresAtMs <= now) return false;
  /* רגע כניסה מהעתיד או תפוגה אחרי התקרה לא נוצרים אצלנו, ולכן נפסלים */
  if (loginAtMs > now || now >= absoluteEndMs(loginAtMs)) return false;
  if (expiresAtMs > absoluteEndMs(loginAtMs)) return false;
  return safeEqual(signature, signSession(expiresAtMs, loginAtMs, secret));
}

/** רגע הכניסה מתוך ערך תקף, לחידוש. ערך לא תקף מחזיר null. */
export function readSessionLoginAt(
  value: string | null | undefined,
  secret: string | null,
  now = Date.now(),
): number | null {
  if (!value || !verifySessionValue(value, secret, now)) return null;
  return parseSession(value)?.loginAtMs ?? null;
}

/** כמה שניות נשארו לערך עד התפוגה, ל-maxAge של הקוקי. ערך פגום מחזיר 0. */
export function sessionMaxAgeSec(value: string, now = Date.now()): number {
  const parsed = parseSession(value);
  if (!parsed) return 0;
  return Math.max(0, Math.floor((parsed.expiresAtMs - now) / 1000));
}

/**
 * האם להנפיק קוקי חדש: רק לערך תקף שנשארו לו פחות מ-thresholdDays ימים, ורק
 * כשהחידוש באמת מאריך אותו. כשהתפוגה כבר צמודה לתקרה של 90 יום אין מה לחדש,
 * והכניסה הבאה דורשת את הסוד. ערך פגום, פג או חתום בסוד אחר מחזיר false,
 * ולכן חידוש לעולם לא פותח סשן למי שאין לו כבר סשן תקף.
 */
export function shouldRenewSession(
  value: string | null | undefined,
  secret: string | null,
  now = Date.now(),
  thresholdDays = ADMIN_SESSION_RENEW_THRESHOLD_DAYS,
): boolean {
  if (!value || !verifySessionValue(value, secret, now)) return false;
  const parsed = parseSession(value);
  if (!parsed) return false;
  if (parsed.expiresAtMs >= absoluteEndMs(parsed.loginAtMs)) return false;
  return parsed.expiresAtMs - now < thresholdDays * DAY_MS;
}
