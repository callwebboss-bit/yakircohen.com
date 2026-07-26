export const LEAD_FLOW_STEPS = [
  { id: "needs", title: "איתור צרכים" },
  { id: "scope", title: "מה כולל / מה לא" },
  { id: "packages", title: "מחיר וחבילות" },
  { id: "upsells", title: "תוספות" },
  { id: "hold", title: "Hold ותשלום" },
] as const;

export type LeadFlowStepId = (typeof LEAD_FLOW_STEPS)[number]["id"];

export function isLeadFlowStepId(value: string): value is LeadFlowStepId {
  return LEAD_FLOW_STEPS.some((s) => s.id === value);
}
