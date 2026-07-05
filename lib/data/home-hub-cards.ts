import type { ComponentType } from "react";
import type { BadgeVariant } from "@/components/marketing/ServiceCard";
import {
  HeadphonesIcon,
  LinkIcon,
  MicIcon,
  MusicIcon,
  RadioIcon,
  ShieldCheckIcon,
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
  | "restoration"
  | "production"
  | "video";

export type HomeHubCard = {
  id: HomeHubCardIcon;
  title: string;
  description: string;
  href: string;
  utmCampaign: string;
  isAiService?: boolean;
  badge?: string;
  /** צבע התווית - עדכן שבועית לפי מה שרוצים לקדם */
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
  restoration: ShieldCheckIcon,
  production: HeadphonesIcon,
  video: VideoIcon,
};

/** כרטיסי hub ראשיים - 8 שירותים */
export const PRIMARY_HOME_HUB_CARDS: readonly HomeHubCard[] = [
  {
    id: "attractions",
    title: "אירועים ואטרקציות",
    description:
      "DJ, עשן כבד, זיקוקים קרים וקונפטי. ציוד מקצועי והפעלה בשטח.",
    href: "/events",
    utmCampaign: "home_attractions",
  },
  {
    id: "podcast",
    title: "הפקת פודקאסט",
    description:
      "הקלטה באולפן אקוסטי, עריכת סאונד דיגיטלית והפצה לספוטיפיי ו-Apple Podcasts.",
    href: "/podcast",
    utmCampaign: "home_podcast",
  },
  {
    id: "studio",
    title: "אולפן הקלטות",
    description:
      "שיר לחתונה, ברכה לבר מצווה, קריינות עסקית ופרויקטים מוזיקליים.",
    href: "/studio",
    utmCampaign: "home_studio",
  },
  {
    id: "ai",
    title: "שירותי AI מתקדמים",
    description:
      "שחזור וניקוי אודיו ב-AI, מיקס ומאסטרינג מרחוק. תוצאה תוך שעות.",
    href: "/online",
    utmCampaign: "home_ai_media",
    isAiService: true,
    badge: "Premium AI",
  },
  {
    id: "business",
    title: "לעסקים וארגונים",
    description:
      "רילז באולפן, תוכן לרשתות, קריינות וסרט תדמית. ממודיעין לכל הארץ.",
    href: "/business",
    utmCampaign: "home_business",
  },
  {
    id: "dj-voice",
    title: "DJ לחתונות",
    description:
      "תקליטן עם ציוד מלא, קו מוזיקלי מותאם והגברה בשטח. מודיעין והמרכז.",
    href: "/events/dj-events",
    utmCampaign: "home_dj_voice",
  },
  {
    id: "restoration",
    title: "שיקום ושחזור סאונד",
    description:
      "הסרת רעשי רקע, שיפור הקלטות ישנות והצלת קבצים פגומים.",
    href: "/online",
    utmCampaign: "home_restoration",
  },
  {
    id: "production",
    title: "הפקה מוזיקלית",
    description:
      "ליווי אמנים משלב הסקיצה ועד מאסטר סופי, כולל עיבודים ומיקס.",
    href: "/academy/music-production",
    utmCampaign: "home_production",
  },
];

/** כרטיסים משניים - אחרי 8 הראשונים */
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
