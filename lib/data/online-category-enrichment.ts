import type { AudioDemoId } from "@/lib/data/audio-demos";
import {
  getPodcastZoomYoutubeVideoId,
  PODCAST_ZOOM_PROOF,
} from "@/lib/data/podcast-proof";

export type OnlineCategoryFaq = {
  id: string;
  question: string;
  answer: string;
};

export type OnlineDeliveryTier = {
  name: string;
  turnaround: string;
  includes: string;
  note?: string;
  featured?: boolean;
};

export type OnlineCategoryProof = {
  headline: string;
  description: string;
  bullets?: readonly string[];
  demoId?: AudioDemoId;
  demoVariant?: "restoration" | "vocal" | "remote";
  youtubeVideoId?: string;
  youtubeTitle?: string;
};

export type OnlineCategoryEnrichment = {
  slug: string;
  ctaPrimaryLabel: string;
  ctaWhatsAppText: string;
  leadHeading: string;
  leadDescription: string;
  deliveryTiers: readonly OnlineDeliveryTier[];
  proof: OnlineCategoryProof;
  faqs: readonly OnlineCategoryFaq[];
  relatedCategorySlugs: readonly string[];
};

export const ONLINE_CATEGORY_ENRICHMENT: readonly OnlineCategoryEnrichment[] = [
  {
    slug: "audio-music",
    ctaPrimaryLabel: "שלחו קובץ אודיו לבדיקה ראשונית",
    ctaWhatsAppText:
      "היי יקיר! יש לי קובץ אודיו/שירה שצריך שיפור או מיקס. אשמח לבדיקה ראשונית והצעת מחיר.",
    leadHeading: "השאירו פרטים - אודיו ומוזיקה",
    leadDescription:
      "צרפו אורך הקלטה ומה המטרה (שיר, ברכה, ארכיון). נחזור עם מסלול ומחיר.",
    deliveryTiers: [
      {
        name: "מהיר",
        turnaround: "24-48 שעות",
        includes: "ניקוי רעשים, איזון בסיסי ומסירה ב-MP3/WAV.",
        note: "לקטעים קצרים עד ~5 דקות",
      },
      {
        name: "סטנדרט",
        turnaround: "2-4 ימי עסקים",
        includes: "עריכה מלאה, תיקון קול, loudness וסבב תיקונים אחד.",
        featured: true,
      },
      {
        name: "פרימיום",
        turnaround: "לפי פרויקט",
        includes: "מיקס + מאסטרינג, stems, מספר סבבי תיקון וליווי צמוד.",
      },
    ],
    proof: {
      headline: "שומעים את ההבדל - אודיו",
      description:
        "דוגמה אמיתית משחזור והשבחה. אנחנו משלבים AI עם אוזן מקצועית - לא רק פילטר אוטומטי.",
      demoId: "recording-vocal-polish",
      demoVariant: "vocal",
    },
    faqs: [
      {
        id: "formats",
        question: "אילו פורמטים אפשר לשלוח?",
        answer:
          "MP3, WAV, M4A, AAC ועוד. לא בטוחים? שלחו בוואטסאפ ונאשר לפני שמתחילים.",
      },
      {
        id: "pitch",
        question: "האם תיקון זיופים יישמע רובוטי?",
        answer:
          "לא. המטרה היא קול טבעי ויציב - תיקון עדין שמחמיא, בלי אפקט \"אוטוטיון\" צורם.",
      },
      {
        id: "sample",
        question: "אפשר לשמוע סקיצה לפני תשלום מלא?",
        answer:
          "כן. לפרויקטים מורכבים מומלץ קטע 30 שניות לפני/אחרי חינם כדי ליישר ציפיות.",
      },
      {
        id: "revision",
        question: "כמה סבבי תיקון כלולים?",
        answer:
          "במסלול סטנדרט - סבב תיקון אחד. במסלול פרימיום אפשר להרחיב לפי הצורך.",
      },
      {
        id: "done",
        question: "אתם רק ממליצים על כלים או מבצעים?",
        answer:
          "מבצעים הכל. אתם שולחים חומר גלם - אנחנו מחזירים קובץ מוכן לשימוש.",
      },
    ],
    relatedCategorySlugs: ["podcast-voice", "image-design"],
  },
  {
    slug: "podcast-voice",
    ctaPrimaryLabel: "שלחו פרק / הקלטה לבדיקה",
    ctaWhatsAppText:
      "היי יקיר! יש לי פרק פודקאסט או הקלטת דיבור לעריכה. אשמח להצעת מחיר וזמן מסירה.",
    leadHeading: "השאירו פרטים - פודקאסט ודיבור",
    leadDescription:
      "ציינו אורך הפרק והאם צריך גם תמלול או גרסאות קצרות. נחזור עם הצעה מדויקת.",
    deliveryTiers: [
      {
        name: "מהיר",
        turnaround: "24-72 שעות",
        includes: "ניקוי רעשים, חיתוך בסיסי ו-normalize לפלטפורמות.",
        note: "פרקים קצרים עד ~20 דקות",
      },
      {
        name: "סטנדרט",
        turnaround: "3-5 ימי עסקים",
        includes:
          "עריכה מלאה, מוזיקת רקע, intro/outro, loudness ל-Spotify ו-Apple Podcasts.",
        featured: true,
      },
      {
        name: "פרימיום",
        turnaround: "לפי לוח זמנים",
        includes: "סדרת פרקים, תמלול, קליפים קצרים ותיאום מול מפיק חיצוני.",
      },
    ],
    proof: {
      headline: "שומעים את ההבדל - פודקאסט",
      description:
        "הקלטות זום, חדר ביתי או פרק גולמי - הופכים לפרק נקי ומוכן ל-Spotify.",
      demoId: PODCAST_ZOOM_PROOF.demoId,
      demoVariant: "remote",
      ...(getPodcastZoomYoutubeVideoId()
        ? {
            youtubeVideoId: getPodcastZoomYoutubeVideoId()!,
            youtubeTitle: PODCAST_ZOOM_PROOF.youtubeTitle,
          }
        : {}),
    },
    faqs: [
      {
        id: "length",
        question: "כמה עולה עריכת פרק?",
        answer:
          "תלוי באורך ובמורכבות (מספר דוברים, רעש, מוזיקה). שלחו קובץ ונחזור עם מחיר שקוף.",
      },
      {
        id: "platforms",
        question: "האם הקובץ מוכן להעלאה ל-Spotify?",
        answer:
          "כן. אנחנו מספקים loudness ופורמטים בהתאם לדרישות הפלטפורמות העיקריות.",
      },
      {
        id: "transcript",
        question: "אפשר גם תמלול?",
        answer:
          "כן - תמלול AI עם עריכה אנושית, ואפשר לשלב תקצירים לבלוג או רשתות.",
      },
      {
        id: "raw",
        question: "מה לשלוח - WAV או MP3?",
        answer:
          "WAV או MP3 באיכות גבוהה. אם יש רק הקלטת זום - גם זה בסדר, נשפר מה שאפשר.",
      },
      {
        id: "rush",
        question: "יש אפשרות לדחיפות?",
        answer: "כן, בתיאום מראש ובתוספת תשלום לפי עומס הסטודיו.",
      },
    ],
    relatedCategorySlugs: ["audio-music", "video-content"],
  },
  {
    slug: "video-content",
    ctaPrimaryLabel: "שלחו קישור לוידאו או בריף קצר",
    ctaWhatsAppText:
      "היי יקיר! יש לי וידאו / תוכן ארוך שצריך עריכה או חיתוך לרשתות. אשמח להצעת מחיר.",
    leadHeading: "השאירו פרטים - וידאו ותוכן",
    leadDescription:
      "שלחו קישור ל-Drive או תיאור הפרויקט. נחזור עם חבילה ולו״ז.",
    deliveryTiers: [
      {
        name: "מהיר",
        turnaround: "2-4 ימי עסקים",
        includes: "חיתוך ל-3-5 קליפים קצרים + כתוביות בסיסיות.",
        note: "מתוך חומר קיים",
      },
      {
        name: "סטנדרט",
        turnaround: "5-10 ימי עסקים",
        includes: "עריכת וידאו שיווקי, ניקוי אודיו, כתוביות RTL וגרסאות לרשתות.",
        featured: true,
      },
      {
        name: "פרימיום",
        turnaround: "לפי פרויקט",
        includes: "סדרת תוכן, תבנית מותג, מספר סבבי עריכה וליווי קמפיין.",
      },
    ],
    proof: {
      headline: "מה מקבלים בפועל",
      description: "תוכן שמוכן לפרסום - לא רק קבצי גלם.",
      bullets: [
        "קצב עריכה מותאם לטיקטוק, רילס ויוטיוב",
        "כתוביות בעברית עם הדגשות מפתח",
        "אודיו נקי גם מהקלטות ביתיות",
        "גרסאות מרובות מאותו חומר (חיסכון בצילום)",
      ],
    },
    faqs: [
      {
        id: "source",
        question: "צריך לצלם מחדש או מספיק חומר קיים?",
        answer:
          "ברוב המקרים מספיק חומר קיים - ראיון, וובינר או הקלטת מסך. נגיד מראש אם חסר משהו.",
      },
      {
        id: "shorts",
        question: "כמה קליפים קצרים אפשר לייצר מפרק אחד?",
        answer:
          "תלוי באורך ובצפיפות התוכן. בדרך כלל 3-10 קליפים לפרק שעה - לפי בריף.",
      },
      {
        id: "subs",
        question: "הכתוביות מדויקות בעברית?",
        answer:
          "כן - AI + עריכה ידנית לטעויות, שמות ומונחים מקצועיים.",
      },
      {
        id: "brand",
        question: "אפשר לשמור על סגנון מותג קבוע?",
        answer:
          "בהחלט. מגדירים פונט, צבעים, פתיח וסגיר - וכל הפרקים נראים אחיד.",
      },
    ],
    relatedCategorySlugs: ["podcast-voice", "image-design"],
  },
  {
    slug: "image-design",
    ctaPrimaryLabel: "שלחו תמונות או בריף עיצובי",
    ctaWhatsAppText:
      "היי יקיר! יש לי תמונות לשדרוג ב-AI או חומרים לעיצוב. אשמח להצעת מחיר מהירה.",
    leadHeading: "השאירו פרטים - תמונה ועיצוב",
    leadDescription:
      "ציינו כמה תמונות ומה המטרה (אלבום, קמפיין, אתר). נחזור עם הצעה.",
    deliveryTiers: [
      {
        name: "מהיר",
        turnaround: "24-48 שעות",
        includes: "עד 5 תמונות - upscale, חידוד וניקוי בסיסי.",
      },
      {
        name: "סטנדרט",
        turnaround: "3-5 ימי עסקים",
        includes: "חבילת תמונות + וריאציות לבאנרים/סושיאל לפי בריף.",
        featured: true,
      },
      {
        name: "פרימיום",
        turnaround: "לפי פרויקט",
        includes: "שחזור אלבומים, סדרת קריאייטיב ומיתוג ויזואלי אחיד.",
      },
    ],
    proof: {
      headline: "לפני ואחרי - תמונה",
      description:
        "תמונות ישנות, מטושטשות או מסך - הופכות לנכסים ברזולוציה גבוהה.",
      bullets: [
        "שחזור פרטים בפנים וברקע",
        "הגדלה ללא פיקסליזציה בולטת",
        "צבעים טבעיים - לא \"פלסטיק\" מוגזם",
        "מסירה מוכנה להדפסה, אתר ורשתות",
      ],
    },
    faqs: [
      {
        id: "old",
        question: "תמונה ישנה ומקולפת - אפשר להציל?",
        answer:
          "ברוב המקרים כן. שלחו דוגמה ונגיד מה ריאלי לפני שמתחייבים לתוצאה.",
      },
      {
        id: "count",
        question: "איך מתמחרים - לפי תמונה?",
        answer:
          "כן, לרוב לפי כמות ומורכבות. חבילות מרובות משתלמות יותר.",
      },
      {
        id: "rights",
        question: "למי שייכות התמונות אחרי העיבוד?",
        answer: "לכם - מסירה מלאה לשימוש מסחרי או פרטי לפי מה שסיכמנו.",
      },
      {
        id: "brief",
        question: "אין לי תמונות - רק רעיון?",
        answer:
          "אפשר להתחיל מבריף ולייצר וריאציות גרפיות. נפרט מה נדרש מכם בשלב הראשון.",
      },
    ],
    relatedCategorySlugs: ["video-content", "audio-music"],
  },
] as const;

export function getOnlineCategoryEnrichment(
  slug: string,
): OnlineCategoryEnrichment | undefined {
  return ONLINE_CATEGORY_ENRICHMENT.find((item) => item.slug === slug);
}
