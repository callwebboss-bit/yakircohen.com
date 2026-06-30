import type { EventBookingItemId, EventBookingItemQuantity } from "@/lib/data/events-booking";
import { isRecord, isStringArray, pickBoolean, pickString } from "@/lib/wizard-draft-parse";

export const EVENTS_SESSION_PRIORITY_IDS = [
  "effect_failure",
  "timing_stress",
  "surprise_costs",
] as const;

export type EventsSessionPriorityId =
  | ""
  | (typeof EVENTS_SESSION_PRIORITY_IDS)[number];

export const EVENTS_WELCOME_PERK_IDS = [
  "tech_brief",
  "setup_photos",
  "coordinator_call",
] as const;

export type EventsWelcomePerkId = "" | (typeof EVENTS_WELCOME_PERK_IDS)[number];

export type EventsFormDraft = {
  selected: EventBookingItemId[];
  quantities: Partial<Record<EventBookingItemId, EventBookingItemQuantity>>;
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  customerNeed: string;
  notes: string;
  selectedUpsells: string[];
  sessionPriority: EventsSessionPriorityId;
  welcomePerk: EventsWelcomePerkId;
  lastMinuteUpsell: boolean;
  termsAccepted: boolean;
};

export function parseEventsFormDraft(
  raw: unknown,
  initial: EventsFormDraft,
): EventsFormDraft | null {
  if (!isRecord(raw)) return null;

  const VALID_QTY = new Set<string>([
    "standard", "double",
    "act_1", "act_2", "act_3",
    "freq_single", "freq_graduated", "freq_full", "freq_extreme",
  ]);
  const quantities: Partial<Record<EventBookingItemId, EventBookingItemQuantity>> = {};
  if (isRecord(raw.quantities)) {
    for (const [key, val] of Object.entries(raw.quantities)) {
      if (typeof val === "string" && VALID_QTY.has(val)) {
        quantities[key as EventBookingItemId] = val as EventBookingItemQuantity;
      }
    }
  }

  const sessionPriority = pickString(raw.sessionPriority);
  const welcomePerk = pickString(raw.welcomePerk);

  return {
    ...initial,
    selected: isStringArray(raw.selected) ? (raw.selected as EventBookingItemId[]) : [],
    quantities,
    name: pickString(raw.name),
    phone: pickString(raw.phone),
    date: pickString(raw.date),
    time: pickString(raw.time),
    location: pickString(raw.location),
    customerNeed: pickString(raw.customerNeed),
    notes: pickString(raw.notes),
    selectedUpsells: isStringArray(raw.selectedUpsells) ? raw.selectedUpsells : [],
    sessionPriority: (EVENTS_SESSION_PRIORITY_IDS as readonly string[]).includes(sessionPriority)
      ? (sessionPriority as EventsSessionPriorityId)
      : "",
    welcomePerk: (EVENTS_WELCOME_PERK_IDS as readonly string[]).includes(welcomePerk)
      ? (welcomePerk as EventsWelcomePerkId)
      : "",
    lastMinuteUpsell: pickBoolean(raw.lastMinuteUpsell),
    termsAccepted: pickBoolean(raw.termsAccepted),
  };
}
