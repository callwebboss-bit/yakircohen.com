import type { SingerPackageId } from "@/lib/data/singer-amplification-page";

export type BookCategoryId =
  | "studio"
  | "podcast"
  | "events"
  | "dj"
  | "photography"
  | "clips"
  | "singer"
  | "academy"
  | "online";

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
]);

const VALID_SINGER_PACKAGES = new Set<string>(["basic", "premium", "vip"]);

/** `/book?pkg=premium#singer` */
export function buildBookHref(
  category: BookCategoryId,
  pkg?: SingerPackageId | string,
): string {
  const params = new URLSearchParams();
  if (pkg?.trim()) params.set("pkg", pkg.trim());
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
