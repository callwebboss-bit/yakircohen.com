/**
 * "ההצעות האחרונות" בעמדת המכירות (החלטת הבעלים 12.10.2026): 20 ההצעות
 * האחרונות שיקיר העתיק עם בחירה במחשבון, כדי לפתוח שוב את אותה בחירה.
 *
 * נשמר רק מה שצריך כדי לבנות את ההצעה מחדש: מזהה הכרטיס, הבחירה, הסכום כולל
 * מע״מ ביום ההעתקה, קוד הפנייה והזמן. בלי שם ובלי טלפון. הסכום נשמר רק כדי
 * לדעת אם המחיר זז; הפתיחה מחדש תמיד מחשבת במחירי היום.
 *
 * כאן רק לוגיקה טהורה (בדיקה, הוספה, תמחור מחדש). הקריאה והכתיבה ל-localStorage
 * ב-SalesDesk.tsx, כמו "שלח שוב".
 */
import type { SalesCard } from "@/lib/sales/sales-book";
import { buildSelectionQuote, type SelectionInput, type SelectionRegion } from "@/lib/sales/selection-quote";

export const RECENT_QUOTES_KEY = "yc:admin-sales:quotes:v1";
export const RECENT_QUOTES_MAX = 20;

export type RecentQuoteSelection = {
  addonIds: string[];
  participants: number | null;
  region: SelectionRegion | null;
  attractionsCount: number | null;
  activations: number | null;
};

export type RecentQuote = {
  cardId: string;
  selection: RecentQuoteSelection;
  /** הסכום כולל מע״מ ביום ההעתקה */
  totalInclVat: number;
  /** "YC-A7K2" מההדבקה, או null */
  leadCode: string | null;
  /** ISO */
  savedAt: string;
};

const REGIONS: readonly SelectionRegion[] = ["center", "north_south", "eilat", "north", "south"];
const LEAD_CODE_RE = /^YC-[A-Z0-9]{4}$/;

const intOrNull = (v: unknown): v is number | null => v === null || (typeof v === "number" && Number.isInteger(v));

function isSelection(value: unknown): value is RecentQuoteSelection {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.addonIds) &&
    v.addonIds.every((id) => typeof id === "string") &&
    intOrNull(v.participants) &&
    (v.region === null || REGIONS.includes(v.region as SelectionRegion)) &&
    intOrNull(v.attractionsCount) &&
    intOrNull(v.activations)
  );
}

/** רשומה תקינה מ-localStorage. כל דבר אחר (גם שדה שם או טלפון שנוסף ביד) לא עובר כמו שהוא */
export function isRecentQuote(value: unknown): value is RecentQuote {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.cardId === "string" &&
    v.cardId.length > 0 &&
    isSelection(v.selection) &&
    typeof v.totalInclVat === "number" &&
    Number.isFinite(v.totalInclVat) &&
    (v.leadCode === null || (typeof v.leadCode === "string" && LEAD_CODE_RE.test(v.leadCode))) &&
    typeof v.savedAt === "string" &&
    !Number.isNaN(new Date(v.savedAt).getTime())
  );
}

/** רק השדות המותרים, גם אם הגיע אובייקט עם יותר */
function pick(entry: RecentQuote): RecentQuote {
  const s = entry.selection;
  return {
    cardId: entry.cardId,
    selection: {
      addonIds: [...s.addonIds],
      participants: s.participants,
      region: s.region,
      attractionsCount: s.attractionsCount,
      activations: s.activations,
    },
    totalInclVat: entry.totalInclVat,
    leadCode: entry.leadCode && LEAD_CODE_RE.test(entry.leadCode) ? entry.leadCode : null,
    savedAt: entry.savedAt,
  };
}

/** קריאה בטוחה של הרשימה השמורה: רק רשומות תקינות, עד 20 */
export function parseRecentQuotes(raw: string | null): RecentQuote[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isRecentQuote).map(pick).slice(0, RECENT_QUOTES_MAX) : [];
  } catch {
    return [];
  }
}

function sameQuote(a: RecentQuote, b: RecentQuote): boolean {
  return a.cardId === b.cardId && a.leadCode === b.leadCode && JSON.stringify(a.selection) === JSON.stringify(b.selection);
}

/** הרשומה החדשה בראש. אותה בחירה לאותו כרטיס ואותו קוד לא נכפלת, רק עולה למעלה */
export function addRecentQuote(list: readonly RecentQuote[], entry: RecentQuote): RecentQuote[] {
  const clean = pick(entry);
  return [clean, ...list.filter((e) => !sameQuote(e, clean))].slice(0, RECENT_QUOTES_MAX);
}

/** הבחירה מהמחשבון בצורה שנשמרת */
export function toRecentSelection(selection: SelectionInput): RecentQuoteSelection {
  return {
    addonIds: [...selection.addonIds],
    participants: selection.participants ?? null,
    region: selection.region ?? null,
    attractionsCount: selection.attractionsCount ?? null,
    activations: selection.activations ?? null,
  };
}

export type RepricedQuote = {
  preset: Partial<SelectionInput>;
  todayInclVat: number;
  /** המחיר היום שונה מהסכום ששמור בהצעה */
  priceChanged: boolean;
};

/** פתיחה מחדש: אותה בחירה, במחירי היום (אותו buildSelectionQuote כמו המחשבון) */
export function repriceRecentQuote(entry: RecentQuote, card: SalesCard): RepricedQuote {
  const s = entry.selection;
  const preset: Partial<SelectionInput> = {
    addonIds: s.addonIds,
    ...(s.participants != null ? { participants: s.participants } : {}),
    ...(s.region != null ? { region: s.region } : {}),
    ...(s.attractionsCount != null ? { attractionsCount: s.attractionsCount } : {}),
    ...(s.activations != null ? { activations: s.activations } : {}),
  };
  const todayInclVat = buildSelectionQuote(card, preset as SelectionInput).totalInclVat;
  return { preset, todayInclVat, priceChanged: todayInclVat !== entry.totalInclVat };
}
