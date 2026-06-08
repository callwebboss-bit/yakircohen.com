import type { PodcastPackageId } from "@/lib/data/podcast-calculator";
import { UPSELLS } from "@/lib/data/booking-calculator-services";
import type { BookingUpsellItem } from "@/lib/data/booking-shared";

/** תוספות UPSELL לפי חבילת פודקאסט שנבחרה */
export const PODCAST_PACKAGE_UPSELL_KEYS: Record<PodcastPackageId, readonly string[]> = {
  starter: ["editing_advanced", "highlights", "custom_graphics"],
  audio: ["editing_advanced", "custom_graphics", "highlights"],
  video: ["full_edit", "custom_graphics", "highlights"],
  social: ["custom_graphics", "highlights", "premium_package"],
};

export function getPodcastUpsellItems(packageId: PodcastPackageId | ""): BookingUpsellItem[] {
  if (!packageId) return [];
  const keys = PODCAST_PACKAGE_UPSELL_KEYS[packageId] ?? [];
  return keys.flatMap((key): BookingUpsellItem[] => {
    const u = UPSELLS[key];
    if (!u) return [];
    return [{ id: key, name: u.name, description: u.desc, price: u.price }];
  });
}

export function sumPodcastUpsells(selected: ReadonlySet<string>): number {
  return Array.from(selected).reduce((sum, key) => sum + (UPSELLS[key]?.price ?? 0), 0);
}
