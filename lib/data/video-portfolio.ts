import { PORTFOLIO_VIDEO_CATALOG } from "@/lib/data/video-catalog.generated";
import {
  PLAYLIST_FEATURED_IDS,
  VIDEO_DESCRIPTION_OVERRIDES,
} from "@/lib/data/video-catalog.overrides";
import type { PortfolioTag, PortfolioVideo, ShowcaseVideoItem } from "@/lib/data/video-catalog";
import {
  getPlaylistConfig,
  type PlaylistId,
} from "@/lib/data/video-playlists";

const catalogById = new Map(
  PORTFOLIO_VIDEO_CATALOG.map((v) => [v.videoId, v] as const),
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

export function getPlaylistVideos(playlistId: PlaylistId): ShowcaseVideoItem[] {
  const featured = PLAYLIST_FEATURED_IDS[playlistId] ?? [];
  const candidates = PORTFOLIO_VIDEO_CATALOG.filter((v) =>
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
