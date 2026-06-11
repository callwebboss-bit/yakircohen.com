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
  termsAccepted: boolean;
};

const PACKAGE_IDS = ["starter", "audio", "video", "social"] as const;
const MOBILE_GEOS = ["center", "north_south", "eilat"] as const;

export function parsePodcastFormDraft(
  raw: unknown,
  initial: PodcastFormDraft,
): PodcastFormDraft | null {
  if (!isRecord(raw)) return null;

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
    termsAccepted: pickBoolean(raw.termsAccepted),
  };
}
