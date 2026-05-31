import type { RecordingSongExampleVideo } from "@/lib/data/recording-song-modiin-page";
import { YOUTUBE_BAT_MITZVAH_CLIP_IDS } from "@/lib/data/youtube-embeds";

const BAT_MITZVAH_VIDEO_TITLES = [
  "קליפ בת מצווה - תמונות ילדות, סרטונים וקליפ מהאולפן",
  "קליפ בת מצווה - דוגמה מהאולפן",
  "קליפ משפחה וחברים - בת מצווה",
  "קליפ מוזיקלי לאירוע",
  "אווירה באולפן - הקלטה בפועל",
] as const;

export const BAT_MITZVAH_CLIP_VIDEOS: readonly RecordingSongExampleVideo[] =
  YOUTUBE_BAT_MITZVAH_CLIP_IDS.map((videoId, i) => ({
    videoId,
    title: BAT_MITZVAH_VIDEO_TITLES[i] ?? `קליפ בת מצווה ${i + 1}`,
  }));

export const BAT_MITZVAH_FEATURED_VIDEO_ID = YOUTUBE_BAT_MITZVAH_CLIP_IDS[0];

export const BAT_MITZVAH_CLIP_TYPES: readonly {
  id: string;
  title: string;
  intro: string;
  bullets: readonly string[];
  note?: string;
}[] = [
  {
    id: "surprise",
    title: "קליפ בהפתעה - המשפחה/החברים שרים לכלת השמחה",
    intro:
      "אחד הקליפים המרגשים ביותר. ממלאים שאלון על כלת בת המצווה, ואנחנו כותבים שיר אישי עליה, על התכונות, הסיפורים המשפחתיים וכל מה שמרגש.",
    bullets: [
      "כתיבת מילים מקוריות",
      "חלוקת סולואים ותפקידים",
      "הקלטות מקצועיות",
      "צילום קליפ מלא",
      'שילוב תמונות, חפצים, בע"ח או כל אלמנט שמופיע בשיר',
    ],
    note: "מומלץ שיר קצבי ושמח - במיוחד כשיש הרבה משתתפים.",
  },
  {
    id: "combined",
    title: "קליפ משולב - הילדה + חברות/חברים/משפחה",
    intro:
      "כלת בת המצווה שרה ולצידה משתתפים נוספים. כולם לומדים את חלקם, ואנחנו דואגים לחלוקה נכונה בין בתים, פזמונים וסולואים. הילדה תמיד במרכז.",
    bullets: [
      "במה גדולה שמכילה מעל 25 משתתפים",
      "כלי נגינה לכולם",
      "אפשרות לשלב צילומי חוץ (בהתאם לצורך)",
    ],
    note: "נמליץ אם צילומי חוץ באמת יתרמו - לפעמים משדרג, לפעמים מיותר.",
  },
  {
    id: "solo",
    title: "קליפ סולו - כלת בת המצווה במרכז",
    intro:
      "הילדה מבצעת את השיר לבדה ומככבת לאורך כל הקליפ. לעניין ויזואלי משלבים:",
    bullets: [
      "אפקטים חזותיים ותאורה מיוחדת באולפן",
      "הילדה במוקד מלא לאורך כל הקליפ",
    ],
  },
] as const;

export const BAT_MITZVAH_PRODUCTION_STYLES: readonly {
  title: string;
  body: string;
}[] = [
  {
    title: "קליפ מוזיקלי - סגנון MTV / ערוץ 24",
    body: "הכול מצולם ב-FULL HD ומוקלט באולפן מקצועי.",
  },
  {
    title: "קליפ בת מצווה מרגש",
    body: "בחירת נושא, כתיבת תסריט, צילום מקצועי, הקלטות ועריכה קולנועית.",
  },
  {
    title: "שיר מתנה מרגש",
    body: "אווירה רגועה, מיקרופון תלוי מהתקרה בלי סטנד מלחיץ, וליווי צמוד - גם לחובבנים.",
  },
] as const;

export const BAT_MITZVAH_STARTING_PRICE = "2,590";

export const BAT_MITZVAH_CLIP_FAQ: readonly {
  id: string;
  question: string;
  answer: string;
  whatsappText: string;
  utmCampaign: string;
}[] = [
  {
    id: "what-included",
    question: "מה כולל קליפ בת מצווה?",
    answer:
      "שאלון סיפור אישי, כתיבת מילים, הקלטה באולפן, צילום, שילוב תמונות ילדות וסרטונים מהבית, עריכה ומיקס - עד קובץ מוכן להקרנה באולם ולרשתות.",
    whatsappText: "היי יקיר! מעוניינים בקליפ לבת מצווה - מה כלול בחבילה?",
    utmCampaign: "bat_mitzvah_faq_included",
  },
  {
    id: "childhood-photos",
    question: "איך משלבים תמונות ילדות וסרטונים בקליפ?",
    answer:
      "אוספים תמונות וסרטונים מהמשפחה (וואטסאפ, אלבומים, טלפונים). בעריכה משלבים אותם עם הקליפ מהאולפן - מעברים, טקסטים ומוזיקה שמספרים את הסיפור של כלת בת המצווה.",
    whatsappText: "היי יקיר! יש לנו תמונות ילדות - איך משלבים בקליפ?",
    utmCampaign: "bat_mitzvah_faq_photos",
  },
  {
    id: "cant-sing",
    question: "הילדה לא זמרת - זה עדיין יצא מקצועי?",
    answer:
      "כן. רוב הלקוחות אינם זמרים מקצועיים. יש ליווי קולי באולפן, תיקוני AI לדיוק ועריכה שמביאה את התוצאה לרמה גבוהה - גם בקליפ סולו וגם בהפתעה עם המשפחה.",
    whatsappText: "היי יקיר! בת מצווה שלא שרה - האם קליפ עדיין אפשרי?",
    utmCampaign: "bat_mitzvah_faq_sing",
  },
  {
    id: "gift-voucher",
    question: "אפשר לרכוש קליפ בת מצווה כשובר מתנה?",
    answer:
      "בהחלט. מזמינים שובר מתנה, מציינים שמדובר במתנה לבת/בר מצווה, והמקבל/ת מתאמ/ת תאריך להקלטה וצילום באולפן במודיעין.",
    whatsappText: "היי יקיר! רוצים שובר מתנה - קליפ לבת מצווה.",
    utmCampaign: "bat_mitzvah_faq_voucher",
  },
] as const;
