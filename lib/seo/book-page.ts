import { SITE_NAME } from "@/lib/constants";

export const BOOK_PAGE_TITLE = "הזמנה מקוונת";

export const BOOK_PAGE_DESCRIPTION =
  "הזמנה מקוונת עם מחיר שקוף (כולל מע״מ): אולפן במודיעין (חבילות מ-990 ₪), פודקאסט, אירועים, DJ, צילום, אקדמיה ושחזור סאונד. Melodyne ו-Auto-Tune באולפן. וואטסאפ מהיר או הזמנה מפורטת - בלי המתנה לתשובה.";

/** Dedicated share image for /book (1200×630) */
export const BOOK_OG_IMAGE_PATH = "/images/og/book.webp";

export const BOOK_OG_IMAGE_WIDTH = 1200;
export const BOOK_OG_IMAGE_HEIGHT = 630;

export const BOOK_OG_IMAGE_ALT = `הזמנה מקוונת עם מחיר שקוף - ${SITE_NAME}`;

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
