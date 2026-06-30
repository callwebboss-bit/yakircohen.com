import type { PodcastPackageId } from "@/lib/data/podcast-calculator";
import type { MobileGeoId } from "@/lib/data/mobile-studio-booking";
import {
  isRecord,
  isStringArray,
  pickBoolean,
  pickEnum,
  pickNonNegativeInt,
  pickPositiveInt,
  pickString,
} from "@/lib/wizard-draft-parse";

export const PODCAST_SESSION_PRIORITY_IDS = [
  "mic_fear",
  "edit_time",
  "surprise_costs",
] as const;

export type PodcastSessionPriorityId =
  | ""
  | (typeof PODCAST_SESSION_PRIORITY_IDS)[number];

export const PODCAST_WELCOME_PERK_IDS = [
  "prep_call",
  "noise_cleanup",
  "spotify_upload",
] as const;

export type PodcastWelcomePerkId = "" | (typeof PODCAST_WELCOME_PERK_IDS)[number];

export type PodcastFormDraft = {
  packageId: PodcastPackageId | "";
  overtimeBlocks: number;
  participantCount: number;
  location: "modiin" | "mobile" | "";
  mobileGeo: MobileGeoId | "";
  name: string;
  phone: string;
  timeframe: string;
  customerNeed: string;
  notes: string;
  selectedUpsells: string[];
  sessionPriority: PodcastSessionPriorityId;
  welcomePerk: PodcastWelcomePerkId;
  lastMinuteUpsell: boolean;
  termsAccepted: boolean;
};

const PACKAGE_IDS = ["starter", "audio", "video", "social"] as const;
const MOBILE_GEOS = ["center", "north_south", "eilat"] as const;

export function parsePodcastFormDraft(
  raw: unknown,
  initial: PodcastFormDraft,
): PodcastFormDraft | null {
  if (!isRecord(raw)) return null;

  const sessionPriority = pickString(raw.sessionPriority);
  const welcomePerk = pickString(raw.welcomePerk);

  return {
    ...initial,
    packageId: pickEnum(raw.packageId, PACKAGE_IDS) ?? initial.packageId,
    overtimeBlocks: pickNonNegativeInt(raw.overtimeBlocks, initial.overtimeBlocks),
    participantCount: pickPositiveInt(raw.participantCount, initial.participantCount),
    location:
      raw.location === "mobile" || raw.location === "modiin"
        ? raw.location
        : initial.location,
    mobileGeo: pickEnum(raw.mobileGeo, MOBILE_GEOS) ?? initial.mobileGeo,
    name: pickString(raw.name),
    phone: pickString(raw.phone),
    timeframe: pickString(raw.timeframe),
    customerNeed: pickString(raw.customerNeed),
    notes: pickString(raw.notes),
    selectedUpsells: isStringArray(raw.selectedUpsells) ? raw.selectedUpsells : [],
    sessionPriority: (PODCAST_SESSION_PRIORITY_IDS as readonly string[]).includes(
      sessionPriority,
    )
      ? (sessionPriority as PodcastSessionPriorityId)
      : "",
    welcomePerk: (PODCAST_WELCOME_PERK_IDS as readonly string[]).includes(welcomePerk)
      ? (welcomePerk as PodcastWelcomePerkId)
      : "",
    lastMinuteUpsell: pickBoolean(raw.lastMinuteUpsell),
    termsAccepted: pickBoolean(raw.termsAccepted),
  };
}
