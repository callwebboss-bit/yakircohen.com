import { isServiceOfferPublished } from "@/lib/data/service-offers/status";
import type { ServiceOfferPage } from "@/lib/data/service-offers/types";

/**
 * שיר או ברכה לגיוס. במילים של הבעלים, 11.10.2026: אפשר ברכה בתוך השיר, ברכה
 * בנוסף, או מצגת תמונות, "בדרך כלל בוחרים מה שרוצים, ועונה לצורך שלכם". המחירים
 * הקיימים: song_recording ו-blessing_recording. מה כלול בברכה: קבועי BLESSING_*.
 */
export const ENLISTMENT_PAGE: ServiceOfferPage = {
  path: "/studio/blessings/enlistment",
  metaTitle: "שיר או ברכה לגיוס, מתנה מהמשפחה לחייל",
  metaDescription:
    "שיר או ברכה מוקלטת לחייל או לחיילת לפני הגיוס. אפשר לשלב ברכה בתוך השיר, ברכה בנפרד או מצגת תמונות. באולפן במודיעין, וברכה גם מרחוק.",
  keywords: ["ברכה לגיוס", "שיר לגיוס", "מתנה לחייל", "ברכה לחייל", "מתנה לגיוס"],
  eyebrow: "גיוס",
  h1: "שיר או ברכה לגיוס",
  intro:
    "מתנה מהמשפחה לחייל או לחיילת לפני הגיוס: שיר, ברכה מוקלטת, או שניהם. קובץ שיכול ללוות אותם בשירות.",
  audience: {
    title: "למי זה מתאים",
    items: [
      "הורים ואחים לפני הגיוס",
      "סבא וסבתא שרוצים להגיד משהו לחייל",
      "כל המשפחה, בשיר אחד או בברכה אחת"
    ],
  },
  steps: [
    {
      title: "בוחרים מה מקליטים",
      description: "שיר, ברכה, או ברכה בתוך השיר. בוחרים את מה שעונה על הצורך שלכם.",
    },
    {
      title: "מקליטים",
      description: "באולפן במודיעין, עם ליווי לאורך ההקלטה. ברכה אפשר גם להקליט בטלפון ולשלוח לנו.",
    },
    {
      title: "מוסיפים מה שרוצים",
      description: "ברכה בנוסף לשיר, בני משפחה נוספים, או מצגת תמונות.",
    },
    {
      title: "הקובץ אצלכם",
      description: "השיר המוכן אצלכם בסוף הסשן באולפן.",
    },
  ],
  includesTitle: "מה כלול",
  includes: [
    "שיר: סשן של שעה באולפן, הקלטה, מיקס ומאסטר",
    "ברכה: בלי הגבלת זמן, עם הנחיה, עריכה ומוזיקת רקע",
    "ליטוש קל של טקסט הברכה",
    "ברכה מרחוק, באותו מחיר כמו באולפן",
  ],
  priceTitle: "כמה עולה שיר או ברכה לגיוס",
  prices: [
    { id: "song_recording", label: "שיר לגיוס", note: "הקלטה, מיקס ומאסטר" },
    { id: "blessing_recording", label: "ברכה מוקלטת לגיוס", note: "בלי הגבלת זמן" },
    { id: "song_group_participant", addon: true, note: "כל בן משפחה נוסף בשיר, עד 12" },
    { id: "blessing_extra_participant", addon: true, note: "כל דובר נוסף בברכה, עד 12" },
  ],
  priceNote: "מצגת תמונות מחושבת בנפרד, בעמוד מצגת התמונות.",
  alternatives: {
    title: "גיוס, או משהו אחר?",
    items: [
      {
        "href": "/studio/blessings",
        "label": "ברכות מוקלטות",
        "body": "ברכה לאירוע אחר, כמו חתונה או בר מצווה."
      },
      {
        "href": "/studio/blessings/milestone-album",
        "label": "אלבום ברכות מוקלטות מרחוק",
        "body": "כל אחד מהמשפחה מקליט ברכה מהבית, ואנחנו מחברים לקובץ אחד."
      },
      {
        "href": "/photo-slideshow",
        "label": "מצגת תמונות",
        "body": "רוצים מצגת תמונות בנוסף לשיר או לברכה."
      }
    ],
  },
  faqs: [
    {
      id: "enlist-song-or-blessing",
      question: "מה עדיף, שיר או ברכה?",
      answer:
        "בוחרים את מה שעונה על הצורך שלכם. אפשר שיר, ברכה, ברכה בתוך השיר, או ברכה בנפרד.",
    },
    {
      id: "enlist-family",
      question: "כל המשפחה יכולה להשתתף?",
      answer: "כן. כל משתתף נוסף בשיר או דובר נוסף בברכה הוא תוספת, עד 12.",
    },
    {
      id: "enlist-remote",
      question: "אפשר להקליט מרחוק?",
      answer:
        "ברכה כן: מקליטים בטלפון, שולחים בוואטסאפ, ויקיר מתקן ומסדר. באותו מחיר כמו באולפן.",
    },
    {
      id: "enlist-photos",
      question: "אפשר להוסיף תמונות?",
      answer: "כן, אפשר להוסיף מצגת תמונות לשיר או לברכה.",
    },
  ],
  whatsapp: {
    packageLabel: "שיר או ברכה לגיוס",
    priceId: "song_recording",
    utmCampaign: "enlistment",
  },
  related: [
    { href: "/studio/blessings", label: "ברכות מוקלטות" },
    { href: "/studio/recording-song-modiin", label: "הקלטת שיר" },
    { href: "/photo-slideshow", label: "מצגת תמונות" },
  ],
  draft: !isServiceOfferPublished("/studio/blessings/enlistment"),
};
