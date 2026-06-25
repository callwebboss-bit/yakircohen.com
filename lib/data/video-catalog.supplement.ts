import type { PortfolioVideo } from "@/lib/data/video-catalog";

/** Curated entries not yet in channel RSS import - merged into portfolio catalog */
export const PORTFOLIO_VIDEO_SUPPLEMENT: readonly PortfolioVideo[] = [
  {
    videoId: "yjxF9pKzbr0",
    title: "שני תותחי קונפטי על במה - סיום שנה בבית ספר",
    youtubeUrl: "https://www.youtube.com/shorts/yjxF9pKzbr0",
    tags: ["dj-events"],
    services: ["events-dj", "events-hub", "events-attractions"],
    description: "הפעלת שני תותחי קונפטי על במה באירוע סיום שנת הלימודים.",
  },
] as const;
