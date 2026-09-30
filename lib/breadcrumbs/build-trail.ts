/**
 * מפת כותרות מיוצרת במקום מאגרי התוכן עצמם.
 *
 * הקובץ הזה נצרך מ-components/layout/Breadcrumbs.tsx שהוא רכיב לקוח, ולכן
 * כל ייבוא כאן נשלח לדפדפן. קודם הוא ייבא את blog.ts (409KB) ואת
 * services.ts (173KB) רק כדי לקרוא כותרות, וזו הייתה נקודת הכניסה היחידה
 * של blog.ts ללקוח בכל הריפו. עכשיו: 14KB של slug לכותרת.
 * גם תוויות דלי הקטגוריה מגיעות מההיטל, ולא מ-blog-categories.ts המלא.
 * המפה מיוצרת ב-scripts/generate-client-data.ts ונשמרת ב-audit.
 */
import {
  BREADCRUMB_BLOG_CATEGORY_TITLES,
  BREADCRUMB_BLOG_TITLES,
  BREADCRUMB_SERVICE_TITLES,
} from "@/lib/data/breadcrumb-titles.generated";
import { absoluteUrl } from "@/lib/site-url";
import {
  BREADCRUMB_PATH_OVERRIDES,
  BREADCRUMB_SEGMENT_LABELS,
} from "@/lib/breadcrumbs/segment-labels";

export type BreadcrumbItem = {
  href: string;
  label: string;
};

const HOME: BreadcrumbItem = { href: "/", label: "בית" };

function labelForPath(path: string): string {
  const override = BREADCRUMB_PATH_OVERRIDES[path];
  if (override) return override;

  const serviceTitle = BREADCRUMB_SERVICE_TITLES[path.replace(/^\//, "")];
  if (serviceTitle) return serviceTitle;

  const segments = path.replace(/^\//, "").split("/");
  const last = segments[segments.length - 1] ?? "";
  if (BREADCRUMB_SEGMENT_LABELS[last]) {
    return BREADCRUMB_SEGMENT_LABELS[last];
  }

  return last.replace(/-/g, " ").trim() || path;
}

/**
 * Builds breadcrumb trail for a pathname (no trailing slash except root).
 * Returns empty for homepage.
 */
export function buildBreadcrumbTrail(pathname: string): BreadcrumbItem[] {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/") return [];

  const override = BREADCRUMB_PATH_OVERRIDES[normalized];
  const segments = normalized.split("/").filter(Boolean);

  if (segments[0] === "blog" && segments.length === 2) {
    const postTitle = BREADCRUMB_BLOG_TITLES[segments[1]!];
    return [
      HOME,
      { href: "/blog", label: BREADCRUMB_SEGMENT_LABELS.blog },
      {
        href: normalized,
        label: postTitle ?? labelForPath(normalized),
      },
    ];
  }

  /* /blog/category/<id>: המקטע "category" אינו עמוד, ולכן הוא לא מקבל פירור
     משלו (הפירור היה מציג "category" באנגלית ומקשר ל-404). הפירור האחרון
     הוא שם הדלי כפי שהוא מוגדר ב-blog-categories.ts. */
  if (segments[0] === "blog" && segments[1] === "category" && segments.length === 3) {
    const categoryLabel = BREADCRUMB_BLOG_CATEGORY_TITLES[segments[2]!];
    return [
      HOME,
      { href: "/blog", label: BREADCRUMB_SEGMENT_LABELS.blog },
      { href: normalized, label: categoryLabel ?? labelForPath(normalized) },
    ];
  }

  const trail: BreadcrumbItem[] = [HOME];
  let acc = "";

  for (let i = 0; i < segments.length; i++) {
    acc += `/${segments[i]}`;
    const isLast = i === segments.length - 1;
    trail.push({
      href: acc,
      label: isLast && override ? override : labelForPath(acc),
    });
  }

  return trail;
}

export function breadcrumbListJsonLd(trail: BreadcrumbItem[]) {
  if (trail.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href === "/" ? "" : item.href.replace(/^\//, "")),
    })),
  };
}
