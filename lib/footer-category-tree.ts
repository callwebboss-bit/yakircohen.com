/**
 * 6 קטגוריות פוטר — נגזרות מ-FOOTER_SEMANTIC_TREE (מקור אמת ל-crawl).
 * Additive only: לא מוחקים קישורים, רק מארגנים מחדש.
 */
import type { SeoFooterLink } from "@/lib/seo-footer-links";
import { FOOTER_SEMANTIC_TREE } from "@/lib/seo-footer-links";

export type FooterCategoryId =
  | "studio"
  | "podcast"
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

const LEGAL_HREFS = new Set(["/privacy", "/terms", "/accessibility", "/pricing"]);

/** קישורי עמודה 5 שאינם משפטיים — נשארים ב-audit */
export const FOOTER_UTILITY_LINKS: readonly SeoFooterLink[] =
  FOOTER_SEMANTIC_TREE[4]!.links.filter((l) => !LEGAL_HREFS.has(l.href));

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
  if (href.startsWith("/business") || href === "/blog") return "podcast";
  return "academy";
}

function buildCategoryLinks(): Record<FooterCategoryId, SeoFooterLink[]> {
  const buckets: Record<FooterCategoryId, SeoFooterLink[]> = {
    studio: [],
    podcast: [],
    ai: [],
    events: [],
    video: [],
    academy: [],
  };

  const col1 = FOOTER_SEMANTIC_TREE[0]!.links;
  for (const link of col1) {
    if (link.href.startsWith("/studio")) {
      buckets.studio.push(link);
    } else if (link.href.startsWith("/online")) {
      buckets.ai.push(link);
    }
  }

  for (const link of FOOTER_SEMANTIC_TREE[1]!.links) {
    buckets.podcast.push(link);
  }

  buckets.podcast.unshift({
    label: "מרכז פודקאסט",
    href: "/podcast",
    title: "הפקת פודקאסט — הקלטה, עריכה והפצה",
  });
  buckets.podcast = dedupeLinks(buckets.podcast);

  for (const link of FOOTER_SEMANTIC_TREE[2]!.links) {
    buckets.events.push(link);
  }

  for (const link of FOOTER_SEMANTIC_TREE[3]!.links) {
    buckets[classifyCol4Href(link.href)].push(link);
  }

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
    hubTitle: "מרכז האולפן — הקלטות במודיעין והמרכז",
    links: categoryLinks.studio,
  },
  {
    id: "podcast",
    label: "פודקאסט לעסקים",
    hubHref: "/podcast/bulk-production",
    hubTitle: "פס ייצור לפודקאסט לעסקים",
    links: categoryLinks.podcast,
  },
  {
    id: "ai",
    label: "שירותי AI",
    hubHref: "/online",
    hubTitle: "שחזור סאונד, מיקס ותיקון זיופים מרחוק",
    links: categoryLinks.ai,
  },
  {
    id: "events",
    label: "DJ ואטרקציות",
    hubHref: "/events",
    hubTitle: "DJ, הגברה ואטרקציות לאירועים",
    links: categoryLinks.events,
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

/** כל הנתיבים שמופיעים בפוטר — ל-audit-nav-coverage */
export function collectFooterNavPaths(): string[] {
  const paths = new Set<string>();

  for (const cat of FOOTER_CATEGORY_TREE) {
    paths.add(cat.hubHref);
    for (const link of cat.links) {
      paths.add(link.href);
    }
  }

  for (const link of FOOTER_UTILITY_LINKS) {
    paths.add(link.href);
  }

  for (const href of FOOTER_CTA_PATHS) {
    paths.add(href);
  }

  paths.add("/pricing");
  paths.add("/privacy");
  paths.add("/terms");
  paths.add("/accessibility");

  return [...paths];
}
