import type { SingerPackageId } from "@/lib/data/singer-amplification-page";
import type { EventBookingItemId } from "@/lib/data/events-booking";
import { parseBookEventItemFromSearch as parseEventItemId } from "@/lib/data/attraction-book-pricing";

export type { EventBookingItemId };

export type BookCategoryId =
  | "studio"
  | "podcast"
  | "events"
  | "dj"
  | "photography"
  | "clips"
  | "singer"
  | "academy"
  | "online"
  | "pro";

const VALID_CATEGORIES = new Set<string>([
  "studio",
  "podcast",
  "events",
  "dj",
  "photography",
  "clips",
  "singer",
  "academy",
  "online",
  "pro",
]);

const VALID_SINGER_PACKAGES = new Set<string>(["basic", "premium", "vip"]);

export type BookHrefOptions = {
  pkg?: SingerPackageId | string;
  item?: EventBookingItemId | string;
};

/** `/book?pkg=premium#singer` או `/book?item=event_confetti#events` */
export function buildBookHref(
  category: BookCategoryId,
  options?: SingerPackageId | string | BookHrefOptions,
): string {
  const params = new URLSearchParams();
  if (typeof options === "string" && options.trim()) {
    params.set("pkg", options.trim());
  } else if (options && typeof options === "object") {
    if (options.pkg?.toString().trim()) params.set("pkg", options.pkg.toString().trim());
    if (options.item?.toString().trim()) params.set("item", options.item.toString().trim());
  }
  const qs = params.toString();
  return `/book${qs ? `?${qs}` : ""}#${category}`;
}

export function parseBookCategoryFromHash(hash: string): BookCategoryId | null {
  const id = hash.replace(/^#/, "").trim();
  return VALID_CATEGORIES.has(id) ? (id as BookCategoryId) : null;
}

export function parseBookPackageFromSearch(
  value: string | null,
): SingerPackageId | null {
  if (!value?.trim()) return null;
  const id = value.trim();
  return VALID_SINGER_PACKAGES.has(id) ? (id as SingerPackageId) : null;
}

export function parseBookEventItemFromSearch(
  value: string | null,
): EventBookingItemId | null {
  return parseEventItemId(value);
}
