const ALLOWED_EMBED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "open.spotify.com",
]);

export function isAllowedEmbedUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && ALLOWED_EMBED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}
