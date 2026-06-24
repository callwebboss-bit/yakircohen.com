import type { BookCategoryId } from "@/lib/book-url";
import { buildBookHref } from "@/lib/book-url";
import { formatFromPriceDual } from "@/lib/data/pricing-catalog";
import { buildYcLeadTag } from "@/lib/yc-lead-tag";

export const CTA_LABELS = {
  whatsappQuote: "קבלו מחיר ותאריך פנוי",
  bookTransparent: "בדקו מחיר - תוך דקה",
  bookOnline: "הזמנה מקוונת",
  sendBookingWa: "שלחו את ההזמנה בוואטסאפ",
  fastWaQuote: "קבלו הצעה",
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
  return `הזמנה מקוונת מ-${formatFromPriceDual(priceExVat).replace("כרגע: ", "")}`;
}

export const VALUE_FRAME_BY_CATEGORY: Record<BookCategoryId, string> = {
  studio: "במקום לנחש באולפן - יוצאים עם קובץ מוכן",
  podcast: "פרק ראשון מוכן - בלי חודש ניסוי וטעייה",
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

/** לסיום סקשנים חדשים בלבד — טון יבש, מעודד בדיקה */
export const SKEPTICISM_CTA =
  "זה המנגנון. אל תאמין לי — תבדוק בעצמך.";
