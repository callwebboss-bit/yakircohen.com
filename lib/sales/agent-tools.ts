/**
 * שכבת הכלים של סוכן המכירות (החלטת הבעלים 12.10.2026, סוכן מכירות).
 *
 * שתי דרכים לדבר עם סוכן: תיבת צ׳אט ב-/admin/sales ופקודת /sales במק. בשתיהן
 * המודל לא יודע אף מחיר. הוא קורא לשלושה כלים, וכל מספר מגיע מהם: מספר
 * המכירות (buildSalesBook) והמחשבון (buildSelectionQuote), אותו מנוע של עמדת
 * המכירות ושל האתר. אין כאן אף מחיר כתוב.
 *
 * מודול טהור בלי React ובלי ה-AI SDK, כדי שהבדיקות, ה-CLI והשרת ישתמשו בו.
 */
import { buildSalesBook, getSalesCard, type SalesCard } from "@/lib/sales/sales-book";
import { matchPaste, normalizeSearch } from "@/lib/sales/paste-match";
import {
  buildSelectionQuote,
  selectionOptions,
  type SelectionInput,
  type SelectionQuote,
  type SelectionRegion,
} from "@/lib/sales/selection-quote";

/* ─── פרטים אישיים ─── */

/* טלפון: 9 ספרות ומעלה עם מקפים, רווחים, סוגריים או +972. אותו רף כמו בעמדה (SalesDesk) */
const PHONE_RE = /\+?\(?\d(?:[\s\-().]?\d){8,}/g;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/** מוחק טלפונים ומיילים לפני שהטקסט יוצא למודל. החלטת הבעלים 12.10.2026, סוכן מכירות */
export function stripContactInfo(text: string): string {
  return text
    .replace(EMAIL_RE, "[מייל הוסר]")
    .replace(PHONE_RE, "[טלפון הוסר]")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/* ─── כללי הכתיבה ─── */

/** בלי סימן קריאה, מקף ארוך או בינוני, שלוש נקודות בתו אחד ומירכאות מסולסלות */
export function cleanAgentCopy(text: string): string {
  return text
    .replace(/[\u2014\u2013]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/!/g, "");
}

/* ─── שגיאה של כלי ─── */

export class SalesToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SalesToolError";
  }
}

function requireCard(id: string): SalesCard {
  const card = getSalesCard(String(id ?? "").trim());
  if (!card) {
    throw new SalesToolError(`אין שירות במחירון עם המזהה "${id}". מחפשים קודם עם search_services.`);
  }
  return card;
}

/* ─── אזורים ─── */

/** השמות שה-CLI והמודל מקבלים. eilat_golan הוא eilat של המנוע */
export const REGION_INPUTS = ["center", "north_south", "eilat_golan", "eilat", "north", "south"] as const;
export type RegionInput = (typeof REGION_INPUTS)[number];

export function toEngineRegion(region: string | null | undefined): SelectionRegion | null {
  if (!region) return null;
  if (region === "eilat_golan") return "eilat";
  return (["center", "north_south", "eilat", "north", "south"] as const).find((r) => r === region) ?? null;
}

/* ─── search_services ─── */

export type ServiceHit = { id: string; title: string; priceLine: string; category: string };

/* מילה בעברית עם אות שימוש בהתחלה ("השיר", "לחתונה") נבדקת גם בלעדיה */
function wordVariants(word: string): string[] {
  const out = [word];
  if (word.length > 3 && /^[הולבמש]/.test(word)) out.push(word.slice(1));
  return out;
}

/** חיפוש לפי מילים מול שם, קטגוריה ומילות החיפוש של הכרטיס. הכי הרבה מילים תואמות קודם */
export function searchServices(query: string, limit = 8): ServiceHit[] {
  const words = normalizeSearch(stripContactInfo(String(query ?? "")))
    .split(" ")
    .filter((w) => w.length >= 2);
  if (words.length === 0) return [];
  const scored = buildSalesBook()
    .cards.map((card, index) => {
      const hay = normalizeSearch([card.title, card.category, card.family, ...card.searchTerms].join(" "));
      const title = normalizeSearch(card.title);
      let score = 0;
      for (const word of words) {
        const variants = wordVariants(word);
        if (variants.some((v) => title.includes(v))) score += 2;
        else if (variants.some((v) => hay.includes(v))) score += 1;
      }
      return { card, index, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);
  return scored.slice(0, Math.max(1, Math.min(limit, 20))).map(({ card }) => ({
    id: card.id,
    title: card.title,
    priceLine: card.priceLine,
    category: card.category,
  }));
}

/* ─── get_service ─── */

export type ServiceDetails = {
  id: string;
  title: string;
  audience: SalesCard["audience"];
  priceLine: string;
  priceFrom: boolean;
  included: string[] | null;
  excluded: string[] | null;
  addons: { id: string; label: string; priceLine: string; requires: string | null }[];
  participants: { min: number; max: number; included: number; noun: string } | null;
  participantsNote: string | null;
  regions: { id: string; label: string }[] | null;
  attractions: { min: number; max: number; initial: number; activationsPerAttraction: number | null } | null;
  confirmLine: string | null;
  pageUrl: string | null;
};

function addonPriceLine(card: SalesCard, exVat: number, inclVat: number, from: boolean): string {
  const prefix = from ? "מ-" : "";
  const fmt = (n: number) => n.toLocaleString("he-IL");
  return card.audience === "business"
    ? `${prefix}${fmt(exVat)} ₪ + מע״מ`
    : `${prefix}${fmt(inclVat)} ₪ כולל מע״מ`;
}

/** הכרטיס המלא: מה כלול, מה לא, שדרוגים, משתתפים, אזורים ו"רק לוודא" */
export function getServiceDetails(id: string): ServiceDetails {
  const card = requireCard(id);
  const options = selectionOptions(card);
  return {
    id: card.id,
    title: card.title,
    audience: card.audience,
    priceLine: card.priceLine,
    priceFrom: card.priceFrom,
    included: card.included,
    excluded: card.excluded,
    addons: options.addons.map((a) => ({
      id: a.id,
      label: a.label,
      priceLine: addonPriceLine(card, a.exVat, a.inclVat, a.priceFrom),
      requires: a.requires ?? null,
    })),
    participants: options.participants
      ? {
          min: options.participants.min,
          max: options.participants.max,
          included: options.participants.included,
          noun: options.participants.noun,
        }
      : null,
    participantsNote: card.participantsNote,
    regions: options.regions
      ? options.regions.map((r) => ({ id: r.id === "eilat" ? "eilat_golan" : r.id, label: r.label }))
      : null,
    attractions: options.attractions
      ? { ...options.attractions, activationsPerAttraction: options.activationsPerAttraction }
      : null,
    confirmLine: card.confirmLine,
    pageUrl: card.pageUrl,
  };
}

/* ─── quote ─── */

export type QuoteToolInput = {
  id: string;
  addonIds?: readonly string[] | null;
  participants?: number | null;
  region?: string | null;
  attractionsCount?: number | null;
  activations?: number | null;
};

export type QuoteToolResult = Pick<
  SelectionQuote,
  | "lines"
  | "morningInclLines"
  | "totalExVat"
  | "totalInclVat"
  | "priceFrom"
  | "priceLine"
  | "message"
  | "confirmLine"
  | "warnings"
  | "addonIds"
  | "participants"
  | "region"
  | "attractionsCount"
  | "activations"
> & {
  id: string;
  title: string;
  audience: SalesCard["audience"];
  /** 8 התווים הראשונים של ה-hash של המחירון, כמו בכותרת של /admin/sales */
  priceHash: string;
  /** הבחירה במבנה של המחשבון, לכפתור "פתח במחשבון" */
  selection: Required<SelectionInput>;
};

export const PRICE_HASH_LENGTH = 8;

export function priceHash(): string {
  return buildSalesBook().contentHash.slice(0, PRICE_HASH_LENGTH);
}

/** המחיר לצירוף: buildSelectionQuote כמו שהוא. מזהה שירות או שדרוג לא מוכר נדחה */
export function quoteService(input: QuoteToolInput): QuoteToolResult {
  const card = requireCard(input.id);
  const options = selectionOptions(card);
  const addonIds = [...new Set((input.addonIds ?? []).map((a) => String(a).trim()).filter(Boolean))];
  const unknown = addonIds.filter((a) => !options.addons.some((o) => o.id === a));
  if (unknown.length) {
    throw new SalesToolError(
      `שדרוגים שלא קיימים לשירות ${card.id}: ${unknown.join(", ")}. המזהים מגיעים מ-get_service.`,
    );
  }
  if (input.region && !toEngineRegion(input.region)) {
    throw new SalesToolError(`אזור לא מוכר: ${input.region}. אפשר: ${REGION_INPUTS.join(", ")}.`);
  }
  const q = buildSelectionQuote(card, {
    addonIds,
    participants: input.participants ?? null,
    region: toEngineRegion(input.region),
    attractionsCount: input.attractionsCount ?? null,
    activations: input.activations ?? null,
  });
  return {
    id: card.id,
    title: card.title,
    audience: card.audience,
    lines: q.lines,
    morningInclLines: q.morningInclLines,
    totalExVat: q.totalExVat,
    totalInclVat: q.totalInclVat,
    priceFrom: q.priceFrom,
    priceLine: q.priceLine,
    message: q.message,
    confirmLine: q.confirmLine,
    warnings: q.warnings,
    addonIds: q.addonIds,
    participants: q.participants,
    region: q.region,
    attractionsCount: q.attractionsCount,
    activations: q.activations,
    priceHash: priceHash(),
    selection: {
      addonIds: q.addonIds,
      participants: q.participants,
      region: q.region,
      attractionsCount: q.attractionsCount,
      activations: q.activations,
    },
  };
}

/* ─── הדבקה ─── */

export type PasteToolResult = {
  match: { id: string; title: string; via: string; addonIds: string[]; participants: number | null } | null;
  code: string | null;
  quote: QuoteToolResult | null;
};

/** הודעה של לקוח: הכרטיס שזוהה (paste-match) והצעה עם הבחירה שזוהתה */
export function pasteToQuote(text: string): PasteToolResult {
  const { match, code } = matchPaste(text, buildSalesBook().cards);
  if (!match) return { match: null, code, quote: null };
  return {
    match: {
      id: match.card.id,
      title: match.card.title,
      via: match.via,
      addonIds: match.addonIds,
      participants: match.participants,
    },
    code,
    quote: quoteService({ id: match.card.id, addonIds: match.addonIds, participants: match.participants }),
  };
}

/* ─── בדיקת מספרים ─── */

/* מספרים בטקסט: "2,063", "1748", "234.50". ספרה בודדת (כמו "3 משתתפים") לא נבדקת */
function numbersIn(text: string): number[] {
  return (text.match(/\d[\d,]*(?:\.\d+)?/g) ?? [])
    .map((n) => Number(n.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n) && n >= 10);
}

/**
 * מספרים בתשובת המודל שלא הופיעו באף פלט של כלי ולא בהודעת המשתמש. רשת ביטחון
 * לכלל "אף מספר לא מומצא": התשובה מסומנת ליקיר, לא נחסמת.
 */
export function unverifiedNumbers(reply: string, sources: readonly string[]): number[] {
  const known = new Set(sources.flatMap(numbersIn));
  return [...new Set(numbersIn(reply).filter((n) => !known.has(n)))];
}

/* ─── ההנחיות למודל ─── */

/** החוק המרכזי, גם בבדיקות */
export const NO_INVENTED_NUMBERS_RULE =
  "כל מחיר, סכום או מספר כסף בתשובה מגיע רק מפלט של כלי שהופעל בתור הזה. אסור להמציא, להעריך, לעגל או לחשב מחיר בעצמך.";

export function buildSalesAgentSystemPrompt(hash = priceHash()): string {
  return [
    "אתה סוכן המכירות של יקיר כהן, אולפן הקלטות ושירותי אירועים. אתה עוזר ליקיר לענות ללקוח בוואטסאפ.",
    "",
    "חוקים:",
    `1. ${NO_INVENTED_NUMBERS_RULE}`,
    "2. מחפשים שירות עם search_services, קוראים פרטים עם get_service, ומחשבים עם quote. כל שדרוג, אזור או מספר משתתפים נכנס לסכום רק דרך quote.",
    "3. אם הבקשה לא במחירון, אומרים את זה ולא נותנים מחיר.",
    "4. חסר מידע: לכל היותר שאלה אחת, ובאותה תשובה כותבים מה ההנחה (למשל 'הנחתי מרכז ומשתתף אחד') ונותנים מחיר לפיה.",
    "5. כותבים בקול של יקיר: חם, ישיר, ישראלי, משפטים קצרים, בלי חנופה ובלי שיווק מנופח.",
    "6. כללי כתיבה: בלי סימן קריאה, בלי מקף ארוך או בינוני (רק מקף רגיל), בלי תו שלוש נקודות, בלי מירכאות מסולסלות.",
    "7. לא כותבים טלפון, מייל או פרטים אישיים של לקוח.",
    "",
    "מבנה התשובה כשיש מחיר, בדיוק עם שלוש הכותרות האלה בשורה משלהן:",
    "[הודעה]",
    "הודעת וואטסאפ קצרה ומוכנה ללקוח. בונים אותה מ-message של quote, מתאימים קלות לשאלה של הלקוח, ושומרים כל מספר בדיוק כמו שהוא.",
    "[רק לוודא]",
    "שורה אחת שמתחילה ב'רק לוודא:' (מ-confirmLine אם יש), שאלה של כן או לא.",
    "[פנימי]",
    `שורה אחת: המזהים · סה״כ · מחירון ${hash}. למשל: song_recording+song_pitch_coaching · סה״כ <totalInclVat מ-quote> ₪ · מחירון ${hash}`,
    "",
    "לפני הכותרות מותר משפט אחד ליקיר (הנחה או אזהרה מ-warnings). בלי מחיר אין צורך בכותרות.",
  ].join("\n");
}
