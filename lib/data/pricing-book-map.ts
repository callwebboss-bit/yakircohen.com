import { buildBookHref, type BookCategoryId } from "@/lib/book-url";
import type { PodcastPackageId } from "@/lib/data/podcast-calculator";
import { getPriceById, type PriceItemId } from "@/lib/data/pricing-catalog";
import type { FilterAnswers } from "@/lib/data/filter-questions";
import {
  resolveLegacySongAlias,
  type SongAddonId,
} from "@/lib/data/song-offer-aliases";
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
  /** הצעת השיר: אילו תוספות מסומנות מראש בטופס (lib/data/song-offer.ts) */
  songOffer?: { addonIds: readonly SongAddonId[] };
  /**
   * WP5 (שלב 4): החבילה שהאשף פותח לפריט הזה מתומחרת אחרת מהפריט בקטלוג
   * (למשל הפקה מלאה 2,500 נפתחת כחבילת אודיו 950). כפתור "הזמנה מקוונת" היה
   * מבטיח מחיר אחד ומציג אחר, ולכן הפריט לא נשלח לאשף: הכפתור הופך לוואטסאפ
   * עם שם הפריט והמחיר. להסיר כשלאשף יש חבילה במחיר הזה.
   */
  notBookable?: string;
};

const SONG_FILTER_PRESET: Partial<FilterAnswers> = {
  timeline: "this_month",
  purpose: "personal",
};

function songTarget(
  catalogId: PriceItemId,
  addonIds: readonly SongAddonId[],
  recordingTypeId: RecordingTypeId = "cover",
): PricingBookTarget {
  return {
    category: "studio",
    catalogId,
    studioPackageId: "song",
    recordingTypeId,
    filterPreset: SONG_FILTER_PRESET,
    songOffer: { addonIds },
  };
}

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
    recordingTypeId: "voiceover",
    filterPreset: { timeline: "this_week", purpose: "professional" },
  },
  blessing_recording: {
    category: "studio",
    catalogId: "blessing_recording",
    recordingTypeId: "general_blessing",
    filterPreset: { timeline: "this_month", purpose: "gift" },
  },
  studio_remote: {
    category: "studio",
    catalogId: "studio_remote",
    studioPackageId: "remote",
    filterPreset: { timeline: "this_month" },
  },
  song_recording: songTarget("song_recording", []),
  song_pitch_coaching: songTarget("song_recording", ["song_pitch_coaching"]),
  studio_session_clip_edited: songTarget("song_recording", ["studio_session_clip_edited"]),
  song_pre_session_interview: songTarget("song_recording", [
    "studio_session_clip_edited",
    "song_pre_session_interview",
  ]),
  single_production: {
    category: "studio",
    catalogId: "single_production",
    recordingTypeId: "original",
    filterPreset: { timeline: "this_month", purpose: "personal" },
  },
  full_production_clip: {
    category: "studio",
    catalogId: "full_production_clip",
    recordingTypeId: "original",
    filterPreset: { timeline: "this_month", purpose: "personal" },
  },
  /* הצילום הגולמי (450) נשאר תוספת לברכה. לשיר יש קליפ ערוך, ראו למעלה. */
  studio_session_clip: {
    category: "studio",
    catalogId: "studio_session_clip",
    recordingTypeId: "general_blessing",
    filterPreset: { timeline: "this_month", purpose: "gift" },
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
    notBookable: "האשף פותח חבילת אודיו (podcast_audio), לא הפקה מלאה",
  },
  mobile_podcast_at_home: {
    category: "podcast",
    catalogId: "mobile_podcast_at_home",
    podcastPackageId: "audio",
    podcastLocation: "mobile",
    notBookable: "האשף מחשב אודיו ועוד תוספת הגעה לפי אזור, לא את מחיר הפתיחה של האולפן הנייד",
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
  noise_removal_segment: {
    category: "online",
    catalogId: "noise_removal_segment",
  },
  studio_self_service_hour: {
    category: "podcast",
    catalogId: "studio_self_service_hour",
    podcastPackageId: "starter",
    notBookable: "האשף פותח את חבילת חצי השעה עם ליווי (studio_half_hour), לא שירות עצמי",
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

/** פריט שהאשף מתמחר אחרת, ולכן אסור לשלוח אליו (ראו notBookable) */
export function isPricingNotBookable(catalogId: PriceItemId): boolean {
  return Boolean(PRICING_BOOK_MAP[catalogId]?.notBookable);
}

/** האם כפתור "הזמנה מקוונת" לפריט הזה מגיע לאשף באותו מחיר */
export function isPricingBookable(catalogId: PriceItemId): boolean {
  const target = PRICING_BOOK_MAP[catalogId];
  return Boolean(target && !target.notBookable);
}

export function resolvePricingBookHref(catalogId: PriceItemId): string | null {
  const target = resolvePricingBookTarget(catalogId);
  if (!target || target.notBookable) return null;
  return buildBookHref(target.category, { catalog: catalogId });
}

/* סוג ההקלטה שהחבילה הישנה הניחה, כדי שקישור ישן ייפתח באותו מקום */
const LEGACY_SONG_RECORDING_TYPE: Readonly<Record<string, RecordingTypeId>> = {
  cover_song: "cover",
  song_package: "event_song",
  studio_viral: "event_song",
  studio_all_in: "event_song",
};

export function parseBookCatalogFromSearch(
  value: string | null,
): PricingBookTarget | null {
  if (!value?.trim()) return null;
  /* קישורים ישנים (?catalog=cover_song וכו') ממשיכים לעבוד: הבסיס עם
     התוספות שהכי קרובות לחבילה שירדה */
  const legacyAddons = resolveLegacySongAlias(value);
  if (legacyAddons) {
    return songTarget(
      "song_recording",
      legacyAddons,
      LEGACY_SONG_RECORDING_TYPE[value.trim()] ?? "cover",
    );
  }
  const id = value.trim() as PriceItemId;
  if (!VALID_CATALOG_IDS.has(id)) return null;
  if (!isPricingBookable(id)) return null;
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
