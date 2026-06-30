import type { SingerPackageId } from "@/lib/data/singer-amplification-page";
import {
  isRecord,
  isStringArray,
  pickBoolean,
  pickEnum,
  pickString,
} from "@/lib/wizard-draft-parse";

export const SINGER_SESSION_PRIORITY_IDS = [
  "feedback_fear",
  "cant_hear_self",
  "surprise_costs",
] as const;

export type SingerSessionPriorityId =
  | ""
  | (typeof SINGER_SESSION_PRIORITY_IDS)[number];

export const SINGER_WELCOME_PERK_IDS = [
  "soundcheck",
  "monitor_mix",
  "tech_on_site",
] as const;

export type SingerWelcomePerkId = "" | (typeof SINGER_WELCOME_PERK_IDS)[number];

export type SingerFormDraft = {
  packageId: SingerPackageId | "";
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  selectedAddons: string[];
  sessionPriority: SingerSessionPriorityId;
  welcomePerk: SingerWelcomePerkId;
  lastMinuteUpsell: boolean;
  /** unused - satisfies useBookingWizard constraint */
  selectedUpsells?: string[];
  termsAccepted: boolean;
};

const PACKAGE_IDS = ["basic", "premium", "vip"] as const satisfies readonly SingerPackageId[];

export function parseSingerFormDraft(
  raw: unknown,
  initial: SingerFormDraft,
  fallbackPackageId: SingerPackageId | "" = "",
): SingerFormDraft | null {
  if (!isRecord(raw)) return null;

  const sessionPriority = pickString(raw.sessionPriority);
  const welcomePerk = pickString(raw.welcomePerk);

  return {
    ...initial,
    packageId: pickEnum(raw.packageId, PACKAGE_IDS) ?? fallbackPackageId,
    name: pickString(raw.name),
    phone: pickString(raw.phone),
    date: pickString(raw.date),
    time: pickString(raw.time),
    location: pickString(raw.location),
    notes: pickString(raw.notes),
    selectedAddons: isStringArray(raw.selectedAddons) ? raw.selectedAddons : [],
    sessionPriority: (SINGER_SESSION_PRIORITY_IDS as readonly string[]).includes(
      sessionPriority,
    )
      ? (sessionPriority as SingerSessionPriorityId)
      : "",
    welcomePerk: (SINGER_WELCOME_PERK_IDS as readonly string[]).includes(welcomePerk)
      ? (welcomePerk as SingerWelcomePerkId)
      : "",
    lastMinuteUpsell: pickBoolean(raw.lastMinuteUpsell),
    termsAccepted: pickBoolean(raw.termsAccepted),
  };
}
