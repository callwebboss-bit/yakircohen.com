/**
 * אישור הזמנה ושובר מתנה (תוכנית עמדת המכירות, סעיף 4): הנתונים שהציור בדפדפן
 * הופך לתמונה לוואטסאפ ול-PDF.
 *
 * שני שמות, כי "שובר" באתר הוא שובר מתנה (shop-vouchers.ts): "אישור הזמנה"
 * להזמנה רגילה, ו"שובר מתנה" למתנה. אישור הזמנה נשלח פעמיים באותו קוד: אחרי
 * ה"כן" (ממתין למקדמה), ואחרי המקדמה (המועד שוריין).
 *
 * בלי מחיר בשום שדה (החלטת הבעלים 6.10.2026). קבלה וחשבונית יוצאות רק ממורנינג,
 * ולכן כל מסמך אומר שהוא לא חשבונית ולא קבלה. גם בלי טלפון של הלקוח ובלי כתובת
 * רחוב: את הכתובת שולחים בוואטסאפ אחרי תיאום (STUDIO_ADDRESS_COORDINATION_NOTE).
 * טקסט חופשי שיקיר מקליד עובר ניקוי מסכומים ומטלפונים, כדי שמחיר או מספר של
 * לקוח לא ייכנסו דרכו בטעות.
 *
 * כל טקסט קבוע מיובא מהמקור שלו באתר ולא מועתק: ביטול, חניה, מה להביא, הטלפון
 * והכתובת של האתר.
 */
import {
  CONTACT_PHONE_DISPLAY,
  STUDIO_PARKING_NOTE,
  type LegalPageHref,
} from "@/lib/constants";
import { CANCELLATION_SUMMARY } from "@/lib/data/home-faq";
import { STUDIO_ARRIVE_EARLY_NOTE, STUDIO_BRING_NOTE } from "@/lib/data/faq-central";
import {
  BLESSING_PARTICIPANT_RULES,
  MOBILE_STUDIO_CHANNEL_RULES,
  PODCAST_PARTICIPANT_RULES,
  SONG_PARTICIPANT_RULES,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { SITE_URL } from "@/lib/site-url";
import {
  getSalesCard,
  getSalesTransparency,
  type SalesAddon,
  type SalesCard,
} from "@/lib/sales/sales-book";

export type VoucherKind = "order" | "gift";
export type VoucherStatus = "awaiting_deposit" | "date_held";
export type VoucherInput = {
  kind: VoucherKind;
  cardId: string;
  addonIds: string[];
  participants?: number;
  firstName?: string;
  dateText?: string;
  timeText?: string;
  status?: VoucherStatus;
  /** מה שסוכם בכתב, אחרי "רק לוודא". נכנס עם "סיכמנו: " */
  agreed?: string;
  giftTo?: string;
  giftFrom?: string;
  giftTitle?: string;
  /** קוד קיים (הנפקה שנייה אחרי מקדמה, או קוד מהודעה שהודבקה). בלי קוד תקין נוצר חדש */
  code?: string;
  issuedAt: Date;
};
export type VoucherData = {
  kind: VoucherKind;
  code: string;
  issuedText: string;
  title: string;
  statusLabel: string | null;
  greeting: string | null;
  serviceTitle: string;
  included: string[];
  agreed: string | null;
  /** "מתי:" לשירות שקורה במקום, "מסירה:" לשירות שנמסר בקובץ. null בשובר מתנה */
  whenLabel: string | null;
  when: string | null;
  where: string | null;
  bring: string | null;
  parking: string | null;
  cancellation: string;
  termsUrl: string;
  validUntilText: string | null;
  redemption: string | null;
  giftTo: string | null;
  giftFrom: string | null;
  disclaimer: string;
  footer: string;
};

/* ─── קוד ─── */

export const VOUCHER_CODE_PREFIX = "YC-";
/* בלי 0, O, 1, I ו-L: מקריאים את הקוד בטלפון ומקלידים אותו במורנינג */
export const VOUCHER_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const VOUCHER_CODE_LENGTH = 4;
const VOUCHER_CODE_RE = new RegExp(`^${VOUCHER_CODE_PREFIX}[${VOUCHER_CODE_ALPHABET}]{${VOUCHER_CODE_LENGTH}}$`);

function defaultRandom(): number {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const buffer = new Uint32Array(1);
    cryptoApi.getRandomValues(buffer);
    return buffer[0] / 0x100000000;
  }
  return Math.random();
}

/** "YC-A7K2": ארבעה תווים בלי תווים שמתבלבלים */
export function generateVoucherCode(random: () => number = defaultRandom): string {
  let body = "";
  for (let i = 0; i < VOUCHER_CODE_LENGTH; i += 1) {
    const index = Math.floor(random() * VOUCHER_CODE_ALPHABET.length);
    body += VOUCHER_CODE_ALPHABET[Math.min(VOUCHER_CODE_ALPHABET.length - 1, Math.max(0, index))];
  }
  return `${VOUCHER_CODE_PREFIX}${body}`;
}

/** "yc-a7k2" או "A7K2" הופכים ל-"YC-A7K2". קוד עם תו לא מהאלפבית מחזיר null. */
export function normalizeVoucherCode(text: string | null | undefined): string | null {
  const compact = (text ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const body = compact.replace(/^YC-?/, "");
  const code = `${VOUCHER_CODE_PREFIX}${body}`;
  return VOUCHER_CODE_RE.test(code) ? code : null;
}

/* ─── תאריכים ─── */

/* תוקף שובר מתנה. הבעלים ביקש שנה (7.10.2026), אבל חוק הגנת הצרכן קובע לשובר
   מתנה תוקף של שנתיים לפחות מיום ההנפקה, ולכן זה המינימום שאפשר לכתוב.
   מקור: https://www.emun.org/credits-and-gift-vouchers/ */
export const GIFT_VALIDITY_YEARS = 2;

const JERUSALEM_DATE = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jerusalem",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

function jerusalemDateParts(date: Date): { day: number; month: number; year: number } {
  const parts = JERUSALEM_DATE.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { day: get("day"), month: get("month"), year: get("year") };
}

/** "6.10.2026", לפי השעון בישראל */
export function formatVoucherDate(date: Date): string {
  const { day, month, year } = jerusalemDateParts(date);
  return `${day}.${month}.${year}`;
}

/* 29.2 שאין לו מקבילה בשנת התפוגה נדחה ל-1.3, כלומר התוקף לא מתקצר */
function addYearsText(date: Date, years: number): string {
  const { day, month, year } = jerusalemDateParts(date);
  const shifted = new Date(Date.UTC(year + years, month - 1, day));
  return `${shifted.getUTCDate()}.${shifted.getUTCMonth() + 1}.${shifted.getUTCFullYear()}`;
}

/* ─── טקסט חופשי ─── */

/* סכום עם סימן מטבע, ו"מע״מ" שנשאר אחריו. תאריך ושעה לא נוגעים בהם, כי אין לידם מטבע. */
const AMOUNT_RE = /₪\s*\d[\d,.]*|\d[\d,.]*\s*(?:₪|ש״ח|ש"ח|שקלים|שקל)/g;
const VAT_RE = /(?:\+\s*|כולל\s+|לפני\s+)?מע["״]מ/g;
/* טלפון: 9 ספרות ומעלה, עם מקפים או רווחים, כמו בשמירה בדפדפן (SalesDesk.tsx) */
const PHONE_RE = /\+?\d(?:[\s-]?\d){8,}/g;
/* רצף ספרות עם נקודה, פסיק, נקודתיים או לוכסן ביניהן: "500", "1,500", "15.10.2026", "18:00" */
const NUMBER_RE = /\d(?:[\d,.:/]*\d)?/g;

/* "15.10", "15/10/2026" או "18:00": תאריך ושעה נשארים */
function isDateOrTime(token: string): boolean {
  const time = /^(\d{1,2}):(\d{2})$/.exec(token);
  if (time) return Number(time[1]) <= 23 && Number(time[2]) <= 59;
  const date = /^(\d{1,2})[./](\d{1,2})(?:[./](\d{2}|\d{4}))?$/.exec(token);
  return date != null && Number(date[1]) >= 1 && Number(date[1]) <= 31 && Number(date[2]) >= 1 && Number(date[2]) <= 12;
}

/*
 * מספר בלי סימן מטבע ("מקדמה 500", "1,500") הוא כנראה סכום, ולכן יורד: 3 ספרות
 * ומעלה, או פסיק של אלפים. מספר קטן ("4 דוברים", "2 שעות") נשאר, וגם תאריך ושעה.
 */
function dropBareAmounts(text: string): string {
  return text.replace(NUMBER_RE, (token) => {
    if (isDateOrTime(token)) return token;
    const digits = token.replace(/\D/g, "").length;
    return digits >= 3 || /\d,\d/.test(token) ? " " : token;
  });
}

function cleanText(text: string | null | undefined, max: number): string | null {
  if (!text) return null;
  const cleaned = dropBareAmounts(text.replace(PHONE_RE, " ").replace(AMOUNT_RE, " ").replace(VAT_RE, " "))
    .replace(/\s+/g, " ")
    .replace(/\s+([,.])/g, "$1")
    /* "יתרה ,, בלי" אחרי שמספר ירד באמצע רשימה */
    .replace(/([,.])(?:\s*[,.])+/g, "$1")
    .replace(/^[\s,.:+]+|[\s,:+]+$/g, "")
    .trim();
  return cleaned ? cleaned.slice(0, max).trim() : null;
}

/* ─── איפה ─── */

type VoucherPlace = "studio" | "event" | "client" | "coordinated" | null;

const PLACE_TEXT: Record<Exclude<VoucherPlace, null>, string> = {
  studio: "אולפן במודיעין, הכתובת נשלחת בוואטסאפ",
  event: "במקום האירוע",
  client: "אצלכם, במקום שתיאמנו",
  /* החלטת הבעלים 7.10.2026 על שיעורים: "מה שקובעים בשיחה, אם זה לא באולפן זה
     בתוספת נסיעות". בלי מספר: התוספת נסגרת בשיחה, לא באישור */
  coordinated: "המקום נקבע בשיחה. מחוץ לאולפן יש תוספת נסיעות",
};

/* שירותים שנעשים מרחוק, גם אם הקטגוריה שלהם היא אולפן או פודקאסט */
const REMOTE_IDS = new Set<string>(["studio_remote", "podcast_editing_hour", "podcast_editing_advanced"]);
/* מגיעים אל הלקוח: אולפן נייד ואולפן זמני בחברה */
const CLIENT_IDS = new Set<string>(["mobile_podcast_at_home", "on_site_half_day", "on_site_full_day", "on_site_retainer"]);
/* באקדמיה: רק מה שבקטלוג כתוב עליו "באולפן" ולא "או בזום" / "או בחברה" */
const STUDIO_IDS = new Set<string>(["academy_nevermind_session"]);
/* צילום שקורה באירוע עצמו. צילומי זוגיות וצילום אומנותי נקבעים בתיאום */
const EVENT_PHOTO_IDS = new Set<string>(["full_event_photo_8h", "event_photo_hourly", "live_reels", "photography_wedding_4h"]);
/* מוצרים לאירוע שמכינים מראש ומוסרים בקובץ, בלי הגעה */
const EVENT_DELIVERED_IDS = new Set<string>(["cinematic_slideshow", "pre_event_production"]);

function placeOf(card: SalesCard): VoucherPlace {
  if (REMOTE_IDS.has(card.id)) return null;
  if (CLIENT_IDS.has(card.id)) return "client";
  if (STUDIO_IDS.has(card.id)) return "studio";
  switch (card.category) {
    case "studio":
    case "podcast":
      return "studio";
    case "dj":
      return "event";
    case "academy":
      return "coordinated";
    case "events":
      return EVENT_DELIVERED_IDS.has(card.id) || card.id.startsWith("growth_slideshow_") ? null : "event";
    case "photography":
      return EVENT_PHOTO_IDS.has(card.id) ? "event" : null;
    default:
      return null;
  }
}

/* ─── מה הוזמן ─── */

const PARTICIPANT_NOUN: Readonly<Record<string, string>> = {
  song: "משתתפים",
  blessing: "דוברים",
  remote: "דוברים",
  podcast: "משתתפים",
  mobile: "אנשים",
};

const MAX_INCLUDED = 4;

/* "דובר נוסף", "משתתף נוסף", "ערוץ נוסף": בכרטיס עם טבלת משתתפים הם שדה המספר,
   לא שדרוג. אחרת אותו דבר נכתב פעמיים ("+ דובר נוסף, 4 דוברים") */
const PARTICIPANT_ADDON_IDS = new Set<string>([
  SONG_PARTICIPANT_RULES.extraId,
  BLESSING_PARTICIPANT_RULES.extraId,
  PODCAST_PARTICIPANT_RULES.extraId,
  MOBILE_STUDIO_CHANNEL_RULES.channelId,
]);

/** השדרוגים שאפשר לסמן באישור: בלי שדרוג המשתתפים כשיש לכרטיס שדה מספר משתתפים */
export function voucherAddons(card: SalesCard): SalesAddon[] {
  return card.participants?.length ? card.addons.filter((a) => !PARTICIPANT_ADDON_IDS.has(a.id)) : card.addons;
}

/** השדרוגים שנבחרו, בסדר של הכרטיס, בלי שדרוג שהתנאי שלו לא נבחר */
function selectedAddons(card: SalesCard, ids: readonly string[]): SalesAddon[] {
  const picked = new Set(ids);
  const chosen = voucherAddons(card).filter((a) => picked.has(a.id));
  const chosenIds = new Set(chosen.map((a) => a.id));
  return chosen.filter((a) => !a.requires || chosenIds.has(a.requires));
}

/** מספר המשתתפים כשהוא מעבר לכלולים, בתוך הטווח של הכרטיס */
function extraParticipants(card: SalesCard, participants: number | undefined): number | null {
  const rows = card.participants;
  if (!rows?.length || participants == null || !Number.isFinite(participants)) return null;
  const min = rows[0].count;
  const max = rows[rows.length - 1].count;
  const n = Math.min(max, Math.trunc(participants));
  return n > min ? n : null;
}

/* שורה אחת לשדרוג: השורה הראשונה ממה שכלול בו, בלי "(מסלול הבסיס)", או השם שלו */
function addonLine(addon: SalesAddon): string {
  if (addon.catalogIds.length !== 1) return addon.label;
  const lines = getSalesTransparency(addon.catalogIds[0] as PriceItemId).included ?? [];
  return lines.find((l) => !l.includes("מסלול הבסיס")) ?? addon.label;
}

function includedLines(card: SalesCard, addons: readonly SalesAddon[]): string[] {
  const extra = addons.map(addonLine);
  const base = (card.included ?? []).slice(0, Math.max(2, MAX_INCLUDED - extra.length));
  return Array.from(new Set([...base, ...extra])).slice(0, MAX_INCLUDED);
}

/* ─── המסמך ─── */

const STATUS_LABEL: Record<VoucherStatus, string> = {
  awaiting_deposit: "ממתין למקדמה",
  date_held: "המועד שוריין",
};

const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
const TERMS_PATH: LegalPageHref = "/terms";

export const ORDER_DISCLAIMER = "אישור הזמנה בלבד. אינו חשבונית מס ואינו קבלה.";
export const GIFT_DISCLAIMER = "שובר מתנה בלבד. אינו חשבונית מס ואינו קבלה.";

/** הנתונים לאישור הזמנה או לשובר מתנה. אין בהם מחיר. */
export function buildVoucherData(input: VoucherInput): VoucherData {
  const card = getSalesCard(input.cardId);
  if (!card) throw new Error(`Unknown sales card: ${input.cardId}`);
  const addons = selectedAddons(card, input.addonIds);
  const code = normalizeVoucherCode(input.code) ?? generateVoucherCode();
  const shared = {
    code,
    issuedText: formatVoucherDate(input.issuedAt),
    included: includedLines(card, addons),
    cancellation: CANCELLATION_SUMMARY,
    termsUrl: `${SITE_HOST}${TERMS_PATH}`,
    footer: `${CONTACT_PHONE_DISPLAY} · ${SITE_HOST}`,
  };

  if (input.kind === "gift") {
    return {
      kind: "gift",
      ...shared,
      title: "שובר מתנה",
      statusLabel: null,
      greeting: null,
      /* שם השירות מהקטלוג לא עובר ניקוי: הוא לא הוקלד, ומספר בו ("100 תמונות") הוא חלק מהשם */
      serviceTitle: input.giftTitle?.trim() === card.title ? card.title : (cleanText(input.giftTitle, 80) ?? card.title),
      agreed: null,
      whenLabel: null,
      when: null,
      where: null,
      bring: null,
      parking: null,
      validUntilText: addYearsText(input.issuedAt, GIFT_VALIDITY_YEARS),
      /* "קוד" ולא "מספר": על השובר כתוב קוד של אותיות וספרות (YC-A7K2) */
      redemption: `למימוש: שולחים בוואטסאפ את קוד השובר ל-${CONTACT_PHONE_DISPLAY} ומתאמים מועד. אפשר לממש גם לשירות אחר מהקטלוג, בשווי ששולם`,
      giftTo: cleanText(input.giftTo, 60),
      giftFrom: cleanText(input.giftFrom, 60),
      disclaimer: GIFT_DISCLAIMER,
    };
  }

  const firstName = cleanText(input.firstName, 30);
  const people = extraParticipants(card, input.participants);
  const noun = PARTICIPANT_NOUN[card.family] ?? "משתתפים";
  const dateText = cleanText(input.dateText, 40);
  const timeText = cleanText(input.timeText, 20);
  const agreed = cleanText(input.agreed, 160);
  const place = placeOf(card);
  const status = input.status ?? "awaiting_deposit";
  /* בשליחה השנייה, אחרי המקדמה, המועד כבר שמור. בלי "המקדמה התקבלה" ליד "אינו קבלה" */
  const greetingTail = status === "date_held" ? "המועד שמור לכם." : "ההזמנה נקלטה.";
  return {
    kind: "order",
    ...shared,
    title: "אישור הזמנה",
    statusLabel: STATUS_LABEL[status],
    greeting: firstName ? `תודה, ${firstName}. ${greetingTail}` : `תודה. ${greetingTail}`,
    serviceTitle: [
      card.title,
      ...addons.map((a) => ` + ${a.label}`),
      people ? `, ${people} ${noun}` : "",
    ].join(""),
    agreed: agreed ? `סיכמנו: ${agreed}` : null,
    /* שירות שנמסר בקובץ (מרחוק, אונליין, מצגת): "מסירה", ובלי שורה עד שיש תאריך */
    whenLabel: place ? "מתי:" : "מסירה:",
    when: dateText ? [dateText, timeText].filter(Boolean).join(", ") : place ? "המועד נקבע בתיאום" : null,
    where: place ? PLACE_TEXT[place] : null,
    bring: place === "studio" ? `${STUDIO_BRING_NOTE}. ${STUDIO_ARRIVE_EARLY_NOTE}` : null,
    parking: place === "studio" ? STUDIO_PARKING_NOTE : null,
    validUntilText: null,
    redemption: null,
    giftTo: null,
    giftFrom: null,
    disclaimer: ORDER_DISCLAIMER,
  };
}
