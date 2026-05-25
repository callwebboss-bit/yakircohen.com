import type { RecordingSongExampleVideo } from "@/lib/data/recording-song-modiin-page";
import { YOUTUBE_BAT_MITZVAH_CLIP_IDS } from "@/lib/data/youtube-embeds";

const BAT_MITZVAH_VIDEO_TITLES = [
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
