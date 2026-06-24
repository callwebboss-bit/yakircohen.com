import type { ComponentType } from "react";
import type { BadgeVariant } from "@/components/marketing/ServiceCard";
import {
  LinkIcon,
  MicIcon,
  MusicIcon,
  RadioIcon,
  SparklesIcon,
  VideoIcon,
  ZapIcon,
} from "@/components/ui/Icons";

export type HomeHubCardIcon =
  | "studio"
  | "podcast"
  | "ai"
  | "attractions"
  | "dj-voice"
  | "business"
  | "video";

export type HomeHubCard = {
  id: HomeHubCardIcon;
  title: string;
  description: string;
  href: string;
  utmCampaign: string;
  isAiService?: boolean;
  badge?: string;
  /** צבע התווית – עדכן שבועית לפי מה שרוצים לקדם */
  badgeVariant?: BadgeVariant;
};

const ICON_MAP: Record<
  HomeHubCardIcon,
  ComponentType<{ size?: number; className?: string }>
> = {
  studio: MusicIcon,
  podcast: RadioIcon,
  ai: ZapIcon,
  attractions: SparklesIcon,
  "dj-voice": MicIcon,
  business: LinkIcon,
  video: VideoIcon,
};

/** כרטיסי hub ראשיים -- עוגן קודם, תמיכה שני, התמחות שלישי */
export const PRIMARY_HOME_HUB_CARDS: readonly HomeHubCard[] = [
  {
    id: "studio",
    title: "אולפן הקלטות",
    description: "שיר לחתונה, ברכה לבר מצווה, קליפ קצר. יוצאים עם קובץ מוכן.",
    href: "/studio",
    utmCampaign: "home_studio",
  },
  {
    id: "podcast",
    title: "פודקאסט",
    description: "מקליטים באולפן, עורכים ומעלים לספוטיפיי - פרק מוכן תוך 24 שעות.",
    href: "/podcast",
    utmCampaign: "home_podcast",
  },
  {
    id: "attractions",
    title: "אירועים ואטרקציות",
    description: "DJ, עשן כניסה, זיקוקים קרים וקונפטי לאירועים. ציוד מקצועי, הפעלה בשטח.",
    href: "/events",
    utmCampaign: "home_attractions",
  },
  {
    id: "dj-voice",
    title: "DJ לחתונות",
    description: "תקליטן מקצועי עם ציוד מלא - מודיעין, ירושלים והמרכז.",
    href: "/events/dj-events",
    utmCampaign: "home_dj_voice",
  },
  {
    id: "ai",
    title: "שירותי AI",
    description: "שחזור הקלטות, מיקס, תיקון זיופים ושדרוג תמונות.",
    href: "/online",
    utmCampaign: "home_ai_media",
    isAiService: true,
    badge: "טכנולוגיית AI",
  },
  {
    id: "business",
    title: "לעסקים וארגונים",
    description: "רילז באולפן, סושיאל, קריינות וסרט תדמית. ממודיעין.",
    href: "/business",
    utmCampaign: "home_business",
  },
];

/** כרטיסים משניים -- אחרי 6 הראשונים */
export const SECONDARY_HOME_HUB_CARDS: readonly HomeHubCard[] = [
  {
    id: "video",
    title: "וידאו וצילום",
    description: "סרט תדמית, אירוע, חתונה. תמונה וסאונד באותה נשימה.",
    href: "/video",
    utmCampaign: "home_video",
  },
];

export function getHomeHubIcon(id: HomeHubCardIcon) {
  return ICON_MAP[id];
}
