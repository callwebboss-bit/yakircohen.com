import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

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
export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin/leads";
const ADMIN_COOKIE_MAX_AGE_SEC = 30 * 24 * 60 * 60;

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
const SESSION_VERSION = "admin-session-v1";

function sessionValue(): string | null {
  const secret = expectedToken();
  if (!secret) return null;
  return createHmac("sha256", secret).update(SESSION_VERSION).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/** True when the current request carries a valid admin session cookie. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = sessionValue();
  if (!expected) return false;
  const store = await cookies();
  const cookie = store.get(ADMIN_COOKIE_NAME)?.value?.trim();
  return Boolean(cookie) && safeEqual(cookie as string, expected);
}

/** Cookie or `Authorization: Bearer` - for route handlers hit by the browser or by the local Closer. */
export async function isAdminRequestAuthorized(request: Request): Promise<boolean> {
  const auth = request.headers.get("authorization")?.trim();
  if (auth?.startsWith("Bearer ")) {
    return verifyAdminToken(auth.slice("Bearer ".length));
  }
  return isAdminAuthenticated();
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  /* מקבל את הסוד, שומר נגזרת. אם הסוד שגוי אין מה לשמור. */
  if (!verifyAdminToken(token)) return;
  const value = sessionValue();
  if (!value) return;
  const store = await cookies();
  store.set({
    name: ADMIN_COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Site-wide: the export route lives under /api/admin/*, which a "/admin" path would not cover.
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE_SEC,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Site-wide: the export route lives under /api/admin/*, which a "/admin" path would not cover.
    path: "/",
    maxAge: 0,
  });
}
