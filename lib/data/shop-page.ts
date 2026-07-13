/**
 * Dedicated shop assets under public/images/shop/ (generate: npm run generate:shop-images).
 * Replace files in place with product shots when ready — same filenames.
 */
export const SHOP_VOUCHER_IMAGES = {
  basic: "/images/shop/voucher-basic.webp",
  premium: "/images/shop/voucher-premium.webp",
  custom: "/images/shop/voucher-custom.webp",
} as const;

export type ShopGearItem = {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  /** Schema.org product name for OfferCatalog */
  schemaName: string;
};

export const SHOP_GEAR_ITEMS: readonly ShopGearItem[] = [
  {
    id: "rcf745",
    title: "הגברה RCF 745",
    subtitle: "רמקולים מוגברים כולל סאבוופר, יצאו מהפקות.",
    imageSrc: "/images/shop/gear-rcf745.webp",
    imageAlt: "רמקולים מוגברים RCF להפקות אירועים",
    schemaName: "רמקולים מוגברים RCF 745 כולל סאבוופר",
  },
  {
    id: "traktor-s4",
    title: "Traktor S4 MK3",
    subtitle: "עמדות די ג'יי, פלטות ואביזרים.",
    imageSrc: "/images/shop/gear-traktor-s4.webp",
    imageAlt: "קונטרולר Traktor S4 לעמדת די ג'יי",
    schemaName: "עמדות די ג'יי Traktor S4 MK3",
  },
  {
    id: "krk",
    title: "ציוד אולפן",
    subtitle: "מיקרופונים, ממשקים ומוניטורים.",
    imageSrc: "/images/shop/gear-krk.webp",
    imageAlt: "ציוד אולפן מקצועי למכירה",
    schemaName: "ציוד אולפן יד שנייה",
  },
  {
    id: "effects",
    title: "אפקטים",
    subtitle: "מכונות עשן, בועות ופירוטכניקה.",
    imageSrc: "/images/shop/gear-effects.webp",
    imageAlt: "אפקטים לאירועים יד שנייה",
    schemaName: "אפקטים לאירועים יד שנייה",
  },
  {
    id: "led",
    title: "תאורת LED",
    subtitle: "פנסי במה, אפקטים ותאורת במה.",
    imageSrc: "/images/shop/gear-led.webp",
    imageAlt: "עמדת לד ותאורת במה לאירועים",
    schemaName: "תאורת LED לאירועים",
  },
  {
    id: "accessories",
    title: "אביזרים",
    subtitle: "כבלים, סטנדים ותיקי נשיאה.",
    imageSrc: "/images/shop/gear-accessories.webp",
    imageAlt: "אביזרי הגברה ואולפן",
    schemaName: "אביזרי הגברה ואולפן",
  },
] as const;

export const SHOP_VOUCHER_FAQ_UI = [
  {
    id: "delivery",
    question: "איך מקבלים את השובר?",
    answer:
      "ניתן לקבל שובר דיגיטלי מיידי לשימוש בטלפון, או שובר מודפס באיסוף מהסטודיו במודיעין.",
  },
  {
    id: "validity",
    question: "מה תוקף השובר?",
    answer:
      "בדרך כלל שנה מיום הרכישה. אם צריך תאריך אחר, כותבים בוואטסאפ ומתאימים.",
  },
] as const;

export const SHOP_GEAR_TRANSPARENCY =
  "שקיפות לגבי מצב הציוד: כל הציוד המוצע למכירה הוא ציוד עבודה שלנו. אנחנו מכירים כל שריטה וכל כפתור. מוזמנים לבוא, לשמוע ולבדוק.";
