import { PORTFOLIO_VIDEO_CATALOG } from "@/lib/data/video-catalog.generated";
import { PORTFOLIO_VIDEO_SUPPLEMENT } from "@/lib/data/video-catalog.supplement";
import {
  PLAYLIST_EXPLICIT_IDS,
  PLAYLIST_FEATURED_IDS,
  PLAYLIST_VIDEO_FALLBACKS,
  VIDEO_DESCRIPTION_OVERRIDES,
} from "@/lib/data/video-catalog.overrides";
import type { PortfolioTag, PortfolioVideo, ShowcaseVideoItem } from "@/lib/data/video-catalog";
import {
  getPlaylistConfig,
  type PlaylistId,
} from "@/lib/data/video-playlists";

const FULL_PORTFOLIO_CATALOG: readonly PortfolioVideo[] = [
  ...PORTFOLIO_VIDEO_CATALOG,
  ...PORTFOLIO_VIDEO_SUPPLEMENT.filter(
    (v) => !PORTFOLIO_VIDEO_CATALOG.some((c) => c.videoId === v.videoId),
  ),
];

const catalogById = new Map(
  FULL_PORTFOLIO_CATALOG.map((v) => [v.videoId, v] as const),
);

function matchesPlaylist(video: PortfolioVideo, playlistId: PlaylistId): boolean {
  const config = getPlaylistConfig(playlistId);

  if (config.requireAnyTag?.length) {
    const hasTag = config.requireAnyTag.some((t) => video.tags.includes(t));
    if (!hasTag) return false;
  } else if (!video.services.includes(playlistId)) {
    return false;
  }

  if (config.excludeTags?.length) {
    if (config.excludeTags.some((t) => video.tags.includes(t))) return false;
  }

  return true;
}

function sortIndex(videoId: string, featured: readonly string[]): number {
  const idx = featured.indexOf(videoId);
  return idx === -1 ? 1000 + videoId.charCodeAt(0) : idx;
}

/**
 * מזהה שנבחר ידנית ולא נפתר נמחק כאן בשקט על ידי filter(Boolean), ולכן
 * /events/equipment/dry-hire הציג סרטון אחד מתוך ארבעה בלי ששום דבר התלונן.
 * האזהרה היא לפיתוח בלבד, ומודפסת פעם אחת לכל צירוף כדי לא להציף את הלוג
 * כשאותו פלייליסט מרונדר בהרבה עמודים.
 * השער האמיתי הוא npm run audit:portfolio-curation, שרץ גם כשאיש לא מסתכל.
 */
const warnedMissingCurated = new Set<string>();
function warnMissingCuratedVideo(videoId: string, playlistId: PlaylistId): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${playlistId}:${videoId}`;
  if (warnedMissingCurated.has(key)) return;
  warnedMissingCurated.add(key);
  console.warn(
    `[video-portfolio] המזהה ${videoId} נבחר ידנית לפלייליסט ${playlistId} ואינו קיים ` +
      `בקטלוג ולא ב-PLAYLIST_VIDEO_FALLBACKS. הסרטון לא יוצג. ` +
      `להוסיף אותו ל-video-catalog.supplement.ts או להסיר את הבחירה.`,
  );
}

export function getPlaylistVideos(playlistId: PlaylistId): ShowcaseVideoItem[] {
  const explicit = PLAYLIST_EXPLICIT_IDS[playlistId];
  if (explicit?.length) {
    return explicit
      .map((videoId) => {
        const fromCatalog = catalogById.get(videoId);
        if (fromCatalog) return toShowcaseItem(fromCatalog);
        const fallback = PLAYLIST_VIDEO_FALLBACKS[videoId];
        if (!fallback) {
          warnMissingCuratedVideo(videoId, playlistId);
          return null;
        }
        return {
          videoId,
          title: fallback.title,
          description:
            fallback.description ?? VIDEO_DESCRIPTION_OVERRIDES[videoId],
        };
      })
      .filter((item): item is ShowcaseVideoItem => Boolean(item));
  }

  const featured = PLAYLIST_FEATURED_IDS[playlistId] ?? [];
  const candidates = FULL_PORTFOLIO_CATALOG.filter((v) =>
    matchesPlaylist(v, playlistId),
  );

  const featuredSet = new Set(featured);
  const sorted = [...candidates].sort((a, b) => {
    const ai = sortIndex(a.videoId, featured);
    const bi = sortIndex(b.videoId, featured);
    if (ai !== bi) return ai - bi;
    if (featuredSet.has(a.videoId) && !featuredSet.has(b.videoId)) return -1;
    if (!featuredSet.has(a.videoId) && featuredSet.has(b.videoId)) return 1;
    return a.title.localeCompare(b.title, "he");
  });

  return sorted.map((v) => toShowcaseItem(v));
}

export function toShowcaseItem(video: PortfolioVideo): ShowcaseVideoItem {
  return {
    videoId: video.videoId,
    title: video.title,
    description: VIDEO_DESCRIPTION_OVERRIDES[video.videoId] ?? video.description,
  };
}

export function getVideoFromCatalog(videoId: string): PortfolioVideo | undefined {
  return catalogById.get(videoId);
}

export function getFeaturedVideoId(playlistId: PlaylistId): string | undefined {
  const featured = PLAYLIST_FEATURED_IDS[playlistId];
  if (featured?.[0]) return featured[0];
  return getPlaylistVideos(playlistId)[0]?.videoId;
}

export function getPlaylistVideoCount(playlistId: PlaylistId): number {
  return getPlaylistVideos(playlistId).length;
}
