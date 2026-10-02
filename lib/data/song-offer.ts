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
  getAddonsForBaseId,
  getPriceById,
  getPriceTransparencyById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";
import type { SongAddonId } from "@/lib/data/song-offer-aliases";
import { sanitizeLeadText } from "@/lib/form-validation";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { buildYcLeadTag } from "@/lib/yc-lead-tag";

export const SONG_OFFER_BASE_ID = "song_recording" satisfies PriceItemId;
export const SONG_OFFER_SECTION_ID = "song-offer";
export const SONG_OFFER_CALLBACK_FORM_ID = "song_offer_callback";
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

export type SongPriceLine = {
  id: PriceItemId;
  label: string;
  exVat: number;
  withVat: number;
};

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

function nis(amount: number): string {
  return `${amount.toLocaleString("he-IL")} ₪`;
}

/** "1,829 ₪ כולל מע״מ (1,550 ₪ + מע״מ)" */
export function formatSongTotalLine(calc: SongOfferCalc): string {
  return `${nis(calc.totalWithVat)} כולל מע״מ (${nis(calc.totalExVat)} + מע״מ)`;
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

/** שורות "מה בחרתי" עם מחיר כולל מע״מ לכל שורה, והסכום */
function selectionLines(calc: SongOfferCalc): string[] {
  return [
    "מה בחרתי:",
    ...calc.lines.map((line) => `• ${line.label} - ${nis(line.withVat)}`),
    `סה״כ: ${formatSongTotalLine(calc)}`,
  ];
}

export function buildSongOfferMessage(
  addonIds: readonly string[],
  { source, giftMode = false }: SongMessageOptions,
): SongMessage {
  const calc = calcSongOffer(addonIds);
  const opening = giftMode
    ? "שלום, אשמח להקליט שיר במתנה באולפן."
    : "שלום, אשמח להקליט שיר באולפן.";
  const text = [opening, ...selectionLines(calc), "מתי נוח לכם להקליט?"].join("\n");
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

export type SongCallbackInput = {
  name: string;
  /** טלפון שכבר עבר validateIsraeliMobile */
  phone: string;
  addonIds: readonly string[];
  source: string;
  giftMode?: boolean;
  /** מזהה שליחה קבוע לכל הצגה של הטופס, כדי שניסיון חוזר לא ייצור ליד כפול */
  submissionId: string;
  /** שדה ה-honeypot כפי שהוא, ריק אצל בני אדם */
  honeypot?: string;
};

/**
 * בקשת "תתקשרו אליי" בחוזה השליחה של שלב 1 (submitLeadToServer). הגוף הוא
 * אותן שורות של הודעת הוואטסאפ, כדי שהבעלים יראה בדיוק מה הלקוח בחר. השרת
 * לא מחשב מחדש את הסכום, ולכן הוא נכנס גם ל-pricingRef לפני מע״מ.
 */
export function buildSongCallbackRequest(input: SongCallbackInput): LeadEmailPayload {
  const calc = calcSongOffer(input.addonIds);
  const name = sanitizeLeadText(input.name, 60);
  const phone = sanitizeLeadText(input.phone, 20);
  const { ycTag } = buildSongOfferMessage(calc.addonIds, {
    source: input.source,
    giftMode: input.giftMode,
  });
  const body = [
    "בקשה לשיחה חוזרת מטופס הקלטת השיר",
    `שם: ${name}`,
    `טלפון: ${phone}`,
    ...(input.giftMode ? ["שיר במתנה"] : []),
    "",
    ...selectionLines(calc),
    "",
    `מקור: ${input.source}`,
    ycTag,
  ].join("\n");
  return {
    formId: SONG_OFFER_CALLBACK_FORM_ID,
    subject: `[יקיר כהן] שיחה חוזרת: הקלטת שיר, ${nis(calc.totalWithVat)} כולל מע״מ`,
    body,
    name,
    phone,
    website_verification: input.honeypot ?? "",
    submissionId: input.submissionId,
    serviceType: "studio",
    pricingRef: {
      sectionId: SONG_OFFER_SECTION_ID,
      label: calc.lines.map((line) => line.label).join(" + "),
      exVat: calc.totalExVat,
      href: buildSongOfferHref(calc.addonIds),
    },
  };
}
