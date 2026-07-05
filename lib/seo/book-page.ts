import { SITE_NAME } from "@/lib/constants";

export const BOOK_PAGE_TITLE = "כל השירותים – מחירון שקוף";

export const BOOK_PAGE_DESCRIPTION =
  "מחירון שקוף עם מחיר סופי (כולל מע״מ): אולפן במודיעין (חבילות מ-990 ₪), פודקאסט, אירועים, DJ, צילום, אקדמיה ושחזור סאונד. וואטסאפ מהיר עם פרטים מוכנים או מחשבון מפורט.";

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
