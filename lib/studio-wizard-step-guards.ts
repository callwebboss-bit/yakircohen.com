import type { StudioFormDraft } from "@/lib/studio-form-draft";

export type WizardStepBlocker = {
  fieldId: string;
  message: string;
  scrollTargetId: string;
};

type Step0GuardInput = Pick<
  StudioFormDraft,
  "recordingType" | "atmosphere"
> & {
  isQuickWizard: boolean;
  isConsultation: boolean;
  hideAtmosphere: boolean;
};

export function getStep0Blockers(input: Step0GuardInput): WizardStepBlocker[] {
  const blockers: WizardStepBlocker[] = [];
  if (!input.recordingType) {
    blockers.push({
      fieldId: "recordingType",
      message: "בחרו סוג הקלטה כדי להמשיך",
      scrollTargetId: "book-recording-type-section",
    });
  }
  const needsAtmosphere =
    !input.isQuickWizard &&
    !input.isConsultation &&
    !input.hideAtmosphere;
  if (needsAtmosphere && !input.atmosphere) {
    blockers.push({
      fieldId: "atmosphere",
      message: "בחרו אווירה לסשן כדי להמשיך",
      scrollTargetId: "book-atmosphere-section",
    });
  }
  return blockers;
}

export function getStep1Blockers(
  packageId: StudioFormDraft["packageId"],
): WizardStepBlocker[] {
  if (packageId) return [];
  return [
    {
      fieldId: "packageId",
      message: "בחרו מסלול אחד כדי להמשיך",
      scrollTargetId: "book-package-grid",
    },
  ];
}

export type WizardStepCheckItem = {
  id: string;
  label: string;
  done: boolean;
  optional?: boolean;
};

export function getStep0Checklist(input: Step0GuardInput): WizardStepCheckItem[] {
  const items: WizardStepCheckItem[] = [
    {
      id: "recordingType",
      label: "סוג הקלטה נבחר",
      done: Boolean(input.recordingType),
    },
  ];
  const needsAtmosphere =
    !input.isQuickWizard &&
    !input.isConsultation &&
    !input.hideAtmosphere;
  if (needsAtmosphere) {
    items.push({
      id: "atmosphere",
      label: "אווירה לסשן נבחרה",
      done: Boolean(input.atmosphere),
    });
  }
  return items;
}

export function getStep1Checklist(
  packageId: StudioFormDraft["packageId"],
  upgradesCount: number,
): WizardStepCheckItem[] {
  return [
    {
      id: "packageId",
      label: "מסלול נבחר",
      done: Boolean(packageId),
    },
    {
      id: "upgrades",
      label: upgradesCount > 0 ? `${upgradesCount} תוספות נבחרו` : "תוספות (אופציונלי)",
      done: upgradesCount > 0,
      optional: true,
    },
  ];
}
