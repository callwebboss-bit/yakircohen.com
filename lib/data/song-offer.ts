/**
 * הצעת הקלטת השיר: בסיס אחד, שלוש תוספות ומספר משתתפים
 * (docs/OWNER-DECISIONS-2026-10-02.md).
 *
 * מודול טהור, בלי React. הצד הזה קורא את הקטלוג (song_recording,
 * PRICING_ADDON_LINKS ו-SONG_PARTICIPANT_RULES) ובונה ממנו SongQuoteData.
 * החישוב עצמו, ההודעה והקישורים יושבים ב-song-offer-quote.ts, כדי שהטופס
 * בדפדפן יחשב בדיוק באותה פונקציה בלי לייבא את הקטלוג.
 *
 * כללי מחיר: לצרכן מציגים כולל מע״מ קודם, ובקטן לפני מע״מ. הסכום הכולל הוא
 * withVat של הסכום לפני מע״מ, ובדיקה מוודאת שהוא שווה גם לסכום השורות כולל
 * מע״מ בכל שילוב ולכל מספר משתתפים.
 */
import type { LeadEmailPayload } from "@/lib/lead-email-notify";
import {
  buildSongCallbackPayload,
  buildSongMessageFromCalc,
  buildSongOfferHrefFrom,
  calcSongQuote,
  clampSongParticipants,
  composeSongOfferQuote,
  formatSongTotalLine,
  SONG_ADDONS_PARAM,
  SONG_OFFER_CALLBACK_FORM_ID,
  SONG_OFFER_PAGE_PATH,
  SONG_OFFER_SECTION_ID,
  SONG_PARTICIPANTS_PARAM,
  songAddonKey,
  songParticipantsBreakdown,
  songParticipantsExplanation,
  songParticipantsExplanationParts,
  songParticipantsSurchargeExVat,
  type SongCallbackContact,
  type SongOfferCalc,
  type SongOfferQuote,
  type SongParticipantRules,
  type SongParticipantsExplanation,
  type SongPriceLine,
  type SongQuoteData,
  type SongQuoteOptions,
} from "@/lib/data/song-offer-quote";
import {
  CATALOG_VAT_RATE,
  getAddonsForBaseId,
  getExVat,
  getPriceById,
  getPriceTransparencyById,
  SONG_PARTICIPANT_RULES,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";
import type { SongAddonId } from "@/lib/data/song-offer-aliases";
import type { PersonBreakdown } from "@/lib/data/participant-cost-copy";

export const SONG_OFFER_BASE_ID = "song_recording" satisfies PriceItemId;
export {
  SONG_ADDONS_PARAM,
  SONG_OFFER_CALLBACK_FORM_ID,
  SONG_OFFER_PAGE_PATH,
  SONG_OFFER_SECTION_ID,
  SONG_PARTICIPANTS_PARAM,
  formatSongTotalLine,
  songAddonKey,
};
export type { SongOfferCalc, SongOfferQuote, SongParticipantRules, SongPriceLine };

/** שם הבסיס בהודעה ובמייל, עם מה שכלול בו */
const BASE_LINE_LABEL = "הקלטת שיר (הקלטה, מיקס ומאסטר)";

export type { SongAddonId };
/* המיפוי של הקישורים הישנים יושב במודול קטן בלי תלויות, ראו שם למה */
export { LEGACY_SONG_ALIASES, resolveLegacySongAlias } from "@/lib/data/song-offer-aliases";

function readAddonIds(): readonly SongAddonId[] {
  return getAddonsForBaseId(SONG_OFFER_BASE_ID).map((item) => item.id as SongAddonId);
}

/** סדר התוספות לפי הקטלוג. זה גם הסדר בטופס ובהודעה. */
export const SONG_ADDON_IDS: readonly SongAddonId[] = readAddonIds();

const SONG_ADDON_SET = new Set<string>(SONG_ADDON_IDS);

export function isSongAddonId(value: string): value is SongAddonId {
  return SONG_ADDON_SET.has(value);
}

/** התוספת שחייבת להיבחר קודם (הראיון משולב בקליפ), לפי שדה requires בקטלוג */
export function getSongAddonRequirement(id: SongAddonId): SongAddonId | null {
  const req = getPriceById(id).requires;
  return req && isSongAddonId(req) ? req : null;
}

/** האם אפשר לבחור את התוספת לצד הבחירה הנוכחית */
export function isSongAddonAvailable(
  id: SongAddonId,
  selected: readonly SongAddonId[],
): boolean {
  const req = getSongAddonRequirement(id);
  return req == null || selected.includes(req);
}

/**
 * מנקה בחירה: מתעלם ממזהים לא מוכרים, מסיר כפילויות, שומר על סדר הקטלוג,
 * ומוריד תוספת שהתנאי שלה לא נבחר (ראיון בלי קליפ). לא מוסיף תוספת בשקט,
 * כדי שהמחיר לא יעלה בלי שהלקוח בחר.
 */
export function normalizeSongAddons(ids: readonly string[]): SongAddonId[] {
  const picked = new Set(ids.filter(isSongAddonId));
  const ordered = SONG_ADDON_IDS.filter((id) => picked.has(id));
  return ordered.filter((id) => isSongAddonAvailable(id, ordered));
}

/** קורא ?addons=a,b (או מחרוזת דומה). ערך ריק או חסר מחזיר בחירה ריקה. */
export function parseSongAddons(value: string | null | undefined): SongAddonId[] {
  if (!value?.trim()) return [];
  return normalizeSongAddons(value.split(/[,\s]+/).map((part) => part.trim()));
}

/** כללי המשתתפים בשיר עם המחירים מהקטלוג */
export function getSongParticipantRules(): SongParticipantRules {
  return {
    included: SONG_PARTICIPANT_RULES.included,
    max: SONG_PARTICIPANT_RULES.max,
    extraExVat: getExVat(SONG_PARTICIPANT_RULES.extraId),
  };
}

/** קורא ?participants=4. ערך חסר או לא מובן נותן זמר אחד, ערך גבוה נחתך ל-12. */
export function parseSongParticipants(value: string | null | undefined): number {
  return clampSongParticipants(value?.trim() ? value : null, getSongParticipantRules());
}

/** תוספת המשתתפים לפני מע״מ, לפי הקטלוג */
export function songParticipantsSurcharge(participants: number): number {
  return songParticipantsSurchargeExVat(participants, getSongParticipantRules());
}

/** { withVat: "כל משתתף נוסף +117 ₪ כולל מע״מ", exVat: "(99 ₪ + מע״מ)", limit: "עד 12 בשיר" } */
export function getSongParticipantsExplanation(): SongParticipantsExplanation {
  return songParticipantsExplanationParts(getSongParticipantRules(), CATALOG_VAT_RATE);
}

/** "4 משתתפים: 590 + 117 + 117 + 117 ₪ כולל מע״מ (500 + 99 + 99 + 99 ₪ + מע״מ)", מהקטלוג */
export function getSongParticipantsBreakdown(participants: number): PersonBreakdown {
  return songParticipantsBreakdown(
    participants,
    getSongParticipantRules(),
    getExVat(SONG_OFFER_BASE_ID),
    CATALOG_VAT_RATE,
  );
}

/** הנתונים הפשוטים שמהם השרת והדפדפן מחשבים כל הצעה */
export function getSongQuoteData(): SongQuoteData {
  return {
    base: { id: SONG_OFFER_BASE_ID, label: BASE_LINE_LABEL, exVat: getExVat(SONG_OFFER_BASE_ID) },
    addons: SONG_ADDON_IDS.map((id) => {
      const item = getPriceById(id);
      return { id, label: item.label, exVat: item.exVat, requires: getSongAddonRequirement(id) };
    }),
    participants: getSongParticipantRules(),
    vatRate: CATALOG_VAT_RATE,
  };
}

/** מחשב את ההצעה לבחירה נתונה. הבסיס תמיד כלול, זמר אחד כלול. */
export function calcSongOffer(addonIds: readonly string[] = [], participants = 1): SongOfferCalc {
  return calcSongQuote(getSongQuoteData(), addonIds, participants);
}

export type SongOfferItemView = {
  id: PriceItemId;
  label: string;
  description: string;
  exVat: number;
  withVat: number;
  included: string[];
  excluded: string[];
  /** לתוספות בלבד: מזהה התוספת שחייבת להיבחר איתה */
  requires: SongAddonId | null;
};

export type SongOfferView = {
  base: SongOfferItemView;
  addons: SongOfferItemView[];
};

function itemView(id: PriceItemId, requires: SongAddonId | null): SongOfferItemView {
  const item = getPriceById(id);
  const t = getPriceTransparencyById(id);
  return {
    id,
    label: item.label,
    description: item.context ?? "",
    exVat: item.exVat,
    withVat: withVat(item.exVat),
    included: [...t.included],
    excluded: [...t.excluded],
    requires,
  };
}

/** נתונים פשוטים לטופס (נשלחים כ-props מקומפוננטת שרת) ולייצוא לכלי הבעלים */
export function getSongOfferView(): SongOfferView {
  return {
    base: itemView(SONG_OFFER_BASE_ID, null),
    addons: SONG_ADDON_IDS.map((id) => itemView(id, getSongAddonRequirement(id))),
  };
}

export type SongMessageOptions = Pick<SongQuoteOptions, "source" | "giftMode"> & {
  /** מספר המשתתפים בשיר, ברירת מחדל 1 */
  participants?: number;
};

export type SongMessage = {
  /** ההודעה ללקוח, בגוף ראשון, בלי התג */
  text: string;
  /** תג [YC:...] לכלי של הבעלים. מי שבונה את הקישור מחליט אם לצרף אותו. */
  ycTag: string;
};

export function buildSongOfferMessage(
  addonIds: readonly string[],
  { source, giftMode = false, participants = 1 }: SongMessageOptions,
): SongMessage {
  const data = getSongQuoteData();
  return buildSongMessageFromCalc(data, calcSongQuote(data, addonIds, participants), { source, giftMode });
}

export type SongWhatsAppHrefOptions = SongQuoteOptions & { participants?: number };

/** קישור wa.me רגיל, כדי שיעבוד גם בדפדפן של אינסטגרם וגם בלי JS */
export function buildSongOfferWhatsAppHref(
  addonIds: readonly string[],
  options: SongWhatsAppHrefOptions,
): string {
  return buildSongOfferQuote(addonIds, options).waHref;
}

/** קישור לטופס בעמוד עם הבחירה, /studio/recording-song-modiin?addons=a,b&participants=4#song-offer */
export function buildSongOfferHref(
  addonIds: readonly string[] = [],
  path: string = SONG_OFFER_PAGE_PATH,
  participants = 1,
): string {
  const rules = getSongParticipantRules();
  return buildSongOfferHrefFrom(
    normalizeSongAddons(addonIds),
    clampSongParticipants(participants, rules),
    rules.included,
    path,
  );
}

export type SongCallbackInput = SongCallbackContact & {
  addonIds: readonly string[];
  participants?: number;
};

/** משמש את מי שבונה בקשה בלי הצעה מוכנה (בדיקות, השרת). ראו buildSongCallbackPayload. */
export function buildSongCallbackRequest(input: SongCallbackInput): LeadEmailPayload {
  const quote = buildSongOfferQuote(input.addonIds, {
    source: input.source,
    giftMode: input.giftMode,
    participants: input.participants,
  });
  return buildSongCallbackPayload(quote, input);
}

/** שילוב אחד עם כל מה שהטופס צריך: סכומים, הודעה, תג וקישורים */
export function buildSongOfferQuote(
  addonIds: readonly string[],
  options: SongWhatsAppHrefOptions,
): SongOfferQuote {
  return composeSongOfferQuote(getSongQuoteData(), addonIds, options.participants ?? 1, options);
}

/**
 * כל השילובים החוקיים מחושבים מראש, לפי songAddonKey. שלוש תוספות והראיון
 * רק עם הקליפ נותנים שישה שילובים, וזה מה שקומפוננטת השרת שולחת לטופס.
 */
export function getSongOfferQuotes(
  options: SongWhatsAppHrefOptions,
): Record<string, SongOfferQuote> {
  const quotes: Record<string, SongOfferQuote> = {};
  for (const ids of validSongCombinations()) {
    quotes[songAddonKey(ids)] = buildSongOfferQuote(ids, options);
  }
  return quotes;
}

/** כל צירופי התוספות החוקיים, בסדר הקטלוג. צירוף שהנרמול מקצץ (ראיון בלי קליפ) לא נכלל. */
function validSongCombinations(): SongAddonId[][] {
  const combos: SongAddonId[][] = [];
  const total = 1 << SONG_ADDON_IDS.length;
  for (let mask = 0; mask < total; mask += 1) {
    const ids = SONG_ADDON_IDS.filter((_, i) => mask & (1 << i));
    const normalized = normalizeSongAddons(ids);
    if (normalized.length === ids.length) combos.push(normalized);
  }
  return combos;
}

export type SongOfferFormItem = {
  id: string;
  label: string;
  description: string;
  exVat: number;
  withVat: number;
  requires: SongAddonId | null;
};

export type SongOfferFormData = {
  base: SongOfferFormItem;
  addons: (SongOfferFormItem & { id: SongAddonId })[];
  /** הנתונים שמהם הטופס מחשב כל הצעה בדפדפן (composeSongOfferQuote) */
  quoteData: SongQuoteData;
  /** שורת ההסבר מתחת לבורר המשתתפים */
  participantsExplanation: SongParticipantsExplanation;
};

/** כל מה שהטופס צריך כ-props: הבסיס, התוספות, נתוני החישוב וההסבר */
export function getSongOfferFormData(): SongOfferFormData {
  const view = getSongOfferView();
  const pick = ({ id, label, description, exVat, withVat, requires }: SongOfferItemView) => ({
    id,
    label,
    description,
    exVat,
    withVat,
    requires,
  });
  return {
    base: pick(view.base),
    addons: view.addons.map((addon) => ({ ...pick(addon), id: addon.id as SongAddonId })),
    quoteData: getSongQuoteData(),
    participantsExplanation: getSongParticipantsExplanation(),
  };
}

export type SongOfferExport = SongOfferView & {
  vatIncluded: true;
  pageHref: string;
  addonsParam: string;
  participantsParam: string;
  /** משתתפים: אחד כלול, השני secondExVat, מהשלישי groupExVat לכל אחד, עד max */
  participants: SongParticipantRules & { explanation: string };
  /** כל השילובים החוקיים, עם הסכומים שהטופס מציג */
  combinations: { addonIds: SongAddonId[]; totalExVat: number; totalWithVat: number; offerHref: string }[];
};

/**
 * ייצוא לכלי הצעות המחיר של הבעלים (scripts/export-closer-config.mjs).
 * בלי הודעות ובלי תג, רק מחירים ושילובים, כדי שהכלי יחשב בדיוק כמו הטופס.
 */
export function getSongOfferExport(): SongOfferExport {
  const combinations = validSongCombinations().map((ids) => {
    const calc = calcSongOffer(ids);
    return {
      addonIds: calc.addonIds,
      totalExVat: calc.totalExVat,
      totalWithVat: calc.totalWithVat,
      offerHref: buildSongOfferHref(calc.addonIds),
    };
  });
  return {
    ...getSongOfferView(),
    vatIncluded: true,
    pageHref: buildSongOfferHref(),
    addonsParam: SONG_ADDONS_PARAM,
    participantsParam: SONG_PARTICIPANTS_PARAM,
    participants: { ...getSongParticipantRules(), explanation: songParticipantsExplanation(getSongParticipantRules(), CATALOG_VAT_RATE) },
    combinations,
  };
}
