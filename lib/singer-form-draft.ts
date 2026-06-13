import type { SingerPackageId } from "@/lib/data/singer-amplification-page";
import {
  isRecord,
  isStringArray,
  pickBoolean,
  pickEnum,
  pickString,
} from "@/lib/wizard-draft-parse";

export type SingerFormDraft = {
  packageId: SingerPackageId | "";
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  selectedAddons: string[];
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
    termsAccepted: pickBoolean(raw.termsAccepted),
  };
}
