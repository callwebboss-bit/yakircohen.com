/** Contextual branding engine: maps a service category to its accent color. */

export type ServiceAccentCategory =
  | "studio"
  | "podcast"
  | "voiceover"
  | "events"
  | "video"
  | "photography"
  | "online"
  | "academy"
  | "pro";

export const SERVICE_ACCENT_COLORS: Record<ServiceAccentCategory, string> = {
  events: "#d42b2b",
  studio: "#d97706",
  voiceover: "#0d9488",
  video: "#4f46e5",
  photography: "#059669",
  podcast: "#7c3aed",
  online: "#06b6d4",
  academy: "#1d4ed8",
  pro: "#92703a",
};

/**
 * Darkened (≈65% accent / 35% black) variants of SERVICE_ACCENT_COLORS, used
 * for small text (badges, kickers, links) where the raw accent fails contrast
 * on light backgrounds. Precomputed because color-mix() against a dynamic
 * --service-accent custom property crashes this project's Turbopack setup.
 */
export const SERVICE_ACCENT_INK_COLORS: Record<ServiceAccentCategory, string> = {
  events: "#8a1c1c",
  studio: "#8d4d04",
  voiceover: "#086058",
  video: "#332e95",
  photography: "#036244",
  podcast: "#51269a",
  online: "#04768a",
  academy: "#13338c",
  pro: "#5f4926",
};

export const DEFAULT_SERVICE_ACCENT = SERVICE_ACCENT_COLORS.events;
export const DEFAULT_SERVICE_ACCENT_INK = SERVICE_ACCENT_INK_COLORS.events;

export function resolveServiceAccentColor(
  category?: string | null,
): string {
  if (!category) return DEFAULT_SERVICE_ACCENT;
  return (
    SERVICE_ACCENT_COLORS[category as ServiceAccentCategory] ??
    DEFAULT_SERVICE_ACCENT
  );
}

export function resolveServiceAccentInkColor(
  category?: string | null,
): string {
  if (!category) return DEFAULT_SERVICE_ACCENT_INK;
  return (
    SERVICE_ACCENT_INK_COLORS[category as ServiceAccentCategory] ??
    DEFAULT_SERVICE_ACCENT_INK
  );
}
