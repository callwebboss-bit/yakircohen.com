import type { BookCategoryId } from "@/lib/book-url";
import { buildBookHref } from "@/lib/book-url";
import { formatConsumerPrice, formatHubPriceDual } from "@/lib/data/pricing-display";
import { formatFromPriceDual } from "@/lib/data/pricing-catalog";
import { buildYcLeadTag } from "@/lib/yc-lead-tag";
import { CONTACT_PHONE_DISPLAY } from "@/lib/constants";

/** הסתייגות תפעולית, שורת משנה ליד הבטחות זמן */
export const TIME_PROMISE_DISCLAIMER =
  'בדרך כלל מתקבלים טווחי הזמן האלה, לפי עומס ומורכבות הפרויקט.';

/*
 * הבטחת מענה להצעה מאוחדת ל"תוך שעה" (החלטת הבעלים 8.9.2026, סעיף 9).
 * הבטחות מסירה נשארות 24 שעות והן דבר אחר לגמרי, ולכן podcastDelivery24h
 * לא משתנה. שם המפתח נושא את המספר בכוונה, כדי ששינוי ערך יחייב שינוי שם.
 */
export const TIME_CLAIMS = {
  quoteHour: "בדרך כלל תוך שעה",
  quoteHourCta: 'קבלו הצעה, בדרך כלל תוך שעה',
  headerQuoteHour: '📩 הצעה, בדרך כלל תוך שעה',
  bookPriceCheck: "בדקו מחיר במחשבון",
  podcastDelivery24h: "בדרך כלל מוכן תוך 24 שעות",
  podcastValueFrame: "תהליך מלווה לפרק ראשון, בדרך כלל בלי חודשים של ניסוי",
  waResponse30m: "מענה אנושי בוואטסאפ, הכי מהר שאפשר",
  waResponse1h: "מענה אנושי בשעות הפעילות, הכי מהר שאפשר",
  waResponse15m: "מענה אנושי, הכי מהר שאפשר",
  waResponse15mBusiness: "מענה אנושי בשעות הפעילות",
  waResponseMinutes: "בדרך כלל תוך דקות בוואטסאפ",
  humanResponseSubline: "*מענה אנושי, לא בוט",
} as const;

/**
 * מסך הגיבוי כשהשרת לא אישר שהליד הגיע לבעלים (LF-02). קודם הגולש ראה
 * "נשלח בהצלחה" גם כשהפרטים לא הגיעו לאף אחד. כאן הוא מקבל דרך בטוחה
 * להעביר אותם: וואטסאפ עם אותו טקסט, טלפון, או ניסיון חוזר.
 */
export const LEAD_SUBMIT_FALLBACK = {
  title: "הפרטים עוד לא הגיעו אלינו",
  body: `אפשר לשלוח אותם בוואטסאפ בלחיצה אחת, או להתקשר ל-${CONTACT_PHONE_DISPLAY}.`,
  whatsapp: "שליחה בוואטסאפ",
  call: "התקשרו",
  retry: "לנסות שוב",
  retrying: "שולחים שוב",
} as const;

/** טופס "נחזור אליכם": הבטחת הזמן היא TIME_CLAIMS.quoteHour, בלי הבטחה חדשה. LF-11 */
export const CALLBACK_SUCCESS_COPY = {
  title: "קיבלנו את הפרטים",
  body: `יקיר יחזור אליך ${TIME_CLAIMS.quoteHour} מ-${CONTACT_PHONE_DISPLAY}.`,
  whatsappOptional: "מעדיפים וואטסאפ? אפשר לכתוב לנו גם שם",
} as const;

export const OUTCOME_CTA = {
  quoteHour: "קבלו הצעה תוך שעה",
  startMinute: "תתחילו לעבוד תוך דקה",
  heroBookNoCommit: "📩 קבעו שיחה - בלי התחייבות",
  heroSendFile: "📤 שלחו קובץ",
  /** Hero דף הבית - ראשי, מוביל ל-/book */
  heroBookPriceNow: "📩 קבעו הקלטה - רואים מחיר סופי מיד",
  /** Hero דף הבית - משני, מוביל ל-/online */
  heroSendFileFixed: "📤 שלחו קובץ - חוזר מתוקן",
  /** ברירת מחדל ל-hero של דפי שירות דקים (וואטסאפ) */
  waQuoteHour: "📩 קבלו הצעה בוואטסאפ - תוך שעה",
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
  /** כרטיס התאמה ב-/book - מחיר קטלוג סגור */
  bookNowOpenSlot: "הזמינו עכשיו לתאריך פנוי",
  /** כרטיס התאמה ב-/book - מחיר משתנה */
  getQuote: "קבלו הצעת מחיר",
  /** תפריט דביק, מלא בדסקטופ */
  headerQuoteHour: TIME_CLAIMS.headerQuoteHour,
  /** תפריט דביק, קומפקטי במובייל */
  headerQuoteHourShort: "📩 הצעה",
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

/** אותו כפתור לעמודי צרכן שמציגים כולל מע״מ (עמודים עם טופס הקלטת השיר) */
export function consumerBookCtaLabel(priceExVat: number): string {
  return `הזמנה מקוונת מ-${formatConsumerPrice(priceExVat).totalLabel}`;
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
  /** slug המאמר - מאפשר לקלוזר לדעת איזה מאמר ייצר את הליד */
  route?: string | null;
}): string {
  return `${options.body.trim()}\n${buildYcLeadTag({
    service: options.closerService,
    price: options.priceExVat,
    source: options.utmCampaign,
    route: options.route ?? null,
    step: 1,
  })}`;
}

/** לסיום סקשנים חדשים בלבד - טון יבש, מעודד בדיקה */
export const SKEPTICISM_CTA =
  "זה המנגנון. אל תאמין לי - תבדוק בעצמך.";
