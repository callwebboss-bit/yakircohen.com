import "server-only";
import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_MAX_AGE_SEC,
  issueSessionValue,
  shouldRenewSession,
  verifySessionValue,
} from "@/lib/admin-session-value";

/**
 * Admin session for /admin/*.
 *
 * הסוד המשותף (ADMIN_LEADS_TOKEN) מוקלד פעם אחת ב-/admin/login. הוא לעולם לא
 * מופיע ב-URL, ולכן אינו דולף להיסטוריית דפדפן, ל-Referer או ללוגים.
 *
 * הקוקי מחזיק נגזרת HMAC של הסוד ולא את הסוד עצמו. ההבדל מהותי: הסוד הוא גם
 * אישור Bearer תקף מול /api/admin/leads/export, ולכן קוקי שדולף (גיבוי מחשב,
 * סנכרון דפדפן, אירוע ב-Sentry) היה מוסר גישה מלאה ל-API. נגזרת HMAC מאמתת
 * את הסשן בלי להיות שמישה כ-Bearer.
 */

export const ADMIN_COOKIE_NAME = "yc_admin_session";
/* הנתיבים והבדיקה של next חיים במודול טהור, כדי שיהיה אפשר לבדוק אותם */
export {
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  adminLoginUrl,
  resolveAdminNextPath,
  safeAdminNextPath,
} from "@/lib/admin-next-path";

function expectedToken(): string | null {
  const value = process.env.ADMIN_LEADS_TOKEN?.trim();
  return value ? value : null;
}

/** Constant-time comparison against ADMIN_LEADS_TOKEN. False when env is unset. */
export function verifyAdminToken(candidate: string | null | undefined): boolean {
  const expected = expectedToken();
  const token = candidate?.trim();
  if (!expected || !token || token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * ערך הקוקי: HMAC-SHA256 של קבוע גרסה, עם הסוד כמפתח.
 * שינוי הקבוע מבטל את כל הסשנים הקיימים בלי לגעת ב-env.
 */
/** True when the current request carries a valid admin session cookie. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionValue(store.get(ADMIN_COOKIE_NAME)?.value?.trim(), expectedToken());
}

/** Cookie or `Authorization: Bearer` - for route handlers hit by the browser or by the local Closer. */
export async function isAdminRequestAuthorized(request: Request): Promise<boolean> {
  const auth = request.headers.get("authorization")?.trim();
  if (auth?.startsWith("Bearer ")) {
    return verifyAdminToken(auth.slice("Bearer ".length));
  }
  return isAdminAuthenticated();
}

/* אפשרויות אחידות לכניסה, לחידוש וליציאה. קוקי שמחודש עם path או sameSite
   אחרים היה נשמר בדפדפן כקוקי שני ליד הישן, ולא במקומו. */
function sessionCookie(value: string, maxAge: number) {
  return {
    name: ADMIN_COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    // Site-wide: the export route lives under /api/admin/*, which a "/admin" path would not cover.
    path: "/",
    maxAge,
  };
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  /* מקבל את הסוד, שומר נגזרת. אם הסוד שגוי אין מה לשמור. */
  if (!verifyAdminToken(token)) return;
  const value = issueSessionValue(expectedToken());
  if (!value) return;
  const store = await cookies();
  store.set(sessionCookie(value, ADMIN_COOKIE_MAX_AGE_SEC));
}

/**
 * מנפיק קוקי חדש ל-30 יום כשהנוכחי תקף ונשארו לו פחות מ-7 ימים.
 * מחזיר true רק כשחודש. בלי קוקי תקף לא קורה כלום, ולכן אין כאן דרך להיכנס
 * בלי הסוד, ואין צורך בהגבלת קצב.
 *
 * המחיר: מי שמחזיק קוקי תקף יכול להאריך אותו כל עוד הוא משתמש בו. יציאה
 * מהמערכת עדיין מוחקת אותו מהדפדפן, והחלפת ADMIN_LEADS_TOKEN ב-Vercel עדיין
 * פוסלת כל קוקי קיים, כולל כאלה שחודשו.
 */
export async function renewAdminSessionCookieIfNeeded(): Promise<boolean> {
  const secret = expectedToken();
  const store = await cookies();
  const current = store.get(ADMIN_COOKIE_NAME)?.value?.trim();
  if (!shouldRenewSession(current, secret)) return false;
  const value = issueSessionValue(secret);
  if (!value) return false;
  store.set(sessionCookie(value, ADMIN_COOKIE_MAX_AGE_SEC));
  return true;
}

export async function clearAdminSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(sessionCookie("", 0));
}
