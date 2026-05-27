/**
 * Legacy URL redirects (301 via next.config).
 *
 * SEO policy:
 * - **Active indexable pages** live only at canonical paths (see sitemap.ts).
 * - Redirects here are for **old inbound URLs** (Google Sites, analytics) or
 *   **true duplicates** - never to replace a page that should rank on its own.
 * - Do not add redirects between two URLs that both have full content.
 */

import { CANONICAL_REDIRECTS } from "./site-architecture";

export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

/** Map legacy path → canonical path (before prefix rules) */
const LEGACY_PATH_MAP: Record<string, string> = {
  /** Google Sites / קישורים ישנים - דף הבית הקנוני הוא `/` בלבד */
  "/home": "/",
  "/home/": "/",
  "/recording": "/studio",
  "/studio-main": "/studio",
  "/online-studio": "/online",
  "/podcast-pricing": "/podcast",
  "/recording-studio": "/studio/recording-studio",
  "/studio-recording": "/studio/recording-studio",
  "/studio/blessings/studio-blessings": "/studio/blessings",
  "/studio/mobile-studio/home-phone-blessings": "/studio/blessings#home-recording",
  "/stuttering-treatment": "/clinic",
  "/stuttering-therapy": "/stuttering",
  "/academy-music": "/academy",
  "/academy/stuttering-course": "/stuttering",
  "/dj-course": "/academy/dj-course",
  "/production-course": "/academy/music-production",
  "/bride-blessing": "/studio/blessings",
  "/groom-blessing": "/studio/blessings",
  "/photo-slider": "/photo-slideshow",
  "/podcast/podcast-studio/modiin-podcast-studio": "/podcast/podcast-studio-modiin",
  "/podcast/podcast-pricing": "/podcast",
  "/contact/whatsapp": "/contact",
  "/order": "/book",
  "/booking": "/book",
  "/book-studio": "/book",
  "/studio-booking": "/book",
  "/price": "/pricing",
  "/prices": "/pricing",
  "/pricing-page": "/pricing",
  "/מחירון": "/pricing",
  "/faq": "/about/faq",
  "/questions": "/about/faq",
  "/שאלות-נפוצות": "/about/faq",
  "/shop": "/voucher",
  "/online/online-pricing": "/online/online-ai-pricing",
  "/gift-card": "/voucher",
  "/gift-voucher": "/voucher",
  "/orders": "/voucher",
  "/gallery": "/",
  "/wedding-songs": "/blog/wedding-songs-chuppah",
  "/weddings-songs": "/blog/wedding-songs-chuppah",
  "/chupa": "/blog/wedding-songs-chuppah",
  "/chuppa": "/blog/wedding-songs-chuppah",
  "/bride": "/blog/wedding-songs-chuppah",
  "/groom": "/blog/wedding-songs-chuppah",
  "/wedding": "/blog/wedding-songs-chuppah",
  "/weddings": "/blog/wedding-songs-chuppah",
  "/חתונה": "/blog/wedding-songs-chuppah",
  "/כלה": "/blog/wedding-songs-chuppah",
  "/חתן": "/blog/wedding-songs-chuppah",
  "/שירים-לחתונה": "/blog/wedding-songs-chuppah",
  "/bride-groom-blessing": "/studio/blessings/bride-groom-blessing",
  "/bar-mitzvah-clip": "/studio/blessings/video-clip",
  "/video/bar-mitzvah-clip": "/studio/blessings/video-clip",
};

/** /attractions/* → /events/attractions/* (with specific overrides) */
const ATTRACTIONS_OVERRIDES: Record<string, string> = {
  "/attractions": "/events/attractions",
  "/attractions/wedding-photography": "/photography/wedding",
  "/attractions/Wedding-photography": "/photography/wedding",
  "/attractions/event-attractions-pricing": "/events/attractions",
  "/attractions/heavy-smoke-large-events":
    "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
  "/attractions/wedding-smoking-machine/heavy-smoke-large-events":
    "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
  "/attractions/smoke-bubble-machine-events":
    "/events/attractions/bubble-machine/smoke-bubble-machine-events",
  "/attractions/bubble-machine/smoke-bubble-machine-events":
    "/events/attractions/bubble-machine/smoke-bubble-machine-events",
  "/attractions/attractions2026": "/events/attractions",
  "/attractions/wedding-smoking-machine":
    "/events/attractions/wedding-smoking-machine",
  "/attractions/bubble-machine": "/events/attractions/bubble-machine",
  "/attractions/cold-fireworks": "/events/attractions/cold-fireworks",
  "/attractions/confetti-cannon": "/events/attractions/confetti-cannon",
  "/attractions/giant-balloons": "/events/attractions/giant-balloons",
  "/attractions/led-booth": "/events/stage-led-dj",
  "/attractions/stage-led-dj": "/events/stage-led-dj",
  "/events/attractions/led-booth": "/events/stage-led-dj",
  "/events/led-booth": "/events/stage-led-dj",
  "/attractions/smoke-cannons-for-events":
    "/events/attractions/smoke-cannons-for-events",
};

function toRedirect(source: string, destination: string): LegacyRedirect {
  return { source, destination, permanent: true as const };
}

export function getLegacyRedirects(): LegacyRedirect[] {
  const fromMap = Object.entries(LEGACY_PATH_MAP).map(([source, destination]) =>
    toRedirect(source, destination),
  );

  const fromCanonical = Object.entries(CANONICAL_REDIRECTS).map(
    ([source, destination]) => toRedirect(source, destination),
  );

  const fromAttractions = Object.entries(ATTRACTIONS_OVERRIDES).map(
    ([source, destination]) => toRedirect(source, destination),
  );

  /** Catch-all: any other /attractions/:path → /events/attractions/:path */
  const attractionsCatchAll = toRedirect(
    "/attractions/:path*",
    "/events/attractions/:path*",
  );

  return [...fromMap, ...fromCanonical, ...fromAttractions, attractionsCatchAll];
}
