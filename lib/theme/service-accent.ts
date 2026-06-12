/** Contextual branding engine: maps a service category to its accent color. */

export type ServiceAccentCategory =
  | "studio"
  | "podcast"
  | "voiceover"
  | "events"
  | "video"
  | "photography"
  | "ai";

export const SERVICE_ACCENT_COLORS: Record<ServiceAccentCategory, string> = {
  events: "#d42b2b",
  studio: "#d97706",
  voiceover: "#0d9488",
  video: "#4f46e5",
  photography: "#059669",
  podcast: "#7c3aed",
  ai: "#06b6d4",
};

export const DEFAULT_SERVICE_ACCENT = SERVICE_ACCENT_COLORS.events;

export function resolveServiceAccentColor(
  category?: string | null,
): string {
  if (!category) return DEFAULT_SERVICE_ACCENT;
  return (
    SERVICE_ACCENT_COLORS[category as ServiceAccentCategory] ??
    DEFAULT_SERVICE_ACCENT
  );
}
