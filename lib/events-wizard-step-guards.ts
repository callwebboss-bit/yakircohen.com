import type { EventsFormDraft } from "@/lib/events-form-draft";
import { validateBookingLead } from "@/lib/form-validation";
import type {
  WizardStepBlocker,
  WizardStepCheckItem,
} from "@/lib/studio-wizard-step-guards";

export type { WizardStepBlocker, WizardStepCheckItem };

type Step0Input = {
  attractionCount: number;
};

type Step1Input = Pick<
  EventsFormDraft,
  "name" | "phone" | "date" | "time" | "location"
>;

const SCROLL_IDS = {
  selection: "book-events-selection",
  name: "ev-name",
  phone: "ev-phone",
  schedule: "book-events-schedule",
  location: "ev-location",
} as const;

function contactBlockers(
  input: Step1Input,
  scrollIds: typeof SCROLL_IDS,
): WizardStepBlocker[] {
  const blockers: WizardStepBlocker[] = [];

  if (!input.name.trim() || input.name.trim().length < 2) {
    blockers.push({
      fieldId: "name",
      message: "הזינו שם (לפחות 2 תווים)",
      scrollTargetId: scrollIds.name,
    });
  }

  const leadCheck = validateBookingLead({
    name: input.name,
    phone: input.phone,
    date: input.date,
    time: input.time,
    location: input.location,
    notes: "",
    requireLocation: true,
  });

  if (!input.phone.trim()) {
    blockers.push({
      fieldId: "phone",
      message: "הזינו מספר טלפון לתיאום",
      scrollTargetId: scrollIds.phone,
    });
  } else if (!leadCheck.ok && leadCheck.errors?.phone) {
    blockers.push({
      fieldId: "phone",
      message: leadCheck.errors.phone,
      scrollTargetId: scrollIds.phone,
    });
  }

  if (!leadCheck.ok && leadCheck.errors?.date) {
    blockers.push({
      fieldId: "date",
      message: leadCheck.errors.date,
      scrollTargetId: scrollIds.schedule,
    });
  }

  if (!leadCheck.ok && leadCheck.errors?.time) {
    blockers.push({
      fieldId: "time",
      message: leadCheck.errors.time,
      scrollTargetId: scrollIds.schedule,
    });
  }

  if (!leadCheck.ok && leadCheck.errors?.location) {
    blockers.push({
      fieldId: "location",
      message: leadCheck.errors.location,
      scrollTargetId: scrollIds.location,
    });
  }

  return blockers;
}

export function getEventsStep0Blockers(input: Step0Input): WizardStepBlocker[] {
  if (input.attractionCount > 0) return [];
  return [
    {
      fieldId: "selected",
      message: "בחרו לפחות אטרקציה אחת כדי להמשיך",
      scrollTargetId: SCROLL_IDS.selection,
    },
  ];
}

export function getEventsStep1Blockers(input: Step1Input): WizardStepBlocker[] {
  return contactBlockers(input, SCROLL_IDS);
}

export function getEventsStep0Checklist(
  attractionCount: number,
): WizardStepCheckItem[] {
  return [
    {
      id: "selected",
      label: "אטרקציה נבחרה",
      done: attractionCount > 0,
    },
  ];
}

export function getEventsStep1Checklist(input: Step1Input): WizardStepCheckItem[] {
  const leadOk = validateBookingLead({
    name: input.name,
    phone: input.phone,
    date: input.date,
    time: input.time,
    location: input.location,
    notes: "",
    requireLocation: true,
  }).ok;

  return [
    { id: "name", label: "שם הוזן", done: input.name.trim().length >= 2 },
    { id: "phone", label: "טלפון תקין", done: leadOk && input.phone.trim().length > 0 },
    { id: "schedule", label: "תאריך ושעה", done: Boolean(input.date.trim() && input.time.trim()) },
    { id: "location", label: "מיקום הוזן", done: Boolean(input.location.trim()) },
  ];
}
