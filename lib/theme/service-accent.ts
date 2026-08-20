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

/** Precomputed page atmosphere - Turbopack cannot color-mix dynamic --service-accent. */
export const SERVICE_HUB_MESH: Record<ServiceAccentCategory, string> = {
  events:
    "radial-gradient(ellipse 80% 55% at 78% 0%, rgba(212,43,43,0.11), transparent 55%), radial-gradient(ellipse 55% 45% at 12% 100%, rgba(196,163,90,0.08), transparent 50%)",
  studio:
    "radial-gradient(ellipse 80% 55% at 78% 0%, rgba(217,119,6,0.12), transparent 55%), radial-gradient(ellipse 55% 45% at 12% 100%, rgba(196,163,90,0.10), transparent 50%)",
  voiceover:
    "radial-gradient(ellipse 80% 55% at 78% 0%, rgba(13,148,136,0.11), transparent 55%), radial-gradient(ellipse 55% 45% at 12% 100%, rgba(154,163,173,0.10), transparent 50%)",
  video:
    "radial-gradient(ellipse 80% 55% at 78% 0%, rgba(79,70,229,0.10), transparent 55%), radial-gradient(ellipse 55% 45% at 12% 100%, rgba(154,163,173,0.08), transparent 50%)",
  photography:
    "radial-gradient(ellipse 80% 55% at 78% 0%, rgba(5,150,105,0.10), transparent 55%), radial-gradient(ellipse 55% 45% at 12% 100%, rgba(196,163,90,0.08), transparent 50%)",
  podcast:
    "radial-gradient(ellipse 80% 55% at 78% 0%, rgba(124,58,237,0.11), transparent 55%), radial-gradient(ellipse 55% 45% at 12% 100%, rgba(154,163,173,0.08), transparent 50%)",
  online:
    "radial-gradient(ellipse 80% 55% at 78% 0%, rgba(6,182,212,0.11), transparent 55%), radial-gradient(ellipse 55% 45% at 12% 100%, rgba(154,163,173,0.08), transparent 50%)",
  academy:
    "radial-gradient(ellipse 80% 55% at 78% 0%, rgba(29,78,216,0.10), transparent 55%), radial-gradient(ellipse 55% 45% at 12% 100%, rgba(154,163,173,0.08), transparent 50%)",
  pro:
    "radial-gradient(ellipse 80% 55% at 78% 0%, rgba(146,112,58,0.12), transparent 55%), radial-gradient(ellipse 55% 45% at 12% 100%, rgba(196,163,90,0.10), transparent 50%)",
};

export const SERVICE_HUB_GLOW: Record<ServiceAccentCategory, string> = {
  events: "rgba(212, 43, 43, 0.18)",
  studio: "rgba(217, 119, 6, 0.20)",
  voiceover: "rgba(13, 148, 136, 0.18)",
  video: "rgba(79, 70, 229, 0.16)",
  photography: "rgba(5, 150, 105, 0.16)",
  podcast: "rgba(124, 58, 237, 0.18)",
  online: "rgba(6, 182, 212, 0.16)",
  academy: "rgba(29, 78, 216, 0.16)",
  pro: "rgba(146, 112, 58, 0.20)",
};

export const DEFAULT_SERVICE_ACCENT = SERVICE_ACCENT_COLORS.events;
export const DEFAULT_SERVICE_ACCENT_INK = SERVICE_ACCENT_INK_COLORS.events;
export const DEFAULT_HUB_MESH = SERVICE_HUB_MESH.events;
export const DEFAULT_HUB_GLOW = SERVICE_HUB_GLOW.events;

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

export function resolveHubMesh(category?: string | null): string {
  if (!category) return DEFAULT_HUB_MESH;
  return SERVICE_HUB_MESH[category as ServiceAccentCategory] ?? DEFAULT_HUB_MESH;
}

export function resolveHubGlow(category?: string | null): string {
  if (!category) return DEFAULT_HUB_GLOW;
  return SERVICE_HUB_GLOW[category as ServiceAccentCategory] ?? DEFAULT_HUB_GLOW;
}
