/**
 * עמודים בלי פס הפעולה התחתון במובייל: יש להם סרגל CTA תחתון משלהם, או שהם כלי
 * פנימי. מקור יחיד לפס (MobileActionBar) ולכפתורים הצפים (FloatingFabs), כדי
 * שכפתור הוואטסאפ הצף יוסתר במובייל בדיוק במקומות שהפס מחליף אותו, ולא במקום
 * אחר.
 */
export const ACTION_BAR_HIDE_PREFIXES = [
  "/contact",
  "/book",
  "/pricing",
  "/admin",
] as const;

export function matchesRoutePrefix(
  pathname: string,
  prefixes: readonly string[],
): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * עמודים רגישים שבהם אין שום אלמנט מכירתי צף: וואטסאפ צף, צ'אט, פס תחתון ופופאפים.
 * כפתור הנגישות נשאר, כי הוא לא מכירתי. החלטת הבעלים 8.10.2026 (B19) לגבי
 * /studio/legacy-recording, דף על זיכרון משפחתי.
 */
export const QUIET_ROUTE_PREFIXES = ["/studio/legacy-recording"] as const;

export function isQuietRoute(pathname: string): boolean {
  return matchesRoutePrefix(pathname, QUIET_ROUTE_PREFIXES);
}

/** האם פס הפעולה התחתון מוצג בעמוד הזה (במובייל) */
export function hasMobileActionBar(pathname: string): boolean {
  return (
    !matchesRoutePrefix(pathname, ACTION_BAR_HIDE_PREFIXES) &&
    !isQuietRoute(pathname)
  );
}
