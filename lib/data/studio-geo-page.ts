import type { GeoCityConfig } from "@/lib/data/geo-cities";

export type GeoStudioServiceLink = {
  emoji: string;
  title: string;
  description: string;
  href: string;
};

export type GeoStudioProcessStep = {
  step: string;
  title: string;
};

export const GEO_STUDIO_PROCESS: readonly GeoStudioProcessStep[] = [
  { step: "1", title: "קובעים תאריך" },
  { step: "2", title: "מגיעים לאולפן, תדריך והכנה" },
  { step: "3", title: "הקלטה מודרכת באווירה נוחה" },
  { step: "4", title: "עריכה, מיקס ושליחה ישירות אליכם" },
] as const;

export const GEO_STUDIO_POPULAR_SERVICES: readonly GeoStudioServiceLink[] = [
  {
    emoji: "🎵",
    title: "הקלטת שירים וברכות",
    description: "מתנה מוקלטת להורים, לסבים או לחברים.",
    href: "/studio/blessings",
  },
  {
    emoji: "💍",
    title: "שיר כניסה לחופה",
    description: "להיכנס לחופה עם שיר שכתבתם או הקלטתם במיוחד.",
    href: "/studio/recording-song-modiin",
  },
  {
    emoji: "📜",
    title: "דרשה לבר/בת מצווה",
    description: "הכנה, הקלטה נקייה ורקע מוזיקלי עדין.",
    href: "/studio/blessings/bar-mitzvah",
  },
  {
    emoji: "🎁",
    title: "שיר במתנה",
    description: "מתנה מקורית, שיר או קליפ מוקלט.",
    href: "/studio/blessings/video-clip",
  },
] as const;

export function studioLocationFaq(city: GeoCityConfig) {
  return {
    id: "location",
    question: `האם האולפן נמצא ב${city.nameHe}?`,
    answer: `האולפן במודיעין, כ-${city.driveMinutes} דקות מ${city.nameHe} (${city.driveNote}). אפשר גם להזמין אולפן נייד בתיאום מראש.`,
  };
}
