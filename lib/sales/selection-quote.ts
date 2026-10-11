/**
 * המחשבון של עמדת המכירות: מחיר לצירוף מדויק שיקיר בוחר בכרטיס, עם הודעה
 * מוכנה לוואטסאפ ושורות למורנינג.
 *
 * הבעלים (12.10.2026): "אין לי מחיר לצירוף מסוים, וההודעה כללית מדי". הכרטיס
 * הציג רק את הבסיס וכמה צירופים קבועים. כאן בוחרים שדרוגים, משתתפים, אזור
 * ומספר אטרקציות, והסכום מחושב באותן פונקציות שהאתר מחשב בהן:
 * calcSongOffer, blessingTotalExVat, podcastParticipantsCostExVat,
 * calcMobileStudioAtHomeExVat ו-getEventBundlePrice. אין כאן אף מחיר כתוב.
 *
 * כלל המע״מ כמו בכל האתר (song-offer.ts): המע״מ פעם אחת על הסכום לפני מע״מ
 * של כל הצירוף, לא על כל שורה.
 *
 * מודול טהור בלי React, כדי שהבדיקות יריצו אותו על ספר המכירות האמיתי, וכדי
 * שהמחשבון בדפדפן יחשב בדיוק אותו דבר.
 */
import {
  BLESSING_PARTICIPANT_RULES,
  CATALOG_BUNDLES,
  catalogWithVat,
  getExVat,
  getPriceById,
  getPriceFromById,
  getPriceTransparencyById,
  MOBILE_STUDIO_CHANNEL_RULES,
  PODCAST_PARTICIPANT_RULES,
  SONG_PARTICIPANT_RULES,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";
import { calcSongOffer, SONG_OFFER_BASE_ID } from "@/lib/data/song-offer";
import { BLESSING_BASE_ID, BLESSING_REMOTE_ID, blessingTotalExVat } from "@/lib/data/blessing-offer";
import { podcastParticipantsCostExVat } from "@/lib/data/podcast-calculator";
import { calcMobileStudioAtHomeExVat } from "@/lib/data/mobile-studio-booking";
import { EVENT_GIFT_THRESHOLD, getEventBundlePrice, isEventQuoteOnly, RIGID_ACTIVATION_OPTIONS } from "@/lib/data/events-booking";
import type { SalesAddon, SalesCard, SalesLine } from "@/lib/sales/sales-book";
import { buildClosingQuestion, buildIncludedSentence, CONFIRM_PREFIX } from "@/lib/sales/sales-copy";

/** עד כמה תווים הודעה עם בחירה. הודעה בלי בחירה היא ההודעה של הכרטיס (עד 350) */
export const SELECTION_MESSAGE_MAX = 500;

/* ─── אזורים ─── */

/** center/north_south/eilat ל-DJ ולאולפן הנייד, center/north/south להגברת זמר */
export type SelectionRegion = "center" | "north_south" | "eilat" | "north" | "south";
export type RegionOption = { id: SelectionRegion; label: string; travelId: PriceItemId | null };

const TRAVEL_NORTH_SOUTH: PriceItemId = "travel_north_south";
const TRAVEL_EILAT_GOLAN: PriceItemId = "travel_eilat_golan";
const SINGER_TRAVEL_NORTH: PriceItemId = "singer_travel_north";
const SINGER_TRAVEL_SOUTH: PriceItemId = "singer_travel_south";

/* אותם פריטי הגעה כמו בעמודי ה-DJ (DJ_TRAVEL_FEE_IDS) ובאולפן הנייד (MOBILE_GEO_FEES).
   בדיקה מוודאת ש-SELECTION_DJ_TRAVEL_IDS הם בדיוק DJ_TRAVEL_FEE_IDS */
const WIDE_REGIONS: readonly RegionOption[] = [
  { id: "center", label: "מרכז", travelId: null },
  { id: "north_south", label: "צפון או דרום", travelId: TRAVEL_NORTH_SOUTH },
  { id: "eilat", label: "אילת או גולן", travelId: TRAVEL_EILAT_GOLAN },
];
/* הגברת זמר: נסיעה משלה, צפון ודרום במחירים שונים (החלטת הבעלים D69) */
const SINGER_REGIONS: readonly RegionOption[] = [
  { id: "center", label: "מרכז", travelId: null },
  { id: "north", label: "צפון", travelId: SINGER_TRAVEL_NORTH },
  { id: "south", label: "דרום", travelId: SINGER_TRAVEL_SOUTH },
];

export const SELECTION_DJ_TRAVEL_IDS: readonly PriceItemId[] = [TRAVEL_NORTH_SOUTH, TRAVEL_EILAT_GOLAN];

/* ─── משתתפים ─── */

export type ParticipantRule = {
  min: number;
  max: number;
  included: number;
  extraId: PriceItemId;
  /** "משתתפים", "דוברים", "אנשים" */
  noun: string;
  one: string;
};

const PARTICIPANT_RULES: Readonly<Record<string, ParticipantRule>> = {
  [SONG_OFFER_BASE_ID]: {
    min: SONG_PARTICIPANT_RULES.included,
    max: SONG_PARTICIPANT_RULES.max,
    included: SONG_PARTICIPANT_RULES.included,
    extraId: SONG_PARTICIPANT_RULES.extraId,
    noun: "משתתפים",
    one: "משתתף",
  },
  [BLESSING_BASE_ID]: blessingRule(),
  [BLESSING_REMOTE_ID]: blessingRule(),
  podcast_audio: {
    min: PODCAST_PARTICIPANT_RULES.included,
    max: PODCAST_PARTICIPANT_RULES.max,
    included: PODCAST_PARTICIPANT_RULES.included,
    extraId: PODCAST_PARTICIPANT_RULES.extraId,
    noun: "משתתפים",
    one: "משתתף",
  },
  [MOBILE_STUDIO_CHANNEL_RULES.arrivalId]: {
    min: MOBILE_STUDIO_CHANNEL_RULES.included,
    max: MOBILE_STUDIO_CHANNEL_RULES.max,
    included: MOBILE_STUDIO_CHANNEL_RULES.included,
    extraId: MOBILE_STUDIO_CHANNEL_RULES.channelId,
    noun: "אנשים",
    one: "אדם",
  },
};

function blessingRule(): ParticipantRule {
  return {
    min: BLESSING_PARTICIPANT_RULES.included,
    max: BLESSING_PARTICIPANT_RULES.max,
    included: BLESSING_PARTICIPANT_RULES.included,
    extraId: BLESSING_PARTICIPANT_RULES.extraId,
    noun: "דוברים",
    one: "דובר",
  };
}

/* ─── אטרקציות ─── */

const ATTRACTION_SINGLE_ID: PriceItemId = "event_attraction_1";
const EXTRA_ACTIVATION_ID: PriceItemId = "event_extra_activation";
const ATTRACTION_BUNDLES = CATALOG_BUNDLES.filter((b) => b.singleId === ATTRACTION_SINGLE_ID);
/* זיקוקים וקונפטי: עד 3 הפעלות לאטרקציה (RIGID_ACTIVATION_OPTIONS), כלומר 2 נוספות */
const MAX_EXTRA_ACTIVATIONS_PER_ATTRACTION = RIGID_ACTIVATION_OPTIONS.length - 1;

function attractionCountOf(id: string): number | null {
  if (id === ATTRACTION_SINGLE_ID) return 1;
  return ATTRACTION_BUNDLES.find((b) => b.bundleId === id)?.count ?? null;
}

/** הפריט בקטלוג למספר אטרקציות: בודדת, או החבילה (מ-4 ומעלה החבילה של 4, מחיר פתיחה) */
export function attractionBaseId(count: number): PriceItemId {
  if (count <= 1) return ATTRACTION_SINGLE_ID;
  const capped = Math.min(count, EVENT_GIFT_THRESHOLD);
  return ATTRACTION_BUNDLES.find((b) => b.count === capped)?.bundleId ?? ATTRACTION_SINGLE_ID;
}

/* ─── מה המחשבון מציע לכל כרטיס ─── */

export type SelectionOptions = {
  /** השדרוגים שמוצגים כצ׳יפים: בלי שדרוג המשתתפים ובלי פריטי הנסיעה, שיש להם שדה משלהם */
  addons: SalesAddon[];
  participants: ParticipantRule | null;
  regions: readonly RegionOption[] | null;
  attractions: { min: number; max: number; initial: number } | null;
  /** הפעלות נוספות לכל אטרקציה, מוכפל במספר האטרקציות */
  activationsPerAttraction: number | null;
};

function isDj(card: SalesCard): boolean {
  return card.family === "dj";
}

function isSinger(card: SalesCard): boolean {
  return card.addons.some((a) => a.id === SINGER_TRAVEL_NORTH || a.id === SINGER_TRAVEL_SOUTH);
}

export function selectionOptions(card: SalesCard): SelectionOptions {
  const participants = card.participants?.length ? (PARTICIPANT_RULES[card.id] ?? null) : null;
  const regions = isSinger(card)
    ? SINGER_REGIONS
    : isDj(card) || card.id === MOBILE_STUDIO_CHANNEL_RULES.arrivalId
      ? WIDE_REGIONS
      : null;
  const count = attractionCountOf(card.id);
  const hidden = new Set<string>([
    ...(participants ? [participants.extraId] : []),
    ...(regions ?? []).flatMap((r) => (r.travelId ? [r.travelId] : [])),
  ]);
  return {
    addons: card.addons.filter((a) => !hidden.has(a.id)),
    participants,
    regions,
    attractions: count == null ? null : { min: 1, max: EVENT_GIFT_THRESHOLD, initial: count },
    activationsPerAttraction: count == null ? null : MAX_EXTRA_ACTIVATIONS_PER_ATTRACTION,
  };
}

/* ─── הבחירה ─── */

export type SelectionInput = {
  addonIds: readonly string[];
  participants?: number | null;
  region?: SelectionRegion | null;
  attractionsCount?: number | null;
  /** הפעלות נוספות (event_extra_activation), סה״כ לכל האטרקציות */
  activations?: number | null;
};

export type SelectionQuote = {
  /** שורות למורנינג: תיאור, כמות, מחיר ליחידה לפני מע״מ */
  lines: SalesLine[];
  totalExVat: number;
  totalInclVat: number;
  priceFrom: boolean;
  /** מעוצב לפי הקהל: לצרכן כולל מע״מ קודם */
  priceLine: string;
  /** הודעת וואטסאפ ללקוח */
  message: string;
  confirmLine: string | null;
  /** אזהרות ליקיר, לא ללקוח */
  warnings: string[];
  /** הבחירה אחרי ניקוי: מה שבאמת נכנס לסכום */
  addonIds: string[];
  participants: number | null;
  region: SelectionRegion | null;
  attractionsCount: number | null;
  activations: number;
  /** הפריט בקטלוג שהסכום בנוי עליו (בחבילת אטרקציות: החבילה) */
  baseId: string;
  /** יש בחירה מעבר לבסיס, ולכן ההודעה נבנית מהבחירה ולא מהכרטיס */
  hasSelection: boolean;
};

const CATALOG_IDS_CACHE = new Map<string, boolean>();

function isPriceFromId(id: string): boolean {
  const cached = CATALOG_IDS_CACHE.get(id);
  if (cached != null) return cached;
  let from = false;
  try {
    from = getPriceFromById(id as PriceItemId) || getPriceTransparencyById(id as PriceItemId).pricingMode === "from";
  } catch {
    from = false;
  }
  CATALOG_IDS_CACHE.set(id, from);
  return from;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function catalogLine(id: PriceItemId, qty = 1, label?: string): SalesLine {
  const item = getPriceById(id);
  return { id, label: label ?? item.label, qty, unitExVat: item.exVat };
}

function sumLines(lines: readonly SalesLine[]): number {
  return round2(lines.reduce((sum, l) => sum + l.qty * l.unitExVat, 0));
}

function clampInt(value: number | null | undefined, min: number, max: number, fallback: number): number {
  if (value == null || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

/* שדרוגים: רק מהרשימה של הכרטיס, ושדרוג שהתנאי שלו לא נבחר נדחה */
function acceptAddons(
  options: SelectionOptions,
  ids: readonly string[],
  warnings: string[],
): SalesAddon[] {
  const picked = new Set(ids);
  const known = options.addons.filter((a) => picked.has(a.id));
  for (const id of picked) {
    if (!options.addons.some((a) => a.id === id)) warnings.push(`השדרוג ${id} לא שייך לשירות הזה ולא נכנס`);
  }
  const chosen = new Set(known.map((a) => a.id));
  return known.filter((addon) => {
    if (!addon.requires || chosen.has(addon.requires)) return true;
    const need = options.addons.find((a) => a.id === addon.requires)?.label ?? addon.requires;
    warnings.push(`${addon.label} רק עם ${need}, ולכן לא נכנס לסכום`);
    return false;
  });
}

/* שורות של שדרוג. בשדרוג DJ של אולפן נייד יש שני פריטי קטלוג: השירות וההגעה */
function addonLines(addon: SalesAddon): SalesLine[] {
  if (addon.catalogIds.length === 1) return [catalogLine(addon.catalogIds[0] as PriceItemId, 1, addon.label)];
  return addon.catalogIds.map((id) => catalogLine(id as PriceItemId));
}

/* ─── הטקסט ללקוח ─── */

/* שם מהקטלוג בהודעה: בלי סימנים ש-audit:ai-tells פוסל, ובלי סימן קריאה */
function cleanText(text: string): string {
  return text
    .replace(/[\u2014\u2013]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/!/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function amount(value: number): string {
  return Number.isInteger(value)
    ? value.toLocaleString("he-IL")
    : value.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* מחיר שורה בהודעה: לצרכן כולל מע״מ, לעסק לפני מע״מ */
function linePrice(exVat: number, from: boolean, audience: SalesCard["audience"]): string {
  const prefix = from ? "מ-" : "";
  return audience === "business" ? `${prefix}${amount(exVat)} ₪ + מע״מ` : `${prefix}${amount(catalogWithVat(exVat))} ₪`;
}

/* "3 משתתפים (2 נוספים)": כמה בסך הכול, ועל כמה משלמים */
function peopleText(rule: ParticipantRule, participants: number, extra: number): string {
  return `${participants} ${rule.noun} (${extra === 1 ? `${rule.one} נוסף` : `${extra} נוספים`})`;
}

type MessageItem = { text: string; exVat: number; from: boolean };

/* מילות הפתיחה של שדרוג שנבחר ("תיקון זיופים"): אם "רק לוודא" מדבר עליו, הוא כבר לא נכון */
function clashesWithAddons(text: string, labels: readonly string[]): boolean {
  return labels.some((label) => {
    const lead = label.split(/\s+/).slice(0, 2).join(" ");
    return lead.length >= 4 && text.includes(lead);
  });
}

/* ─── החישוב ─── */

/** הבחירה ההתחלתית של כרטיס: בלי שדרוגים, הכלולים, מרכז, ומספר האטרקציות של הכרטיס */
export function defaultSelection(card: SalesCard): Required<SelectionInput> {
  const options = selectionOptions(card);
  return {
    addonIds: [],
    participants: options.participants?.min ?? null,
    region: options.regions ? "center" : null,
    attractionsCount: options.attractions?.initial ?? null,
    activations: 0,
  };
}

export function buildSelectionQuote(card: SalesCard, input: SelectionInput): SelectionQuote {
  const options = selectionOptions(card);
  const warnings: string[] = [];
  const addons = acceptAddons(options, input.addonIds, warnings);
  const addonExVat = round2(addons.reduce((sum, a) => sum + a.exVat, 0));

  const rule = options.participants;
  const participants = rule ? clampInt(input.participants, rule.min, rule.max, rule.min) : null;
  if (rule && input.participants != null && participants !== Math.trunc(input.participants)) {
    warnings.push(`מספר ה${rule.noun} בשירות הזה בין ${rule.min} ל-${rule.max}`);
  }
  const extraPeople = rule && participants != null ? Math.max(0, participants - rule.included) : 0;

  const regionOption = options.regions
    ? (options.regions.find((r) => r.id === input.region) ?? options.regions[0])
    : null;
  if (options.regions && input.region && regionOption?.id !== input.region) {
    warnings.push("האזור שנבחר לא מתאים לשירות הזה, החישוב לפי המרכז");
  }

  const attractions = options.attractions;
  const attractionsCount = attractions
    ? clampInt(input.attractionsCount, attractions.min, attractions.max, attractions.initial)
    : null;
  const maxActivations =
    attractionsCount != null && options.activationsPerAttraction != null
      ? attractionsCount * options.activationsPerAttraction
      : 0;
  const activations = clampInt(input.activations, 0, maxActivations, 0);

  const baseId = (attractionsCount != null ? attractionBaseId(attractionsCount) : card.id) as PriceItemId;

  /* שורות למורנינג */
  const baseLine = catalogLine(baseId);
  const lines: SalesLine[] = [baseLine];
  if (rule && extraPeople > 0) lines.push(catalogLine(rule.extraId, extraPeople));
  if (regionOption?.travelId) lines.push(catalogLine(regionOption.travelId));
  if (activations > 0) lines.push(catalogLine(EXTRA_ACTIVATION_ID, activations));
  for (const addon of addons) lines.push(...addonLines(addon));

  /* הסכום מהעזר של השירות, כמו באתר. השורות חייבות להגיע לאותו סכום */
  const travelExVat = regionOption?.travelId ? getExVat(regionOption.travelId) : 0;
  let serviceExVat: number;
  switch (card.id) {
    case SONG_OFFER_BASE_ID: {
      const song = calcSongOffer(
        addons.map((a) => a.id),
        participants ?? SONG_PARTICIPANT_RULES.included,
      );
      /* שדרוגים שהטופס באתר לא מכיר (סבב תיקונים, חצי שעה, זמר מהצוות) נוספים על הסכום שלו */
      const inForm = new Set<string>(song.addonIds);
      const outside = addons.filter((a) => !inForm.has(a.id));
      serviceExVat = song.totalExVat + outside.reduce((sum, a) => sum + a.exVat, 0);
      break;
    }
    case BLESSING_BASE_ID:
    case BLESSING_REMOTE_ID:
      serviceExVat = blessingTotalExVat(participants ?? BLESSING_PARTICIPANT_RULES.included, card.id) + addonExVat;
      break;
    case "podcast_audio":
      serviceExVat =
        getExVat("podcast_audio") +
        podcastParticipantsCostExVat(participants ?? PODCAST_PARTICIPANT_RULES.included, false) +
        addonExVat;
      break;
    case MOBILE_STUDIO_CHANNEL_RULES.arrivalId: {
      const geo = regionOption?.id === "north_south" || regionOption?.id === "eilat" ? regionOption.id : "center";
      serviceExVat =
        calcMobileStudioAtHomeExVat(geo, participants ?? MOBILE_STUDIO_CHANNEL_RULES.included) + addonExVat;
      break;
    }
    default:
      if (attractionsCount != null) {
        serviceExVat = getEventBundlePrice(attractionsCount) + activations * getExVat(EXTRA_ACTIVATION_ID) + addonExVat;
      } else {
        serviceExVat = getExVat(baseId) + travelExVat + addonExVat;
      }
  }
  const totalExVat = round2(serviceExVat);
  if (Math.abs(sumLines(lines) - totalExVat) >= 0.005) {
    warnings.push("שורות המורנינג לא מסתכמות לסכום של האתר. בודקים לפני שליחה.");
  }
  const totalInclVat = catalogWithVat(totalExVat);

  const quoteOnly = attractionsCount != null && isEventQuoteOnly(attractionsCount);
  const priceFrom = lines.some((l) => isPriceFromId(l.id)) || quoteOnly;
  if (priceFrom) {
    const fromLabels = lines.filter((l) => isPriceFromId(l.id)).map((l) => l.label);
    warnings.push(
      quoteOnly
        ? `מ-${EVENT_GIFT_THRESHOLD} אטרקציות זה מחיר פתיחה, והסופי נסגר בשיחה`
        : `מחיר התחלה (מ-): ${fromLabels.join(", ")}`,
    );
  }
  const price = formatPrice(totalExVat, { from: priceFrom, audience: card.audience });

  const defaults = defaultSelection(card);
  const hasSelection =
    addons.length > 0 ||
    (participants != null && participants !== defaults.participants) ||
    (regionOption != null && regionOption.id !== "center") ||
    (attractionsCount != null && attractionsCount !== defaults.attractionsCount) ||
    activations > 0;

  /* ההודעה */
  let message = card.message;
  if (hasSelection) {
    const items: MessageItem[] = [
      { text: getPriceById(baseId).label, exVat: baseLine.unitExVat, from: isPriceFromId(baseId) },
    ];
    if (rule && extraPeople > 0) {
      items.push({ text: peopleText(rule, participants ?? rule.min, extraPeople), exVat: extraPeople * getExVat(rule.extraId), from: false });
    }
    if (regionOption?.travelId) {
      items.push({ text: getPriceById(regionOption.travelId).label, exVat: travelExVat, from: false });
    }
    if (activations > 0) {
      items.push({
        text: activations === 1 ? "הפעלה נוספת" : `${activations} הפעלות נוספות`,
        exVat: activations * getExVat(EXTRA_ACTIVATION_ID),
        from: false,
      });
    }
    for (const addon of addons) items.push({ text: addon.label, exVat: addon.exVat, from: addon.priceFrom });

    const included =
      attractionsCount != null && activations > 0 ? "התפעול במקום כלול." : buildIncludedSentence(card);
    /* באזור שנבחר כבר ידוע איפה, ולכן נשאר רק התאריך */
    const question =
      regionOption && regionOption.id !== "center" && isDj(card) ? "מה תאריך האירוע?" : buildClosingQuestion(card);
    const head = card.audience === "business" ? "היי, זה המחיר למה שביקשתם:" : "היי, זה המחיר למה שביקשתם, כולל מע״מ:";
    const list = items.map((item) => `• ${cleanText(item.text)}: ${linePrice(item.exVat, item.from, card.audience)}`);
    const total = `סה״כ ${price.inline}.`;
    const compose = (withIncluded: boolean, rows: string[]) =>
      [head, ...rows, total, withIncluded && included ? cleanText(included) : null, question]
        .filter((p): p is string => Boolean(p))
        .join("\n");
    message = compose(true, list);
    if (message.length > SELECTION_MESSAGE_MAX) message = compose(false, list);
    if (message.length > SELECTION_MESSAGE_MAX) {
      /* הרבה שדרוגים: השמות בלי המחיר לכל אחד, הסכום נשאר */
      const short = [list[0], `• ועוד: ${items.slice(1).map((i) => cleanText(i.text)).join(", ")}`];
      message = compose(false, short);
    }
  }

  /* "רק לוודא" שהבחירה כבר סתרה לא נשלח */
  let confirmLine = card.confirmLine;
  if (confirmLine) {
    const body = confirmLine.slice(CONFIRM_PREFIX.length);
    const clash =
      clashesWithAddons(body, addons.map((a) => a.label)) ||
      ((card.id === BLESSING_BASE_ID || card.id === BLESSING_REMOTE_ID) && extraPeople > 0 && body.includes("אחד")) ||
      (card.id === MOBILE_STUDIO_CHANNEL_RULES.arrivalId && regionOption != null && regionOption.id !== "center") ||
      (attractionsCount != null && activations > 0);
    if (clash) confirmLine = null;
  }

  return {
    lines,
    totalExVat,
    totalInclVat,
    priceFrom,
    priceLine: price.inline,
    message,
    confirmLine,
    warnings,
    addonIds: addons.map((a) => a.id),
    participants,
    region: regionOption?.id ?? null,
    attractionsCount,
    activations,
    baseId,
    hasSelection,
  };
}
