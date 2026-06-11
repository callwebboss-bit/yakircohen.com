import type { EventBookingItemId } from "@/lib/data/events-booking";
import { isRecord, isStringArray, pickBoolean, pickString } from "@/lib/wizard-draft-parse";

export type EventsFormDraft = {
  selected: EventBookingItemId[];
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  customerNeed: string;
  notes: string;
  selectedUpsells: string[];
  termsAccepted: boolean;
};

export function parseEventsFormDraft(
  raw: unknown,
  initial: EventsFormDraft,
): EventsFormDraft | null {
  if (!isRecord(raw)) return null;

  return {
    ...initial,
    selected: isStringArray(raw.selected) ? (raw.selected as EventBookingItemId[]) : [],
    name: pickString(raw.name),
    phone: pickString(raw.phone),
    date: pickString(raw.date),
    time: pickString(raw.time),
    location: pickString(raw.location),
    customerNeed: pickString(raw.customerNeed),
    notes: pickString(raw.notes),
    selectedUpsells: isStringArray(raw.selectedUpsells) ? raw.selectedUpsells : [],
    termsAccepted: pickBoolean(raw.termsAccepted),
  };
}
