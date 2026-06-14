import type { ComponentType } from "react";
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

/** כרטיסי hub ראשיים — סדר Google priority */
export const PRIMARY_HOME_HUB_CARDS: readonly HomeHubCard[] = [
  {
    id: "studio",
    title: "אולפן הקלטות",
    description: "שיר במתנה, ברכה לחתונה, קליפ קצר. הילד שלכם הוא הכוכב.",
    href: "/studio",
    utmCampaign: "home_studio",
  },
  {
    id: "podcast",
    title: "פודקאסט",
    description: "בואו נבנה פורמט, נקליט באולפן, נערוך ונעלה.",
    href: "/podcast",
    utmCampaign: "home_podcast",
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
    id: "attractions",
    title: "אטרקציות",
    description: "עשן, זיקוקים קרים, בועות וקונפטי. רגעים שמצטלמים.",
    href: "/events/attractions",
    utmCampaign: "home_attractions",
  },
  {
    id: "dj-voice",
    title: "DJ וקריינות",
    description: "תקליטן לאירוע, תגים קוליים וקריינות לפרסומות ו-IVR.",
    href: "/events/dj-events",
    utmCampaign: "home_dj_voice",
  },
  {
    id: "business",
    title: "לעסקים וארגונים",
    description: "רילז באולפן, סושיאל, קריינות וסרט תדמית. ממודיעין.",
    href: "/business",
    utmCampaign: "home_business",
  },
];

/** כרטיסים משניים — אחרי 6 הראשונים */
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
