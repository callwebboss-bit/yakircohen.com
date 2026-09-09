/**
 * משפך בלוג → שירות (blog-funnel-spec-improved.md, שלב B).
 *
 * כל התנועה האורגנית של האתר מגיעה למאמרים, ולרובם לא היה CTA עם קישור ל-/book,
 * מחיר ותג [YC:] למעקב. השכבה הזאת ממפה כל relatedServiceSlug לקטגוריית /book
 * (דרך service-book-map, מקור האמת למחירים) ומספקת קופי CTA לפי קטגוריה ולפי
 * שלב הגולש במשפך. שכבה נוספת בלבד: callout/nurture קיימים תמיד גוברים.
 */

import type { BookCategoryId } from "@/lib/book-url";
import { BOOK_CLOSER_SERVICE } from "@/lib/data/book-closer-map";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";

export type FunnelIntent = "awareness" | "consideration" | "decision";

type FunnelCopy = {
  heading: string;
  body: string;
  /** פתיח הודעת וואטסאפ - כותרת המאמר מתווספת אוטומטית */
  whatsappOpener: string;
};

/** קופי לפי קטגוריית /book. יבש, עובדתי, בלי סימני קריאה. */
const FUNNEL_COPY: Record<BookCategoryId, FunnelCopy> = {
  studio: {
    heading: "רוצים להקליט את זה באולפן?",
    body: "הקלטת שיר או ברכה באולפן במודיעין, עם ליווי קולי ותיקון זיופים. המחיר סופי לפני שמגיעים.",
    whatsappOpener: "שלום, אשמח להצעה להקלטה באולפן.",
  },
  podcast: {
    heading: "מתחילים פודקאסט?",
    body: `הקלטה, עריכה והפצה מאולפן אחד. פרק ראשון ${TIME_CLAIMS.podcastDelivery24h}.`,
    whatsappOpener: "שלום, אשמח להצעה להפקת פודקאסט.",
  },
  events: {
    heading: "מתכננים אירוע?",
    body: "אטרקציות, עשן, קונפטי והגברה עם טכנאי בשטח. מחיר סגור מראש, בלי תוספות ביום האירוע.",
    whatsappOpener: "שלום, אשמח להצעה לאטרקציות לאירוע.",
  },
  dj: {
    heading: "צריכים DJ לאירוע?",
    body: "DJ, הגברה ותאורה בצוות אחד. שולחים תאריך ואולם, מקבלים זמינות והצעה.",
    whatsappOpener: "שלום, אשמח לבדוק זמינות DJ לאירוע.",
  },
  photography: {
    heading: "צילום לאירוע?",
    body: "צילום סטילס ווידאו לאירועים, עם סאונד מאותו צוות. מחיר לפי שעות, בלי הפתעות.",
    whatsappOpener: "שלום, אשמח להצעה לצילום אירוע.",
  },
  clips: {
    heading: "קליפ או תוכן לעסק?",
    body: "יום צילום באולפן או במשרד, חודש של תוכן לרשתות. חשבונית מס.",
    whatsappOpener: "שלום, אשמח להצעה לתוכן וידאו לעסק.",
  },
  singer: {
    heading: "הגברה להופעה?",
    body: "מערכת מכווננת, מוניטורים וטכנאי צמוד לאורך ההופעה. מחיר לפי גודל האירוע.",
    whatsappOpener: "שלום, אשמח להצעה להגברה להופעה.",
  },
  academy: {
    heading: "רוצים ללמוד את זה בעצמכם?",
    body: "שיעורים פרטיים באולפן: DJ, הפקה, קול. לומדים על ציוד אמיתי, בקצב שלכם.",
    whatsappOpener: "שלום, אשמח לשמוע על שיעור פרטי באקדמיה.",
  },
  online: {
    heading: "יש לכם הקלטה שצריכה תיקון?",
    body: "שולחים קובץ בוואטסאפ, מקבלים הערכה. ניקוי רעשים, תיקון זיופים ומיקס מרחוק.",
    whatsappOpener: "שלום, יש לי הקלטה שצריכה שיפור סאונד.",
  },
  pro: {
    heading: "שירות לספקי אירועים?",
    body: "ווייס-טאגים, סטים מוכנים ומיקסים ל-DJ ומפיקים. מחירון שקוף לספקים.",
    whatsappOpener: "שלום, אשמח לשמוע על שירותים לספקי אירועים.",
  },
};

/** תווית כפתור הוואטסאפ לפי שלב במשפך */
const WA_LABEL_BY_INTENT: Record<FunnelIntent, string> = {
  awareness: "שאלו אותנו בוואטסאפ",
  consideration: "קבלו הצעה בוואטסאפ",
  decision: "בדקו תאריך בוואטסאפ",
};

export type BlogFunnelTarget = {
  bookCategory: BookCategoryId;
  heading: string;
  body: string;
  ctaLabel: string;
  whatsappMessage: string;
  utmCampaign: string;
  closerService: string;
  priceExVat: number;
  bookHref: string;
  bookCtaLabel: string;
};

export type BlogFunnelPostInput = {
  slug: string;
  title: string;
  relatedServiceSlug: string;
  funnelIntent?: FunnelIntent;
};

/**
 * מחזיר יעד משפך מלא למאמר, או null כשאין מיפוי ל-/book (למשל clinic).
 * `whatsappOpener` מ-callout קיים גובר על הפתיח הגנרי של הקטגוריה.
 */
export function resolveBlogFunnel(
  post: BlogFunnelPostInput,
  options?: { whatsappOpener?: string | null },
): BlogFunnelTarget | null {
  const bookCta = resolveServiceBookCta(post.relatedServiceSlug);
  if (!bookCta) return null;

  const copy = FUNNEL_COPY[bookCta.bookCategory];
  const intent: FunnelIntent = post.funnelIntent ?? "consideration";
  const opener = options?.whatsappOpener?.trim() || copy.whatsappOpener;

  return {
    bookCategory: bookCta.bookCategory,
    heading: copy.heading,
    body: copy.body,
    ctaLabel: WA_LABEL_BY_INTENT[intent],
    whatsappMessage: `${opener}\nקראתי את הכתבה "${post.title.trim()}".`,
    utmCampaign: `blog_funnel_${bookCta.bookCategory}`,
    closerService: BOOK_CLOSER_SERVICE[bookCta.bookCategory],
    priceExVat: bookCta.priceExVat,
    bookHref: bookCta.bookHref,
    bookCtaLabel: bookCta.bookLabel,
  };
}
