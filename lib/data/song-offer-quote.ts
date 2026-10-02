/**
 * הצד הקל של הצעת השיר, בלי הקטלוג. נטען בדפדפן.
 *
 * הטופס (components/pricing/SongOfferConfigurator.tsx) מקבל מהשרת את כל
 * השילובים המחושבים מראש (getSongOfferQuotes ב-song-offer.ts), ולכן בדפדפן
 * נשארים רק חיפוש לפי מפתח, ניקוי בחירה לפי נתוני ה-view, ובניית בקשת
 * השיחה החוזרת. כך הטופס לא תלוי בקטלוג ולא מחשב מחיר בעצמו.
 */
import type { LeadEmailPayload } from "@/lib/lead-email-notify";
import type { SongAddonId } from "@/lib/data/song-offer-aliases";
import { sanitizeLeadText } from "@/lib/form-validation";

export const SONG_OFFER_CALLBACK_FORM_ID = "song_offer_callback";
export const SONG_OFFER_SECTION_ID = "song-offer";

export type SongPriceLine = {
  id: string;
  label: string;
  exVat: number;
  withVat: number;
};

/** מה שצריך לשורות "מה בחרתי" ולסכום */
export type SongOfferTotals = {
  lines: readonly SongPriceLine[];
  totalExVat: number;
  totalWithVat: number;
};

/** שילוב אחד מחושב מראש בשרת. נתונים פשוטים בלבד, כדי לעבור כ-props. */
export type SongOfferQuote = SongOfferTotals & {
  addonIds: SongAddonId[];
  /** "1,829 ₪ כולל מע״מ (1,550 ₪ + מע״מ)" */
  totalLine: string;
  /** ההודעה ללקוח בלי התג */
  messageText: string;
  ycTag: string;
  /** קישור wa.me מוכן */
  waHref: string;
  /** קישור חזרה לטופס עם הבחירה */
  offerHref: string;
};

/** מפתח קבוע לשילוב. הבחירה כבר מנורמלת, ולכן הסדר הוא סדר הקטלוג. */
export function songAddonKey(ids: readonly string[]): string {
  return ids.length ? ids.join(",") : "base";
}

export type SongAddonRule = { id: SongAddonId; requires: SongAddonId | null };

/**
 * ניקוי בחירה לפי רשימת התוספות שהשרת שלח (באותו סדר כמו normalizeSongAddons
 * ב-song-offer.ts): מתעלם ממזהים לא מוכרים, שומר על סדר הקטלוג, ומוריד
 * תוספת שהתנאי שלה לא נבחר. לא מוסיף תוספת בשקט.
 */
export function normalizeSongSelection(
  ids: readonly string[],
  rules: readonly SongAddonRule[],
): SongAddonId[] {
  const picked = new Set(ids);
  const ordered = rules.filter((rule) => picked.has(rule.id));
  const chosen = new Set(ordered.map((rule) => rule.id));
  return ordered
    .filter((rule) => rule.requires == null || chosen.has(rule.requires))
    .map((rule) => rule.id);
}

export function nis(amount: number): string {
  return `${amount.toLocaleString("he-IL")} ₪`;
}

/** "1,829 ₪ כולל מע״מ (1,550 ₪ + מע״מ)" */
export function formatSongTotalLine(totals: Pick<SongOfferTotals, "totalExVat" | "totalWithVat">): string {
  return `${nis(totals.totalWithVat)} כולל מע״מ (${nis(totals.totalExVat)} + מע״מ)`;
}

/** שורות "מה בחרתי" עם מחיר כולל מע״מ לכל שורה, והסכום */
export function songSelectionLines(totals: SongOfferTotals): string[] {
  return [
    "מה בחרתי:",
    ...totals.lines.map((line) => `• ${line.label} - ${nis(line.withVat)}`),
    `סה״כ: ${formatSongTotalLine(totals)}`,
  ];
}

export type SongCallbackContact = {
  name: string;
  /** טלפון שכבר עבר validateIsraeliMobile */
  phone: string;
  source: string;
  giftMode?: boolean;
  /** מזהה שליחה קבוע לכל הצגה של הטופס, כדי שניסיון חוזר לא ייצור ליד כפול */
  submissionId: string;
  /** שדה ה-honeypot כפי שהוא, ריק אצל בני אדם */
  honeypot?: string;
};

/**
 * בקשת "תתקשרו אליי" בחוזה השליחה של שלב 1 (submitLeadToServer), משילוב
 * שכבר חושב. הגוף הוא אותן שורות של הודעת הוואטסאפ, כדי שהבעלים יראה בדיוק
 * מה הלקוח בחר. השרת לא מחשב מחדש את הסכום, ולכן הוא נכנס גם ל-pricingRef
 * לפני מע״מ.
 */
export function buildSongCallbackPayload(
  quote: Pick<SongOfferQuote, "lines" | "totalExVat" | "totalWithVat" | "ycTag" | "offerHref">,
  input: SongCallbackContact,
): LeadEmailPayload {
  const name = sanitizeLeadText(input.name, 60);
  const phone = sanitizeLeadText(input.phone, 20);
  const body = [
    "בקשה לשיחה חוזרת מטופס הקלטת השיר",
    `שם: ${name}`,
    `טלפון: ${phone}`,
    ...(input.giftMode ? ["שיר במתנה"] : []),
    "",
    ...songSelectionLines(quote),
    "",
    `מקור: ${input.source}`,
    quote.ycTag,
  ].join("\n");
  return {
    formId: SONG_OFFER_CALLBACK_FORM_ID,
    subject: `[יקיר כהן] שיחה חוזרת: הקלטת שיר, ${nis(quote.totalWithVat)} כולל מע״מ`,
    body,
    name,
    phone,
    website_verification: input.honeypot ?? "",
    submissionId: input.submissionId,
    serviceType: "studio",
    pricingRef: {
      sectionId: SONG_OFFER_SECTION_ID,
      label: quote.lines.map((line) => line.label).join(" + "),
      exVat: quote.totalExVat,
      href: quote.offerHref,
    },
  };
}
