import type { TierACategoryId } from "@/lib/book-wizard-cro/types";
import studioMatrix from "@/lib/book-wizard-cro/fit-matrices/studio.json";

type StudioFitData = {
  matrix: Record<string, Record<string, number>>;
  businessModifiers: { voiceover_business: number; event_song_personal: number };
};

const fitData = studioMatrix as StudioFitData;

export function calcStudioWizardFitPct(opts: {
  recordingType: string;
  packageId: string;
  projectMode: string;
}): number | null {
  if (!opts.recordingType || !opts.packageId) return null;

  const row = fitData.matrix[opts.recordingType];
  let base = row?.[opts.packageId] ?? 87;

  if (opts.projectMode === "business" && opts.recordingType === "voiceover") {
    base = Math.min(98, base + fitData.businessModifiers.voiceover_business);
  }
  if (opts.projectMode === "personal" && opts.recordingType === "event_song") {
    base = Math.min(98, base + fitData.businessModifiers.event_song_personal);
  }

  return Math.min(98, Math.max(85, base));
}

export function calcWizardFitPct(
  category: TierACategoryId,
  form: { recordingType?: string; packageId?: string; projectMode?: string },
): number | null {
  if (category !== "studio") return null;
  return calcStudioWizardFitPct({
    recordingType: form.recordingType ?? "",
    packageId: form.packageId ?? "",
    projectMode: form.projectMode ?? "",
  });
}
