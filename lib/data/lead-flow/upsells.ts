import type { PriceItemId } from "@/lib/data/pricing-catalog";
import type { LeadFlowServiceId } from "./services";

export type LeadFlowUpsell = {
  id: string;
  label: string;
  catalogId: PriceItemId;
  /** אל תציג כשירות הנוכחי הוא אותו אפקט */
  hideFor?: readonly LeadFlowServiceId[];
};

export const LEAD_FLOW_UPSELLS: readonly LeadFlowUpsell[] = [
  {
    id: "heavy-smoke",
    label: "עשן כבד",
    catalogId: "event_attraction_1",
    hideFor: ["heavy-smoke"],
  },
  {
    id: "confetti",
    label: "קונפטי",
    catalogId: "event_attraction_1",
    hideFor: ["confetti"],
  },
  {
    id: "bubbles",
    label: "בועות סבון",
    catalogId: "event_attraction_1",
    hideFor: ["bubbles"],
  },
  {
    id: "slideshow",
    label: "מצגת תמונות קולנועית",
    catalogId: "cinematic_slideshow",
  },
  {
    id: "mobile-studio",
    label: "אולפן נייד",
    catalogId: "mobile_studio",
    hideFor: ["mobile-studio"],
  },
  {
    id: "express",
    label: "מסירה מהירה של תוצרים",
    catalogId: "express_delivery",
    hideFor: ["confetti", "bubbles", "heavy-smoke", "used-gear"],
  },
];

export function getUpsellsForService(
  serviceId: LeadFlowServiceId,
): readonly LeadFlowUpsell[] {
  return LEAD_FLOW_UPSELLS.filter(
    (u) => !u.hideFor?.includes(serviceId),
  );
}
