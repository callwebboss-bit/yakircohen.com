import { getFilterCategoryId } from "@/lib/data/blog-categories";

/** הצורה המינימלית של פוסט שצריך כאן, כדי שהמודול לא יישען על blog.ts (5,000 שורות) */
export type DatedPost = {
  category: string;
  seo: { datePublished: string; dateModified?: string };
};

/**
 * תאריך שינוי של פוסט. כל הפוסטים יושבים בקובץ אחד, ו-git עוקב אחרי קובץ ולא
 * אחרי פוסט, ולכן התאריך בא משדות התוכן: dateModified כשיש, אחרת datePublished.
 * הפורמט (YYYY-MM-DD) והסדר ביניהם מובטחים ב-lib/data/blog-dates.test.ts.
 */
export function postLastModified(post: DatedPost): string {
  return post.seo.dateModified ?? post.seo.datePublished;
}

/** תאריך עמוד קטגוריה: הפוסט החדש ביותר בה. undefined לקטגוריה בלי פוסטים */
export function categoryLastModified(
  categoryId: string,
  posts: readonly DatedPost[],
): string | undefined {
  let latest: string | undefined;
  for (const post of posts) {
    if (getFilterCategoryId(post.category) !== categoryId) continue;
    const date = postLastModified(post);
    /* YYYY-MM-DD, ולכן השוואת מחרוזות היא השוואת תאריכים */
    if (!latest || date > latest) latest = date;
  }
  return latest;
}

/**
 * תאריך ראוט מתוך sitemap-dates.generated.json. התאמה מדויקת קודם, ואחריה
 * מפתח דינמי כמו "/online/[category]" שמתאים לכל כתובת בעומק הזה.
 */
export function routeDateFor(
  dates: Readonly<Record<string, string>>,
  pathname: string,
): string | undefined {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const exact = dates[normalized];
  if (exact) return exact;
  const parts = normalized.split("/");
  for (const key of Object.keys(dates)) {
    if (!key.includes("[")) continue;
    const keyParts = key.split("/");
    if (keyParts.length !== parts.length) continue;
    const matches = keyParts.every(
      (segment, i) => (segment.startsWith("[") && segment.endsWith("]") && parts[i] !== "") || segment === parts[i],
    );
    if (matches) return dates[key];
  }
  return undefined;
}
