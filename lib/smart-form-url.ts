import type { BookCategoryId } from "@/lib/book-url";
import { buildBookHref } from "@/lib/book-url";
import type { PriceItemId } from "@/lib/data/pricing-catalog";
import { getSmartFormEnrichment } from "@/lib/data/smart-form-enrichment";
import type { SmartFormCategoryId } from "@/lib/data/smart-form-matrix";

export const SMART_FORM_STORAGE_KEY = "yc_smart_form_v1";

export type SmartFormState = {
  categoryId: SmartFormCategoryId | null;
  selectedChipIds: string[];
  name: string;
  contactMethod: string;
  socialOrId: string;
  termsAccepted: boolean;
  baseCatalogId: PriceItemId | null;
  estimateExVat: number;
  upsellCatalogIds: PriceItemId[];
  bookCategory: BookCategoryId | null;
};

export const EMPTY_SMART_FORM_STATE: SmartFormState = {
  categoryId: null,
  selectedChipIds: [],
  name: "",
  contactMethod: "",
  socialOrId: "",
  termsAccepted: false,
  baseCatalogId: null,
  estimateExVat: 0,
  upsellCatalogIds: [],
  bookCategory: null,
};

/** Serialize form state -> URLSearchParams (smart=1 + fields) */
export function serializeSmartFormToParams(state: SmartFormState): URLSearchParams {
  const params = new URLSearchParams();
  params.set("smart", "1");
  if (state.baseCatalogId) params.set("catalog", state.baseCatalogId);
  if (state.estimateExVat > 0) params.set("estimate", String(Math.round(state.estimateExVat)));
  if (state.upsellCatalogIds.length) {
    params.set("upsells", state.upsellCatalogIds.join(","));
  }
  if (state.name.trim()) params.set("name", state.name.trim());
  if (state.contactMethod.trim()) params.set("contact", state.contactMethod.trim());
  if (state.socialOrId.trim()) params.set("social", state.socialOrId.trim());
  if (state.categoryId) params.set("smartCat", state.categoryId);
  params.set("koalendar", "1");
  return params;
}

export function parseSmartFormFromSearch(
  search: string | URLSearchParams,
): Partial<SmartFormState> & { smart: boolean; koalendar: boolean } {
  const params =
    typeof search === "string" ? new URLSearchParams(search) : search;
  const smart = params.get("smart") === "1";
  const koalendar = params.get("koalendar") === "1";
  const catalog = params.get("catalog");
  const estimateRaw = params.get("estimate");
  const upsellsRaw = params.get("upsells");
  const smartCat = params.get("smartCat") as SmartFormCategoryId | null;

  return {
    smart,
    koalendar,
    categoryId: smartCat || null,
    baseCatalogId: (catalog as PriceItemId) || null,
    estimateExVat: estimateRaw ? Number.parseInt(estimateRaw, 10) || 0 : 0,
    upsellCatalogIds: upsellsRaw
      ? (upsellsRaw.split(",").filter(Boolean) as PriceItemId[])
      : [],
    name: params.get("name")?.trim() || "",
    contactMethod: params.get("contact")?.trim() || "",
    socialOrId: params.get("social")?.trim() || "",
  };
}

/** נתיב /book עם query + hash לקטגוריה */
export function buildSmartFormBookHref(state: SmartFormState): string {
  const category = state.bookCategory || "studio";
  const params = serializeSmartFormToParams(state);
  const catalog = state.baseCatalogId || undefined;
  const base = buildBookHref(category, catalog ? { catalog } : undefined);
  const [pathAndQuery, hash] = base.split("#");
  const url = new URL(pathAndQuery || "/book", "https://yakircohen.com");
  for (const [key, value] of params.entries()) {
    if (key === "catalog" && url.searchParams.has("catalog")) continue;
    url.searchParams.set(key, value);
  }
  const qs = url.searchParams.toString();
  return `/book${qs ? `?${qs}` : ""}${hash ? `#${hash}` : `#${category}`}`;
}

export function saveSmartFormSession(state: SmartFormState): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SMART_FORM_STORAGE_KEY, JSON.stringify(state));
    window.sessionStorage.setItem(
      `${SMART_FORM_STORAGE_KEY}_closer`,
      smartFormStateToJson(state),
    );
  } catch {
    /* ignore quota */
  }
}

export function readSmartFormSession(): SmartFormState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SMART_FORM_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SmartFormState;
    if (!parsed || typeof parsed !== "object") return null;
    return { ...EMPTY_SMART_FORM_STATE, ...parsed };
  } catch {
    return null;
  }
}

/**
 * מחרוזת יציבה ל-CLOSER / deep-link: מפתחות ASCII, ערכים בלי תווים בעייתיים ב-URL.
 * estimate תמיד לפני מע״מ (exVat).
 */
export function buildSmartFormCloserPlainText(state: SmartFormState): string {
  const enrichment = getSmartFormEnrichment(state.categoryId);
  const lines = [
    "YC_SMART_FORM",
    `smart=1`,
    state.categoryId ? `smartCat=${state.categoryId}` : "",
    state.bookCategory ? `bookCategory=${state.bookCategory}` : "",
    state.baseCatalogId ? `catalog=${state.baseCatalogId}` : "",
    state.estimateExVat > 0
      ? `estimateExVat=${Math.round(state.estimateExVat)}`
      : "",
    state.upsellCatalogIds.length
      ? `upsells=${state.upsellCatalogIds.join(",")}`
      : "",
    state.name ? `name=${state.name}` : "",
    state.contactMethod ? `contact=${state.contactMethod}` : "",
    state.socialOrId ? `social=${state.socialOrId}` : "",
    enrichment
      ? `returnPotential=${enrichment.returnPotential}`
      : "",
    enrichment?.prepHref ? `prepHref=${enrichment.prepHref}` : "",
    `vatRate=0.18`,
  ];
  return lines.filter(Boolean).join("\n");
}

/** JSON תואם ל-session + URL - לשימוש ב-deep link בלי קריסה */
export function smartFormStateToJson(state: SmartFormState): string {
  const enrichment = getSmartFormEnrichment(state.categoryId);
  return JSON.stringify({
    v: 1,
    smart: 1,
    categoryId: state.categoryId,
    bookCategory: state.bookCategory,
    baseCatalogId: state.baseCatalogId,
    estimateExVat: Math.round(state.estimateExVat),
    upsellCatalogIds: state.upsellCatalogIds,
    name: state.name,
    contactMethod: state.contactMethod,
    socialOrId: state.socialOrId,
    selectedChipIds: state.selectedChipIds,
    returnPotential: enrichment?.returnPotential ?? null,
    prepHref: enrichment?.prepHref ?? null,
    vatRate: 0.18,
  });
}
