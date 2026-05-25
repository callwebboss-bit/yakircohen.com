/** Canonical production origin for metadata and JSON-LD. */
export const SITE_URL = "https://yakircohen.com";

export function absoluteUrl(path = ""): string {
  const normalized = path.replace(/^\/+/, "");
  return normalized ? `${SITE_URL}/${normalized}` : SITE_URL;
}
