/**
 * מנוע מחירון קבוצתי להקלטות אולפן — מקור אמת משותף לאתר ול-yakir-closer.
 */

import {
  getClientScenarioDescription,
  getClientScenarioShortTitle,
} from "@/lib/data/client-scenario-labels";
import { VAT_RATE, formatNis, withVat as withVatAtSiteRate } from "@/lib/data/pricing";
import type { RecordingTypeId, StudioPackageId, StudioUpgradeId } from "@/lib/data/studio-recording-booking";
import {
  GROUP_PRICING_ELIGIBLE_PACKAGES,
  GROUP_PRICING_INELIGIBLE_RECORDING_TYPES,
  STUDIO_EXTRA_PARTICIPANT_PRICE,
  STUDIO_FILMING_MAX,
  STUDIO_RECORDING_MAX,
  STUDIO_SAVINGS_TIP_THRESHOLD,
  STUDIO_VIDEO_PACKAGE_IDS,
  STUDIO_VIDEO_UPGRADE_IDS,
} from "@/lib/data/studio-recording-booking";

export {
  STUDIO_EXTRA_PARTICIPANT_PRICE,
  STUDIO_FILMING_MAX,
  STUDIO_RECORDING_MAX,
  STUDIO_SAVINGS_TIP_THRESHOLD,
};

export const PAIR_EXTRA_PRICE = Math.round(STUDIO_EXTRA_PARTICIPANT_PRICE / 2);
export const MOTZASH_SURCHARGE = 0.5;

export type StudioScenarioId = "pairs" | "solo" | "group" | "save5";

export type StudioScenario = {
  id: StudioScenarioId;
  label: string;
  extrasExVat: number;
  subtotalExVat: number;
  withVat: number;
  note: string;
};

export type StudioScenarioResult = {
  eligible: boolean;
  ineligibleReason?: string;
  scenarios: StudioScenario[];
  recommended: StudioScenario | null;
  recorderCount: number;
  isMotzash: boolean;
  vatRate: number;
};

export type ParsedParticipants = {
  adultsCount: number | null;
  childrenCount: number | null;
  recorderCount: number | null;
  isAmbiguousGroup: boolean;
};

const GROUP_KEYWORDS_RE =
  /חברים|המשפחה|הילדים\s+של|קבוצה|כולנו|כולם|משפחה|הרבה\s+אנשים|כמה\s+אנשים/i;

const ADULTS_RE =
  /(\d+)\s*מבוגר(?:ים|ות)?|מבוגר(?:ים|ות)?\s*[:\-]?\s*(\d+)/i;
const CHILDREN_RE =
  /(\d+)\s*(?:ילד(?:ים|ות)?|בנ(?:ים|ות)?)|(?:ילד(?:ים|ות)?|בנ(?:ים|ות)?)\s*[:\-]?\s*(\d+)|שישה\s+ילדים|חמישה\s+ילדים|ארבעה\s+ילדים|שלושה\s+ילדים|שני\s+ילדים|ילד\s+אחד/i;
const TOTAL_RE =
  /סה[״"]?כ\s*(?:מקליטים|משתתפים|אנשים)?\s*[:\-]?\s*(\d+)|(\d+)\s*אנשים/i;

const HEBREW_NUMBER_WORDS: Record<string, number> = {
  אחד: 1,
  אחת: 1,
  שניים: 2,
  שני: 2,
  שתיים: 2,
  שלושה: 3,
  שלוש: 3,
  ארבעה: 4,
  ארבע: 4,
  חמישה: 5,
  חמש: 5,
  שישה: 6,
  שש: 6,
  שבעה: 7,
  שבע: 7,
  שמונה: 8,
  תשעה: 9,
  תשע: 9,
  עשרה: 10,
  עשר: 10,
};

function parseHebrewNumberWord(text: string): number | null {
  for (const [word, n] of Object.entries(HEBREW_NUMBER_WORDS)) {
    if (text.includes(word)) return n;
  }
  return null;
}

function firstNum(...groups: (string | undefined)[]): number | null {
  for (const g of groups) {
    if (g) {
      const n = Number(g);
      if (!Number.isNaN(n) && n >= 0) return n;
    }
  }
  return null;
}

export function parseParticipantsFromText(text: string): ParsedParticipants {
  if (!text?.trim()) {
    return {
      adultsCount: null,
      childrenCount: null,
      recorderCount: null,
      isAmbiguousGroup: false,
    };
  }

  const adultsMatch = text.match(ADULTS_RE);
  let adultsCount = firstNum(adultsMatch?.[1], adultsMatch?.[2]);

  const childrenMatch = text.match(CHILDREN_RE);
  let childrenCount = firstNum(childrenMatch?.[1], childrenMatch?.[2]);
  if (childrenCount === null && childrenMatch) {
    childrenCount = parseHebrewNumberWord(childrenMatch[0]);
  }

  const totalMatch = text.match(TOTAL_RE);
  const explicitTotal = firstNum(totalMatch?.[1], totalMatch?.[2]);

  let recorderCount: number | null = null;
  if (adultsCount !== null || childrenCount !== null) {
    recorderCount = (adultsCount ?? 0) + (childrenCount ?? 0);
  } else if (explicitTotal !== null) {
    recorderCount = explicitTotal;
  }

  const hasGroupKeyword = GROUP_KEYWORDS_RE.test(text);
  const isAmbiguousGroup = hasGroupKeyword && recorderCount === null;

  return { adultsCount, childrenCount, recorderCount, isAmbiguousGroup };
}

export function isGroupPricingEligible(options: {
  packageId?: string | null;
  serviceId?: string | null;
  recordingType?: RecordingTypeId | "" | null;
}): boolean {
  const { packageId, serviceId, recordingType } = options;

  if (serviceId && serviceId !== "recording") return false;

  if (
    recordingType &&
    GROUP_PRICING_INELIGIBLE_RECORDING_TYPES.includes(
      recordingType as (typeof GROUP_PRICING_INELIGIBLE_RECORDING_TYPES)[number],
    )
  ) {
    return false;
  }

  if (packageId) {
    return GROUP_PRICING_ELIGIBLE_PACKAGES.includes(
      packageId as (typeof GROUP_PRICING_ELIGIBLE_PACKAGES)[number],
    );
  }

  return serviceId === "recording" || !serviceId;
}

export function hasVideoUpgrade(
  selectedUpgrades: readonly string[],
  packageId?: string | null,
): boolean {
  const videoPackages = STUDIO_VIDEO_PACKAGE_IDS as readonly string[];
  const videoUpgrades = STUDIO_VIDEO_UPGRADE_IDS as readonly string[];
  if (packageId && videoPackages.includes(packageId)) {
    return true;
  }
  return selectedUpgrades.some((id) => videoUpgrades.includes(id));
}

export function formatFilmingGuidance(options: {
  recorderCount: number;
  hasVideoUpgrade: boolean;
}): string | null {
  const { recorderCount, hasVideoUpgrade } = options;
  if (!hasVideoUpgrade || recorderCount <= STUDIO_FILMING_MAX) return null;
  return (
    "📸 שימו לב: האולפן מרווח ומותאם להקלטה שלכם, אך מבחינת זווית המצלמות והתאורה בצילום הקליפ, " +
    `נחלק אתכם בקפסולות/סבבים של עד ${STUDIO_FILMING_MAX} אנשים בכל פריים כדי שכולם ייצאו מושלם בווידאו!`
  );
}

export function buildStudioGuidelines(options: {
  recorderCount: number;
  hasVideoUpgrade: boolean;
}): string {
  const parts = ["חזרות בבית", "שקט באולפן"];
  const { recorderCount, hasVideoUpgrade } = options;

  if (recorderCount > STUDIO_RECORDING_MAX) {
    parts.push(`חלוקה לזוגות — עד ${STUDIO_RECORDING_MAX} באולפן בו-זמנית`);
  }

  const filming = formatFilmingGuidance({ recorderCount, hasVideoUpgrade });
  if (filming) {
    parts.push(filming.replace(/^📸\s*/, ""));
  } else if (hasVideoUpgrade) {
    parts.push(`עד ${STUDIO_FILMING_MAX} אנשים בצילום`);
  }

  return parts.join(" · ");
}

function applyMotzash(subtotal: number, isMotzash: boolean): number {
  if (!isMotzash) return subtotal;
  return Math.round(subtotal * (1 + MOTZASH_SURCHARGE));
}

function withVatAt(subtotalExVat: number, vatRate: number): number {
  return Math.round(subtotalExVat * (1 + vatRate));
}

function buildScenario(
  id: StudioScenarioId,
  label: string,
  baseExVat: number,
  extrasExVat: number,
  isMotzash: boolean,
  vatRate: number,
  note: string,
): StudioScenario {
  const subtotalExVat = applyMotzash(baseExVat + extrasExVat, isMotzash);
  return {
    id,
    label,
    extrasExVat,
    subtotalExVat,
    withVat: withVatAt(subtotalExVat, vatRate),
    note,
  };
}

export function calcStudioScenarios(options: {
  baseExVat: number;
  recorderCount: number;
  isMotzash?: boolean;
  vatRate?: number;
  packageId?: string | null;
  serviceId?: string | null;
  recordingType?: RecordingTypeId | "" | null;
}): StudioScenarioResult {
  const {
    baseExVat,
    recorderCount,
    isMotzash = false,
    vatRate = VAT_RATE,
    packageId,
    serviceId,
    recordingType,
  } = options;

  const eligible = isGroupPricingEligible({ packageId, serviceId, recordingType });

  if (!eligible || recorderCount < 2) {
    const subtotalExVat = applyMotzash(baseExVat, isMotzash);
    const single: StudioScenario = {
      id: "pairs",
      label: "מחיר בסיס",
      extrasExVat: 0,
      subtotalExVat,
      withVat: withVatAt(subtotalExVat, vatRate),
      note: eligible ? "מקליט/ה אחד/ת כלול/ה בבסיס" : "מחיר קבוצתי ייקבע בשיחת ייעוץ",
    };
    return {
      eligible,
      ineligibleReason: eligible ? undefined : "מחיר קבוצתי ייקבע בשיחת ייעוץ",
      scenarios: [single],
      recommended: single,
      recorderCount,
      isMotzash,
      vatRate,
    };
  }

  const extras = recorderCount - 1;
  const scenarios: StudioScenario[] = [
    buildScenario(
      "pairs",
      getClientScenarioShortTitle("pairs"),
      baseExVat,
      extras * PAIR_EXTRA_PRICE,
      isMotzash,
      vatRate,
      getClientScenarioDescription("pairs"),
    ),
    buildScenario(
      "solo",
      getClientScenarioShortTitle("solo"),
      baseExVat,
      extras * STUDIO_EXTRA_PARTICIPANT_PRICE,
      isMotzash,
      vatRate,
      getClientScenarioDescription("solo"),
    ),
    buildScenario(
      "group",
      getClientScenarioShortTitle("group"),
      baseExVat,
      0,
      isMotzash,
      vatRate,
      getClientScenarioDescription("group"),
    ),
  ];

  if (recorderCount > STUDIO_SAVINGS_TIP_THRESHOLD) {
    scenarios.push(
      buildScenario(
        "save5",
        getClientScenarioShortTitle("save5"),
        baseExVat,
        (STUDIO_SAVINGS_TIP_THRESHOLD - 1) * PAIR_EXTRA_PRICE,
        isMotzash,
        vatRate,
        getClientScenarioDescription("save5"),
      ),
    );
  }

  const recommended = scenarios.find((s) => s.id === "pairs") ?? scenarios[0];

  return {
    eligible: true,
    scenarios,
    recommended,
    recorderCount,
    isMotzash,
    vatRate,
  };
}

export function formatScenarioBlock(
  result: StudioScenarioResult,
  options?: { includeMotzashNote?: boolean },
): string {
  if (!result.eligible || result.recorderCount < 2) {
    if (result.recommended) {
      return `▸ ${result.recommended.label}: ${formatNis(result.recommended.subtotalExVat)} לפני מע״מ`;
    }
    return "";
  }

  const lines = result.scenarios.map(
    (s) => `▸ ${s.label}: ${formatNis(s.subtotalExVat)} לפני מע״מ`,
  );

  if (options?.includeMotzashNote && result.isMotzash) {
    lines.push("▸ כל הסכומים כוללים +50% פתיחת מוצ״ש");
  }

  return lines.join("\n");
}

export function formatDiscountBlock(options: {
  subtotalExVat: number;
  discountExVat: number;
  vatRate?: number;
  label?: string;
}): string {
  const vatRate = options.vatRate ?? VAT_RATE;
  const discount = Math.abs(options.discountExVat);
  const after = options.subtotalExVat + options.discountExVat;
  const vatBefore = withVatAt(options.subtotalExVat, vatRate);
  const vatAfter = withVatAt(after, vatRate);

  return [
    `מחיר לפני הנחה: ${formatNis(options.subtotalExVat)} לפני מע״מ (${formatNis(vatBefore)} סופי)`,
    `הנחה${options.label ? ` (${options.label})` : ""}: -${formatNis(discount)}`,
    `מחיר לאחר הנחה: ${formatNis(after)} לפני מע״מ (${formatNis(vatAfter)} סופי)`,
  ].join("\n");
}

/** מחיר מומלץ לשליחה ב-YC tag (תרחיש זוגות + מוצ״ש אם רלוונטי) */
export function resolveLeadPriceExVat(options: {
  baseExVat: number;
  upgradesExVat?: number;
  recorderCount: number;
  isMotzash?: boolean;
  packageId?: string | null;
  recordingType?: RecordingTypeId | "" | null;
}): number {
  const base = options.baseExVat + (options.upgradesExVat ?? 0);
  const result = calcStudioScenarios({
    baseExVat: base,
    recorderCount: options.recorderCount,
    isMotzash: options.isMotzash,
    packageId: options.packageId,
    recordingType: options.recordingType,
    serviceId: "recording",
  });
  return result.recommended?.subtotalExVat ?? applyMotzash(base, options.isMotzash ?? false);
}

export function withVatAtRate(amountExVat: number, vatRate: number = VAT_RATE): number {
  return withVatAt(amountExVat, vatRate);
}

export { withVatAtSiteRate as withVatDefault };
