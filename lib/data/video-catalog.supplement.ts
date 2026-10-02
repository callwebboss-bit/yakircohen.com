import type { PortfolioVideo } from "@/lib/data/video-catalog";

/** Curated entries not yet in channel RSS import - merged into portfolio catalog */
export const PORTFOLIO_VIDEO_SUPPLEMENT: readonly PortfolioVideo[] = [
  {
    videoId: "LKg3pwdon_M",
    title: "הקלטת שיר מתנה לחברה עם הקדשה אישית באולפן",
    youtubeUrl: "https://www.youtube.com/watch?v=LKg3pwdon_M",
    tags: ["studio-recording"],
    services: [
      "recording-song-modiin",
      "studio-gifts",
      "blessings-video-clip",
    ],
    description:
      "קליפ מתננה - שיר בהפתעה לאישה, לחברה או לבן/בת הזוג. הקלטה ועריכה באולפן במודיעין.",
  },
  {
    videoId: "QRMxKVUOOl0",
    title: "הקלטה אמיתית באולפן - דוגמת קליפ מהסשן",
    youtubeUrl: "https://www.youtube.com/watch?v=QRMxKVUOOl0",
    tags: ["studio-recording"],
    services: ["recording-song-modiin", "recording-studio", "studio-gifts"],
    description: "צילום סשן הקלטה באולפן במודיעין. דוגמה לקליפ מההקלטה.",
  },
  {
    videoId: "1DUnuS_hv5Y",
    title: "מג'יק קאס (Magic Kass) - הקליפ הרשמי",
    youtubeUrl: "https://www.youtube.com/watch?v=1DUnuS_hv5Y",
    tags: ["studio-recording"],
    services: ["studio-hub", "recording-song-modiin"],
    description:
      "הפקה ועיבוד מוזיקלי: יקיר כהן הפקות ורועי מאנה · מילים: רועי מאנה, יקיר כהן ויקיר איזמירלי · שירה: עמית רבוח · כוריאוגרפיה: לירון אבדר · רקדניות: להקת בלרין · סטודיו לי דאנס בניהול לירון אבדר · מעל מיליון צפיות",
  },
  {
    videoId: "591H4EX6miM",
    title: "קורס גמגום - לדבר נכון ולקבל את עצמך בביטחון אמיתי",
    youtubeUrl: "https://www.youtube.com/shorts/591H4EX6miM",
    tags: ["education"],
    services: [],
    description:
      "סרטון קצר מתוך קורס הגמגום: איך לדבר נכון ולבנות ביטחון אמיתי בדיבור. שיטת NeverMind, באולפן במודיעין.",
  },
  {
    videoId: "yjxF9pKzbr0",
    title: "שני תותחי קונפטי על במה - סיום שנה בבית ספר",
    youtubeUrl: "https://www.youtube.com/shorts/yjxF9pKzbr0",
    tags: ["dj-events"],
    services: ["events-dj", "events-hub", "events-attractions"],
    description: "הפעלת שני תותחי קונפטי על במה באירוע סיום שנת הלימודים.",
  },
] as const;
