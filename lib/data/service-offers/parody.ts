import { isServiceOfferPublished } from "@/lib/data/service-offers/status";
import type { ServiceOfferPage } from "@/lib/data/service-offers/types";

/**
 * פרודיה וקאבר עם מילים חדשות. במילים של הבעלים, 11.10.2026: "לוקחים שיר שהלחן
 * מוכר, או שיר שרוצים לעשות אותו הומוריסטי ומצחיק", "הלקוח שולח כמה שיותר
 * פרטים, ומה שהוא באמת רוצה שיהיה, ואז אנחנו יחד מרכיבים, מי יהיה הזמר, על איזה
 * לחן", ו"מקבלים אותו תוך 24 שעות מוכן". המחירים: song_parody, song_recording
 * לקאבר עם המילים שלכם, ו-song_house_singer.
 */
export const PARODY_PAGE: ServiceOfferPage = {
  path: "/studio/parody",
  metaTitle: "פרודיה לאירוע, שיר מוכר עם מילים חדשות",
  metaDescription:
    "פרודיה ליום הולדת, לחתונה, לפרישה או למסיבת רווקות: לוקחים לחן מוכר וכותבים לו מילים חדשות ומצחיקות. בוחרים יחד לחן ומי שר, והשיר מוכן תוך 24 שעות מאישור המילים.",
  keywords: ["פרודיה לאירוע", "פרודיה ליום הולדת", "שיר עם מילים חדשות", "פרודיה לחתונה", "שיר מצחיק במתנה"],
  eyebrow: "פרודיה",
  h1: "פרודיה לאירוע, לחן מוכר עם מילים חדשות",
  intro:
    "לוקחים שיר שכולם מכירים, וכותבים לו מילים חדשות, מצחיקות ואישיות. ליום הולדת, לחתונה, לפרישה או למסיבת רווקות.",
  highlight: "השיר מוכן תוך 24 שעות מרגע שאישרתם את המילים.",
  audience: {
    title: "למי זה מתאים",
    items: [
      "יום הולדת עגול, עם הבדיחות שרק החברים מבינים",
      "חתונה, כשהחברים רוצים לשיר משהו לזוג",
      "פרישה או פרידה מהעבודה",
      "מסיבת רווקות"
    ],
  },
  steps: [
    {
      title: "שולחים לנו פרטים",
      description: "כמה שיותר פרטים, ומה שאתם באמת רוצים שיהיה בשיר: סיפורים, בדיחות פנימיות, שמות.",
    },
    {
      title: "מרכיבים יחד",
      description: "בוחרים יחד על איזה לחן, ומי שר: אתם, או זמר או זמרת מהצוות שלנו.",
    },
    {
      title: "כותבים ומקליטים",
      description: "כותבים את המילים, מקליטים, ועושים מיקס ומאסטר. מלווים אתכם מהפרטים הראשונים ועד השיר המוכן.",
    },
    {
      title: "השיר אצלכם",
      description: "השיר המוכן אצלכם תוך 24 שעות מרגע שאישרתם את המילים.",
    },
  ],
  includesTitle: "מה כלול בפרודיה",
  includes: [
    "כתיבת מילים חדשות ללחן מוכר",
    "בחירה משותפת של הלחן ושל מי ששר",
    "הקלטה, מיקס ומאסטר",
    "יש לכם כבר מילים? קאבר עם המילים שלכם, במחיר של הקלטת שיר",
  ],
  priceTitle: "כמה עולה פרודיה",
  prices: [
    { id: "song_parody", label: "פרודיה: אנחנו כותבים ומקליטים" },
    { id: "song_recording", label: "קאבר עם המילים שלכם", note: "אתם מביאים את המילים, אנחנו מקליטים" },
    { id: "song_house_singer", addon: true, note: "אם לא רוצים לשיר בעצמכם" },
    { id: "studio_pitch_correction", addon: true },
  ],
  videos: {
    title: "פרודיות מהאולפן",
    description: "פרודיות שהפקנו באולפן. כך נשמע לחן מוכר עם מילים חדשות.",
    items: [
      {
        "videoId": "nsHUwF9hc_U",
        "title": "איך עושים פרודיה? מאחורי הקלעים באולפן"
      },
      {
        "videoId": "y1LHYRx7teQ",
        "title": "הזוג הזה, גרסת הסטודנטים"
      },
      {
        "videoId": "Aj1j4Km0V5s",
        "title": "ג'וני, הגרסה הנשית"
      },
      {
        "videoId": "xID2V0BM_g0",
        "title": "פרודיה על מתכון מטבוחה"
      }
    ],
  },
  alternatives: {
    title: "פרודיה, או משהו אחר?",
    items: [
      {
        "href": "/studio/original-song",
        "label": "שיר מקורי לכל אירוע",
        "body": "רוצים לחן חדש שנכתב רק בשבילכם, ולא לחן מוכר."
      },
      {
        "href": "/studio/recording-song-modiin/gifts/funny-ringtone",
        "label": "רינגטון מצחיק במתנה",
        "body": "רוצים משהו קצר ומצחיק לטלפון, ולא שיר שלם."
      },
      {
        "href": "/business/corporate-songs",
        "label": "שיר לחברה",
        "body": "השיר מיועד לחברה או לצוות, עם חשבונית מס."
      },
      {
        "href": "/studio/professional-singer",
        "label": "שיר בביצוע זמר מהצוות",
        "body": "אתם לא רוצים לשיר בכלל."
      }
    ],
  },
  faqs: [
    {
      id: "parody-what-to-send",
      question: "מה צריך לשלוח לכם?",
      answer:
        "כמה שיותר פרטים, ומה שאתם באמת רוצים שיהיה בשיר: למי השיר, סיפורים, בדיחות פנימיות ושמות. משם מרכיבים יחד.",
    },
    {
      id: "parody-who-sings",
      question: "מי שר את הפרודיה?",
      answer: "אתם, או זמר או זמרת מהצוות שלנו. מחליטים יחד, לפי השיר והאירוע.",
    },
    {
      id: "parody-own-lyrics",
      question: "כבר כתבתי מילים. אפשר רק להקליט?",
      answer: "כן. זה קאבר עם המילים שלכם, במחיר של הקלטת שיר: הקלטה, מיקס ומאסטר.",
    },
    {
      id: "parody-time",
      question: "תוך כמה זמן השיר מוכן?",
      answer: "תוך 24 שעות מרגע שאישרתם את המילים.",
    },
    {
      id: "parody-what",
      question: "מה זה פרודיה לאירוע?",
      answer: "לוקחים שיר שהלחן שלו מוכר לכולם, וכותבים לו מילים חדשות על האדם ועל האירוע. הקהל מזהה את הלחן, והמילים מספרות עליכם.",
    },
    /* המסירה: הסקשן "מה מקבלים ביד" ב-components/seo/RecordingSongModiinPageContent.tsx */
    {
      id: "parody-delivery",
      question: "מה מקבלים בסוף?",
      answer: "את השיר בשני פורמטים, WAV ו-MP3, בוואטסאפ ובקישור להורדה.",
    },
  ],
  whatsapp: {
    packageLabel: "פרודיה לאירוע",
    priceId: "song_parody",
    utmCampaign: "parody",
  },
  related: [
    { href: "/studio/original-song", label: "שיר מקורי לכל אירוע" },
    { href: "/studio/professional-singer", label: "זמר שישיר בשבילכם" },
    { href: "/studio/recording-song-modiin/gifts", label: "מתנות מהאולפן" },
  ],
  draft: !isServiceOfferPublished("/studio/parody"),
};
