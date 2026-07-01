import type { BookingUpsellItem } from "@/lib/data/booking-shared";
import {
  STUDIO_RECORDING_UPGRADES,
  STUDIO_UPGRADES_BY_PATH,
  STUDIO_VIDEO_UPGRADES_HIDDEN_ON_PACKAGE,
  type StudioPackageId,
  type StudioUpgradeId,
} from "@/lib/data/studio-recording-booking";

const STUDIO_UPGRADE_BTS_YOUTUBE = "8p22YCZEsmg";

const PODCAST_URBAN_IMAGE =
  "/images/services/podcast/אולפן פודקאסט לעסקים - החלק האורבני - יקיר כהן הפקות במודיעין.webp";

type UpgradeDisplayMeta = {
  whatYouGet?: string;
  imageSrc?: string;
  youtubeVideoId?: string;
  thumbIcon?: string;
};

const UPGRADE_DISPLAY: Partial<Record<StudioUpgradeId, UpgradeDisplayMeta>> = {
  bts: {
    whatYouGet: "צילומים מקצועיים מהסשן - לשמירה ולשיתוף",
    youtubeVideoId: STUDIO_UPGRADE_BTS_YOUTUBE,
  },
  studio_session_video: {
    whatYouGet: "סרטון מערוך מההקלטה - דוגמה בלחיצה",
    youtubeVideoId: "wINztIFDN08",
  },
  performance_clip: {
    whatYouGet: "סרטון מערוך מוכן להקרנה ולרשתות",
  },
  podcast_interview: {
    whatYouGet: "במתחם הפודקאסט האורבני המשפחתי",
    imageSrc: PODCAST_URBAN_IMAGE,
  },
  express: {
    whatYouGet: "עדיפות בלו\"ז והגשה מהירה במיוחד",
    thumbIcon: "⚡",
  },
  vocal_coaching: {
    whatYouGet: "תגיעו לאולפן מוכנים ובטוחים",
  },
  ai_playback: {
    whatYouGet: "לחן מקורי לפי הסגנון שלכם",
    youtubeVideoId: "r8Xk2_m9FJ8",
  },
};

export function buildStudioUpgradeItems(
  packageId: StudioPackageId | "",
  bookingPath: keyof typeof STUDIO_UPGRADES_BY_PATH | null,
): BookingUpsellItem[] {
  const pathIds = bookingPath ? STUDIO_UPGRADES_BY_PATH[bookingPath] : null;
  const hidden =
    packageId && STUDIO_VIDEO_UPGRADES_HIDDEN_ON_PACKAGE[packageId]
      ? new Set(STUDIO_VIDEO_UPGRADES_HIDDEN_ON_PACKAGE[packageId])
      : null;

  return STUDIO_RECORDING_UPGRADES.filter((u) => {
    if (pathIds && !pathIds.includes(u.id)) return false;
    if (hidden?.has(u.id)) return false;
    return true;
  }).map((u) => {
    const meta = UPGRADE_DISPLAY[u.id];
    return {
      id: u.id,
      name: u.name,
      description: u.description,
      price: u.price,
      badge: u.badge,
      whatYouGet: meta?.whatYouGet,
      imageSrc: meta?.imageSrc,
      youtubeVideoId: meta?.youtubeVideoId,
      thumbIcon: meta?.thumbIcon,
    };
  });
}
