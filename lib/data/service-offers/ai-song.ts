import { isServiceOfferPublished } from "@/lib/data/service-offers/status";
import type { ServiceOfferPage } from "@/lib/data/service-offers/types";

/**
 * שיר AI במתנה. במילים של הבעלים, 11.10.2026: הקול יכול להיות שלכם, קול של זמר
 * ב-AI, או זמר מאיתנו. הכול מרחוק. "את רוב התהליך אנחנו עושים ביחד, צעד צעד,
 * כאשר אם הולכים אחורה בצעד, יש לזה השלכות או תוספת מחיר". "אני עומד על איכות".
 * המחירים: ai_song_ai_voice, ai_song_your_voice, song_house_singer.
 */
export const AI_SONG_PAGE: ServiceOfferPage = {
  path: "/studio/ai-song-gift",
  metaTitle: "שיר AI במתנה, בקול שלכם או בקול AI",
  metaDescription:
    "שיר אישי במתנה שנוצר עם AI: כותבים יחד את המילים, והקול יכול להיות שלכם, קול AI, או זמר מהצוות שלנו. הכול מרחוק, צעד אחרי צעד.",
  keywords: ["שיר AI במתנה", "שיר בינה מלאכותית", "שיר אישי AI", "שיר מתנה AI ליום הולדת", "שיר AI בעברית"],
  eyebrow: "שיר AI",
  h1: "שיר AI במתנה",
  intro:
    "שיר אישי שנוצר עם AI, ונבנה יחד איתכם. הקול בשיר יכול להיות שלכם, קול של זמר שנוצר ב-AI, או זמר או זמרת מהצוות שלנו. הכול מרחוק, בלי להגיע לאולפן.",
  audience: {
    title: "למי זה מתאים",
    items: [
      "מתנה מרחוק, בלי להגיע לאולפן",
      "מי שלא רוצה לשיר",
      "יום הולדת, יום נישואין או הפתעה"
    ],
  },
  steps: [
    {
      title: "מספרים לנו",
      description: "למי השיר, מה האירוע, ומה אתם רוצים שיהיה בו.",
    },
    {
      title: "כותבים יחד",
      description: "כותבים את המילים יחד איתכם, ובוחרים סגנון וקול.",
    },
    {
      title: "שומעים ומעירים",
      description: "בכל שלב אתם שומעים מה יצא, מעירים, ואנחנו משנים לפי הצורך.",
    },
    {
      title: "השיר אצלכם",
      description: "מלטשים, עושים מיקס, ושולחים לכם את השיר המוכן.",
    },
  ],
  includesTitle: "מה כלול בשיר AI",
  includes: [
    "מילים שכותבים יחד איתכם",
    "מוזיקה ב-AI, בסגנון שבוחרים",
    "קול לבחירה: שלכם, קול AI או זמר מהצוות",
    "הערות ותיקונים בכל שלב, עד שאתם מרוצים",
  ],
  priceTitle: "כמה עולה שיר AI",
  prices: [
    { id: "ai_song_ai_voice", label: "שיר AI בקול AI" },
    { id: "ai_song_your_voice", label: "שיר AI בקול שלכם", note: "מקליטים בטלפון ושולחים, אנחנו מנקים ומערבבים" },
    { id: "song_house_singer", addon: true, note: "זמר או זמרת מהצוות במקום קול AI" },
  ],
  priceNote:
    "עובדים יחד, צעד אחרי צעד. חזרה לשלב שכבר אישרתם משפיעה על כל מה שנבנה אחריו, ולכן היא בתוספת מחיר.",
  videos: {
    title: "איך נשמע שיר שנבנה עם AI",
    description: "סשן אמיתי באולפן: מרעיון לשיר מלא עם AI.",
    items: [
      {
        "videoId": "hmEuYVR4ifA",
        "title": "להקליט שיר ב-10 דקות עם AI"
      }
    ],
  },
  alternatives: {
    title: "שיר AI, או משהו אחר?",
    items: [
      {
        "href": "/studio/original-song",
        "label": "שיר מקורי לכל אירוע",
        "body": "רוצים לחן שנכתב ומוקלט באולפן, עם נגיעה אנושית מההתחלה."
      },
      {
        "href": "/studio/recording-song-modiin",
        "label": "הקלטת שיר באולפן",
        "body": "רוצים את החוויה של הקלטה באולפן."
      },
      {
        "href": "/academy/ai-music",
        "label": "קורס AI במוזיקה",
        "body": "רוצים ללמוד ליצור לבד עם AI."
      }
    ],
  },
  faqs: [
    {
      id: "ai-voice-options",
      question: "של מי הקול בשיר?",
      answer: "לבחירתכם: הקול שלכם, קול של זמר שנוצר ב-AI, או זמר או זמרת מהצוות שלנו.",
    },
    {
      id: "ai-remote",
      question: "צריך להגיע לאולפן?",
      answer: "לא. הכול נעשה מרחוק. אם בוחרים בקול שלכם, מקליטים בטלפון ושולחים לנו.",
    },
    {
      id: "ai-changes",
      question: "אפשר לבקש שינויים?",
      answer:
        "כן. בכל שלב אתם שומעים מה יצא, מעירים, ואנחנו משנים לפי הצורך. רק חזרה לשלב שכבר אישרתם היא בתוספת מחיר, כי היא משפיעה על כל מה שנבנה אחריו.",
    },
    {
      id: "ai-vs-studio",
      question: "מה ההבדל בין שיר AI להקלטת שיר באולפן?",
      answer:
        "בהקלטה באולפן שרים על פלייבק, עם ליווי בזמן ההקלטה. בשיר AI המוזיקה נוצרת ב-AI ובונים אותה יחד, מרחוק.",
    },
    {
      id: "ai-name",
      question: "השם יישמע נכון?",
      answer: "שומעים כל שלב לפני שממשיכים, כולל איך נשמע השם. מה שלא נשמע נכון, מתקנים באותו שלב.",
    },
    {
      id: "ai-lyrics",
      question: "מי כותב את המילים?",
      answer: "כותבים אותן יחד איתכם. ה-AI יוצר את המוזיקה, ואת הקול אם בחרתם בקול AI, ואנחנו מלטשים ועושים מיקס.",
    },
  ],
  whatsapp: {
    packageLabel: "שיר AI במתנה",
    priceId: "ai_song_ai_voice",
    utmCampaign: "ai_song_gift",
  },
  related: [
    { href: "/studio/original-song", label: "שיר מקורי לכל אירוע" },
    { href: "/studio/professional-singer", label: "זמר שישיר בשבילכם" },
    { href: "/studio/recording-song-modiin/gifts", label: "מתנות מהאולפן" },
  ],
  draft: !isServiceOfferPublished("/studio/ai-song-gift"),
};
