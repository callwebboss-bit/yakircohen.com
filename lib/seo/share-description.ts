/** WhatsApp / Telegram / Facebook preview truncates ~60 chars - hook must land first. */
export const SHARE_PREVIEW_MAX = 60;

const LOCATION_MARKERS = [
  "במודיעין",
  "ממודיעין",
  "בירושלים",
  "מירושלים",
  "במרכז",
  "לכל הארץ",
] as const;

export function buildMetaDescription(hook: string, extension?: string): string {
  const trimmedHook = hook.trim();
  if (!extension?.trim()) return trimmedHook;
  const sep = trimmedHook.endsWith(".") ? " " : ". ";
  return `${trimmedHook}${sep}${extension.trim()}`;
}

export function auditShareHook(description: string): {
  preview: string;
  ok: boolean;
  hookLength: number;
  hasLocation: boolean;
} {
  const dotIndex = description.indexOf(".");
  const hookEnd = dotIndex >= 0 ? dotIndex + 1 : Math.min(description.length, SHARE_PREVIEW_MAX);
  const hook = description.slice(0, hookEnd).trim();
  const hookLength = hook.length;
  const hasLocation = LOCATION_MARKERS.some((m) => hook.includes(m));
  const preview = description.slice(0, SHARE_PREVIEW_MAX);
  const endsClean =
    dotIndex >= 0 && dotIndex < SHARE_PREVIEW_MAX
      ? true
      : !/[א-תa-zA-Z]$/.test(preview) || preview.length < SHARE_PREVIEW_MAX;

  return {
    preview,
    ok: hasLocation && hookLength <= SHARE_PREVIEW_MAX + 5 && endsClean,
    hookLength,
    hasLocation,
  };
}
