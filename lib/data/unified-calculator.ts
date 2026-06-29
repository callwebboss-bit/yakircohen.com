import { getExVat } from "@/lib/data/pricing-catalog";

export type CalcOption = {
  id: string;
  label: string;
  note: string;
  exVat: number;
};

export type CalcCategory = {
  id: string;
  emoji: string;
  title: string;
  bookHref: string;
  options: readonly CalcOption[];
};

export const UNIFIED_CALC_CATEGORIES: readonly CalcCategory[] = [
  {
    id: "studio",
    emoji: "🎙️",
    title: "אולפן",
    bookHref: "/studio",
    options: [
      { id: "blessing", label: "ברכה / אמירה", note: "עד חצי שעה", exVat: getExVat("blessing_recording") },
      { id: "cover", label: "הקלטת שיר קאבר", note: "על גבי פלייבק קיים", exVat: getExVat("cover_song") },
      { id: "package", label: "חבילת שיר + מיקס", note: "עד 3 שעות", exVat: getExVat("song_package") },
      { id: "single", label: "הפקת סינגל מלא", note: "6 שעות + מאסטר מסחרי", exVat: getExVat("single_production") },
    ],
  },
  {
    id: "podcast",
    emoji: "🎧",
    title: "פודקאסט",
    bookHref: "/podcast",
    options: [
      { id: "audio", label: "פרק אודיו", note: "הקלטה + עריכה + הפצה", exVat: getExVat("podcast_audio") },
      { id: "video", label: "פרק וידאו", note: "3 מצלמות + תאורה", exVat: getExVat("podcast_video") },
      { id: "content", label: "חבילת תוכן", note: "וידאו + 3 רילז + כתוביות", exVat: getExVat("content_package") },
      { id: "editing", label: "עריכה בלבד", note: "לשעת חומר גולמי", exVat: getExVat("podcast_editing_hour") },
    ],
  },
  {
    id: "events",
    emoji: "🎉",
    title: "אירוע",
    bookHref: "/events",
    options: [
      { id: "single_effect", label: "אפקט בודד", note: "עשן / זיקוקים / בועות", exVat: getExVat("single_effect") },
      { id: "attr2", label: "2 אטרקציות", note: "חבילה עם הנחה", exVat: getExVat("event_attraction_2") },
      { id: "attr3", label: "3 אטרקציות", note: "חבילה עם הנחה", exVat: getExVat("event_attraction_3") },
      { id: "attr4", label: "4+ אטרקציות + מתנה", note: "קליפ גלריה חינם", exVat: getExVat("event_attraction_4") },
    ],
  },
  {
    id: "online",
    emoji: "🤖",
    title: "Online AI",
    bookHref: "/online",
    options: [
      { id: "legacy", label: "המרת VHS + שחזור AI", note: "קלטת - דיגיטל נקי", exVat: getExVat("legacy_dig_ai") },
      { id: "branding", label: "מיתוג קולי בסיס", note: "ג'ינגל + IVR", exVat: getExVat("audio_brand_starter") },
      { id: "social", label: "סושיאל דאמפ פיילוט", note: "5 רילז ערוכים", exVat: getExVat("content_studio_pilot") },
      { id: "fullsocial", label: "סשן תוכן מלא", note: "12 רילז + כתוביות", exVat: getExVat("content_studio_session") },
    ],
  },
] as const;
