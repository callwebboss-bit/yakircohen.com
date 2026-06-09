/** Extracts the video ID from a YouTube watch, share, or embed URL. */
export function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "").trim();
      return id.length >= 6 ? id : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const fromQuery = parsed.searchParams.get("v")?.trim();
      if (fromQuery && fromQuery.length >= 6) return fromQuery;
      const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?#]+)/);
      if (shortsMatch?.[1]) return shortsMatch[1];
      const embedMatch = parsed.pathname.match(/\/embed\/([^/?#]+)/);
      if (embedMatch?.[1]) return embedMatch[1];
    }
    return null;
  } catch {
    return null;
  }
}

/** Converts a YouTube watch/share URL to an embed-safe iframe src. */
export function toYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
