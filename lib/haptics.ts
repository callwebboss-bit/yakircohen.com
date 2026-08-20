/** Short hardware tap. No-op when reduced-motion is on or vibrate is missing. */
export function tapHaptic(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  navigator.vibrate?.(10);
}
