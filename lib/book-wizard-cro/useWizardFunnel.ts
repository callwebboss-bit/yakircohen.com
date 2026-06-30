"use client";

import { useCallback } from "react";
import {
  trackBookWizardFunnel,
  type BookWizardFunnelEvent,
} from "@/lib/analytics/book-wizard-funnel";
import type { TierACategoryId } from "@/lib/book-wizard-cro/types";

/** קולבק יציב לפי קטגוריה - GTM / Meta retargeting */
export function useWizardFunnel(category: TierACategoryId) {
  return useCallback(
    (
      event: BookWizardFunnelEvent,
      params?: Record<string, string | number | boolean>,
    ) => {
      trackBookWizardFunnel(event, { category, ...params });
    },
    [category],
  );
}
