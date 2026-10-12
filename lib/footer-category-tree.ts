/**
 * 8 קטגוריות פוטר, נגזרות מ-FOOTER_SEMANTIC_TREE (מקור אמת ל-crawl).
 * Additive only: לא מוחקים קישורים, רק מארגנים מחדש.
 *
 * תוכנית הבהירות, שלב 6ב (12.10.2026): הסדר כמו בתפריט העליון (אולפן, מתנות,
 * פודקאסט, אירועים), ושתי קבוצות חדשות: "מתנות" (/matanot לא היה מקושר מהפוטר
 * בכלל) ו"לעסקים" (11 עמודי /business ישבו תחת "פודקאסט"). כל קישור נשאר, וכל
 * כותרת קיימת נשארת בשמה.
 */
import type { SeoFooterLink } from "@/lib/seo-footer-links";
import { FOOTER_SEMANTIC_TREE } from "@/lib/seo-footer-links";

export type FooterCategoryId =
  | "studio"
  | "gifts"
  | "podcast"
  | "business"
  | "ai"
  | "events"
  | "video"
  | "academy";

export type FooterCategoryGroup = {
  id: FooterCategoryId;
  label: string;
  hubHref: string;
  hubTitle: string;
  links: readonly SeoFooterLink[];
};

const LEGAL_HREFS = new Set([
  "/privacy",
  "/terms",
  "/accessibility",
  "/sustainability",
  "/pricing",
]);

/** קישורי עמודה 5 שאינם משפטיים. לא מרונדרים בפוטר, ראה FOOTER_LEGAL_ROW_LINKS. */
export const FOOTER_UTILITY_LINKS: readonly SeoFooterLink[] =
  FOOTER_SEMANTIC_TREE[4]!.links.filter((l) => !LEGAL_HREFS.has(l.href));

/**
 * שורת "מידע משפטי ותפעולי" בפוטר, כפי שהיא מרונדרת ב-FooterLegalLinks.
 *
 * למה כאן ולא ברכיב: collectFooterNavPaths מזין את audit:nav-coverage, ועד
 * 15.9.2026 הוא הזין אותו ב-FOOTER_UTILITY_LINKS, שמעולם לא רונדרו. האודיט
 * אישר "מכוסה בפוטר" לעמודים שאף פוטר לא קישר אליהם: /data/industry-2026
 * נמדד עם אפס קישורים נכנסים בכל האתר. שומר שמאשר כיסוי שלא קיים מסוכן
 * יותר משומר שאין. עכשיו הרכיב והאודיט קוראים את אותה רשימה.
 *
 * /shop ו-/data/industry-2026 נוספו ב-15.9.2026: שניהם היו בלי אף קישור
 * פנימי. התוויות הן ה-h1 של העמודים, בקיצור.
 */
export const FOOTER_LEGAL_ROW_LINKS = [
  { href: "/contact", label: "יצירת קשר" },
  { href: "/about/faq", label: "שאלות נפוצות" },
  { href: "/shop", label: "חנות שוברים וציוד" },
  { href: "/data/industry-2026", label: "נתוני תעשייה 2026" },
  { href: "/data/recording-studio-costs-2026", label: "עלות אולפן הקלטות" },
  /* 12.10.2026 (שלב 6ב): המגזין ישב תחת "פודקאסט". הוא לכל האתר, ולכן כאן */
  { href: "/blog", label: "מגזין הסאונד וההפקות" },
  { href: "/pricing", label: "מחירון" },
  /* 11.10.2026: לתיק העבודות לא היה קישור מה-header, מה-footer או מעמוד הבית */
  { href: "/portfolio", label: "תיק עבודות" },
] as const;

export const FOOTER_CTA_PATHS = [
  "/online/vocal-fix/send-file",
  "/book",
] as const;

function dedupeLinks(links: SeoFooterLink[]): SeoFooterLink[] {
  const seen = new Set<string>();
  const out: SeoFooterLink[] = [];
  for (const link of links) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    out.push(link);
  }
  return out;
}

function classifyCol4Href(href: string): FooterCategoryId {
  if (href.startsWith("/academy") || href.startsWith("/voiceover")) return "academy";
  if (
    href.startsWith("/video") ||
    href.startsWith("/photography") ||
    href === "/photo-slideshow"
  ) {
    return "video";
  }
  if (href === "/pro" || href.startsWith("/events/dj") || href === "/pro/event-index") {
    return "events";
  }
  if (href.startsWith("/online")) return "ai";
  if (href.startsWith("/business")) return "business";
  if (href === "/blog") return "podcast";
  return "academy";
}

function buildCategoryLinks(): Record<FooterCategoryId, SeoFooterLink[]> {
  const buckets: Record<FooterCategoryId, SeoFooterLink[]> = {
    studio: [],
    gifts: [],
    podcast: [],
    business: [],
    ai: [],
    events: [],
    video: [],
    academy: [],
  };

  const col1 = FOOTER_SEMANTIC_TREE[0]!.links;
  for (const link of col1) {
    if (link.href === "/studio/recording-song-modiin/gifts") {
      buckets.gifts.push(link);
    } else if (link.href.startsWith("/studio")) {
      buckets.studio.push(link);
    } else if (link.href.startsWith("/online")) {
      buckets.ai.push(link);
    }
  }

  for (const link of FOOTER_SEMANTIC_TREE[1]!.links) {
    if (link.href.startsWith("/business")) buckets.business.push(link);
    else if (link.href !== "/blog") buckets.podcast.push(link);
  }

  buckets.podcast.unshift({
    label: "מרכז פודקאסט",
    href: "/podcast",
    title: "הפקת פודקאסט, הקלטה, עריכה והפצה",
  });
  buckets.podcast = dedupeLinks(buckets.podcast);

  for (const link of FOOTER_SEMANTIC_TREE[2]!.links) {
    buckets.events.push(link);
  }

  for (const link of FOOTER_SEMANTIC_TREE[3]!.links) {
    buckets[classifyCol4Href(link.href)].push(link);
  }

  /* שובר המתנה להורדה: עמוד המתנות היחיד שלא היה מקושר מהפוטר מלבד /matanot עצמו */
  buckets.gifts.push({
    label: "שובר מתנה להקלטה באולפן",
    href: "/matanot/gift-voucher",
    title: "שובר מתנה להקלטה באולפן: עיצוב והורדה",
  });

  /* /blog עבר לשורת המידע (FOOTER_LEGAL_ROW_LINKS), גם כשהוא מגיע מעמודה 4 */
  buckets.podcast = buckets.podcast.filter((l) => l.href !== "/blog");

  buckets.video.unshift({
    label: "מרכז צילום",
    href: "/photography",
    title: "צילום חתונות, אירועים וכנסים",
  });

  for (const key of Object.keys(buckets) as FooterCategoryId[]) {
    buckets[key] = dedupeLinks(buckets[key]);
  }

  return buckets;
}

const categoryLinks = buildCategoryLinks();

export const FOOTER_CATEGORY_TREE: readonly FooterCategoryGroup[] = [
  {
    id: "studio",
    label: "אולפן הקלטות",
    hubHref: "/studio",
    hubTitle: "מרכז האולפן, הקלטות במודיעין והמרכז",
    links: categoryLinks.studio,
  },
  {
    id: "gifts",
    label: "מתנות",
    hubHref: "/matanot",
    hubTitle: "מתנה מוקלטת לפי אירוע",
    links: categoryLinks.gifts,
  },
  {
    id: "podcast",
    label: "פודקאסט",
    /* היה /podcast/bulk-production, עמוד משנה של B2B, בכל עמוד באתר. */
    hubHref: "/podcast",
    hubTitle: "הפקת פודקאסט, הקלטה, עריכה והפצה",
    links: categoryLinks.podcast,
  },
  {
    id: "events",
    label: "DJ ואטרקציות",
    hubHref: "/events",
    hubTitle: "DJ, הגברה ואטרקציות לאירועים",
    links: categoryLinks.events,
  },
  {
    id: "business",
    label: "לעסקים",
    hubHref: "/business",
    hubTitle: "הפקת תוכן לעסקים - קריינות ופודקאסט",
    links: categoryLinks.business,
  },
  {
    id: "ai",
    label: "שירותי AI",
    hubHref: "/online",
    hubTitle: "שחזור סאונד, מיקס ותיקון זיופים מרחוק",
    links: categoryLinks.ai,
  },
  {
    id: "video",
    label: "צילום וידאו",
    hubHref: "/video",
    hubTitle: "הפקת וידאו וצילום לאירועים ולעסקים",
    links: categoryLinks.video,
  },
  {
    id: "academy",
    label: "אקדמיה",
    hubHref: "/academy",
    hubTitle: "קורסים, סדנאות ולימוד מקצועי",
    links: categoryLinks.academy,
  },
] as const;

/** כל הנתיבים שמופיעים בפוטר, ל-audit-nav-coverage */
export function collectFooterNavPaths(): string[] {
  const paths = new Set<string>();

  for (const cat of FOOTER_CATEGORY_TREE) {
    paths.add(cat.hubHref);
    for (const link of cat.links) {
      paths.add(link.href);
    }
  }

  for (const link of FOOTER_LEGAL_ROW_LINKS) {
    paths.add(link.href);
  }

  for (const href of FOOTER_CTA_PATHS) {
    paths.add(href);
  }

  paths.add("/pricing");
  paths.add("/privacy");
  paths.add("/terms");
  paths.add("/whats-included");
  paths.add("/accessibility");
  paths.add("/sustainability");

  return [...paths];
}
