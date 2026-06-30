import type { BookingUpsellItem } from "@/lib/data/booking-shared";
import { UPSELLS } from "@/lib/data/booking-calculator-services";
import {
  getAddonsForBaseId,
  getPriceById,
  type PriceItem,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import type { PodcastPackageId } from "@/lib/data/podcast-calculator";
import type { StudioPackageId } from "@/lib/data/studio-recording-booking";

const PODCAST_PACKAGE_CATALOG: Record<PodcastPackageId, PriceItemId> = {
  starter: "studio_half_hour",
  audio: "podcast_audio",
  video: "podcast_video",
  social: "content_package",
};

const STUDIO_PACKAGE_CATALOG: Partial<Record<StudioPackageId, PriceItemId>> = {
  remote: "blessing_recording",
  classic: "cover_song",
  pro: "song_package",
  viral: "full_production_clip",
  all_in: "single_production",
};

const EVENTS_BUNDLE_CATALOG: Record<number, PriceItemId> = {
  1: "event_attraction_1",
  2: "event_attraction_2",
  3: "event_attraction_3",
};

export function catalogItemsToUpsellItems(
  items: readonly PriceItem[],
): BookingUpsellItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.label,
    description: item.context,
    price: item.exVat,
  }));
}

export function getCatalogAddonsForPodcastPackage(
  packageId: PodcastPackageId | "",
): BookingUpsellItem[] {
  if (!packageId) return [];
  const baseId = PODCAST_PACKAGE_CATALOG[packageId];
  return catalogItemsToUpsellItems(getAddonsForBaseId(baseId));
}

export function getCatalogAddonsForStudioPackage(
  packageId: StudioPackageId | "",
): BookingUpsellItem[] {
  if (!packageId) return [];
  const baseId = STUDIO_PACKAGE_CATALOG[packageId];
  if (!baseId) return [];
  return catalogItemsToUpsellItems(getAddonsForBaseId(baseId));
}

/** תוספות לפי מספר אטרקציות (לא כולל השכרת הגברה) */
export function getCatalogAddonsForEventsBundle(
  attractionCount: number,
): BookingUpsellItem[] {
  if (attractionCount <= 0) return [];
  const baseId =
    attractionCount >= 4
      ? ("event_attraction_4" as PriceItemId)
      : EVENTS_BUNDLE_CATALOG[attractionCount];
  if (!baseId) return [];
  return catalogItemsToUpsellItems(getAddonsForBaseId(baseId));
}

export function resolveAddonPrice(id: string): number {
  try {
    return getPriceById(id as PriceItemId).exVat;
  } catch {
    return UPSELLS[id]?.price ?? 0;
  }
}

export function resolveAddonLabel(id: string): string {
  try {
    return getPriceById(id as PriceItemId).label;
  } catch {
    return UPSELLS[id]?.name ?? id;
  }
}

export function sumAddonPrices(selected: ReadonlySet<string>): number {
  return Array.from(selected).reduce((sum, id) => sum + resolveAddonPrice(id), 0);
}

export function podcastPackageToCatalogId(
  packageId: PodcastPackageId | "",
): PriceItemId | null {
  if (!packageId) return null;
  return PODCAST_PACKAGE_CATALOG[packageId] ?? null;
}

export function studioPackageToCatalogId(
  packageId: StudioPackageId | "",
): PriceItemId | null {
  if (!packageId) return null;
  return STUDIO_PACKAGE_CATALOG[packageId] ?? null;
}

export function eventsBundleToCatalogId(attractionCount: number): PriceItemId | null {
  if (attractionCount <= 0) return null;
  if (attractionCount >= 4) return "event_attraction_4";
  return EVENTS_BUNDLE_CATALOG[attractionCount] ?? null;
}
