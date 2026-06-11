import type { ServiceCategory } from "@/lib/data/services";
import { SITE_NAME } from "@/lib/constants";
import { DEFAULT_OG_HEIGHT, DEFAULT_OG_WIDTH } from "@/lib/seo/page-schema";

export type OgImageConfig = {
  path: string;
  alt: string;
  width: number;
  height: number;
};

const DEFAULT_OG: OgImageConfig = {
  path: "/images/services/studio/hub/אולפן פודקאסט - יקיר כהן 1.webp",
  alt: `${SITE_NAME} - אולפן הקלטות במודיעין`,
  width: 1200,
  height: 900,
};

const CATEGORY_OG: Record<ServiceCategory, OgImageConfig> = {
  studio: {
    path: "/images/og/studio.webp",
    alt: `אולפן הקלטות וברכות - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  podcast: {
    path: "/images/og/podcast.webp",
    alt: `אולפן פודקאסט במודיעין - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  events: {
    path: "/images/og/events.webp",
    alt: `אטרקציות ו-DJ לאירועים - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  video: {
    path: "/images/og/video.webp",
    alt: `הפקת וידאו וצילום - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  photography: {
    path: "/images/og/photography.webp",
    alt: `צילום אירועים - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  voiceover: {
    path: "/images/og/voiceover.webp",
    alt: `קריינות מקצועית - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
};

export type HubOgKey =
  | "studio"
  | "podcast"
  | "events"
  | "academy"
  | "online"
  | "photography"
  | "voiceover"
  | "video"
  | "pricing"
  | "blog"
  | "book"
  | "shop"
  | "voucher";

const HUB_OG: Record<HubOgKey, OgImageConfig> = {
  book: {
    path: "/images/og/book.webp",
    alt: `הזמנה מקוונת עם מחיר שקוף - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  studio: CATEGORY_OG.studio,
  podcast: CATEGORY_OG.podcast,
  events: CATEGORY_OG.events,
  video: CATEGORY_OG.video,
  photography: CATEGORY_OG.photography,
  voiceover: CATEGORY_OG.voiceover,
  academy: {
    path: "/images/og/academy.webp",
    alt: `אקדמיה ושיעורים פרטיים - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  online: {
    path: "/images/og/online.webp",
    alt: `שירותי AI ושחזור סאונד - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  pricing: {
    path: "/images/og/pricing.webp",
    alt: `מחירון שקוף - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  blog: {
    path: "/images/og/blog.webp",
    alt: `מגזין מקצועי - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  shop: {
    path: "/images/og/shop.webp",
    alt: `חנות - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
  voucher: {
    path: "/images/og/voucher.webp",
    alt: `שובר מתנה - ${SITE_NAME}`,
    width: DEFAULT_OG_WIDTH,
    height: DEFAULT_OG_HEIGHT,
  },
};

export function resolveOgForCategory(category: ServiceCategory): OgImageConfig {
  return CATEGORY_OG[category] ?? DEFAULT_OG;
}

export function resolveOgForHub(hub: HubOgKey): OgImageConfig {
  return HUB_OG[hub];
}

export function ogImageToMetadataParam(config: OgImageConfig) {
  return {
    path: config.path,
    alt: config.alt,
    width: config.width,
    height: config.height,
  };
}
