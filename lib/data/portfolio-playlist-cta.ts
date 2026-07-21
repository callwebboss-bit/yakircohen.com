import { buildBookHref } from "@/lib/book-url";
import { getExVat, type PriceItemId } from "@/lib/data/pricing-catalog";
import type { PlaylistId } from "@/lib/data/video-playlists";

export type PortfolioPlaylistCtaConfig = {
  /** ניסוח המשך חוויה - לא "הזמן עכשיו" */
  prompt: string;
  serviceHref: string;
  serviceLabel: string;
  bookHref: string;
  bookLabel: string;
  priceExVat: number;
  /** true = מחיר "מ-" */
  priceFrom: boolean;
  utmCampaign: string;
};

function cta(opts: {
  prompt: string;
  serviceHref: string;
  serviceLabel: string;
  bookCategory: Parameters<typeof buildBookHref>[0];
  catalog: PriceItemId;
  bookLabel?: string;
  priceFrom?: boolean;
  utmCampaign: string;
}): PortfolioPlaylistCtaConfig {
  return {
    prompt: opts.prompt,
    serviceHref: opts.serviceHref,
    serviceLabel: opts.serviceLabel,
    bookHref: buildBookHref(opts.bookCategory, { catalog: opts.catalog }),
    bookLabel: opts.bookLabel ?? "תיאום סשן דומה",
    priceExVat: getExVat(opts.catalog),
    priceFrom: opts.priceFrom ?? true,
    utmCampaign: opts.utmCampaign,
  };
}

/**
 * CTA מתחת לפלייליסט ב־/portfolio בלבד.
 * education-tips נשאר בלי CTA קשיח (טיפים ≠ הוכחת שירות).
 */
export const PORTFOLIO_PLAYLIST_CTA: Partial<
  Record<PlaylistId, PortfolioPlaylistCtaConfig>
> = {
  "studio-hub": cta({
    prompt: "רוצים סשן באולפן כמו בדוגמאות?",
    serviceHref: "/studio",
    serviceLabel: "לאולפן ההקלטות",
    bookCategory: "studio",
    catalog: "studio_half_hour",
    bookLabel: "תיאום סשן דומה",
    utmCampaign: "portfolio_cta_studio",
  }),
  "recording-song-modiin": cta({
    prompt: "רוצה סשן שיר דומה?",
    serviceHref: "/studio/recording-song-modiin",
    serviceLabel: "לעמוד הקלטת שיר",
    bookCategory: "studio",
    catalog: "cover_song",
    bookLabel: "תיאום סשן שיר",
    utmCampaign: "portfolio_cta_recording_song",
  }),
  "blessings-hub": cta({
    prompt: "רוצה ברכה מוקלטת דומה?",
    serviceHref: "/studio/blessings",
    serviceLabel: "לעמוד הברכות",
    bookCategory: "studio",
    catalog: "blessing_recording",
    bookLabel: "תיאום הקלטת ברכה",
    utmCampaign: "portfolio_cta_blessings",
  }),
  "podcast-hub": cta({
    prompt: "רוצה פרק פודקאסט דומה?",
    serviceHref: "/podcast",
    serviceLabel: "למרכז הפודקאסט",
    bookCategory: "podcast",
    catalog: "podcast_pilot",
    bookLabel: "תיאום הקלטת פודקאסט",
    utmCampaign: "portfolio_cta_podcast",
  }),
  "events-dj": cta({
    prompt: "רוצה DJ לאירוע כמו בדוגמאות?",
    serviceHref: "/events/dj-events",
    serviceLabel: "לעמוד DJ לאירועים",
    bookCategory: "dj",
    catalog: "dj_premium",
    bookLabel: "בדיקת זמינות DJ",
    utmCampaign: "portfolio_cta_dj",
  }),
  "voiceover-hub": cta({
    prompt: "רוצה קריינות דומה?",
    serviceHref: "/voiceover",
    serviceLabel: "למרכז הקריינות",
    bookCategory: "studio",
    catalog: "studio_half_hour",
    bookLabel: "תיאום הקלטת קריינות",
    utmCampaign: "portfolio_cta_voiceover",
  }),
  "studio-hub-entertainment": cta({
    prompt: "רוצים הפקה מצחיקה במתנה?",
    serviceHref: "/studio/recording-song-modiin/gifts",
    serviceLabel: "למתנות מהאולפן",
    bookCategory: "studio",
    catalog: "cover_song",
    bookLabel: "תיאום סשן דומה",
    utmCampaign: "portfolio_cta_entertainment",
  }),
};

export function getPortfolioPlaylistCta(
  playlistId: PlaylistId,
): PortfolioPlaylistCtaConfig | null {
  return PORTFOLIO_PLAYLIST_CTA[playlistId] ?? null;
}
