import type {
  AtmosphereId,
  ConsultationPackageId,
  RecordingTypeId,
  ScheduleWindowId,
  StudioPackageId,
  StudioUpgradeId,
} from "@/lib/data/studio-recording-booking";
import type { MobileGeoId } from "@/lib/data/mobile-studio-booking";
import {
  isRecord,
  isStringArray,
  pickBoolean,
  pickEnum,
  pickNonNegativeInt,
  pickString,
} from "@/lib/wizard-draft-parse";

/** סוגי הקלטה שבהם מופיע שדה שם החוגג/ת */
export const EVENT_CELEBRANT_RECORDING_TYPES = [
  "event_song",
  "bride_blessing",
  "bar_mitzvah_speech",
  "general_blessing",
] as const satisfies readonly RecordingTypeId[];

export function isEventCelebrantRecordingType(
  recordingType: RecordingTypeId | "",
): boolean {
  return (EVENT_CELEBRANT_RECORDING_TYPES as readonly string[]).includes(recordingType);
}

export type WizardDepthId = "quick" | "standard" | "full";
export type ScenarioChoiceId = "" | "pairs" | "unsure";

export type ProjectModeId = "" | "personal" | "business";

export type StudioFormDraft = {
  wizardDepth: WizardDepthId;
  scenarioChoice: ScenarioChoiceId;
  projectMode: ProjectModeId;
  companyName: string;
  needsInvoice: boolean;
  splitCostEnabled: boolean;
  splitCostCount: number;
  recordingType: RecordingTypeId | "";
  songName: string;
  celebrantName: string;
  referrer: string;
  atmosphere: AtmosphereId | "";
  packageId: StudioPackageId | ConsultationPackageId | "";
  location: "modiin" | "mobile";
  mobileGeo: MobileGeoId | "";
  selectedUpgrades: StudioUpgradeId[];
  surpriseGift: boolean;
  giftRecipientName: string;
  name: string;
  phone: string;
  scheduleWindow: ScheduleWindowId | "";
  date: string;
  time: string;
  notes: string;
  adultsCount: number;
  childrenCount: number;
  customerNeed: string;
  termsAccepted: boolean;
  selectedUpsells?: string[];
};

const RECORDING_TYPES = [
  "cover",
  "original",
  "event_song",
  "bride_blessing",
  "bar_mitzvah_speech",
  "general_blessing",
  "voiceover",
  "song_promotion_consultation",
  "other",
] as const satisfies readonly RecordingTypeId[];

const ATMOSPHERE_IDS = ["intimate", "party", "focused"] as const satisfies readonly AtmosphereId[];

const PACKAGE_IDS = [
  "remote",
  "classic",
  "pro",
  "viral",
  "all_in",
  "consultation_phone",
  "consultation_inperson",
] as const satisfies readonly (StudioPackageId | ConsultationPackageId)[];

const MOBILE_GEOS = ["center", "north_south", "eilat"] as const satisfies readonly MobileGeoId[];

const SCHEDULE_WINDOWS = ["weekdays", "motzash"] as const satisfies readonly ScheduleWindowId[];
const WIZARD_DEPTHS = ["quick", "standard", "full"] as const satisfies readonly WizardDepthId[];
const SCENARIO_CHOICES = ["", "pairs", "unsure"] as const satisfies readonly ScenarioChoiceId[];
const PROJECT_MODES = ["", "personal", "business"] as const satisfies readonly ProjectModeId[];

/** שדות שנדחו לשיחה ב-quick path */
export function buildStudioDeferredFields(
  form: Pick<StudioFormDraft, "songName" | "time" | "atmosphere" | "celebrantName">,
  wizardDepth: WizardDepthId,
  showCelebrant: boolean,
): string | null {
  if (wizardDepth !== "quick") return null;
  const parts: string[] = [];
  if (!form.songName.trim()) parts.push("song");
  if (!form.time.trim()) parts.push("time");
  if (!form.atmosphere) parts.push("atmosphere");
  if (showCelebrant && !form.celebrantName.trim()) parts.push("celebrant");
  return parts.length ? parts.join(",") : null;
}

export function parseStudioFormDraft(
  raw: unknown,
  initial: StudioFormDraft,
): StudioFormDraft | null {
  if (!isRecord(raw)) return null;

  const location =
    raw.location === "mobile" || raw.location === "modiin" ? raw.location : initial.location;

  return {
    ...initial,
    wizardDepth: pickEnum(raw.wizardDepth, WIZARD_DEPTHS) ?? initial.wizardDepth,
    scenarioChoice: pickEnum(raw.scenarioChoice, SCENARIO_CHOICES) ?? initial.scenarioChoice,
    projectMode: pickEnum(raw.projectMode, PROJECT_MODES) ?? initial.projectMode,
    companyName: pickString(raw.companyName),
    needsInvoice: pickBoolean(raw.needsInvoice, initial.needsInvoice),
    splitCostEnabled: pickBoolean(raw.splitCostEnabled, initial.splitCostEnabled),
    splitCostCount: Math.min(10, Math.max(2, pickNonNegativeInt(raw.splitCostCount, initial.splitCostCount) || 2)),
    recordingType: pickEnum(raw.recordingType, RECORDING_TYPES) ?? initial.recordingType,
    songName: pickString(raw.songName),
    celebrantName: pickString(raw.celebrantName),
    referrer: pickString(raw.referrer),
    atmosphere: pickEnum(raw.atmosphere, ATMOSPHERE_IDS) ?? initial.atmosphere,
    packageId: pickEnum(raw.packageId, PACKAGE_IDS) ?? initial.packageId,
    location,
    mobileGeo: pickEnum(raw.mobileGeo, MOBILE_GEOS) ?? initial.mobileGeo,
    selectedUpgrades: isStringArray(raw.selectedUpgrades)
      ? (raw.selectedUpgrades as StudioUpgradeId[])
      : [],
    surpriseGift: pickBoolean(raw.surpriseGift, initial.surpriseGift),
    giftRecipientName: pickString(raw.giftRecipientName),
    name: pickString(raw.name),
    phone: pickString(raw.phone),
    scheduleWindow: pickEnum(raw.scheduleWindow, SCHEDULE_WINDOWS) ?? initial.scheduleWindow,
    date: pickString(raw.date),
    time: pickString(raw.time),
    notes: pickString(raw.notes),
    adultsCount: pickNonNegativeInt(raw.adultsCount, initial.adultsCount),
    childrenCount: pickNonNegativeInt(raw.childrenCount, initial.childrenCount),
    customerNeed: pickString(raw.customerNeed, initial.customerNeed),
    termsAccepted: pickBoolean(raw.termsAccepted),
  };
}
