import type { BookCategoryId } from "@/lib/book-url";
import { buildBookHref } from "@/lib/book-url";
import { formatHubPriceDual } from "@/lib/data/pricing-display";
import { formatFromPriceDual } from "@/lib/data/pricing-catalog";
import { buildYcLeadTag } from "@/lib/yc-lead-tag";

/** הסתייגות תפעולית, שורת משנה ליד הבטחות זמן */
export const TIME_PROMISE_DISCLAIMER =
  'בדרך כלל מתקבלים טווחי הזמן האלה, לפי עומס ומורכבות הפרויקט.';

export const TIME_CLAIMS = {
  quote24h: "בדרך כלל תוך 24 שעות",
  quote24hCta: 'קבלו הצעה, בדרך כלל תוך 24 שעות',
  headerQuote24h: '📩 הצעה, בדרך כלל תוך 24 שעות',
  bookPriceCheck: "בדקו מחיר במחשבון",
  podcastDelivery24h: "בדרך כלל מוכן תוך 24 שעות",
  podcastValueFrame: "תהליך מלווה לפרק ראשון, בדרך כלל בלי חודשים של ניסוי",
  waResponse30m: "בדרך כלל תוך פחות מ-30 דקות בוואטסאפ",
  waResponse1h: "בדרך כלל תוך שעה בשעות פעילות (א-ה 9:00-20:00)",
  waResponse15m: "בדרך כלל תוך 15 דקות",
  waResponse15mBusiness: "בדרך כלל תוך 15 דקות בשעות הפעילות",
  waResponseMinutes: "בדרך כלל תוך דקות בוואטסאפ",
  humanResponseSubline: "*מענה אנושי תוך שעה",
} as const;

export const OUTCOME_CTA = {
  quote24h: "קבלו הצעה תוך 24 שעות",
  startMinute: "תתחילו לעבוד תוך דקה",
  heroBookNoCommit: "📩 קבעו שיחה - בלי התחייבות",
  heroSendFile: "📤 שלחו קובץ",
  /** Hero דף הבית - ראשי, מוביל ל-/book */
  heroBookPriceNow: "📩 קבעו הקלטה - רואים מחיר סופי מיד",
  /** Hero דף הבית - משני, מוביל ל-/online */
  heroSendFileFixed: "📤 שלחו קובץ - חוזר מתוקן",
} as const;

export const FORCE_MAJEURE_REASSURANCE =
  "🔒 קורונה, מלחמה, כוח עליון? אנחנו איתכם - בטלפון נסגור מה מתאים.";

export const FORM_DATA_SECURITY =
  "🔒 הנתונים שלך מאובטחים. לא משתפים עם אף אחד.";

export const HESITATION_CTA =
  "❓ עדיין מתלבטים? דברו איתנו בלי שום התחייבות.";

export const SERVICE_CARD_DETAILS_CTA = "📖 לפרטים";

export const CTA_LABELS = {
  whatsappQuote: "קבלו מחיר ותאריך פנוי",
  bookTransparent: TIME_CLAIMS.bookPriceCheck,
  bookOnline: "הזמנה מקוונת",
  /** ניסוח תוצאתי - סגירת הזמנה, לא "שליחה" */
  sendBookingWa: "סגרו את ההזמנה בוואטסאפ",
  fastWaQuote: "קבלו הצעה",
  /** תפריט דביק, מלא בדסקטופ */
  headerQuote24h: TIME_CLAIMS.headerQuote24h,
  /** תפריט דביק, קומפקטי במובייל */
  headerQuote24hShort: "📩 הצעה",
} as const;

export function whatsappQuoteCta(serviceLabel: string, priceExVat: number): string {
  return `אני רוצה הצעה ל${serviceLabel} מ-${formatFromPriceDual(priceExVat)}`;
}

export function sendBookingWaCta(totalWithVat: number): string {
  return `${CTA_LABELS.sendBookingWa} - ${totalWithVat.toLocaleString("he-IL")} ₪ סופי`;
}

export const PRICING_FRAMING_LINE =
  "כל מחיר כאן = מה שתקבלו בפועל. ללא עלויות נסתרות - פרטים סופיים בוואטסאפ.";

export function whatsappAriaLabel(serviceLabel: string, priceExVat: number): string {
  return `סגרו ${serviceLabel} בוואטסאפ - ${formatFromPriceDual(priceExVat)}`;
}

export function hubBookCtaLabel(priceExVat: number): string {
  const dual = formatFromPriceDual(priceExVat)
    .replace(/^כרגע:\s*/, "")
    .replace(/^מ-/, "");
  return `הזמנה מקוונת מ-${dual}`;
}

export function pricingRowBookCta(priceExVat: number, priceFrom = false): string {
  return `${CTA_LABELS.bookOnline} - ${formatHubPriceDual(priceExVat, priceFrom)}`;
}

export const VALUE_FRAME_BY_CATEGORY: Record<BookCategoryId, string> = {
  studio: "במקום לנחש באולפן - יוצאים עם קובץ מוכן",
  podcast: TIME_CLAIMS.podcastValueFrame,
  events: "אפקטים שמרימים את האירוע - בלי הפתעות ביום",
  dj: "מוזיקה ואווירה מקצועית - שמצולמת ונשמעת טוב",
  photography: "רגעים חשובים שמורים - בצילום ובוידאו",
  clips: "קליפ מקצועי - מוכן לשיתוף",
  singer: "סאונד מקצועי על הבמה - אתם מתמקדים בשירה",
  academy: "ללמוד בקצב שלך - עם מי שעושה את זה בשטח",
  online: "מחזירים הקלטה שלא הייתם זורקים",
  pro: "שירות מקצועי לעסקים - בלי לנחש מחירים",
};

export function bookHrefForCategory(category: BookCategoryId): string {
  return buildBookHref(category);
}

export function buildBlogCtaWhatsAppMessage(options: {
  body: string;
  closerService: string;
  priceExVat?: number | null;
  utmCampaign: string;
}): string {
  return `${options.body.trim()}\n${buildYcLeadTag({
    service: options.closerService,
    price: options.priceExVat,
    source: options.utmCampaign,
    step: 1,
  })}`;
}

/** לסיום סקשנים חדשים בלבד - טון יבש, מעודד בדיקה */
export const SKEPTICISM_CTA =
  "זה המנגנון. אל תאמין לי - תבדוק בעצמך.";
