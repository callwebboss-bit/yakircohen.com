/**
 * Deep-link ל-yakir-closer.html עם הודעת ליד מקודדת.
 * לשימוש במיילים / התראות פנימיות.
 */
export function buildCloserLeadUrl(
  waBody: string,
  closerHtmlPath = "../local-tools/yakir-closer.html",
): string {
  if (typeof window !== "undefined") {
    const base = new URL(closerHtmlPath, window.location.origin);
    base.searchParams.set("lead", btoa(unescape(encodeURIComponent(waBody.trim()))));
    return base.toString();
  }
  const encoded = Buffer.from(waBody.trim(), "utf8").toString("base64");
  return `${closerHtmlPath}?lead=${encodeURIComponent(encoded)}`;
}
