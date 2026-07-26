export const LEAD_FLOW_SERVICE_IDS = [
  "confetti",
  "bubbles",
  "heavy-smoke",
  "song",
  "podcast",
  "mobile-studio",
  "used-gear",
] as const;

export type LeadFlowServiceId = (typeof LEAD_FLOW_SERVICE_IDS)[number];

export type LeadFlowService = {
  id: LeadFlowServiceId;
  label: string;
  href: string;
  group: "attractions" | "studio" | "shop";
};

export const LEAD_FLOW_SERVICES: readonly LeadFlowService[] = [
  {
    id: "confetti",
    label: "קונפטי",
    href: "/events/attractions/confetti-cannon",
    group: "attractions",
  },
  {
    id: "bubbles",
    label: "בועות סבון",
    href: "/events/attractions/bubble-machine",
    group: "attractions",
  },
  {
    id: "heavy-smoke",
    label: "עשן כבד",
    href: "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
    group: "attractions",
  },
  {
    id: "song",
    label: "הקלטת שיר",
    href: "/studio/recording-song-modiin",
    group: "studio",
  },
  {
    id: "podcast",
    label: "הקלטת פודקאסט",
    href: "/podcast",
    group: "studio",
  },
  {
    id: "mobile-studio",
    label: "אולפן הקלטות נייד",
    href: "/studio/mobile-studio",
    group: "studio",
  },
  {
    id: "used-gear",
    label: "ציוד יד-2 לתקליטנים",
    href: "/shop#dj-used-gear",
    group: "shop",
  },
] as const;

export function getLeadFlowService(
  id: LeadFlowServiceId,
): LeadFlowService | undefined {
  return LEAD_FLOW_SERVICES.find((s) => s.id === id);
}

export function isLeadFlowServiceId(value: string): value is LeadFlowServiceId {
  return (LEAD_FLOW_SERVICE_IDS as readonly string[]).includes(value);
}
