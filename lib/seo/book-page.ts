import { SITE_NAME } from "@/lib/constants";
import { withVat } from "@/lib/data/pricing";
import { getExVat } from "@/lib/data/pricing-catalog";

export const BOOK_PAGE_TITLE = "הזמנה מקוונת - מחירון שקוף מודיעין";

/* מחיר הקלטת השיר כולל מע״מ, מהקטלוג. קודם היה כאן "חבילות מ-990" תחת
   טענת "כולל מע״מ", וזה לא היה נכון (PI-16), והחבילות ירדו ב-2.10.2026 */
const SONG_WITH_VAT = `${withVat(getExVat("song_recording")).toLocaleString("he-IL")} ₪`;

export const BOOK_PAGE_DESCRIPTION =
  `מחירון שקוף עם מחיר סופי (כולל מע״מ): הקלטת שיר באולפן במודיעין ${SONG_WITH_VAT}, פודקאסט, אירועים, DJ, צילום, אקדמיה ושחזור סאונד. וואטסאפ מהיר עם פרטים מוכנים או מחשבון מפורט.`;

/** טקסט ה-noscript של /book ושל /book/[category] */
export const BOOK_NOSCRIPT_TEXT =
  `הזמנה מקוונת באתר יקיר כהן: הקלטת שיר באולפן במודיעין (${SONG_WITH_VAT} כולל מע״מ), פודקאסט, אטרקציות לאירועים, הגברה לזמרים, DJ, צילום ושיעורים פרטיים. אפשר לשלוח פרטים בוואטסאפ.`;

/** Dedicated share image for /book (1200×630) */
export const BOOK_OG_IMAGE_PATH = "/images/og/book.webp";

export const BOOK_OG_IMAGE_WIDTH = 1200;
export const BOOK_OG_IMAGE_HEIGHT = 630;

export const BOOK_OG_IMAGE_ALT = `מחירון שקוף לכל השירותים - ${SITE_NAME}`;

export const BOOK_PAGE_KEYWORDS = [
  "הזמנת אולפן",
  "הזמנת פודקאסט",
  "הזמנת אטרקציות לאירועים",
  "הגברה לזמרים",
  "שיעורים פרטיים מוזיקה",
  "שחזור סאונד AI",
  "מחירון הקלטות",
  "הזמנה מקוונת",
] as const;
