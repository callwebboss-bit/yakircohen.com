import { buildBookHref, type BookCategoryId } from "@/lib/book-url";
import { hubBookCtaLabel } from "@/lib/data/conversion-copy";
import { resolveEventItemIdFromPath } from "@/lib/data/attraction-book-pricing";
import { getExVat, type PriceItemId } from "@/lib/data/pricing-catalog";

export type ServiceBookCta = {
  bookHref: string;
  bookLabel: string;
  bookCategory: BookCategoryId;
  /** מחיר התחלתי לפני מע״מ - לתג [YC:] ולקופי */
  priceExVat: number;
};

type BookMapEntry = {
  bookCategory: BookCategoryId;
  priceCatalogId?: PriceItemId;
  /** כשאין מזהה בקטלוג (למשל אקדמיה 990) */
  priceExVat?: number;
};

/** slug (no leading slash) קטגוריית /book + מחיר התחלתי מהקטלוג */
const SERVICE_BOOK_MAP: Record<string, BookMapEntry> = {
  studio: { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  "studio/blessings": { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  "studio/recording-song-modiin": {
    bookCategory: "studio",
    priceCatalogId: "cover_song",
  },
  "studio/recording-studio": { bookCategory: "studio", priceCatalogId: "studio_hour" },
  "studio/mobile-studio": { bookCategory: "studio", priceCatalogId: "mobile_podcast_at_home" },
  events: { bookCategory: "events", priceCatalogId: "event_attraction_1" },
  photography: { bookCategory: "photography", priceCatalogId: "event_photo_hourly" },
  video: { bookCategory: "clips", priceCatalogId: "quick_summary_clip" },
  "business/reel-factory": {
    bookCategory: "clips",
    priceCatalogId: "reel_factory_rave_24h",
  },
  podcast: { bookCategory: "podcast", priceCatalogId: "podcast_pilot" },
  voiceover: { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  online: { bookCategory: "online", priceCatalogId: "damaged_recording_rescue" },
  academy: { bookCategory: "academy", priceExVat: 990 },
  voucher: { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  pro: { bookCategory: "pro", priceCatalogId: "dj_voice_tag_single" },
  "events/dj/voice-tags": { bookCategory: "dj", priceCatalogId: "dj_voice_tag_single" },
  "online/mashup-fixer": { bookCategory: "online", priceCatalogId: "mashup_custom_planned" },
  "events/dj/pre-built-sets": { bookCategory: "dj", priceCatalogId: "prebuilt_set_corporate" },
  "podcast/studio-in-a-box": { bookCategory: "podcast", priceCatalogId: "studio_in_box_consult" },
  "podcast/bulk-production": { bookCategory: "podcast", priceCatalogId: "bulk_podcast_episode" },
  "podcast/self-service-studio": {
    bookCategory: "podcast",
    priceCatalogId: "studio_self_service_hour",
  },
  "business/content-studio": {
    bookCategory: "clips",
    priceCatalogId: "content_studio_session",
  },
  "business/on-site-studio": {
    bookCategory: "clips",
    priceCatalogId: "on_site_half_day",
  },
  "business/corporate-songs": {
    bookCategory: "studio",
    priceCatalogId: "corp_song_toast",
  },
  "business/audiobooks": {
    bookCategory: "online",
    priceCatalogId: "audiobook_hour",
  },
  "business/audio-branding": {
    bookCategory: "online",
    priceCatalogId: "audio_brand_starter",
  },
  "online/legacy-digitization": {
    bookCategory: "online",
    priceCatalogId: "legacy_dig_basic",
  },
  "online/transcription": {
    bookCategory: "online",
    priceCatalogId: "transcribe_hour",
  },
  "online/voice-cloning": {
    bookCategory: "online",
    priceCatalogId: "voice_clone_setup",
  },
  "online/vocal-fix/noise-removal": {
    bookCategory: "online",
    priceCatalogId: "noise_removal_segment",
  },
  "online/vocal-fix/eq-fix": {
    bookCategory: "online",
    priceCatalogId: "eq_freq_fix",
  },
  "online/vocal-fix/volume-balance": {
    bookCategory: "online",
    priceCatalogId: "volume_balance_full",
  },
  // עמוד המיקס מציג 500 ₪ קשיח ואין ל-500 מזהה בקטלוג (external_mix_master=1750). escape-hatch כמו academy/singer.
  "online/vocal-fix/mixing": { bookCategory: "online", priceExVat: 500 },
  // עמוד נחיתה חדש לתיקון סאונד פודקאסט - בסיס חבילת שידוריאל = ניקוי רעשים (500)
  "online/vocal-fix/podcast-repair": {
    bookCategory: "online",
    priceCatalogId: "noise_removal_segment",
  },
  "academy/workshops": {
    bookCategory: "academy",
    priceCatalogId: "workshop_team_2h",
  },
  "business/employer-branding": {
    bookCategory: "online",
    priceCatalogId: "employer_welcome",
  },
  "events/equipment/dry-hire": { bookCategory: "singer", priceCatalogId: "dry_hire_day" },
  "events/equipment/system-tuning": { bookCategory: "singer", priceCatalogId: "system_tuning_ease" },
  "events/dj-events": { bookCategory: "dj", priceCatalogId: "dj_premium" },
  /* בר מצווה נכנס דרך אשף ה-DJ ולא דרך אשף האטרקציות: ה-CTA הראשי הוא תקליטן,
     והאטרקציות נבחרות אחריו. בלי השורה הזו ה-fallback של events/ היה מציג 1,750 ₪. */
  "events/bar-mitzvah": { bookCategory: "dj", priceCatalogId: "dj_premium" },
  "events/equipment/singer-amplification": { bookCategory: "singer", priceExVat: 2800 },
};

const SLUG_PREFIX_FALLBACK: { prefix: string; entry: BookMapEntry }[] = [
  { prefix: "studio/", entry: { bookCategory: "studio", priceCatalogId: "blessing_recording" } },
  { prefix: "events/", entry: { bookCategory: "events", priceCatalogId: "event_attraction_1" } },
  { prefix: "podcast/", entry: { bookCategory: "podcast", priceCatalogId: "podcast_pilot" } },
  { prefix: "photography/", entry: { bookCategory: "photography", priceCatalogId: "event_photo_hourly" } },
  { prefix: "online/", entry: { bookCategory: "online", priceCatalogId: "damaged_recording_rescue" } },
  { prefix: "academy/", entry: { bookCategory: "academy", priceExVat: 990 } },
  { prefix: "voiceover/", entry: { bookCategory: "studio", priceCatalogId: "blessing_recording" } },
  { prefix: "business/", entry: { bookCategory: "clips", priceCatalogId: "reel_factory_rave_24h" } },
  { prefix: "pro/", entry: { bookCategory: "pro", priceCatalogId: "dj_voice_tag_single" } },
];

function normalizeSlug(slug: string): string {
  return slug.replace(/^\/+/, "").replace(/\/+$/, "");
}

function lookupEntry(slug: string): BookMapEntry | null {
  const normalized = normalizeSlug(slug);
  if (SERVICE_BOOK_MAP[normalized]) return SERVICE_BOOK_MAP[normalized];
  const prefixHit = SLUG_PREFIX_FALLBACK.find((row) => normalized.startsWith(row.prefix));
  return prefixHit?.entry ?? null;
}

export function resolveServiceBookCta(slug: string): ServiceBookCta | null {
  const entry = lookupEntry(slug);
  if (!entry) return null;
  const priceExVat =
    entry.priceExVat ?? (entry.priceCatalogId ? getExVat(entry.priceCatalogId) : 0);
  if (!priceExVat) return null;
  const pagePath = `/${normalizeSlug(slug)}`;
  const eventItemId =
    entry.bookCategory === "events" ? resolveEventItemIdFromPath(pagePath) : null;
  return {
    bookCategory: entry.bookCategory,
    bookHref: buildBookHref(
      entry.bookCategory,
      eventItemId ? { item: eventItemId } : undefined,
    ),
    bookLabel: hubBookCtaLabel(priceExVat),
    priceExVat,
  };
}
