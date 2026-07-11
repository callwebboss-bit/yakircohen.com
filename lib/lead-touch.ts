/** Fires a lightweight "touch" event to /api/lead-touch (client-side only). */
export function fireLeadTouch(source: string, ctaType?: string): void {
  fetch("/api/lead-touch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source,
      page_path: window.location.pathname,
      timestamp: Date.now(),
      ...(ctaType ? { cta_type: ctaType } : {}),
    }),
    keepalive: true,
  }).catch(() => {});
}
