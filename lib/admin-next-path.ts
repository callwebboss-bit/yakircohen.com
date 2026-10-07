/**
 * נתיבי הכניסה לניהול והפרמטר next: לאן חוזרים אחרי הקלדת הסוד.
 *
 * למה מודול נפרד: lib/admin-auth.ts מייבא server-only ו-next/headers, ולכן
 * אי אפשר לבדוק אותו בבדיקת יחידה. הבדיקה כאן היא מה שמונע הפניה פתוחה
 * (open redirect): בלעדיה, קישור כמו /admin/login?next=//evil.example היה
 * שולח את יקיר, מיד אחרי שהקליד את הסוד, לאתר מתחזה שנראה כמו העמוד שלו.
 * lib/admin-next-path.test.ts בודק אותו.
 *
 * הקבועים יושבים כאן, ו-lib/admin-auth.ts מייצא אותם הלאה, כדי שהבודק יוכל
 * לפסול את עמוד הכניסה עצמו בלי לייבא קוד שרת.
 */

export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin/leads";

const ADMIN_PREFIX = "/admin/";
/* נתיב אמיתי בניהול קצר בהרבה. התקרה רק חוסמת זבל ארוך ב-URL. */
const MAX_NEXT_LENGTH = 512;
/* בסיס פיקטיבי לפענוח בלבד. אם הפענוח יוצא ממנו, הנתיב ניסה לצאת מהאתר. */
const PARSE_BASE = "https://admin-next.invalid";

/* דפדפנים מוחקים טאב ושורה חדשה מכתובות, ואז "/\t/" הופך ל-"//". לולאה על
   קודי התווים ולא ביטוי רגולרי, כי no-control-regex של eslint פוסל טווח בקרה. */
function hasControlOrSpace(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code <= 0x20 || code === 0x7f) return true;
  }
  return /\s/.test(value);
}

/**
 * מחזיר את הנתיב אם בטוח לחזור אליו אחרי כניסה, אחרת null.
 *
 * בטוח = מחרוזת שמתחילה ב-/admin/, בלי "//", בלי "\" ובלי תווי בקרה או
 * רווחים, שאחרי פענוח URL נשארת באותו אתר ותחת /admin/ (כך נתפסים גם
 * "/admin/../" ו-"%2e%2e"), ושאינה עמוד הכניסה עצמו (אחרת חוזרים ללולאה).
 */
export function safeAdminNextPath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (raw.length > MAX_NEXT_LENGTH) return null;
  if (!raw.startsWith(ADMIN_PREFIX)) return null;
  if (raw.includes("//") || raw.includes("\\")) return null;
  if (hasControlOrSpace(raw)) return null;

  let url: URL;
  try {
    url = new URL(raw, PARSE_BASE);
  } catch {
    return null;
  }
  if (url.origin !== PARSE_BASE) return null;
  if (!url.pathname.startsWith(ADMIN_PREFIX)) return null;
  if (url.pathname === ADMIN_LOGIN_PATH || url.pathname.startsWith(`${ADMIN_LOGIN_PATH}/`)) {
    return null;
  }
  return raw;
}

/** לאן להפנות אחרי כניסה מוצלחת: next אם בטוח, אחרת דף הבית של הניהול. */
export function resolveAdminNextPath(raw: unknown): string {
  return safeAdminNextPath(raw) ?? ADMIN_HOME_PATH;
}

/**
 * כתובת עמוד הכניסה, עם next כשהוא בטוח ועם קוד שגיאה כשיש.
 * עמוד שמפנה משתמש לא מחובר קורא לזה עם הנתיב של עצמו, למשל
 * adminLoginUrl("/admin/sales"), ואחרי הכניסה חוזרים אליו.
 */
export function adminLoginUrl(next?: unknown, error?: "1" | "rate"): string {
  const params = new URLSearchParams();
  if (error) params.set("error", error);
  const safeNext = safeAdminNextPath(next);
  if (safeNext) params.set("next", safeNext);
  const query = params.toString();
  return query ? `${ADMIN_LOGIN_PATH}?${query}` : ADMIN_LOGIN_PATH;
}
