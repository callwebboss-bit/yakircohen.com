import { buildWhatsAppHref } from "@/lib/whatsapp";

export type MatanotEventCardData = {
  id: string;
  title: string;
  suitedFor: readonly string[];
  ideas: readonly string[];
  whatsappHref: string;
};

export type MatanotStep = {
  step: string;
  title: string;
  body: string;
};

export type MatanotProductNote = {
  title: string;
  body: string;
};

export type MatanotPackageData = {
  id: string;
  title: string;
  items: readonly string[];
  startingPrice: string;
  note?: string;
  whatsappHref: string;
};

export const MATANOT_PAGE_PATH = "/matanot";

export const MATANOT_HERO = {
  title: "מתנה מוקלטת שתמיד נשארת איתם",
  description:
    "שיר, ברכה או פודקאסט אישי לכל אירוע - הפקה מלאה מאולפן יקיר כהן במודיעין.",
  primaryLabel: "בחרו את סוג האירוע",
  secondaryLabel: "שלחו הודעה בוואטסאפ",
  secondaryHref: buildWhatsAppHref({
    text: "היי יקיר, אני מחפש/ת רעיון למתנה מוקלטת ורוצה להבין מה יכול להתאים.",
    utm_source: "website",
    utm_campaign: "matanot_hero",
  }),
} as const;

export const MATANOT_EVENT_CARDS: readonly MatanotEventCardData[] = [
  {
    id: "wedding",
    title: "חתונה",
    suitedFor: [
      "לזוג שרוצה רגע אישי בתוך האירוע.",
      "למשפחה או חברים שמחפשים מתנה עם משמעות.",
      "למי שרוצה שיר, ברכה או קטע מוקלט להקרנה.",
    ],
    ideas: [
      "שיר מוקלט לחופה או לרחבה.",
      "ברכה של ההורים והחברים בעריכה נקייה.",
      "קטע אודיו קצר שמשתלב בקליפ או במצגת.",
    ],
    whatsappHref: buildWhatsAppHref({
      text: "היי יקיר, אני מחפש/ת רעיון למתנה מוקלטת לחתונה בתאריך...",
      utm_source: "website",
      utm_campaign: "matanot_wedding",
    }),
  },
  {
    id: "birthday",
    title: "יום הולדת",
    suitedFor: [
      "למי שרוצה מתנה אישית ולא מוצר מדף.",
      "למשפחה שמחפשת ברכה מוקלטת מכל מי שחשוב.",
      "לחברים שרוצים להקליט שיר או קטע מצחיק.",
    ],
    ideas: [
      "שיר יום הולדת אישי באולפן.",
      "ברכה מוקלטת עם כמה קולות ועריכה.",
      "רינגטון או קטע קומי קצר למי שאוהב הומור.",
    ],
    whatsappHref: buildWhatsAppHref({
      text: "היי יקיר, אני מחפש/ת רעיון למתנה מוקלטת ליום הולדת בתאריך...",
      utm_source: "website",
      utm_campaign: "matanot_birthday",
    }),
  },
  {
    id: "bar-bat-mitzvah",
    title: "בר/בת מצווה",
    suitedFor: [
      "להורים שרוצים להפתיע בשיר או קליפ.",
      "לילד/ה שרוצים להקליט באולפן ולהישאר עם קובץ מוכן.",
      "למשפחה שמחפשת מתנה שאפשר גם להקרין באולם.",
    ],
    ideas: [
      "הקלטת שיר אישי עם ליווי באולפן.",
      "ברכה מוקלטת של המשפחה לערב האירוע.",
      "קליפ קצר או קטע שמע למצגת.",
    ],
    whatsappHref: buildWhatsAppHref({
      text: "היי יקיר, אני מחפש/ת רעיון למתנה מוקלטת לבר/בת מצווה בתאריך...",
      utm_source: "website",
      utm_campaign: "matanot_mitzvah",
    }),
  },
  {
    id: "anniversary",
    title: "יום נישואין",
    suitedFor: [
      "לזוג שרוצה להקליט משהו פרטי ומשפחתי.",
      "למי שמחפש מתנה שקטה, ישירה ואישית.",
      "לילדים שרוצים להכין להורים מתנה עם קול ותוכן.",
    ],
    ideas: [
      "שיר בהקדשה אישית.",
      "ברכה זוגית מוקלטת עם מוזיקה ברקע.",
      "פודקאסט קצר על סיפור הזוגיות.",
    ],
    whatsappHref: buildWhatsAppHref({
      text: "היי יקיר, אני מחפש/ת רעיון למתנה מוקלטת ליום נישואין בתאריך...",
      utm_source: "website",
      utm_campaign: "matanot_anniversary",
    }),
  },
] as const;

export const MATANOT_STEPS: readonly MatanotStep[] = [
  { step: "1", title: "בוחרים סוג אירוע", body: "מתחילים מהאירוע ומהסגנון: שיר, ברכה או פודקאסט אישי." },
  { step: "2", title: "ממלאים פרטים בסיסיים", body: "שולחים תאריך, למי המתנה מיועדת ומה הרעיון הראשוני." },
  { step: "3", title: "מקבלים הצעה ומשלמים מקדמה", body: "מסכמים מה מפיקים, מה נמסר ובאיזה לוח זמנים." },
  { step: "4", title: "מקליטים באולפן או מרחוק", body: "אפשר להגיע למודיעין או לעבוד מרחוק, לפי סוג ההפקה." },
  { step: "5", title: "מקבלים קובץ ומארז לפי הצורך", body: "המסירה דיגיטלית, ויש גם אפשרות למארז פיזי." },
] as const;

export const MATANOT_PRODUCT_NOTES: readonly MatanotProductNote[] = [
  {
    title: "דיסק און קי ממותג",
    body: "דיסק און קי מעוצב עם הלוגו שלנו ושם הזוג/הילד, כולל הקובץ המוקלט וברכה כתובה.",
  },
  {
    title: "אוזניות איכותיות",
    body: "אוזניות סגורות ונוחות, מותאמות להאזנה ראשונה למתנה.",
  },
  {
    title: "קופסת מתנה / קופסת עץ",
    body: "קופסה מעוצבת שבה נארזים הדיסק און קי, האוזניות ופתק אישי.",
  },
] as const;

export const MATANOT_PACKAGES: readonly MatanotPackageData[] = [
  {
    id: "digital-only",
    title: "דיגיטלי בלבד",
    items: [
      "קובץ WAV/MP3 מוכן לשליחה",
      "ברכה כתובה קצרה לצירוף",
      "התאמה למסירה בוואטסאפ או במייל",
    ],
    startingPrice: "ללא תוספת למחיר ההפקה",
    note: "מתאים למי שרוצה למסור מהר וללא מארז פיזי.",
    whatsappHref: buildWhatsAppHref({
      text: "היי יקיר, אני רוצה את חבילת דיגיטלי בלבד למתנה מוקלטת.",
      utm_source: "website",
      utm_campaign: "matanot_package_digital",
    }),
  },
  {
    id: "usb-design",
    title: "דיסק און קי + עיצוב",
    items: [
      "קובץ מוקלט על דיסק און קי",
      "מיתוג עם שם המקבל/ת או הזוג",
      "ברכה כתובה מודפסת",
    ],
    startingPrice: "+199 ש\"ח למחיר ההפקה",
    note: "מתאים למסירה אישית באירוע או לפניו.",
    whatsappHref: buildWhatsAppHref({
      text: "היי יקיר, אני רוצה את חבילת דיסק און קי + עיצוב למתנה מוקלטת.",
      utm_source: "website",
      utm_campaign: "matanot_package_usb",
    }),
  },
  {
    id: "full-gift-box",
    title: "חבילה מושלמת: דיסק און קי + אוזניות + קופסה",
    items: [
      "דיסק און קי מעוצב עם הקובץ",
      "אוזניות סגורות ונוחות",
      "קופסת מתנה ופתק אישי",
    ],
    startingPrice: "+399 ש\"ח למחיר ההפקה",
    note: "למי שרוצה למסור את ההקלטה כמארז מלא.",
    whatsappHref: buildWhatsAppHref({
      text: "היי יקיר, אני רוצה את החבילה המושלמת עם דיסק און קי, אוזניות וקופסה.",
      utm_source: "website",
      utm_campaign: "matanot_package_full",
    }),
  },
] as const;

export const MATANOT_FINAL_CTA = {
  title: "רוצים עזרה בבחירת המתנה?",
  href: buildWhatsAppHref({
    text: "היי יקיר, אשמח לעזרה בבחירת מתנה מוקלטת לפי סוג האירוע והתקציב.",
    utm_source: "website",
    utm_campaign: "matanot_final_cta",
  }),
} as const;
