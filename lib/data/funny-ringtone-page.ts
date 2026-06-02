import { formatNis } from "@/lib/data/pricing";

export const RINGTONE_PRICE_NIS = 299;

export const RINGTONE_AUDIO = {
  beforeSrc: "/audio/before-rengtone.mp3",
  afterSrc: "/audio/after-ringtone.mp3",
  beforeLabel: "הקלטה גולמית",
  afterLabel: "רינגטון מוכן ומצחיק",
} as const;

export const RINGTONE_HERO = {
  eyebrow: "מתנה לכיף",
  title: "רינגטון מצחיק שיגרום לכולם לצחוק בטלפון",
  subtitle:
    "מתנה מקורית ליום הולדת, הפתעה לחבר/ה או אירוע מיוחד — מקליטים, מעבדים ומגישים רינגטון אישי שמישהו באמת ישמיע בטלפון.",
  priceBadge: `מבצע ${formatNis(RINGTONE_PRICE_NIS)}`,
  whatsappText:
    "היי יקיר! מעוניינ/ת ברינגטון מצחיק במתנה (299 ש\"ח). אשמח לפרטים.",
  utmCampaign: "gift_funny_ringtone",
} as const;

export const RINGTONE_INCLUDES: readonly {
  title: string;
  body: string;
}[] = [
  {
    title: "הקלטה ועריכה מקצועית",
    body: "לוקחים הקלטה גולמית — ומחזירים רינגטון מלוטש, ברור ומצחיק.",
  },
  {
    title: "קובץ מוכן להתקנה",
    body: "מקבלים קובץ שמתאים ל-iPhone ו-Android, עם הוראות התקנה קצרות.",
  },
  {
    title: "סגנון לפי הדמות",
    body: "מצחיק, מרגש או קורע — מתאימים את הטון למי שמקבל את המתנה.",
  },
  {
    title: "מחיר מבצע ברור",
    body: `${formatNis(RINGTONE_PRICE_NIS)} לרינגטון אישי — בלי הפתעות.`,
  },
] as const;

export const RINGTONE_STEPS: readonly {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "1",
    title: "שולחים רעיון",
    body: "מי מקבל את המתנה, מה הסיפור ואיזה סגנון מצחיק מתאים — בוואטסאפ או בטופס.",
  },
  {
    step: "2",
    title: "מקליטים ומעבדים",
    body: "מקליטים את הקטע, מוסיפים עיבוד, אפקטים ועריכה — עד שזה נשמע כמו רינגטון אמיתי.",
  },
  {
    step: "3",
    title: "מקבלים ומתקינים",
    body: "שולחים קובץ מוכן + הוראות. המקבל/ת מתקין/ה בטלפון — וההפתעה מתחילה בצלצול הבא.",
  },
] as const;

export const RINGTONE_AUDIENCES: readonly {
  badge: string;
  title: string;
  body: string;
}[] = [
  {
    badge: "יום הולדת",
    title: "מתנה ליום הולדת",
    body: "הפתעה קטנה שגורמת לצחוק בכל פעם שהטלפון מצלצל — מושלם לחבר/ה קרוב/ה.",
  },
  {
    badge: "אירוע מיוחד",
    title: "הפתעה לאירוע",
    body: "בר מצווה, מסיבת פרידה או כל אירוע — רינגטון שכולם יזכרו אחרי.",
  },
  {
    badge: "לחבר/ה",
    title: "מתנה לחבר הכי טוב",
    body: "לא עוד חולצה או כוס — מתנה אישית שממש משתמשים בה כל יום.",
  },
] as const;

export const RINGTONE_FAQ: readonly {
  id: string;
  question: string;
  answer: string;
  whatsappText: string;
  utmCampaign: string;
}[] = [
  {
    id: "how-long",
    question: "כמה זמן לוקח להכין את הרינגטון?",
    answer:
      "ברוב המקרים 3–5 ימי עבודה. צריכים מהר? דברו איתנו — נבדוק אפשרות אקספרס.",
    whatsappText: "היי יקיר! רינגטון מצחיק — כמה זמן לוקח?",
    utmCampaign: "ringtone_faq_timing",
  },
  {
    id: "install",
    question: "איך מתקינים את הרינגטון בטלפון?",
    answer:
      "שולחים קובץ מוכן עם הוראות קצרות ל-iPhone ו-Android. זה לוקח דקה — גם למי שלא טכני.",
    whatsappText: "היי יקיר! איך מתקינים את הרינגטון?",
    utmCampaign: "ringtone_faq_install",
  },
  {
    id: "content",
    question: "מה אפשר לשים ברינגטון?",
    answer:
      "ברכה מצחיקה, ציטוט פנימי, שיר קצר, קול מוכר — כל רעיון שמתאים למקבל/ת המתנה. נעזור לנסח.",
    whatsappText: "היי יקיר! מה אפשר לשים ברינגטון מצחיק?",
    utmCampaign: "ringtone_faq_content",
  },
  {
    id: "price",
    question: "האם המחיר כולל הכל?",
    answer: `כן — ${formatNis(RINGTONE_PRICE_NIS)} מבצע כולל הקלטה, עריכה וקובץ מוכן. בלי עלויות נסתרות.`,
    whatsappText: "היי יקיר! מה כולל המחיר של הרינגטון?",
    utmCampaign: "ringtone_faq_price",
  },
] as const;

export const RINGTONE_PAGE_PATH =
  "/studio/recording-song-modiin/gifts/funny-ringtone" as const;
