import type { SingerPackageId } from "@/lib/data/singer-amplification-page";
import type { EventBookingItemId } from "@/lib/data/events-booking";
import { parseBookEventItemFromSearch as parseEventItemId } from "@/lib/data/attraction-book-pricing";
import {
  parseBookCatalogFromSearch,
  type PricingBookTarget,
} from "@/lib/data/pricing-book-map";
import type { PriceItemId } from "@/lib/data/pricing-catalog";

export type { PricingBookTarget };
export { parseBookCatalogFromSearch };

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
  /** מזהה מחיר מהמחירון, /book?catalog=blessing_recording#studio */
  catalog?: PriceItemId | string;
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
    if (options.catalog?.toString().trim()) {
      params.set("catalog", options.catalog.toString().trim());
    }
  }
  const qs = params.toString();
  return `/book${qs ? `?${qs}` : ""}#${category}`;
}

export function parseBookCategoryFromHash(hash: string): BookCategoryId | null {
  const id = hash.replace(/^#/, "").trim().split("/")[0];
  return VALID_CATEGORIES.has(id) ? (id as BookCategoryId) : null;
}

/** מפרק `#studio/step/2` → 2 (לחזרה מ-Session Rescuer) */
export function parseBookWizardStepFromHash(hash: string): number | null {
  const parts = hash.replace(/^#/, "").trim().split("/").filter(Boolean);
  const stepIdx = parts.findIndex((p) => p === "step");
  if (stepIdx === -1 || stepIdx + 1 >= parts.length) return null;
  const n = Number.parseInt(parts[stepIdx + 1] ?? "", 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function parseBookCategoryFromPathname(pathname: string): BookCategoryId | null {
  const match = pathname.match(/^\/book\/([^/]+)\/?$/);
  if (!match?.[1]) return null;
  const id = match[1];
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
