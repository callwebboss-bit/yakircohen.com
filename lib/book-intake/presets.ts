export type ServiceTypeTag =
  | "MIX_AND_MASTER"
  | "PODCAST_VOICE_CLEANUP"
  | "VIDEO_AI_EDIT"
  | "NEED_RECOMMENDATION";

export type IntakePreset = {
  tag: ServiceTypeTag;
  label: string;
  userChoicePreset: string;
  closerService: string;
};

export const INTAKE_PRESETS: readonly IntakePreset[] = [
  {
    tag: "MIX_AND_MASTER",
    label: "א' מוזיקה / מיקס",
    userChoicePreset: "אפשרות א' (מוזיקה)",
    closerService: "online_ai",
  },
  {
    tag: "PODCAST_VOICE_CLEANUP",
    label: "ב' פודקאסט / קריינות",
    userChoicePreset: "אפשרות ב' (פודקאסט)",
    closerService: "podcast",
  },
  {
    tag: "VIDEO_AI_EDIT",
    label: "ג' וידאו / AI",
    userChoicePreset: "אפשרות ג' (וידאו)",
    closerService: "recording",
  },
  {
    tag: "NEED_RECOMMENDATION",
    label: "ד' לא בטוח / ייעוץ חבר",
    userChoicePreset: "אפשרות ד' (המלצה)",
    closerService: "online_ai",
  },
] as const;

export function getPresetByTag(tag: ServiceTypeTag): IntakePreset {
  const preset = INTAKE_PRESETS.find((p) => p.tag === tag);
  if (!preset) return INTAKE_PRESETS[3];
  return preset;
}
