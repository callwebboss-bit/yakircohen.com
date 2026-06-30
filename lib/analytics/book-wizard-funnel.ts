"use client";

import { trackConversion } from "@/lib/analytics/conversion-events";

import type { TierACategoryId } from "@/lib/book-wizard-cro/types";

export type BookWizardFunnelEvent =
  | "Step1_Complete"
  | "Step2_PackageSelected"
  | "GhostLead_Fired"
  | "WhatsApp_Click";

type FunnelParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

/** אירועי משפך מותאמים ל-GTM / Meta Pixel retargeting */
export function trackBookWizardFunnel(
  event: BookWizardFunnelEvent,
  params?: FunnelParams & { category?: TierACategoryId | string },
): void {
  const category = params?.category ?? "studio";
  const payload = { ...params, category };

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event,
      funnel: `${category}_booking`,
      ...payload,
    });
    window.fbq?.("trackCustom", event, payload);
  }

  trackConversion("book_wizard_step", {
    funnel_event: event,
    ...payload,
  });
}
