import { buildBookHref, type BookCategoryId } from "@/lib/book-url";
import type { PodcastPackageId } from "@/lib/data/podcast-calculator";
import { getPriceById, type PriceItemId } from "@/lib/data/pricing-catalog";
import type { FilterAnswers } from "@/lib/data/filter-questions";
import type {
  RecordingTypeId,
  StudioPackageId,
} from "@/lib/data/studio-recording-booking";

export type PricingBookTarget = {
  category: BookCategoryId;
  catalogId: PriceItemId;
  podcastPackageId?: PodcastPackageId;
  studioPackageId?: StudioPackageId;
  recordingTypeId?: RecordingTypeId;
  filterPreset?: Partial<FilterAnswers>;
  participantCount?: number;
  podcastLocation?: "modiin" | "mobile";
};

const PRICING_BOOK_MAP: Partial<Record<PriceItemId, PricingBookTarget>> = {
  // ─── אולפן ───
  studio_half_hour: {
    category: "podcast",
    catalogId: "studio_half_hour",
    podcastPackageId: "starter",
  },
  studio_hour: {
    category: "studio",
    catalogId: "studio_hour",
    studioPackageId: "classic",
    recordingTypeId: "voiceover",
    filterPreset: { timeline: "this_week", purpose: "professional" },
  },
  blessing_recording: {
    category: "studio",
    catalogId: "blessing_recording",
    studioPackageId: "remote",
    recordingTypeId: "general_blessing",
    filterPreset: { timeline: "this_month", purpose: "gift" },
  },
  cover_song: {
    category: "studio",
    catalogId: "cover_song",
    studioPackageId: "classic",
    recordingTypeId: "cover",
    filterPreset: { timeline: "this_month", purpose: "personal" },
  },
  song_package: {
    category: "studio",
    catalogId: "song_package",
    studioPackageId: "pro",
    recordingTypeId: "event_song",
    filterPreset: { timeline: "this_month", purpose: "personal" },
  },
  single_production: {
    category: "studio",
    catalogId: "single_production",
    studioPackageId: "all_in",
    recordingTypeId: "original",
    filterPreset: { timeline: "this_month", purpose: "personal" },
  },
  full_production_clip: {
    category: "studio",
    catalogId: "full_production_clip",
    studioPackageId: "viral",
    recordingTypeId: "original",
    filterPreset: { timeline: "this_month", purpose: "personal" },
  },
  // ─── פודקאסט ───
  podcast_pilot: {
    category: "podcast",
    catalogId: "podcast_pilot",
    podcastPackageId: "audio",
  },
  podcast_audio: {
    category: "podcast",
    catalogId: "podcast_audio",
    podcastPackageId: "audio",
  },
  podcast_video: {
    category: "podcast",
    catalogId: "podcast_video",
    podcastPackageId: "video",
  },
  content_package: {
    category: "podcast",
    catalogId: "content_package",
    podcastPackageId: "social",
  },
  full_podcast_production: {
    category: "podcast",
    catalogId: "full_podcast_production",
    podcastPackageId: "audio",
  },
  mobile_podcast_at_home: {
    category: "podcast",
    catalogId: "mobile_podcast_at_home",
    podcastPackageId: "audio",
    podcastLocation: "mobile",
  },
  podcast_extra_participant: {
    category: "podcast",
    catalogId: "podcast_extra_participant",
    podcastPackageId: "audio",
    participantCount: 3,
  },
  podcast_editing_hour: {
    category: "online",
    catalogId: "podcast_editing_hour",
  },
  studio_self_service_hour: {
    category: "podcast",
    catalogId: "studio_self_service_hour",
    podcastPackageId: "starter",
  },
  corp_podcast_pilot: {
    category: "pro",
    catalogId: "corp_podcast_pilot",
  },
  corp_podcast_retainer: {
    category: "pro",
    catalogId: "corp_podcast_retainer",
  },
};

const VALID_CATALOG_IDS = new Set(
  Object.keys(PRICING_BOOK_MAP) as PriceItemId[],
);

export function resolvePricingBookTarget(
  catalogId: PriceItemId,
): PricingBookTarget | null {
  return PRICING_BOOK_MAP[catalogId] ?? null;
}

export function resolvePricingBookHref(catalogId: PriceItemId): string | null {
  const target = resolvePricingBookTarget(catalogId);
  if (!target) return null;
  return buildBookHref(target.category, { catalog: catalogId });
}

export function parseBookCatalogFromSearch(
  value: string | null,
): PricingBookTarget | null {
  if (!value?.trim()) return null;
  const id = value.trim() as PriceItemId;
  if (!VALID_CATALOG_IDS.has(id)) return null;
  try {
    getPriceById(id);
  } catch {
    return null;
  }
  return resolvePricingBookTarget(id);
}

export function categoryFromPricingCatalog(
  catalogId: PriceItemId,
): BookCategoryId | null {
  return resolvePricingBookTarget(catalogId)?.category ?? null;
}
