import type { PodcastFormDraft } from "@/lib/podcast-form-draft";
import { validateBookingLead } from "@/lib/form-validation";
import type {
  WizardStepBlocker,
  WizardStepCheckItem,
} from "@/lib/studio-wizard-step-guards";

export type { WizardStepBlocker, WizardStepCheckItem };

type Step0Input = Pick<PodcastFormDraft, "packageId">;

type Step1Input = Pick<
  PodcastFormDraft,
  "name" | "phone" | "location" | "mobileGeo"
>;

export function getPodcastStep0Blockers(
  input: Step0Input,
): WizardStepBlocker[] {
  if (input.packageId) return [];
  return [
    {
      fieldId: "packageId",
      message: "בחרו חבילת פודקאסט כדי להמשיך",
      scrollTargetId: "book-podcast-package-grid",
    },
  ];
}

export function getPodcastStep1Blockers(
  input: Step1Input,
): WizardStepBlocker[] {
  const blockers: WizardStepBlocker[] = [];

  if (!input.name.trim() || input.name.trim().length < 2) {
    blockers.push({
      fieldId: "name",
      message: "הזינו שם (לפחות 2 תווים)",
      scrollTargetId: "pb-name",
    });
  }

  if (!input.phone.trim()) {
    blockers.push({
      fieldId: "phone",
      message: "הזינו מספר טלפון לתיאום",
      scrollTargetId: "pb-phone",
    });
  } else {
    const phoneCheck = validateBookingLead({
      name: input.name,
      phone: input.phone,
      date: "",
      time: "",
      location: "",
      notes: "",
      requireLocation: false,
      requireDate: false,
      requireTime: false,
    });
    if (!phoneCheck.ok && phoneCheck.errors?.phone) {
      blockers.push({
        fieldId: "phone",
        message: phoneCheck.errors.phone,
        scrollTargetId: "pb-phone",
      });
    }
  }

  if (input.location === "mobile" && !input.mobileGeo) {
    blockers.push({
      fieldId: "mobileGeo",
      message: "בחרו אזור הגעה לאולפן הנייד",
      scrollTargetId: "book-podcast-location-section",
    });
  }

  return blockers;
}

export function getPodcastStep0Checklist(
  packageId: PodcastFormDraft["packageId"],
): WizardStepCheckItem[] {
  return [
    {
      id: "packageId",
      label: "חבילה נבחרה",
      done: Boolean(packageId),
    },
  ];
}

export function getPodcastStep1Checklist(
  input: Step1Input,
): WizardStepCheckItem[] {
  const phoneOk =
    input.phone.trim().length > 0 &&
    validateBookingLead({
      name: input.name,
      phone: input.phone,
      date: "",
      time: "",
      location: "",
      notes: "",
      requireLocation: false,
      requireDate: false,
      requireTime: false,
    }).ok;

  return [
    {
      id: "name",
      label: "שם הוזן",
      done: input.name.trim().length >= 2,
    },
    {
      id: "phone",
      label: "טלפון תקין",
      done: phoneOk,
    },
    {
      id: "location",
      label:
        input.location === "mobile" ? "אולפן נייד + אזור" : "מיקום נבחר",
      done:
        input.location === "modiin" ||
        (input.location === "mobile" && Boolean(input.mobileGeo)),
    },
  ];
}
