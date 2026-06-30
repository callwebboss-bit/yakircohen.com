import type { StudioFormDraft } from "@/lib/studio-form-draft";
import { calcStudioWizardFitPct } from "@/lib/book-wizard-cro/calc-wizard-fit";

export function calcStudioPackageFitPct(
  form: Pick<StudioFormDraft, "recordingType" | "packageId" | "projectMode">,
): number | null {
  return calcStudioWizardFitPct({
    recordingType: form.recordingType,
    packageId: form.packageId,
    projectMode: form.projectMode,
  });
}
