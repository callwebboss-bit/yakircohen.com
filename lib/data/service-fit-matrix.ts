/**
 * מטריצת התאמת שירותים — additive בלבד על pathnames קיימים.
 * מזינה HubAudienceFitBlock, ServiceFitSnapshot, PageRelatedFooter.
 * לא יוצרת URLs חדשים ולא משנה canonical.
 */

import { getDecisionPaths } from "@/lib/data/service-decision-paths";
import { getNextUpSuggestion } from "@/lib/data/next-up";
import { getSameCategoryLinks } from "@/lib/site-architecture";

export type FitAudience = "families" | "creators" | "business";
export type FitDelivery = "in_studio" | "mobile" | "on_site" | "self_service";
export type FitGuidance = "self_service" | "assisted" | "full_production";
export type FitOutcome =
  | "ready_song"
  | "recorded_blessing"
  | "finished_podcast_episode"
  | "video_clip"
  | "finished_audiobook"
  | "business_content_day";

export type ServiceFitEntry = {
  pathname: string;
  hubPath: string;
  titleHe: string;
  primaryAudience: FitAudience;
  secondaryAudience?: FitAudience;
  delivery: FitDelivery;
  guidance: FitGuidance;
  outcome: FitOutcome;
  /** דף מומלץ הבא — pathname קיים בלבד */
  nextPath: string;
  priceAnchorExVat?: number;
  notes?: string;
};

export const FIT_AUDIENCE_LABEL: Record<FitAudience, string> = {
  families: "משפחות ופרטיים",
  creators: "יוצרים ופודקאסטרים",
  business: "עסקים וצוותים",
};

export const FIT_DELIVERY_LABEL: Record<FitDelivery, string> = {
  in_studio: "באולפן",
  mobile: "נייד — מגיע אליכם",
  on_site: "אצל הלקוח",
  self_service: "עצמאי / מרחוק",
};

export const FIT_GUIDANCE_LABEL: Record<FitGuidance, string> = {
  self_service: "שירות עצמי",
  assisted: "עם ליווי",
  full_production: "הפקה מלאה",
};

export const FIT_OUTCOME_LABEL: Record<FitOutcome, string> = {
  ready_song: "שיר מוכן",
  recorded_blessing: "ברכה מוקלטת",
  finished_podcast_episode: "פרק פודקאסט מוכן",
  video_clip: "וידאו / קליפ",
  finished_audiobook: "ספר שמע מוכן",
  business_content_day: "יום תוכן לעסק",
};

/** מחירון לפי hub — להשוואה ב-PageRelatedFooter */
const HUB_PRICING_PATH: Record<string, string> = {
  "/studio": "/studio/pricing",
  "/podcast": "/pricing",
  "/events": "/pricing",
  "/business": "/pricing",
  "/academy": "/pricing",
  "/online": "/online/online-ai-pricing",
  "/voiceover": "/pricing",
  "/video": "/pricing",
  "/photography": "/pricing",
};

/**
 * שירותים ראשיים בלבד (לא כל עלי האטרקציות / FAQ).
 * קהל ראשי אחד; secondary רק כשמשפר בהירות.
 */
export const SERVICE_FIT_MATRIX: readonly ServiceFitEntry[] = [
  // ── Studio ──
  {
    pathname: "/studio/recording-song-modiin",
    hubPath: "/studio",
    titleHe: "הקלטת שיר",
    primaryAudience: "families",
    secondaryAudience: "creators",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "ready_song",
    nextPath: "/studio/blessings/video-clip",
    priceAnchorExVat: 1200,
  },
  {
    pathname: "/studio/recording-song-modiin/gifts",
    hubPath: "/studio",
    titleHe: "שיר במתנה",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
  },
  {
    pathname: "/studio/blessings",
    hubPath: "/studio",
    titleHe: "הקלטת ברכה",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "recorded_blessing",
    nextPath: "/studio/recording-song-modiin",
    priceAnchorExVat: 590,
    notes: "אפשר גם מהבית — עדיין אותו outcome",
  },
  {
    pathname: "/studio/blessings/video-clip",
    hubPath: "/studio",
    titleHe: "שיר + קליפ",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/studio/recording-song-modiin",
    priceAnchorExVat: 4500,
  },
  {
    pathname: "/studio/mobile-studio",
    hubPath: "/studio",
    titleHe: "אולפן נייד",
    primaryAudience: "families",
    secondaryAudience: "business",
    delivery: "mobile",
    guidance: "full_production",
    outcome: "ready_song",
    nextPath: "/pricing",
    priceAnchorExVat: 5000,
    notes: "לא לערבב עם הקלטה באולפן מודיעין",
  },
  {
    pathname: "/studio/recording-studio",
    hubPath: "/studio",
    titleHe: "אולפן הקלטות",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/pricing",
    priceAnchorExVat: 750,
  },
  {
    pathname: "/studio/studio-jerusalem",
    hubPath: "/studio",
    titleHe: "אולפן לירושלים",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
    notes: "GEO — האולפן הפיזי במודיעין",
  },
  {
    pathname: "/studio/studio-shoham",
    hubPath: "/studio",
    titleHe: "אולפן לשוהם",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
    notes: "GEO — האולפן הפיזי במודיעין",
  },
  {
    pathname: "/studio/studio-rehovot",
    hubPath: "/studio",
    titleHe: "אולפן לרחובות",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
    notes: "GEO — האולפן הפיזי במודיעין",
  },

  // ── Podcast ──
  {
    pathname: "/podcast/podcast-recording",
    hubPath: "/podcast",
    titleHe: "הקלטת פודקאסט",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/podcast-editing",
    priceAnchorExVat: 750,
  },
  {
    pathname: "/podcast/podcast-production",
    hubPath: "/podcast",
    titleHe: "הפקת פודקאסט",
    primaryAudience: "creators",
    secondaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/podcast-editing",
    priceAnchorExVat: 1650,
  },
  {
    pathname: "/podcast/podcast-editing",
    hubPath: "/podcast",
    titleHe: "עריכת פודקאסט",
    primaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/podcast-recording",
    priceAnchorExVat: 750,
    notes: "מרחוק על קובץ קיים — לא סשן אולפן",
  },
  {
    pathname: "/podcast/podcast-studio-modiin",
    hubPath: "/podcast",
    titleHe: "השכרת אולפן פודקאסט",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "self_service",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/podcast-recording",
    priceAnchorExVat: 750,
    notes: "חדר+ציוד בלי הפקה מלאה",
  },
  {
    pathname: "/podcast/self-service-studio",
    hubPath: "/podcast",
    titleHe: "אולפן שירות עצמי",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "self_service",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/podcast-editing",
    priceAnchorExVat: 650,
  },
  {
    pathname: "/podcast/mobile-podcast-at-home",
    hubPath: "/podcast",
    titleHe: "פודקאסט נייד",
    primaryAudience: "creators",
    secondaryAudience: "families",
    delivery: "mobile",
    guidance: "full_production",
    outcome: "finished_podcast_episode",
    nextPath: "/pricing",
    priceAnchorExVat: 2500,
    notes: "לא לערבב עם הקלטה באולפן",
  },
  {
    pathname: "/podcast/podcast-with-grandpa",
    hubPath: "/podcast",
    titleHe: "פודקאסט עם סבא וסבתא",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/podcast-recording",
  },
  {
    pathname: "/podcast/corporate-podcast",
    hubPath: "/podcast",
    titleHe: "פודקאסט ארגוני",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "finished_podcast_episode",
    nextPath: "/business",
    priceAnchorExVat: 4800,
    notes: "נפרד מפודקאסט ליוצרים פרטיים",
  },
  {
    pathname: "/podcast/bulk-production",
    hubPath: "/podcast",
    titleHe: "פס ייצור פודקאסט",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/corporate-podcast",
    priceAnchorExVat: 950,
  },

  // ── Business ──
  {
    pathname: "/business/content-studio",
    hubPath: "/business",
    titleHe: "סושיאל דאמפ",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "business_content_day",
    nextPath: "/business/on-site-studio",
    priceAnchorExVat: 1650,
  },
  {
    pathname: "/business/on-site-studio",
    hubPath: "/business",
    titleHe: "אולפן זמני בחברה",
    primaryAudience: "business",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "business_content_day",
    nextPath: "/pricing",
    priceAnchorExVat: 6500,
    notes: "on-site ≠ mobile למשפחה",
  },
  {
    pathname: "/business/reel-factory",
    hubPath: "/business",
    titleHe: "מפעל רילס",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/business/content-studio",
    priceAnchorExVat: 950,
  },
  {
    pathname: "/business/audiobooks",
    hubPath: "/business",
    titleHe: "ספרי שמע",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "finished_audiobook",
    nextPath: "/voiceover/services",
    priceAnchorExVat: 750,
  },
  {
    pathname: "/business/employer-branding",
    hubPath: "/business",
    titleHe: "תוכן HR",
    primaryAudience: "business",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "business_content_day",
    nextPath: "/business/content-studio",
    priceAnchorExVat: 4500,
  },
  {
    pathname: "/business/corporate-songs",
    hubPath: "/business",
    titleHe: "שירים לחברות",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
    priceAnchorExVat: 5000,
  },

  // ── Academy ──
  {
    pathname: "/academy/dj-course",
    hubPath: "/academy",
    titleHe: "קורס DJ",
    primaryAudience: "creators",
    secondaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/academy/music-production",
  },
  {
    pathname: "/academy/music-production",
    hubPath: "/academy",
    titleHe: "הפקת מוזיקה",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
  },
  {
    pathname: "/academy/voiceover",
    hubPath: "/academy",
    titleHe: "קורס קריינות",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "recorded_blessing",
    nextPath: "/voiceover/services",
  },
  {
    pathname: "/academy/private-lessons",
    hubPath: "/academy",
    titleHe: "שיעור פרטי",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/academy",
    priceAnchorExVat: 990,
  },
  {
    pathname: "/academy/workshops",
    hubPath: "/academy",
    titleHe: "סדנאות לצוותים",
    primaryAudience: "business",
    delivery: "on_site",
    guidance: "assisted",
    outcome: "business_content_day",
    nextPath: "/business/content-studio",
    priceAnchorExVat: 2800,
  },
  {
    pathname: "/academy/ai-music",
    hubPath: "/academy",
    titleHe: "AI מוזיקה",
    primaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
  },

  // ── Online ──
  {
    pathname: "/online/vocal-fix",
    hubPath: "/online",
    titleHe: "שיפור קול",
    primaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/online/vocal-fix/send-file",
    priceAnchorExVat: 450,
  },
  {
    pathname: "/online/mashup-fixer",
    hubPath: "/online",
    titleHe: "תיקון מאשאפ",
    primaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/events/dj-events",
    priceAnchorExVat: 650,
  },
  {
    pathname: "/online/transcription",
    hubPath: "/online",
    titleHe: "תמלול וכתוביות",
    primaryAudience: "business",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "finished_podcast_episode",
    nextPath: "/online",
    priceAnchorExVat: 180,
  },

  // ── Events (primary only) ──
  {
    pathname: "/events/dj-events",
    hubPath: "/events",
    titleHe: "DJ לאירועים",
    primaryAudience: "families",
    secondaryAudience: "business",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "ready_song",
    nextPath: "/events/attractions",
    priceAnchorExVat: 5000,
  },
  {
    pathname: "/events/attractions",
    hubPath: "/events",
    titleHe: "אטרקציות",
    primaryAudience: "families",
    delivery: "on_site",
    guidance: "assisted",
    outcome: "video_clip",
    nextPath: "/events/wedding-attractions-packages",
    priceAnchorExVat: 1750,
  },
  {
    pathname: "/events/wedding-attractions-packages",
    hubPath: "/events",
    titleHe: "חבילות לחתונה",
    primaryAudience: "families",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/events/dj-events",
  },

  // ── Voiceover / Video ──
  {
    pathname: "/voiceover/services",
    hubPath: "/voiceover",
    titleHe: "שירותי קריינות",
    primaryAudience: "business",
    secondaryAudience: "creators",
    delivery: "self_service",
    guidance: "full_production",
    outcome: "recorded_blessing",
    nextPath: "/academy/voiceover",
  },
  {
    pathname: "/video/corporate-video",
    hubPath: "/video",
    titleHe: "סרט תדמית",
    primaryAudience: "business",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/business",
  },
] as const;

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

const BY_PATH = new Map(
  SERVICE_FIT_MATRIX.map((entry) => [entry.pathname, entry] as const),
);

export function getServiceFit(pathname: string): ServiceFitEntry | null {
  return BY_PATH.get(normalizePath(pathname)) ?? null;
}

export function getHubFitEntries(hubPath: string): ServiceFitEntry[] {
  const hub = normalizePath(hubPath);
  return SERVICE_FIT_MATRIX.filter((e) => e.hubPath === hub);
}

export function getHubFitByAudience(
  hubPath: string,
): Record<FitAudience, ServiceFitEntry[]> {
  const entries = getHubFitEntries(hubPath);
  return {
    families: entries.filter((e) => e.primaryAudience === "families"),
    creators: entries.filter((e) => e.primaryAudience === "creators"),
    business: entries.filter((e) => e.primaryAudience === "business"),
  };
}

export type RelatedRole = "primary" | "complementary" | "comparative";

export type RelatedLink = {
  href: string;
  label: string;
  role: RelatedRole;
};

function titleForPath(pathname: string): string {
  const fit = getServiceFit(pathname);
  if (fit) return fit.titleHe;
  const next = getNextUpSuggestion(pathname);
  if (next && next.href === pathname) return next.label;
  return pathname.split("/").filter(Boolean).at(-1) ?? pathname;
}

/**
 * עד 3 קישורים: ראשי (next-up / nextPath) · משלים · השוואתי.
 * לא כולל book/pricing כראשי — ההמרה ב-sticky.
 */
export function getPageRelatedTrio(pathname: string): RelatedLink[] {
  const path = normalizePath(pathname);
  const fit = getServiceFit(path);
  const nextUp = getNextUpSuggestion(path);
  const result: RelatedLink[] = [];
  const used = new Set<string>([path]);

  const primaryHref = nextUp?.href ?? fit?.nextPath;
  if (primaryHref && !used.has(normalizePath(primaryHref))) {
    const href = normalizePath(primaryHref);
    used.add(href);
    result.push({
      href,
      label: nextUp?.label ?? titleForPath(href),
      role: "primary",
    });
  }

  // משלים/השוואתי: קודם service-decision-paths (קיים), אחר כך siblings
  const decisionEdges = getDecisionPaths(path);
  for (const edge of decisionEdges) {
    if (result.length >= 3) break;
    const href = normalizePath(edge.href);
    if (used.has(href)) continue;
    used.add(href);
    result.push({
      href,
      label: edge.label,
      role: result.some((r) => r.role === "complementary")
        ? "comparative"
        : "complementary",
    });
  }

  const siblings = getSameCategoryLinks(path);
  for (const sib of siblings) {
    if (result.length >= 3) break;
    const href = normalizePath(sib.href);
    if (used.has(href)) continue;
    used.add(href);
    result.push({
      href,
      label: sib.label,
      role: result.some((r) => r.role === "complementary")
        ? "comparative"
        : "complementary",
    });
  }

  if (result.length < 3) {
    const hub = fit?.hubPath ?? `/${path.split("/").filter(Boolean)[0] ?? ""}`;
    const pricingHref = HUB_PRICING_PATH[hub] ?? "/pricing";
    const href = normalizePath(pricingHref);
    if (!used.has(href)) {
      result.push({
        href,
        label: href.includes("studio/pricing") ? "מחירון אולפן" : "מחירון",
        role: "comparative",
      });
    }
  }

  return result.slice(0, 3);
}
