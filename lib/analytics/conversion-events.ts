"use client";

type GtagFn = (...args: unknown[]) => void;

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: GtagFn };
  w.gtag?.(...args);
}

export type ConversionEventName =
  | "book_router_select"
  | "book_fast_whatsapp"
  | "book_wizard_start"
  | "book_wizard_step"
  | "book_lead_submit"
  | "book_success_panel"
  | "whatsapp_popup_blocked";

export function trackConversion(
  name: ConversionEventName,
  params?: Record<string, string | number | boolean>,
): void {
  gtag("event", name, params ?? {});
}
