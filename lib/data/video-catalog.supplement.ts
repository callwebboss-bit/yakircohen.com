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
    videoId: "yjxF9pKzbr0",
    title: "שני תותחי קונפטי על במה - סיום שנה בבית ספר",
    youtubeUrl: "https://www.youtube.com/shorts/yjxF9pKzbr0",
    tags: ["dj-events"],
    services: ["events-dj", "events-hub", "events-attractions"],
    description: "הפעלת שני תותחי קונפטי על במה באירוע סיום שנת הלימודים.",
  },
] as const;
