import { SITE_NAME } from "@/lib/constants";

export const BRAND_SUFFIX = ` | ${SITE_NAME}`;

/** Strip embedded or trailing brand so constructMetadata adds suffix once. */
export function normalizeTitle(title: string): string {
  let t = title.trim();
  const brand = SITE_NAME;

  while (t.endsWith(BRAND_SUFFIX)) {
    t = t.slice(0, -BRAND_SUFFIX.length).trim();
  }

  const pipeBrandSuffix = new RegExp(`\\s*\\|\\s*${escapeRegExp(brand)}\\s*$`);
  while (pipeBrandSuffix.test(t)) {
    t = t.replace(pipeBrandSuffix, "").trim();
  }

  const trailingBrand = new RegExp(`\\s+${escapeRegExp(brand)}\\s*$`);
  if (trailingBrand.test(t) && t !== brand) {
    t = t.replace(trailingBrand, "").trim();
  }

  return t;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
