/**
 * נתיבים שחייבים לשמור על ≥2 מסלולי inbound (header, hub, footer, home).
 * בשימוש ב-QA וב-audit ידני לפני deploy.
 */
export const PROTECTED_PATHS = [
  "/pricing",
  "/studio",
  "/podcast",
  "/events",
  "/about/faq",
  "/book",
] as const;

export type ProtectedPath = (typeof PROTECTED_PATHS)[number];

/** כל hub חייב לקשר לעומק + מחירון רלוונטי */
export const MIN_HUB_SUPPORT_LINKS: Record<string, readonly string[]> = {
  "/studio": [
    "/studio/recording-song-modiin",
    "/studio/blessings",
    "/studio/studio-jerusalem",
    "/studio/pricing",
  ],
  "/events": [
    "/events/dj-events",
    "/events/wedding-attractions-packages",
    "/events/stage-led-dj",
  ],
  "/podcast": [
    "/podcast/podcast-recording",
    "/podcast/podcast-editing",
    "/podcast/mobile-podcast-at-home",
  ],
  "/pricing": ["/studio", "/events", "/podcast"],
};
