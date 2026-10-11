import { isServiceOfferPublished } from "@/lib/data/service-offers/status";
import type { ServiceOfferPage } from "@/lib/data/service-offers/types";

/**
 * שיר מקורי לכל אירוע. החלטת הבעלים 11.10.2026: השיר המקורי, שהיה לבר ובת מצווה
 * בלבד, פתוח לכל אירוע באותו מחיר ("שלא יהיה בלגן"). מה כלול: מהקטלוג
 * (song_original_mitzvah, pricing-catalog.ts).
 */
export const ORIGINAL_SONG_PAGE: ServiceOfferPage = {
  path: "/studio/original-song",
  metaTitle: "שיר מקורי לכל אירוע, מילים, לחן והקלטה",
  metaDescription:
    "שיר שנכתב רק בשבילכם, לחתונה, להצעת נישואין, ליום נישואין, ליום הולדת או לבר ובת מצווה. כותבים יחד את המילים, עושים לחן ומקליטים באולפן במודיעין.",
  keywords: ["שיר מקורי", "שיר מקורי לחתונה", "שיר להצעת נישואין", "כתיבת שיר אישי", "שיר מקורי ליום הולדת"],
  eyebrow: "שיר מקורי",
  h1: "שיר מקורי לכל אירוע",
  intro:
    "שיר שנכתב רק בשבילכם: לחתונה, להצעת נישואין, ליום נישואין, ליום הולדת או לבר ובת מצווה. כותבים יחד איתכם את המילים, עושים לחן ומקליטים באולפן במודיעין.",
  highlight: "אותו מחיר לכל אירוע.",
  audience: {
    title: "למי זה מתאים",
    items: [
      "זוג לפני החתונה, לחופה או לריקוד",
      "הצעת נישואין",
      "יום נישואין",
      "יום הולדת",
      "בר ובת מצווה"
    ],
  },
  steps: [
    {
      title: "מספרים לנו את הסיפור",
      description: "למי השיר, מה האירוע, ואילו רגעים ומילים חייבים להיכנס.",
    },
    {
      title: "כותבים מילים ולחן",
      description: "כותבים יחד איתכם את המילים, ועושים לחן. מקבלים עד שתי סקיצות שונות לבחירה.",
    },
    {
      title: "מקליטים באולפן",
      description: "מקליטים באולפן במודיעין, עם ליווי לאורך כל ההקלטה.",
    },
    {
      title: "מוסיפים מה שרוצים",
      description: "תיקון זיופים, משתתפים נוספים או קליפ מהסשן, כתוספות.",
    },
  ],
  includesTitle: "מה כלול בשיר המקורי",
  includes: [
    "כתיבת מילים ולחן, לפי מילים שכותבים יחד איתכם",
    "עד שתי סקיצות שונות של לחן",
    "הקלטה באולפן",
    "תיקון זיופים, קליפ ומשתתפים נוספים הם תוספות",
  ],
  priceTitle: "כמה עולה שיר מקורי",
  prices: [
    { id: "song_original_mitzvah", label: "שיר מקורי, מילים, לחן והקלטה" },
    { id: "studio_pitch_correction", addon: true },
    { id: "song_group_participant", addon: true, note: "מהמשתתף השני והלאה, עד 12 בשיר אחד" },
    { id: "studio_session_clip", addon: true },
  ],
  priceNote: "אותו מחיר לחתונה, להצעת נישואין, ליום נישואין, ליום הולדת ולבר ובת מצווה.",
  videos: {
    title: "איך נראה שיר מקורי באולפן",
    items: [
      {
        "videoId": "K8c9xAHWN-g",
        "title": "איך מקליטים שיר מקורי, כל התהליך עד התוצר הסופי"
      }
    ],
  },
  alternatives: {
    title: "שיר מקורי, או משהו אחר?",
    items: [
      {
        "href": "/studio/recording-song-modiin",
        "label": "הקלטת שיר קיים",
        "body": "רוצים לשיר שיר שכבר קיים, על פלייבק."
      },
      {
        "href": "/studio/parody",
        "label": "פרודיה לאירוע",
        "body": "רוצים מילים חדשות ומצחיקות על לחן שכולם מכירים."
      },
      {
        "href": "/studio/ai-song-gift",
        "label": "שיר AI במתנה",
        "body": "רוצים מתנה שנעשית כולה מרחוק, ובמחיר נמוך יותר."
      },
      {
        "href": "/studio/blessings/bat-mitzvah-clip",
        "label": "קליפ לבת או לבר מצווה",
        "body": "רוצים גם קליפ עם תמונות ילדות וסרטונים מהבית."
      }
    ],
  },
  faqs: [
    {
      id: "original-vs-recording",
      question: "מה ההבדל בין שיר מקורי להקלטת שיר?",
      answer:
        "בהקלטת שיר שרים שיר קיים על פלייבק. בשיר מקורי כותבים מילים ולחן חדשים, רק בשבילכם, ואז מקליטים.",
    },
    {
      id: "original-proposal",
      question: "אפשר שיר מקורי להצעת נישואין?",
      answer:
        "כן. השיר המקורי פתוח לכל אירוע ובאותו מחיר: הצעת נישואין, חתונה, יום נישואין, יום הולדת, בר ובת מצווה.",
    },
    {
      id: "original-sketches",
      question: "כמה גרסאות של לחן מקבלים?",
      answer: "עד שתי סקיצות שונות, כדי שתבחרו את מה שמרגיש לכם נכון.",
    },
    {
      id: "original-not-singer",
      question: "אני לא זמר, זה מתאים לי?",
      answer:
        "כן. מלווים אתכם לאורך כל ההקלטה, ואפשר להוסיף תיקון זיופים. ואם לא רוצים לשיר בכלל, יש לנו זמרים וזמרות שיבצעו את השיר.",
    },
  ],
  whatsapp: {
    packageLabel: "שיר מקורי לאירוע",
    priceId: "song_original_mitzvah",
    utmCampaign: "original_song",
  },
  related: [
    { href: "/studio/recording-song-modiin", label: "הקלטת שיר קיים" },
    { href: "/studio/recording-song-modiin/gifts", label: "מתנות מהאולפן" },
    { href: "/studio/blessings", label: "ברכות מוקלטות" },
  ],
  draft: !isServiceOfferPublished("/studio/original-song"),
};
