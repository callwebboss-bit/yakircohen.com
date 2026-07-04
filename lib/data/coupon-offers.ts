import { getPriceById, type PriceItemId } from "@/lib/data/pricing-catalog";
import { resolvePricingBookHref } from "@/lib/data/pricing-book-map";

export type SeasonKey = "default" | "summer" | "wedding" | "rosh";

export const COUPON_DISCOUNT_CAP = 0.07;
export const COUPON_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

export type CouponOfferTemplate = {
  code: string;
  catalogId: PriceItemId;
  amountOffExVat: number;
  ctaLabel: string;
  icon?: string;
  themeClass: string;
  validUntilIso: string;
  validUntilHe: string;
  microCopy: string;
  entityLine?: string;
  seasonLabel: string;
};

export type ResolvedCouponOffer = CouponOfferTemplate & {
  headline: string;
  seasonKey: SeasonKey;
};

type ContextualRule = {
  pathPrefix: string;
  season: SeasonKey;
  catalogId: PriceItemId;
  amountOffExVat: number;
  ctaLabel?: string;
};

const MICRO_COPY =
  "הטבה אישית למימוש עצמי בלבד. ללא התחייבות, ללא דמי מנוי נסתרים";

const SEASON_OFFERS: Record<SeasonKey, CouponOfferTemplate> = {
  summer: {
    code: "YAKIRSUMMER",
    catalogId: "podcast_pilot",
    amountOffExVat: 60,
    ctaLabel: "המשך להזמנה דיגיטלית",
    icon: "☀️",
    themeClass: "coupon-banner-summer",
    validUntilIso: "2026-08-31",
    validUntilHe:
      "בתוקף עד 31 באוגוסט 2026, או עד גמר מלאי השעות הפנויות לעונה",
    microCopy: MICRO_COPY,
    seasonLabel: "מבצע קיץ",
  },
  wedding: {
    code: "YAKIRHATUNA",
    catalogId: "blessing_recording",
    amountOffExVat: 35,
    ctaLabel: "המשך להזמנה דיגיטלית",
    icon: "💍",
    themeClass: "coupon-banner-wedding",
    validUntilIso: "2026-10-31",
    validUntilHe: "בתוקף עד 31 באוקטובר 2026",
    microCopy: MICRO_COPY,
    seasonLabel: "מבצע חתונות",
  },
  rosh: {
    code: "YAKIRSHANA",
    catalogId: "podcast_pilot",
    amountOffExVat: 50,
    ctaLabel: "המשך להזמנה דיגיטלית",
    icon: "🍎",
    themeClass: "coupon-banner-rosh",
    validUntilIso: "2026-10-31",
    validUntilHe: "בתוקף עד 31 באוקטובר 2026",
    microCopy: MICRO_COPY,
    seasonLabel: "הטבת שנה חדשה",
  },
  default: {
    code: "YAKIR10",
    catalogId: "podcast_pilot",
    amountOffExVat: 50,
    ctaLabel: "המשך להזמנה דיגיטלית",
    icon: "🎁",
    themeClass: "coupon-banner-default",
    validUntilIso: "2026-12-31",
    validUntilHe: "בתוקף עד 31 בדצמבר 2026",
    microCopy: MICRO_COPY,
    seasonLabel: "הטבה לזמן מוגבל",
  },
};

const CONTEXTUAL_RULES: ContextualRule[] = [
  {
    pathPrefix: "/podcast",
    season: "summer",
    catalogId: "podcast_pilot",
    amountOffExVat: 60,
  },
  {
    pathPrefix: "/studio",
    season: "summer",
    catalogId: "studio_hour",
    amountOffExVat: 75,
  },
  {
    pathPrefix: "/pricing",
    season: "summer",
    catalogId: "podcast_pilot",
    amountOffExVat: 60,
  },
];

const COUPON_PATH_PREFIXES = [
  "/pricing",
  "/studio",
  "/podcast",
  "/events",
  "/dj",
  "/photography",
  "/online",
  "/academy",
  "/pro",
  "/",
] as const;

const COUPON_BLOCKED_PREFIXES = ["/book", "/contact", "/blog", "/legal", "/privacy"];

export function getIsraelDate(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }));
}

export function getCurrentSeason(now = getIsraelDate()): SeasonKey {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  if ((month === 9 || month === 10) && day >= 15) return "rosh";
  if (month >= 6 && month <= 8) return "summer";
  if (month === 5 && day > 10) return "wedding";
  return "default";
}

function buildHeadline(catalogId: PriceItemId, amountOffExVat: number): string {
  const item = getPriceById(catalogId);
  return `הנחה של ₪${amountOffExVat.toLocaleString("he-IL")} על ${item.label}`;
}

function mergeOffer(
  base: CouponOfferTemplate,
  seasonKey: SeasonKey,
  overrides?: Partial<Pick<CouponOfferTemplate, "catalogId" | "amountOffExVat" | "ctaLabel">>,
): ResolvedCouponOffer {
  const catalogId = overrides?.catalogId ?? base.catalogId;
  const amountOffExVat = overrides?.amountOffExVat ?? base.amountOffExVat;
  const ctaLabel = overrides?.ctaLabel ?? base.ctaLabel;

  return {
    ...base,
    catalogId,
    amountOffExVat,
    ctaLabel,
    headline: buildHeadline(catalogId, amountOffExVat),
    seasonKey,
  };
}

export function resolveOfferForPath(
  pathname: string,
  seasonKey: SeasonKey = getCurrentSeason(),
): ResolvedCouponOffer | null {
  if (!isCouponPathAllowed(pathname)) return null;

  const contextual = CONTEXTUAL_RULES.filter(
    (rule) => rule.season === seasonKey && pathname.startsWith(rule.pathPrefix),
  ).sort((a, b) => b.pathPrefix.length - a.pathPrefix.length)[0];

  const base = SEASON_OFFERS[seasonKey];
  if (!contextual) {
    return mergeOffer(base, seasonKey);
  }

  return mergeOffer(base, seasonKey, {
    catalogId: contextual.catalogId,
    amountOffExVat: contextual.amountOffExVat,
    ctaLabel: contextual.ctaLabel,
  });
}

export function isCouponPathAllowed(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (COUPON_BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return false;
  }
  if (pathname === "/") return true;
  return COUPON_PATH_PREFIXES.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(`${p}/`)),
  );
}

const CODE_INDEX: Map<string, { seasonKey: SeasonKey; template: CouponOfferTemplate }> =
  new Map(
    (Object.entries(SEASON_OFFERS) as [SeasonKey, CouponOfferTemplate][]).map(
      ([seasonKey, template]) => [template.code.toUpperCase(), { seasonKey, template }],
    ),
  );

export function sanitizeCouponParam(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  if (!/^[A-Za-z0-9_]+$/.test(trimmed) || trimmed.length > 32) return null;
  return trimmed.toUpperCase();
}

export function resolveCouponByCode(code: string): ResolvedCouponOffer | null {
  const sanitized = sanitizeCouponParam(code);
  if (!sanitized) return null;
  const entry = CODE_INDEX.get(sanitized);
  if (!entry) return null;
  return mergeOffer(entry.template, entry.seasonKey);
}

export function isCouponOfferExpired(offer: ResolvedCouponOffer, now = new Date()): boolean {
  const end = new Date(`${offer.validUntilIso}T23:59:59+03:00`);
  return now > end;
}

export function resolveCouponBookHref(offer: ResolvedCouponOffer): string {
  const base = resolvePricingBookHref(offer.catalogId);
  if (!base) return `/book?coupon=${encodeURIComponent(offer.code)}`;
  const [pathAndQuery, hash = ""] = base.split("#");
  const [path, query = ""] = pathAndQuery.split("?");
  const params = new URLSearchParams(query);
  params.set("coupon", offer.code);
  const qs = params.toString();
  return `${path}?${qs}${hash ? `#${hash}` : ""}`;
}

export function assertOfferWithinCap(offer: Pick<CouponOfferTemplate, "catalogId" | "amountOffExVat">): void {
  const exVat = getPriceById(offer.catalogId).exVat;
  if (offer.amountOffExVat <= 0) {
    throw new Error(`Coupon ${offer.catalogId}: amountOffExVat must be positive`);
  }
  if (offer.amountOffExVat >= exVat) {
    throw new Error(
      `Coupon ${offer.catalogId}: amountOffExVat (${offer.amountOffExVat}) must be less than price (${exVat})`,
    );
  }
  const ratio = offer.amountOffExVat / exVat;
  if (ratio > COUPON_DISCOUNT_CAP + 1e-9) {
    throw new Error(
      `Coupon ${offer.catalogId}: discount ${(ratio * 100).toFixed(1)}% exceeds cap ${COUPON_DISCOUNT_CAP * 100}%`,
    );
  }
}

function assertValidIsoDate(iso: string): void {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Invalid validUntilIso: ${iso}`);
  const [, y, m, d] = match.map(Number);
  const parsed = new Date(y, m - 1, d);
  if (
    parsed.getFullYear() !== y ||
    parsed.getMonth() !== m - 1 ||
    parsed.getDate() !== d
  ) {
    throw new Error(`Invalid calendar date in validUntilIso: ${iso}`);
  }
}

export function validateCouponConfig(): void {
  for (const [seasonKey, template] of Object.entries(SEASON_OFFERS) as [
    SeasonKey,
    CouponOfferTemplate,
  ][]) {
    assertValidIsoDate(template.validUntilIso);
    assertOfferWithinCap(template);
    getPriceById(template.catalogId);
    if (!template.ctaLabel.trim()) {
      throw new Error(`Coupon ${seasonKey}: empty ctaLabel`);
    }
  }

  for (const rule of CONTEXTUAL_RULES) {
    assertOfferWithinCap({
      catalogId: rule.catalogId,
      amountOffExVat: rule.amountOffExVat,
    });
    getPriceById(rule.catalogId);
  }
}

export function formatCouponTotalLabel(offer: ResolvedCouponOffer): string {
  return `סך הכל (לאחר קיזוז ${offer.seasonLabel}: -${offer.amountOffExVat.toLocaleString("he-IL")} ₪)`;
}

export function applyCouponDiscountExVat(
  offer: ResolvedCouponOffer | null,
  totalExVat: number,
): number {
  if (!offer) return totalExVat;
  return Math.max(0, totalExVat - offer.amountOffExVat);
}
