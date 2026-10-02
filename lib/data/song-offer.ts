/**
 * הצעת הקלטת השיר: בסיס אחד ושלוש תוספות (docs/OWNER-DECISIONS-2026-10-02.md).
 *
 * מודול טהור, בלי React. כל החישובים, הודעת הוואטסאפ, הקישורים, מיפוי
 * הקישורים הישנים ובקשת השיחה החוזרת יושבים כאן, והמחירים והתוספות נקראים
 * מהקטלוג בלבד (song_recording ו-PRICING_ADDON_LINKS).
 *
 * כללי מחיר: לצרכן מציגים כולל מע״מ קודם, ובקטן לפני מע״מ. הסכום הכולל הוא
 * סכום שורות כולל המע״מ, ובדיקה מוודאת שהוא שווה ל-withVat של סכום השורות
 * לפני מע״מ בכל שילוב, כך שמחיר עתידי שמתעגל אחרת יפיל את הבדיקות.
 */
import type { LeadEmailPayload } from "@/lib/lead-email-notify";
import {
  buildSongCallbackPayload,
  formatSongTotalLine,
  SONG_OFFER_CALLBACK_FORM_ID,
  SONG_OFFER_SECTION_ID,
  songAddonKey,
  songSelectionLines,
  type SongCallbackContact,
  type SongOfferQuote,
  type SongPriceLine,
} from "@/lib/data/song-offer-quote";
import {
  getAddonsForBaseId,
  getPriceById,
  getPriceTransparencyById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";
import type { SongAddonId } from "@/lib/data/song-offer-aliases";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { buildYcLeadTag } from "@/lib/yc-lead-tag";

export const SONG_OFFER_BASE_ID = "song_recording" satisfies PriceItemId;
export { SONG_OFFER_CALLBACK_FORM_ID, SONG_OFFER_SECTION_ID, formatSongTotalLine, songAddonKey };
export type { SongOfferQuote, SongPriceLine };
export const SONG_OFFER_PAGE_PATH = "/studio/recording-song-modiin";
/** שם הפרמטר בכתובת שזוכר את הבחירה, ?addons=id,id */
export const SONG_ADDONS_PARAM = "addons";

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

export type SongOfferCalc = {
  addonIds: SongAddonId[];
  lines: SongPriceLine[];
  totalExVat: number;
  totalWithVat: number;
};

function priceLine(id: PriceItemId, label?: string): SongPriceLine {
  const item = getPriceById(id);
  return { id, label: label ?? item.label, exVat: item.exVat, withVat: withVat(item.exVat) };
}

/** מחשב את ההצעה לבחירה נתונה. הבסיס תמיד כלול. */
export function calcSongOffer(addonIds: readonly string[] = []): SongOfferCalc {
  const ids = normalizeSongAddons(addonIds);
  const lines = [
    priceLine(SONG_OFFER_BASE_ID, BASE_LINE_LABEL),
    ...ids.map((id) => priceLine(id)),
  ];
  return {
    addonIds: ids,
    lines,
    totalExVat: lines.reduce((sum, line) => sum + line.exVat, 0),
    totalWithVat: lines.reduce((sum, line) => sum + line.withVat, 0),
  };
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

export type SongMessageOptions = {
  /** נתיב העמוד, נכנס רק לתג [YC:] */
  source: string;
  giftMode?: boolean;
};

export type SongMessage = {
  /** ההודעה ללקוח, בגוף ראשון, בלי התג */
  text: string;
  /** תג [YC:...] לכלי של הבעלים. מי שבונה את הקישור מחליט אם לצרף אותו. */
  ycTag: string;
};

export function buildSongOfferMessage(
  addonIds: readonly string[],
  { source, giftMode = false }: SongMessageOptions,
): SongMessage {
  const calc = calcSongOffer(addonIds);
  const opening = giftMode
    ? "שלום, אשמח להקליט שיר במתנה באולפן."
    : "שלום, אשמח להקליט שיר באולפן.";
  const text = [opening, ...songSelectionLines(calc), "מתי נוח לכם להקליט?"].join("\n");
  const ycTag = buildYcLeadTag({
    service: "recording",
    price: calc.totalExVat,
    source,
    package: [SONG_OFFER_BASE_ID, ...calc.addonIds].join(","),
    form: "song_offer",
    purpose: giftMode ? "gift" : null,
  });
  return { text, ycTag };
}

export type SongWhatsAppHrefOptions = SongMessageOptions & {
  utmCampaign?: string;
  /* החלטת הבעלים על התג בהודעת הלקוח עדיין פתוחה (שאלה 6), ולכן כמו בשאר
     האתר אחרי שלב 1 הוא נשאר כברירת מחדל */
  includeYcTag?: boolean;
};

/** קישור wa.me רגיל, כדי שיעבוד גם בדפדפן של אינסטגרם וגם בלי JS */
export function buildSongOfferWhatsAppHref(
  addonIds: readonly string[],
  options: SongWhatsAppHrefOptions,
): string {
  const { text, ycTag } = buildSongOfferMessage(addonIds, options);
  return buildWhatsAppHref({
    text: options.includeYcTag === false ? text : `${text}\n${ycTag}`,
    utm_source: "website",
    utm_campaign: options.utmCampaign ?? "song_offer",
  });
}

/** קישור לטופס בעמוד עם הבחירה, /studio/recording-song-modiin?addons=a,b#song-offer */
export function buildSongOfferHref(
  addonIds: readonly string[] = [],
  path: string = SONG_OFFER_PAGE_PATH,
): string {
  const ids = normalizeSongAddons(addonIds);
  const qs = ids.length ? `?${SONG_ADDONS_PARAM}=${ids.join(",")}` : "";
  return `${path}${qs}#${SONG_OFFER_SECTION_ID}`;
}

export type SongCallbackInput = SongCallbackContact & {
  addonIds: readonly string[];
};

/** משמש את מי שבונה בקשה בלי שילוב מוכן מראש (בדיקות, השרת). ראו buildSongCallbackPayload. */
export function buildSongCallbackRequest(input: SongCallbackInput): LeadEmailPayload {
  const quote = buildSongOfferQuote(input.addonIds, {
    source: input.source,
    giftMode: input.giftMode,
  });
  return buildSongCallbackPayload(quote, input);
}

/** שילוב אחד עם כל מה שהטופס צריך: סכומים, הודעה, תג וקישורים */
export function buildSongOfferQuote(
  addonIds: readonly string[],
  options: SongWhatsAppHrefOptions & { offerPath?: string },
): SongOfferQuote {
  const calc = calcSongOffer(addonIds);
  const { text, ycTag } = buildSongOfferMessage(calc.addonIds, options);
  return {
    addonIds: calc.addonIds,
    lines: calc.lines,
    totalExVat: calc.totalExVat,
    totalWithVat: calc.totalWithVat,
    totalLine: formatSongTotalLine(calc),
    messageText: text,
    ycTag,
    waHref: buildSongOfferWhatsAppHref(calc.addonIds, options),
    offerHref: buildSongOfferHref(calc.addonIds, options.offerPath),
  };
}

/**
 * כל השילובים החוקיים מחושבים מראש, לפי songAddonKey. שלוש תוספות והראיון
 * רק עם הקליפ נותנים שישה שילובים, וזה מה שקומפוננטת השרת שולחת לטופס.
 */
export function getSongOfferQuotes(
  options: SongWhatsAppHrefOptions & { offerPath?: string },
): Record<string, SongOfferQuote> {
  const quotes: Record<string, SongOfferQuote> = {};
  const total = 1 << SONG_ADDON_IDS.length;
  for (let mask = 0; mask < total; mask += 1) {
    const ids = SONG_ADDON_IDS.filter((_, i) => mask & (1 << i));
    const normalized = normalizeSongAddons(ids);
    if (normalized.length !== ids.length) continue;
    quotes[songAddonKey(normalized)] = buildSongOfferQuote(normalized, options);
  }
  return quotes;
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
  quotes: Record<string, SongOfferQuote>;
};

/** כל מה שהטופס צריך כ-props: הבסיס, התוספות וכל השילובים המחושבים */
export function getSongOfferFormData(
  options: SongWhatsAppHrefOptions & { offerPath?: string },
): SongOfferFormData {
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
    quotes: getSongOfferQuotes(options),
  };
}
