import type {
  ConsultationPackageId,
  RecordingTypeId,
  StudioPackageId,
} from "@/lib/data/studio-recording-booking";
import type { StudioFormDraft } from "@/lib/studio-form-draft";

const FIT_MATRIX: Partial<
  Record<RecordingTypeId, Partial<Record<StudioPackageId | ConsultationPackageId, number>>>
> = {
  cover: { classic: 92, pro: 96, viral: 94, all_in: 90, remote: 78 },
  original: { pro: 94, all_in: 97, classic: 86, viral: 91 },
  event_song: { classic: 91, pro: 95, all_in: 93 },
  bride_blessing: { remote: 93, classic: 88 },
  bar_mitzvah_speech: { classic: 90, pro: 94 },
  general_blessing: { remote: 94, classic: 89 },
  voiceover: { classic: 92, pro: 95 },
  other: { classic: 88, pro: 91 },
};

export function calcStudioPackageFitPct(
  form: Pick<StudioFormDraft, "recordingType" | "packageId" | "projectMode">,
): number | null {
  if (!form.recordingType || !form.packageId) return null;

  const row = FIT_MATRIX[form.recordingType];
  let base = row?.[form.packageId] ?? 87;

  if (form.projectMode === "business" && form.recordingType === "voiceover") {
    base = Math.min(98, base + 2);
  }
  if (form.projectMode === "personal" && form.recordingType === "event_song") {
    base = Math.min(98, base + 1);
  }

  return Math.min(98, Math.max(85, base));
}
