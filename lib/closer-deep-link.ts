/**
 * Deep link payload for yakir-closer.html (local file:// only).
 * Opens: ../local-tools/yakir-closer.html?lead=<encoded>
 */

export type CloserLeadPayload = {
  v: 1;
  waBody: string;
};

export function encodeCloserLeadParam(payload: CloserLeadPayload): string {
  const json = JSON.stringify(payload);
  if (typeof btoa !== "undefined") {
    return btoa(unescape(encodeURIComponent(json)));
  }
  return Buffer.from(json, "utf8").toString("base64");
}

/** Relative path from repo — user opens via Dropbox / local-tools folder. */
export const CLOSER_HTML_FILENAME = "yakir-closer.html";

export function buildCloserDeepLink(waBody: string, htmlFile = CLOSER_HTML_FILENAME): string {
  const param = encodeCloserLeadParam({ v: 1, waBody: waBody.trim() });
  return `${htmlFile}?lead=${encodeURIComponent(param)}`;
}

export function decodeWhatsAppTextFromHref(href: string): string | null {
  try {
    const u = new URL(href);
    const text = u.searchParams.get("text");
    return text ? decodeURIComponent(text) : null;
  } catch {
    return null;
  }
}
