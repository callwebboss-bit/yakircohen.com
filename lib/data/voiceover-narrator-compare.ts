import { SKEPTICISM_CTA } from "@/lib/data/conversion-copy";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import { absoluteUrl } from "@/lib/site-url";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";

export type VoiceoverNarratorCompareContext = "page" | "portfolio" | "compact";

export const VOICEOVER_OTHER_SRC = "/audio/voiceover-other-narrator.mp3";
export const VOICEOVER_YAKIR_SRC = "/audio/voiceover-yakir-cohen.mp3";
/**
 * הפרסומת הסופית במקום הדוגמה "החמה" שלא עלתה אף פעם (READY היה false, הקובץ חסר).
 * החלטת הבעלים 11.10.2026: "שיהיה הפרסומת הסופית".
 */
export const VOICEOVER_FINAL_AD = {
  videoId: "kMBtj7hLTHA",
  title: "קריינות לפרסומת טלוויזיה: בנא משקאות, ערוץ 14",
  label: "ככה זה נשמע בפרסומת הסופית",
  note: "פרסומת חג לבנא משקאות ששודרה בערוץ 14. קריינות: יקיר כהן.",
} as const;

export const VOICEOVER_COMPARE_SECTION_ID = "voiceover-compare";

export const VOICEOVER_COMPARE_HEADING = "שתי דוגמאות קריינות - זה אני, וזה לא אני";

export const VOICEOVER_COMPARE_LEAD_SINGLE =
  "שתי הקלטות. אחת של יקיר כהן, אחת של קריין אחר. תשמעו ותחליטו.";

export const VOICEOVER_COMPARE_DISCLAIMER =
  "הדוגמה השנייה היא של קריין אחר, לא של יקיר כהן. היא מוצגת רק כדי שתוכלו לשמוע הבדל בסגנון ובסאונד. אין כאן ביקורת על הקריין.";

export const VOICEOVER_OTHER_LABEL = "לא יקיר כהן";
export const VOICEOVER_YAKIR_LABEL = "יקיר כהן";

export const VOICEOVER_OTHER_NOTE = "קריין אחר. דוגמה חיצונית.";

export const VOICEOVER_YAKIR_NOTE =
  "בקובץ 3 גרסאות של אותו משפט, עם ניואנסים שונים. עד 2 סבבי תיקונים אחרי בחירת גרסה.";

export const VOICEOVER_COMPARE_SKEPTICISM = SKEPTICISM_CTA;

export const VOICEOVER_COMPARE_SERVICES_HREF = "/voiceover/services";
export const VOICEOVER_COMPARE_SERVICES_LABEL = "שירותי קריינות";
export const VOICEOVER_COMPARE_HUB_HREF = "/voiceover";

export const VOICEOVER_COMPARE_WA_TEXT =
  "שלום, שמעתי את דוגמת הקריינות באתר. אשמח להזמין קריינות.";

export const VOICEOVER_COMPARE_BOOK_CTA = resolveServiceBookCta("voiceover");

export const VOICEOVER_COMPARE_ROWS = [
  {
    label: "מי מקריין",
    other: "קריין אחר",
    yakir: "יקיר כהן",
  },
  {
    label: "הקלטה",
    other: "דוגמה חיצונית",
    yakir: "מיקרופון, פריאמפ וכיוון סאונד",
  },
  {
    label: "ביצוע",
    other: "סגנון של הקריין בדוגמה",
    yakir: "התאמת סגנון - רשמי או חם ואנרגטי - ו-3 גרסאות של אותו משפט",
  },
  {
    label: "אחרי ההקלטה",
    other: "לא חלק מהדוגמה",
    yakir: "עד 2 סבבי תיקונים, עד שהלקוח מרוצה מהתוצר",
  },
] as const;

export const VOICEOVER_COMPARE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AudioObject",
  name: "דוגמת קריינות - יקיר כהן",
  description:
    "הקלטת קריינות של יקיר כהן. בקובץ 3 גרסאות ביצוע של אותו משפט. מוצגת לצד דוגמה של קריין אחר, בלי ביקורת על הקריין.",
  encodingFormat: "audio/mpeg",
  contentUrl: absoluteUrl(VOICEOVER_YAKIR_SRC),
  inLanguage: "he",
  author: { "@id": ENTITY_IDS.founder },
} as const;
