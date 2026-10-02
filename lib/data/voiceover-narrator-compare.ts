import { SKEPTICISM_CTA } from "@/lib/data/conversion-copy";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import { absoluteUrl } from "@/lib/site-url";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";

export type VoiceoverNarratorCompareContext = "page" | "portfolio" | "compact";

export const VOICEOVER_OTHER_SRC = "/audio/voiceover-other-narrator.mp3";
export const VOICEOVER_YAKIR_SRC = "/audio/voiceover-yakir-cohen.mp3";
export const VOICEOVER_YAKIR_WARM_SRC = "/audio/voiceover-yakir-cohen-warm.mp3";

/**
 * הגרסה החמה מוצגת רק כשהקובץ voiceover-yakir-cohen-warm.mp3 קיים ב-public/audio.
 * מקור: "YES YAKIR 2.mp3" - להעתיק לשם ה-URL-בטוח ואז להעביר ל-true.
 * נכון לעכשיו הקובץ חסר בדיסק, לכן false. כשהוא עולה - true והנגן מופיע.
 */
export const VOICEOVER_YAKIR_WARM_READY = false;

export const VOICEOVER_COMPARE_SECTION_ID = "voiceover-compare";

export const VOICEOVER_COMPARE_HEADING = "שתי דוגמאות קריינות - זה אני, וזה לא אני";

export const VOICEOVER_COMPARE_LEAD =
  "הקלטות של יקיר כהן בשני סגנונות - רשמי ונקי, וחם ואנרגטי - ולצדן הקלטה של קריין אחר. תשמעו ותחליטו.";

export const VOICEOVER_COMPARE_LEAD_SINGLE =
  "שתי הקלטות. אחת של יקיר כהן, אחת של קריין אחר. תשמעו ותחליטו.";

export const VOICEOVER_COMPARE_DISCLAIMER =
  "הדוגמה השנייה היא של קריין אחר, לא של יקיר כהן. היא מוצגת רק כדי שתוכלו לשמוע הבדל בסגנון ובסאונד. אין כאן ביקורת על הקריין.";

export const VOICEOVER_OTHER_LABEL = "לא יקיר כהן";
export const VOICEOVER_YAKIR_LABEL = "יקיר כהן";

export const VOICEOVER_OTHER_NOTE = "קריין אחר. דוגמה חיצונית.";

export const VOICEOVER_YAKIR_NOTE =
  "בקובץ 3 גרסאות של אותו משפט, עם ניואנסים שונים. עד 2 סבבי תיקונים אחרי בחירת גרסה.";

export const VOICEOVER_YAKIR_STYLE_LABEL = "סגנון רשמי ונקי";
export const VOICEOVER_YAKIR_WARM_STYLE_LABEL = "סגנון חם ואנרגטי, עם חיוך";
export const VOICEOVER_YAKIR_STYLES_NOTE =
  "אותו קריין, שני סגנונות. בוחרים כיוון - ומקליטים 3 גרסאות ביצוע לבחירה. עד 2 סבבי תיקונים אחרי בחירת גרסה.";

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
