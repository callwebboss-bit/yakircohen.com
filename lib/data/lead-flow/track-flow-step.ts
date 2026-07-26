import { trackConversion } from "@/lib/analytics/conversion-events";

export type LeadFlowStepName =
  | "service"
  | "needs"
  | "scope"
  | "packages"
  | "upsells"
  | "hold";

/** מעקב ניטרלי לכל מעבר שלב בזרימת הליד */
export function trackFlowStep(
  stepName: LeadFlowStepName | string,
  payload?: Record<string, string | number | boolean>,
): void {
  trackConversion("needs_flow_step", {
    step: stepName,
    ...payload,
  });
}
