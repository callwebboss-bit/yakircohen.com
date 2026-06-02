export type PortfolioTag =
  | "studio-recording"
  | "podcast"
  | "blessings"
  | "bat-bar-mitzvah"
  | "dj-events"
  | "voiceover"
  | "education"
  | "entertainment"
  | "brand-tv";

export type PortfolioVideo = {
  videoId: string;
  title: string;
  youtubeUrl: string;
  tags: readonly PortfolioTag[];
  /** Playlist ids this video belongs to (auto + overrides) */
  services: readonly string[];
  description?: string;
  priority?: number;
};

export type ShowcaseVideoItem = {
  videoId: string;
  title: string;
  description?: string;
};
