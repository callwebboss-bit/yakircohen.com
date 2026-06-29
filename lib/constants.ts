import { SITE_HUB_LINKS } from "@/lib/site-architecture";

export const SITE_NAME = "יקיר כהן הפקות";

/** Short label for page kickers (no first name) */
export const SITE_KICKER = "הפקות מקצועית במודיעין";

/** Brand logo - header and footer */
export const SITE_LOGO_SRC = "/images/logo.svg";

/** Studio photo for hero and studio marketing blocks */
export const SITE_STUDIO_IMAGE_SRC =
  "/images/services/studio/hub/אולפן פודקאסט - יקיר כהן 1.webp";

export const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/yakir.cohen.official/",
    label: "Instagram",
    icon: "📸",
  },
  {
    href: "https://www.tiktok.com/@yakir.cohen.offical",
    label: "TikTok",
    icon: "🎵",
  },
  {
    href: "https://www.facebook.com/dj.yakir.cohen/",
    label: "Facebook",
    icon: "👍",
  },
  {
    href: "https://www.youtube.com/@Yakircohen",
    label: "YouTube",
    icon: "▶️",
  },
] as const;

/** Homepage featured reel - @Yakircohen */
export const FEATURED_YOUTUBE_VIDEO_ID = "XUr2e5S4JSA";
export const FEATURED_YOUTUBE_TITLE =
  "אולפן, אירועים ופודקאסט במודיעין";

export const CONTACT_PHONE_DISPLAY = "058-7555456";
export const CONTACT_PHONE_E164 = "+972587555456";
export const CONTACT_PHONE_WHATSAPP = "972587555456";

/**
 * Internal / legal requests only - never shown on public pages (anti-spam).
 * Contact UX: WhatsApp + phone only.
 */
export const CONTACT_EMAIL_INTERNAL = "callwebboss@gmail.com";

/** Physical studio - footer, contact, schema */
export const STUDIO_ADDRESS_TITLE = "יקיר כהן הפקות - אולפן הקלטות במודיעין";
export const STUDIO_ADDRESS_LINE =
  "עמק איילון 34, מודיעין מכבים רעות";

/** Combined line for metadata / schema */
export const STUDIO_ADDRESS = `${STUDIO_ADDRESS_TITLE}, ${STUDIO_ADDRESS_LINE}`;

export const STUDIO_MAPS_URL = "https://maps.app.goo.gl/mZXM2wzCtZpFKT5Y8";

export const STUDIO_GOOGLE_MAPS_URL = STUDIO_MAPS_URL;

export const STUDIO_WAZE_URL = STUDIO_MAPS_URL;

/** מרכזי תוכן - נגזר מ-site-architecture (לפוטר ומקומות ישנים) */
export const NAV_HUBS = [
  ...SITE_HUB_LINKS,
  { href: "/blog", label: "מגזין מקצועי" },
] as const;

/** Footer-only links (trust links live in FOOTER_SEMANTIC_TREE column 5) */
export const FOOTER_EXTRA_LINKS: readonly { href: string; label: string }[] = [];

export const FOOTER_LEGAL_LINKS = [
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/accessibility", label: "הצהרת נגישות" },
  { href: "/terms", label: "תנאי שירות" },
] as const;

export type LegalPageHref = (typeof FOOTER_LEGAL_LINKS)[number]["href"];

export const BUSINESS_HOURS = [
  { days: "ראשון - חמישי", hours: "09:00 - 20:00" },
  { days: "שישי", hours: "09:00 - 14:00" },
  { days: "שבת", hours: "סגור" },
] as const;

/** Trust metrics - homepage, book page, badges (edit values here) */
export const GOOGLE_RATING = "4.9";
export const GOOGLE_RATING_BEST = "5";
export const GOOGLE_RATING_WORST = "1";
/** Optional - shown in badge + schema when set (update from Google Business Profile) */
export const GOOGLE_REVIEW_COUNT = "150";
export const GOOGLE_RATING_LABEL = "דירוג Google";

export const SITE_TRUST_STATS = [
  { value: "20+", label: "שנות ניסיון" },
  { value: "5,000+", label: "לקוחות מרוצים" },
  { value: `${GOOGLE_RATING} ★`, label: GOOGLE_RATING_LABEL },
] as const;
