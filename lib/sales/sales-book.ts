/**
 * ספר המכירות של עמדת הוואטסאפ (/admin/sales, תוכנית עמדת המכירות 6.10.2026).
 *
 * כרטיס לכל שירות שנמכר לבד, עם המחיר, מה כלול, השדרוגים, המשתתפים, צירופים
 * נפוצים, הודעה מוכנה ללקוח ושורות למורנינג. הכול נבנה מהקטלוג בכל טעינה,
 * ואין כאן אף מספר של מחיר: ארבעה ניסיונות קודמים של אותו רעיון החזיקו עותק
 * של המחירים, והעותק התיישן (מחיר שיר ישן בערכת iCloud וב-prices.js).
 *
 * כלל המע״מ כמו בכל האתר (song-offer.ts): המע״מ מחושב פעם אחת על הסכום לפני
 * מע״מ של כל הצירוף, לא על כל שורה. לכן ברכה לארבעה דוברים יוצאת בדיוק כמו
 * בטופס באתר ולא שקל יותר.
 *
 * המודול טהור ובלי node:crypto, כדי שגם אישור ההזמנה בדפדפן (voucher.ts) יוכל
 * לקרוא את הכרטיסים. ה-hash מחושב כאן ב-SHA-256 קטן משלנו, בדיוק כמו
 * scripts/export-pricing.ts, ובדיקה מוודאת ששניהם יוצאים אותו דבר.
 */
import {
  BLESSING_PARTICIPANT_RULES,
  CATALOG_BUNDLES,
  CATALOG_VAT_RATE,
  catalogWithVat,
  DJ_TRAVEL_CENTER_NOTE,
  DJ_TRAVEL_FEE_IDS,
  getAddonsForBaseId,
  getExVat,
  getPriceById,
  getPriceFromById,
  getPriceTransparencyById,
  MOBILE_STUDIO_CHANNEL_RULES,
  PODCAST_AUDIO_PACK_IDS,
  PODCAST_PARTICIPANT_RULES,
  PRICING_CATALOG,
  SONG_PARTICIPANT_RULES,
  STUDIO_TURNS_NOTE,
  type PriceItem,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { formatPrice, getPriceAudience } from "@/lib/data/pricing-display";
import { calcSongOffer, getSongOfferExport, SONG_OFFER_BASE_ID } from "@/lib/data/song-offer";
import {
  BLESSING_BASE_ID,
  BLESSING_REMOTE_ID,
  BLESSING_TEXT_REWRITE_ID,
  blessingTotalExVat,
} from "@/lib/data/blessing-offer";
import { podcastParticipantsCostExVat } from "@/lib/data/podcast-calculator";
import { calcMobileStudioAtHomeExVat, type MobileGeoId } from "@/lib/data/mobile-studio-booking";
import { DJ_CALC_ADDONS } from "@/lib/data/dj-events-calculator";
import {
  EVENT_BOOKING_ITEMS,
  LIQUID_FREQUENCY_OPTIONS,
  RIGID_ACTIVATION_OPTIONS,
} from "@/lib/data/events-booking";
import { PRICING_HUB_SECTIONS, resolveRowHref } from "@/lib/data/pricing-hub";
import { absoluteUrl } from "@/lib/site-url";
import { buildCardAgreedLine, buildCardConfirmLine, buildCardMessage } from "@/lib/sales/sales-copy";

export type SalesAudience = "consumer" | "business";
export type SalesLine = { id: string; label: string; qty: number; unitExVat: number };
export type SalesCombo = {
  key: string;
  label: string;
  lines: SalesLine[];
  totalExVat: number;
  totalInclVat: number;
  priceFrom: boolean;
};
export type SalesAddon = {
  id: string;
  label: string;
  exVat: number;
  inclVat: number;
  requires?: string;
  /** מזהי הקטלוג שמהם המחיר בנוי. בשדרוג DJ של אולפן נייד יש שניים: השירות וההגעה */
  catalogIds: string[];
  /** אחד ממזהי הקטלוג הוא מחיר התחלה, ולכן המחיר מוצג עם "מ-" */
  priceFrom: boolean;
};
export type SalesParticipantRow = { count: number; totalExVat: number; totalInclVat: number };
export type SalesCard = {
  /** מזהה הקטלוג של הבסיס */
  id: string;
  /** "song" | "blessing" | "remote" | "podcast" | "mobile" | "dj" | "attractions" | "sound", או קטגוריית הקטלוג */
  family: string;
  title: string;
  category: string;
  audience: SalesAudience;
  priceFrom: boolean;
  exVat: number;
  inclVat: number;
  /** מעוצב לפי הקהל, עם "מ-" במחיר התחלה */
  priceLine: string;
  /** null: אין לפריט פירוט משלו, רק נוסח ברירת המחדל של הקטגוריה ("פירוט לא הוגדר") */
  included: string[] | null;
  excluded: string[] | null;
  addons: SalesAddon[];
  participants: SalesParticipantRow[] | null;
  /** שורה ליד טבלת המשתתפים, למשל קיבולת האולפן (STUDIO_TURNS_NOTE), או null */
  participantsNote: string | null;
  combos: SalesCombo[];
  /** הודעת וואטסאפ ללקוח, עד 350 תווים */
  message: string;
  /** "רק לוודא: ..." ממה שלא כלול, שאלה של כן או לא */
  confirmLine: string | null;
  /** אותו דבר כעובדה, בלי מחיר, לשורת "סיכמנו" באישור ההזמנה */
  agreedLine: string | null;
  pageUrl: string | null;
  searchTerms: string[];
  /** שמונת השירותים הנפוצים, מוצגים ראשונים */
  featured: boolean;
  /** שורת הבסיס למורנינג */
  morningLines: SalesLine[];
};
export type SalesBook = {
  cards: SalesCard[];
  /** אותו hash כמו docs/pricing-export.json */
  contentHash: string;
  /** כמה פריטים בקטלוג (לכותרת העמוד) */
  itemCount: number;
};

/** הכרטיס בלי ההודעות. ממנו sales-copy.ts בונה את ההודעה, את "רק לוודא" ואת "סיכמנו". */
export type SalesCardDraft = Omit<SalesCard, "message" | "confirmLine" | "agreedLine">;

/* ─── איזה פריט מקבל כרטיס ─── */

/** שמונת השירותים שרוב הפניות עליהם, בסדר שבו הם מוצגים ראשונים */
export const FEATURED_CARD_IDS = [
  "song_recording",
  "blessing_recording",
  "studio_remote",
  "podcast_audio",
  "mobile_podcast_at_home",
  "dj_premium",
  "event_attraction_1",
  "event_sound_rental",
] as const satisfies readonly PriceItemId[];

const FAMILY_BY_ID: Partial<Record<PriceItemId, string>> = {
  song_recording: "song",
  blessing_recording: "blessing",
  studio_remote: "remote",
  podcast_audio: "podcast",
  podcast_audio_pack_4: "podcast",
  podcast_audio_pack_8: "podcast",
  mobile_podcast_at_home: "mobile",
  dj_premium: "dj",
  dj_yakir_personal: "dj",
  event_attraction_1: "attractions",
  event_attraction_2: "attractions",
  event_attraction_3: "attractions",
  event_attraction_4: "attractions",
  event_sound_rental: "sound",
};

/* פריטים שלא בקטגוריית addons ובכל זאת נמכרים רק על בסיס. הם מופיעים כשדרוג
   או כשורה בצירוף של הבסיס שלהם, ולא ככרטיס. פריטי addons לא מקבלים כרטיס
   בכלל, חוץ מ-STANDALONE_ADDON_IDS. בדיקה מוודאת שכל אחד מופיע איפשהו. */
const ADDON_ONLY_IDS = new Set<PriceItemId>([
  "studio_session_clip",
  "mobile_extra_channel",
  "podcast_extra_participant",
  "event_extra_activation",
  "express_delivery",
]);

/* בקטגוריית addons, אבל שירות שעומד לבד: "שירות נפרד משדרוג AI" (context בקטלוג) */
const STANDALONE_ADDON_IDS = new Set<PriceItemId>(["photo_colorization"]);

/**
 * פריטים שלא מוצגים בעמדה בכלל: לא כרטיס, לא שדרוג ולא שורה בצירוף.
 * כל שורה עם הסיבה, כדי שפריט לא ייעלם בשקט.
 */
export const SALES_IGNORED_IDS: Readonly<Partial<Record<PriceItemId, string>>> = {
  /* studio_extra_revision ירד מכאן: החלטת הבעלים D65, 7.10.2026 ענתה על השאלה
     הפתוחה, והוא שדרוג של הקלטת השיר (SALES_EXTRA_ADDON_LINKS) */
  online_extra_minutes: "תוספת לשירות אונליין, אין בקטלוג בסיס שמקושר אליה",
  /* online_extra_channels ו-online_extra_revision ירדו מכאן: מ-7.10.2026 הם
     תוספות של online_home_mix (החלטת הבעלים D73) */
  gift_box_usb: "תוספת למחיר הפקה, בלי בסיס מוגדר בקטלוג",
  gift_box_full: "תוספת למחיר הפקה, בלי בסיס מוגדר בקטלוג",
  studio_prep_digital: "חוברת הכנה, בלי בסיס מוגדר בקטלוג",
  singer_live_recording_promo: "מבצע הרגע האחרון שקיים רק בתוך אשף ההגברה (lib/data/cro/singer.ts)",
};

/**
 * שדרוגים שאין להם קישור ב-PRICING_ADDON_LINKS, ובכל זאת שייכים לבסיס ברור:
 * - הגברת זמר: אותן חמש תוספות כמו SINGER_ADDONS בעמוד ההגברה
 *   (lib/data/singer-amplification-page.ts), ושתי תוספות הנסיעה שלה (החלטת
 *   הבעלים D69, 7.10.2026).
 * - משתתף נוסף בשעת חדר: "מקליט נוסף באותו סשן בשעת חדר" (suitedFor בקטלוג).
 * - הקלטת שיר: סבב תיקונים נוסף (החלטת הבעלים D65, 7.10.2026) וחצי שעה נוספת
 *   כשהסשן עובר שעה (D66). רק בעמדה ולא ב-PRICING_ADDON_LINKS, כי משם נבנה גם
 *   הטופס באתר, ושם הלקוח לא בוחר מראש סבב שלישי או חריגה.
 * המחירים עצמם מהקטלוג, כאן רק השיוך.
 */
const SALES_EXTRA_ADDON_LINKS: Partial<Record<PriceItemId, readonly PriceItemId[]>> = (() => {
  const singer = [
    "singer_extra_mic",
    "singer_extra_monitor",
    "singer_remote_mix",
    "singer_live_recording",
    "singer_extra_hour",
    "singer_travel_north",
    "singer_travel_south",
  ] as const satisfies readonly PriceItemId[];
  const roomTime = ["studio_extra_participant"] as const satisfies readonly PriceItemId[];
  const song = ["studio_extra_revision", "studio_half_hour"] as const satisfies readonly PriceItemId[];
  return {
    singer_amp_basic: singer,
    singer_amp_premium: singer,
    singer_amp_vip: singer,
    studio_half_hour: roomTime,
    studio_hour: roomTime,
    song_recording: song,
  };
})();

/* שם השדרוג בכרטיס, כשהשם בקטלוג מתאר את הפריט כשירות בפני עצמו. חצי שעה
   באולפן בכרטיס השיר היא חריגה מהסשן (החלטת הבעלים D66, 7.10.2026) */
const SALES_ADDON_LABEL: Partial<Record<PriceItemId, Partial<Record<PriceItemId, string>>>> = {
  song_recording: { studio_half_hour: "חצי שעה נוספת, כשהסשן עובר שעה" },
};

/* קיבולת האולפן ליד טבלת המשתתפים (החלטת הבעלים D64, 7.10.2026) */
const PARTICIPANTS_NOTE_IDS = new Set<string>(["song_recording", "podcast_audio"]);

const CATALOG = PRICING_CATALOG as readonly PriceItem[];

function isCardItem(item: PriceItem): boolean {
  const id = item.id as PriceItemId;
  if (SALES_IGNORED_IDS[id] != null) return false;
  if (ADDON_ONLY_IDS.has(id)) return false;
  return item.category !== "addons" || STANDALONE_ADDON_IDS.has(id);
}

/* ─── מה כלול: פירוט אמיתי מול נוסח ברירת מחדל ─── */

/* כמו normalizeLine בקטלוג: "כולל X" ו"לא כולל X" נשמרים כ-X */
function normalizeScopeLine(text: string | undefined): string | null {
  const line = text?.trim();
  if (!line) return null;
  return line.replace(/^(לא כולל |כולל )/, "");
}

type TransparencyField = "included" | "excluded";

function scopeHead(item: PriceItem, field: TransparencyField): string | null {
  return normalizeScopeLine(field === "included" ? item.scope?.includes : item.scope?.excludes);
}

/** השורות שאחרי שורת ה-scope: הדריסה של הפריט, או נוסח ברירת המחדל של הקטגוריה */
function transparencyTail(item: PriceItem, field: TransparencyField): string[] {
  const lines = [...getPriceTransparencyById(item.id as PriceItemId)[field]];
  const head = scopeHead(item, field);
  return head != null && lines[0] === head ? lines.slice(1) : lines;
}

/*
 * נוסח ברירת המחדל של כל קטגוריה (PRICE_TRANSPARENCY_BY_CATEGORY) לא מיוצא
 * מהקטלוג, ולכן מזהים אותו כאן בלי להעתיק אותו: זו רשימת השורות שהכי הרבה
 * פריטים באותה קטגוריה חולקים, ולפחות שניים. דריסה של פריט היא כמעט תמיד
 * ייחודית לו. בקטגוריית addons ברירת המחדל היא שם התוספת עצמה (ADDON_LABEL_TOKEN
 * בקטלוג), ולכן שורה אחת ששווה לשם היא גם ברירת מחדל.
 */
const defaultTailCache = new Map<string, string | null>();

function categoryDefaultTail(category: string, field: TransparencyField): string | null {
  const cacheKey = `${category}:${field}`;
  if (defaultTailCache.has(cacheKey)) return defaultTailCache.get(cacheKey) ?? null;
  const counts = new Map<string, number>();
  for (const item of CATALOG) {
    if (item.category !== category) continue;
    const key = JSON.stringify(transparencyTail(item, field));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let best: string | null = null;
  let bestCount = 1;
  for (const [key, count] of counts) {
    if (count > bestCount) {
      best = key;
      bestCount = count;
    }
  }
  defaultTailCache.set(cacheKey, best);
  return best;
}

function isDefaultTail(item: PriceItem, field: TransparencyField, tail: readonly string[]): boolean {
  if (tail.length === 0) return true;
  if (tail.length === 1 && tail[0] === item.label.trim()) return true;
  return JSON.stringify(tail) === categoryDefaultTail(item.category, field);
}

/* ─── כפילויות בין שורת ה-scope לדריסה ─── */

const STOP_WORDS = new Set(["של", "על", "עם", "או", "את", "כל", "עד", "לפי", "גם", "בלי", "לא", "יש", "זה"]);
const DJ_WORD = /^(?:ו|ה|מה|ב)?(?:תקליטן|דיג׳יי|דיג'יי|דיג׳י|דיג'י|dj)$/;

function contentTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[(),.:;"״\-/+]/g, " ")
    .split(/\s+/)
    .map((word) => (DJ_WORD.test(word) ? "dj" : word.replace(/^ו(?=.{3,})/, "")))
    .filter((word) => word.length >= 2 && !STOP_WORDS.has(word));
}

/* "מהצוות" ו"הצוות", "ההקלטה" ו"להקלטה": אותה מילה עם אות שימוש לפניה */
function sameWord(a: string, b: string): boolean {
  if (a === b) return true;
  return Math.min(a.length, b.length) >= 3 && (a.endsWith(b) || b.endsWith(a));
}

/** כמה ממילות התוכן של השורה כבר מופיעות בשורות האחרות */
function coverage(line: string, others: readonly string[]): number {
  const words = contentTokens(line);
  if (words.length === 0) return 1;
  const pool = others.flatMap(contentTokens);
  return words.filter((w) => pool.some((p) => sameWord(w, p))).length / words.length;
}

/*
 * כשיש לפריט דריסה, שורת ה-scope חוזרת לפעמים על אותו דבר במילים אחרות
 * ("תקליטן מהצוות" מול "DJ מנוסה מהצוות"). אז מעדיפים את שורות הדריסה.
 * שורת scope שמוסיפה מידע ("הקלטה, מיקס ומאסטר" בשיר) נשארת ראשונה.
 */
const SCOPE_DUPLICATE_COVERAGE = 0.6;

export type SalesTransparency = { included: string[] | null; excluded: string[] | null };

function realLines(item: PriceItem, field: TransparencyField): string[] | null {
  const head = scopeHead(item, field);
  const tail = transparencyTail(item, field);
  if (isDefaultTail(item, field, tail)) return head != null ? [head] : null;
  if (head == null) return tail;
  return coverage(head, tail) >= SCOPE_DUPLICATE_COVERAGE ? tail : [head, ...tail];
}

/** מה כלול ומה לא, בלי נוסח ברירת המחדל של הקטגוריה. null: אין פירוט לפריט. */
export function getSalesTransparency(id: PriceItemId): SalesTransparency {
  const item = getPriceById(id);
  return { included: realLines(item, "included"), excluded: realLines(item, "excluded") };
}

/* ─── שורות, צירופים ומשתתפים ─── */

function line(id: PriceItemId, qty = 1): SalesLine {
  const item = getPriceById(id);
  return { id, label: item.label, qty, unitExVat: item.exVat };
}

function sumLines(lines: readonly SalesLine[]): number {
  /* מחיר לפני מע״מ יכול להיות לא שלם (שמירה קבועה בענן), ולכן מעגלים לאגורות */
  return Math.round(lines.reduce((sum, l) => sum + l.qty * l.unitExVat, 0) * 100) / 100;
}

const CATALOG_IDS = new Set<string>(CATALOG.map((item) => item.id));

/* מחיר התחלה: הדגל בקטלוג, או פירוט שמוגדר "from" (שחזור קול, למשל, מסומן רק
   בפירוט). אותו כלל לכרטיס, לשדרוג ולשורה בצירוף, כדי ש"מ-" לא ייעלם באחד מהם */
function isPriceFromId(id: string): boolean {
  if (!CATALOG_IDS.has(id)) return false;
  return getPriceFromById(id as PriceItemId) || getPriceTransparencyById(id as PriceItemId).pricingMode === "from";
}

/**
 * צירוף עם שורות למורנינג. הסכום לפני מע״מ מגיע מהעזר של השירות כשיש כזה
 * (calcSongOffer, blessingTotalExVat וכו׳), ובדיקה מוודאת שהוא שווה לסכום
 * השורות. המע״מ פעם אחת על הסכום. מחיר התחלה אם אחת השורות היא מחיר התחלה.
 */
function comboFromLines(key: string, label: string, lines: SalesLine[], totalExVat = sumLines(lines)): SalesCombo {
  const priceFrom = lines.some((l) => isPriceFromId(l.id));
  return { key, label, lines, totalExVat, totalInclVat: catalogWithVat(totalExVat), priceFrom };
}

function participantRow(count: number, totalExVat: number): SalesParticipantRow {
  return { count, totalExVat, totalInclVat: catalogWithVat(totalExVat) };
}

function range(from: number, to: number): number[] {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
}

function addonLabels(ids: readonly string[]): string {
  return ids.map((id) => `+ ${getPriceById(id as PriceItemId).label}`).join(" ");
}

/* שיר: הצירופים מהייצוא של הטופס (getSongOfferExport), רק אלה של שלוש התוספות
   הראשונות שבתוכנית, ועוד 4 זמרים עם תיקון זיופים */
const SONG_COMBO_ADDONS = new Set<string>([
  "song_pitch_coaching",
  "studio_session_clip_edited",
  "song_pre_session_interview",
]);

function songLines(addonIds: readonly string[], participants: number): SalesLine[] {
  const extra = participants - SONG_PARTICIPANT_RULES.included;
  return [
    line(SONG_OFFER_BASE_ID),
    ...(extra > 0 ? [line(SONG_PARTICIPANT_RULES.extraId, extra)] : []),
    ...addonIds.map((id) => line(id as PriceItemId)),
  ];
}

function songCombos(): SalesCombo[] {
  const fromExport = getSongOfferExport()
    .combinations.filter((c) => c.addonIds.length > 0 && c.addonIds.every((id) => SONG_COMBO_ADDONS.has(id)))
    .map((c) => comboFromLines(c.addonIds.join(","), addonLabels(c.addonIds), songLines(c.addonIds, 1), c.totalExVat));
  const groupSize = 4;
  const groupAddons = ["song_pitch_coaching"];
  const group = calcSongOffer(groupAddons, groupSize);
  return [
    ...fromExport,
    comboFromLines(
      `participants-${group.participants}+${groupAddons.join(",")}`,
      `${group.participants} משתתפים ${addonLabels(group.addonIds)}`,
      songLines(group.addonIds, group.participants),
      group.totalExVat,
    ),
  ];
}

function speakerLines(baseId: PriceItemId, speakers: number): SalesLine[] {
  const extra = speakers - BLESSING_PARTICIPANT_RULES.included;
  return [line(baseId), ...(extra > 0 ? [line(BLESSING_PARTICIPANT_RULES.extraId, extra)] : [])];
}

function blessingCombos(): SalesCombo[] {
  const family = 4;
  return [
    comboFromLines(`speakers-${family}`, `${family} דוברים`, speakerLines(BLESSING_BASE_ID, family), blessingTotalExVat(family)),
    comboFromLines(BLESSING_TEXT_REWRITE_ID, addonLabels([BLESSING_TEXT_REWRITE_ID]), [line(BLESSING_BASE_ID), line(BLESSING_TEXT_REWRITE_ID)]),
    comboFromLines("studio_pitch_correction", addonLabels(["studio_pitch_correction"]), [line(BLESSING_BASE_ID), line("studio_pitch_correction")]),
  ];
}

function remoteCombos(): SalesCombo[] {
  const pair = 2;
  return [
    comboFromLines(`speakers-${pair}`, `${pair} דוברים`, speakerLines(BLESSING_REMOTE_ID, pair), blessingTotalExVat(pair, BLESSING_REMOTE_ID)),
    comboFromLines("studio_pitch_correction", addonLabels(["studio_pitch_correction"]), [line(BLESSING_REMOTE_ID), line("studio_pitch_correction")]),
  ];
}

function podcastTotalExVat(participants: number): number {
  return getExVat("podcast_audio") + podcastParticipantsCostExVat(participants, false);
}

function podcastLines(participants: number): SalesLine[] {
  const extra = participants - PODCAST_PARTICIPANT_RULES.included;
  return [line("podcast_audio"), ...(extra > 0 ? [line(PODCAST_PARTICIPANT_RULES.extraId, extra)] : [])];
}

function podcastCombos(): SalesCombo[] {
  const sizes = [PODCAST_PARTICIPANT_RULES.included + 1, PODCAST_PARTICIPANT_RULES.included + 2];
  return [
    ...sizes.map((n) => comboFromLines(`participants-${n}`, `${n} משתתפים`, podcastLines(n), podcastTotalExVat(n))),
    ...PODCAST_AUDIO_PACK_IDS.map((id) => comboFromLines(id, getPriceById(id).label, [line(id)])),
  ];
}

/* אזורי ההגעה של האולפן הנייד (MOBILE_GEO_FEES) מול פריטי ההגעה בקטלוג. בדיקה
   מוודאת שסכום השורות שווה ל-calcMobileStudioAtHomeExVat בכל צירוף. */
const MOBILE_TRAVEL_ID: Record<Exclude<MobileGeoId, "center">, PriceItemId> = {
  north_south: "travel_north_south",
  eilat: "travel_eilat_golan",
};

function mobileLines(geo: MobileGeoId, people: number): SalesLine[] {
  const extra = people - MOBILE_STUDIO_CHANNEL_RULES.included;
  return [
    line(MOBILE_STUDIO_CHANNEL_RULES.arrivalId),
    ...(extra > 0 ? [line(MOBILE_STUDIO_CHANNEL_RULES.channelId, extra)] : []),
    ...(geo === "center" ? [] : [line(MOBILE_TRAVEL_ID[geo])]),
  ];
}

function mobileCombos(): SalesCombo[] {
  const cases: { geo: MobileGeoId; people: number }[] = [
    { geo: "center", people: 2 },
    { geo: "center", people: 4 },
    { geo: "north_south", people: 2 },
    { geo: "eilat", people: MOBILE_STUDIO_CHANNEL_RULES.included },
  ];
  return cases.map(({ geo, people }) => {
    const lines = mobileLines(geo, people);
    const area = geo === "center" ? "מרכז" : getPriceById(MOBILE_TRAVEL_ID[geo]).label;
    const who = people === 1 ? "אדם אחד" : `${people} אנשים`;
    return comboFromLines(`${geo}-${people}`, `${who}, ${area}`, lines, calcMobileStudioAtHomeExVat(geo, people));
  });
}

function djCombos(baseId: PriceItemId): SalesCombo[] {
  const travel = DJ_TRAVEL_FEE_IDS.map((id) => comboFromLines(id, getPriceById(id).label, [line(baseId), line(id)]));
  const center = comboFromLines("center", DJ_TRAVEL_CENTER_NOTE, [line(baseId)]);
  const yakir: PriceItemId = "dj_yakir_personal";
  const personal = baseId === yakir ? [] : [comboFromLines(yakir, getPriceById(yakir).label, [line(yakir)])];
  return [center, ...travel, ...personal];
}

const ATTRACTION_SINGLE_ID: PriceItemId = "event_attraction_1";

function attractionNames(type: "rigid" | "liquid"): string[] {
  return EVENT_BOOKING_ITEMS.filter((i) => i.pricingType === type).map((i) => i.name);
}

function attractionCombos(): SalesCombo[] {
  const bundles = CATALOG_BUNDLES.filter((b) => b.singleId === ATTRACTION_SINGLE_ID).map((b) =>
    comboFromLines(b.bundleId, getPriceById(b.bundleId).label, [line(b.bundleId)]),
  );
  /* זיקוקים וקונפטי: כל הפעלה נוספת היא event_extra_activation. האינדקס במערך הוא
     מספר ההפעלות הנוספות (act_1 בלי תוספת), ובדיקה מוודאת שהסכום שווה ל-addOnPrice */
  const rigidNames = attractionNames("rigid").join(" או ");
  const rigid = RIGID_ACTIVATION_OPTIONS.flatMap((opt, extra) =>
    extra === 0
      ? []
      : [
          comboFromLines(
            opt.key,
            `${rigidNames}, ${opt.shortLabel}`,
            [line(ATTRACTION_SINGLE_ID), line("event_extra_activation", extra)],
            getExVat(ATTRACTION_SINGLE_ID) + opt.addOnPrice,
          ),
        ],
  );
  /* עשן ובועות: מדרגות באחוזים ממחיר האטרקציה, בלי מזהה בקטלוג. שורה עם שם
     המדרגה והסכום שהאשף מחשב (LIQUID_FREQUENCY_OPTIONS) */
  const liquidNames = attractionNames("liquid").join(", ");
  const liquid = LIQUID_FREQUENCY_OPTIONS.filter((opt) => opt.addOnPrice > 0).map((opt) =>
    comboFromLines(opt.key, `${liquidNames}: ${opt.shortLabel}`, [
      line(ATTRACTION_SINGLE_ID),
      { id: `attraction_${opt.key}`, label: opt.label, qty: 1, unitExVat: opt.addOnPrice },
    ]),
  );
  return [...bundles, ...rigid, ...liquid];
}

function soundCombos(): SalesCombo[] {
  return [
    comboFromLines(ATTRACTION_SINGLE_ID, `+ ${getPriceById(ATTRACTION_SINGLE_ID).label}`, [
      line("event_sound_rental"),
      line(ATTRACTION_SINGLE_ID),
    ]),
  ];
}

/*
 * מחיר עם עריכה (withEditing בקטלוג): שעת אולפן, חצי שעה ושירות עצמי. זה לא
 * מזהה נפרד בקטלוג, ולכן בלי הצירוף הזה המחיר לא היה מופיע בעמדה בכלל. השורות
 * כמו בבונה המחיר באתר (studio-price-builder.ts): הבסיס, ועוד ההפרש לעריכה.
 */
function withEditingCombos(item: PriceItem): SalesCombo[] {
  const editing = item.withEditing;
  if (!editing) return [];
  const id = item.id as PriceItemId;
  const editingLine: SalesLine = {
    id: `${id}_with_editing`,
    label: editing.label,
    qty: 1,
    unitExVat: Math.round((editing.exVat - item.exVat) * 100) / 100,
  };
  return [comboFromLines("with_editing", editing.label, [line(id), editingLine], editing.exVat)];
}

function combosFor(item: PriceItem): SalesCombo[] {
  return [...serviceCombos(item.id as PriceItemId), ...withEditingCombos(item)];
}

function serviceCombos(id: PriceItemId): SalesCombo[] {
  switch (id) {
    case "song_recording":
      return songCombos();
    case "blessing_recording":
      return blessingCombos();
    case "studio_remote":
      return remoteCombos();
    case "podcast_audio":
      return podcastCombos();
    case "mobile_podcast_at_home":
      return mobileCombos();
    case "dj_premium":
    case "dj_yakir_personal":
      return djCombos(id);
    case "event_attraction_1":
      return attractionCombos();
    case "event_sound_rental":
      return soundCombos();
    default:
      return [];
  }
}

function participantsFor(id: PriceItemId): SalesParticipantRow[] | null {
  switch (id) {
    case "song_recording":
      return range(SONG_PARTICIPANT_RULES.included, SONG_PARTICIPANT_RULES.max).map((n) =>
        participantRow(n, calcSongOffer([], n).totalExVat),
      );
    case "blessing_recording":
    case "studio_remote":
      return range(BLESSING_PARTICIPANT_RULES.included, BLESSING_PARTICIPANT_RULES.max).map((n) =>
        participantRow(n, blessingTotalExVat(n, id)),
      );
    case "podcast_audio":
      return range(PODCAST_PARTICIPANT_RULES.included, PODCAST_PARTICIPANT_RULES.max).map((n) =>
        participantRow(n, podcastTotalExVat(n)),
      );
    case "mobile_podcast_at_home":
      return range(MOBILE_STUDIO_CHANNEL_RULES.included, MOBILE_STUDIO_CHANNEL_RULES.max).map((n) =>
        participantRow(n, calcMobileStudioAtHomeExVat("center", n)),
      );
    default:
      return null;
  }
}

/* ─── שדרוגים ─── */

function catalogAddon(id: PriceItemId): SalesAddon {
  const item = getPriceById(id);
  return {
    id,
    label: item.label,
    exVat: item.exVat,
    inclVat: catalogWithVat(item.exVat),
    ...(item.requires ? { requires: item.requires } : {}),
    catalogIds: [id],
    priceFrom: isPriceFromId(id),
  };
}

/* בקטלוג אין ל-DJ שדרוגים מקושרים. המחשבון באתר (DJ_CALC_ADDONS) הוא המקור. */
function djAddons(): SalesAddon[] {
  return DJ_CALC_ADDONS.map((option) => {
    const extras: readonly PriceItemId[] = "extraCatalogIds" in option ? option.extraCatalogIds : [];
    const catalogIds = [option.catalogId, ...extras];
    return {
      id: extras.length ? option.id : option.catalogId,
      label: option.name,
      exVat: option.priceExVat,
      inclVat: catalogWithVat(option.priceExVat),
      catalogIds,
      /* צילום פודקאסט באירוע בנוי על אולפן נייד, שהוא מחיר התחלה */
      priceFrom: catalogIds.some(isPriceFromId),
    };
  });
}

function addonsFor(id: PriceItemId): SalesAddon[] {
  if (id === "dj_premium" || id === "dj_yakir_personal") return djAddons();
  const linked = getAddonsForBaseId(id).map((item) => item.id as PriceItemId);
  const extra = SALES_EXTRA_ADDON_LINKS[id] ?? [];
  const labels = SALES_ADDON_LABEL[id] ?? {};
  return [...linked, ...extra.filter((x) => !linked.includes(x))].map((addonId) => {
    const addon = catalogAddon(addonId);
    const label = labels[addonId];
    return label ? { ...addon, label } : addon;
  });
}

/* ─── עמוד וקהל ─── */

let pagePathCache: Map<string, string> | null = null;

/** העמוד של הפריט מהמחירון (PRICING_HUB_SECTIONS). המופע הראשון קובע. */
function pagePathFor(id: string): string | null {
  if (!pagePathCache) {
    pagePathCache = new Map();
    for (const section of PRICING_HUB_SECTIONS) {
      for (const row of section.rows) {
        if (row.catalogId && !pagePathCache.has(row.catalogId)) {
          pagePathCache.set(row.catalogId, resolveRowHref(row, section.href));
        }
      }
    }
  }
  return pagePathCache.get(id) ?? null;
}

/* עסקים רואים לפני מע״מ קודם: קטגוריית pro בקטלוג, או פריט שהעמוד שלו תחת
   /business או /pro (getPriceAudience, החלטת הבעלים 2.10.2026) */
function audienceFor(item: PriceItem, pagePath: string | null): SalesAudience {
  if (getPriceAudience(item.category) === "business") return "business";
  return pagePath && getPriceAudience(pagePath) === "business" ? "business" : "consumer";
}

/* ─── חיפוש ─── */

const FAMILY_SEARCH_TERMS: Record<string, readonly string[]> = {
  song: ["שיר", "הקלטת שיר", "שירה", "זמר", "בר מצווה", "בת מצווה", "חתונה", "מתנה", "סבא", "סבתא"],
  blessing: ["ברכה", "דרשה", "בר מצווה", "בת מצווה", "סבא", "סבתא", "חתונה", "נאום"],
  remote: ["מרחוק", "וואטסאפ", "ברכה", "דרשה", "טלפון", "בר מצווה"],
  podcast: ["פודקאסט", "סבא", "סבתא", "ראיון", "פרק"],
  mobile: ["נייד", "אולפן נייד", "פודקאסט", "הגעה", "בית", "משרד"],
  dj: ["DJ", "דיג׳יי", "דיגיי", "תקליטן", "חתונה", "אירוע"],
  attractions: ["אטרקציה", "אטרקציות", "זיקוקים", "עשן", "בועות", "קונפטי", "אירוע", "חתונה"],
  sound: ["הגברה", "רמקולים", "סאונד", "השכרה", "אירוע"],
};

function searchTermsFor(item: PriceItem, family: string): string[] {
  const words = item.label
    .replace(/[(),.:;"״/+]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^-+|-+$/g, ""))
    .filter((w) => w.length >= 2);
  return Array.from(new Set([item.label, ...words, ...(FAMILY_SEARCH_TERMS[family] ?? [])]));
}

/* ─── הכרטיס ─── */

/*
 * יחידת החיוב ליד המחיר (scope.billingLabel בקטלוג). בלעדיה ריטיינר חודשי
 * נשלח ללקוח כמו מחיר חד-פעמי. "לחבילה" לא נכנס: שם החבילה כבר אומר את זה.
 */
export const BILLING_UNIT_BY_LABEL: Readonly<Record<string, string>> = {
  חודשי: "לחודש",
  ליום: "ליום",
  "לכל פרק": "לפרק",
};

/** "18,500 ₪ + מע״מ לחודש (21,830 ₪ כולל מע״מ)": המחיר לפי הקהל, עם היחידה אחרי המחיר הראשון */
function priceLineFor(item: PriceItem, priceFrom: boolean, audience: SalesAudience): string {
  const price = formatPrice(item.exVat, { from: priceFrom, audience });
  const unit = BILLING_UNIT_BY_LABEL[item.scope?.billingLabel ?? ""];
  return unit ? `${price.headline} ${unit} (${price.vatNote})` : price.inline;
}

function buildCard(item: PriceItem): SalesCard {
  const id = item.id as PriceItemId;
  const family = FAMILY_BY_ID[id] ?? item.category;
  const pagePath = pagePathFor(id);
  const audience = audienceFor(item, pagePath);
  const priceFrom = isPriceFromId(id);
  const { included, excluded } = getSalesTransparency(id);
  const draft: SalesCardDraft = {
    id,
    family,
    title: item.label,
    category: item.category,
    audience,
    priceFrom,
    exVat: item.exVat,
    inclVat: catalogWithVat(item.exVat),
    priceLine: priceLineFor(item, priceFrom, audience),
    included,
    excluded,
    addons: addonsFor(id),
    participants: participantsFor(id),
    participantsNote: PARTICIPANTS_NOTE_IDS.has(id) ? STUDIO_TURNS_NOTE : null,
    combos: combosFor(item),
    pageUrl: pagePath ? absoluteUrl(pagePath) : null,
    searchTerms: searchTermsFor(item, family),
    featured: (FEATURED_CARD_IDS as readonly string[]).includes(id),
    morningLines: [line(id)],
  };
  return {
    ...draft,
    message: buildCardMessage(draft),
    confirmLine: buildCardConfirmLine(draft),
    agreedLine: buildCardAgreedLine(draft),
  };
}

/* ─── hash של הקטלוג, כמו scripts/export-pricing.ts ─── */

/* אותם שדות ובאותו סדר כמו ExportedItem ב-export-pricing.ts, אחרת ה-hash שונה */
function catalogHashPayload(): string {
  const items = CATALOG.map((p) => {
    const row: Record<string, string | number | boolean> = {
      id: p.id,
      label: p.label,
      category: p.category,
      exVat: p.exVat,
      inclVat: catalogWithVat(p.exVat),
      priceFrom: p.priceFrom === true,
    };
    if (p.context) row.context = p.context;
    if (p.suitedFor) row.suitedFor = p.suitedFor;
    if (p.withEditing) {
      row.withEditingExVat = p.withEditing.exVat;
      row.withEditingInclVat = catalogWithVat(p.withEditing.exVat);
    }
    return row;
  });
  return JSON.stringify({ vatRate: CATALOG_VAT_RATE, items });
}

const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(x: number, n: number): number {
  return (x >>> n) | (x << (32 - n));
}

/** SHA-256 של מחרוזת UTF-8, hex. בלי node:crypto, כדי שירוץ גם בדפדפן. */
export function sha256Hex(text: string): string {
  const bytes = new TextEncoder().encode(text);
  const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  const bitLength = bytes.length * 8;
  view.setUint32(padded.length - 8, Math.floor(bitLength / 0x100000000));
  view.setUint32(padded.length - 4, bitLength >>> 0);
  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const w = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i += 1) w[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i += 1) {
      const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + SHA256_K[i] + w[i]) >>> 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
    h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0;
    h[7] = (h[7] + hh) >>> 0;
  }
  return Array.from(h, (x) => x.toString(16).padStart(8, "0")).join("");
}

/** אותו contentHash כמו ב-docs/pricing-export.json */
export function catalogContentHash(): string {
  return sha256Hex(catalogHashPayload()).slice(0, 16);
}

/* ─── הספר ─── */

let bookCache: SalesBook | null = null;

/** כל הכרטיסים: שמונת הנפוצים קודם, לפי הסדר, ואחריהם השאר בסדר הקטלוג */
export function buildSalesBook(): SalesBook {
  if (bookCache) return bookCache;
  const cards = CATALOG.filter(isCardItem).map(buildCard);
  const rank = (card: SalesCard) => {
    const i = (FEATURED_CARD_IDS as readonly string[]).indexOf(card.id);
    return i === -1 ? FEATURED_CARD_IDS.length : i;
  };
  const ordered = cards
    .map((card, index) => ({ card, index }))
    .sort((a, b) => rank(a.card) - rank(b.card) || a.index - b.index)
    .map(({ card }) => card);
  bookCache = { cards: ordered, contentHash: catalogContentHash(), itemCount: CATALOG.length };
  return bookCache;
}

/** כרטיס לפי מזהה קטלוג, או null אם אין לו כרטיס */
export function getSalesCard(id: string): SalesCard | null {
  return buildSalesBook().cards.find((card) => card.id === id) ?? null;
}
