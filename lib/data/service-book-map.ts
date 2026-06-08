import { buildBookHref, type BookCategoryId } from "@/lib/book-url";
import { hubBookCtaLabel } from "@/lib/data/conversion-copy";
import { getExVat, type PriceItemId } from "@/lib/data/pricing-catalog";

export type ServiceBookCta = {
  bookHref: string;
  bookLabel: string;
  bookCategory: BookCategoryId;
};

type BookMapEntry = {
  bookCategory: BookCategoryId;
  priceCatalogId?: PriceItemId;
  /** כשאין מזהה בקטלוג (למשל אקדמיה 990) */
  priceExVat?: number;
};

/** slug (no leading slash) → קטגוריית /book + מחיר התחלתי מהקטלוג */
const SERVICE_BOOK_MAP: Record<string, BookMapEntry> = {
  studio: { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  "studio/blessings": { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  "studio/recording-song-modiin": {
    bookCategory: "studio",
    priceCatalogId: "blessing_recording",
  },
  "studio/recording-studio": { bookCategory: "studio", priceCatalogId: "studio_hour" },
  events: { bookCategory: "events", priceCatalogId: "event_attraction_1" },
  photography: { bookCategory: "photography", priceCatalogId: "event_photo_hourly" },
  video: { bookCategory: "clips", priceCatalogId: "quick_summary_clip" },
  podcast: { bookCategory: "podcast", priceCatalogId: "podcast_pilot" },
  voiceover: { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  online: { bookCategory: "online", priceCatalogId: "damaged_recording_rescue" },
  academy: { bookCategory: "academy", priceExVat: 990 },
  voucher: { bookCategory: "studio", priceCatalogId: "blessing_recording" },
};

const SLUG_PREFIX_FALLBACK: { prefix: string; entry: BookMapEntry }[] = [
  { prefix: "studio/", entry: { bookCategory: "studio", priceCatalogId: "blessing_recording" } },
  { prefix: "events/", entry: { bookCategory: "events", priceCatalogId: "event_attraction_1" } },
  { prefix: "podcast/", entry: { bookCategory: "podcast", priceCatalogId: "podcast_pilot" } },
  { prefix: "photography/", entry: { bookCategory: "photography", priceCatalogId: "event_photo_hourly" } },
  { prefix: "online/", entry: { bookCategory: "online", priceCatalogId: "damaged_recording_rescue" } },
  { prefix: "academy/", entry: { bookCategory: "academy", priceExVat: 990 } },
  { prefix: "voiceover/", entry: { bookCategory: "studio", priceCatalogId: "blessing_recording" } },
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
  return {
    bookCategory: entry.bookCategory,
    bookHref: buildBookHref(entry.bookCategory),
    bookLabel: hubBookCtaLabel(priceExVat),
  };
}
