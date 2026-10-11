import { isServiceOfferPublished } from "@/lib/data/service-offers/status";
import type { ServiceOfferPage } from "@/lib/data/service-offers/types";

/**
 * חבילת השקה לפודקאסט חדש. החלטת הבעלים 11.10.2026: פגישת אפיון, טריילר ותמונת
 * עטיפה, "מעצב מקצועי, שבוודאי משתמש בתכונות של AI, אבל עם יכולות של מעצב".
 * המחיר נקבע לפי סקר שוק (ראו podcast_launch_package בקטלוג). ההעלאה לספוטיפיי
 * כלולה בחבילות audio, video ו-social (PodcastBookingWizard.tsx, שורת ההשוואה).
 */
export const PODCAST_LAUNCH_PAGE: ServiceOfferPage = {
  path: "/podcast/launch-package",
  metaTitle: "חבילת השקה לפודקאסט חדש, אפיון, טריילר ועטיפה",
  metaDescription:
    "לפני הפרק הראשון: פגישת אפיון שבונה את הפורמט, טריילר לפודקאסט, ותמונת עטיפה ממעצב מקצועי. הקלטת הפרקים באולפן במודיעין.",
  keywords: ["השקת פודקאסט", "טריילר לפודקאסט", "עיצוב עטיפה לפודקאסט", "ייעוץ פודקאסט", "איך פותחים פודקאסט"],
  eyebrow: "פודקאסט חדש",
  h1: "חבילת השקה לפודקאסט חדש",
  intro:
    "כל מה שצריך לפני הפרק הראשון: פגישת אפיון שבונה את הפורמט, טריילר שמציג את הפודקאסט, ותמונת עטיפה ממעצב מקצועי.",
  audience: {
    title: "למי זה מתאים",
    items: [
      "מי שמתחיל פודקאסט ראשון",
      "עסק שרוצה לפתוח פודקאסט",
      "פודקאסט קיים שרוצה להתחיל מחדש עם פורמט ברור"
    ],
  },
  steps: [
    {
      title: "פגישת אפיון",
      description: "בונים יחד את הפורמט: שם הפודקאסט ומבנה הפרק.",
    },
    {
      title: "טריילר",
      description: "טריילר קצר שמציג את הפודקאסט, מוכן להעלאה לפני הפרק הראשון.",
    },
    {
      title: "תמונת עטיפה",
      description: "מעצב מקצועי מעצב את העטיפה. הוא עובד גם עם כלי AI, עם העין והיכולות של מעצב.",
    },
    {
      title: "עולים לאוויר",
      description: "מקליטים את הפרק הראשון באולפן. ברוב חבילות הפרקים ההעלאה לספוטיפיי כבר כלולה.",
    },
  ],
  includesTitle: "מה כלול בחבילה",
  includes: [
    "פגישת אפיון לפורמט",
    "טריילר לפודקאסט",
    "תמונת עטיפה ממעצב מקצועי",
    "הקלטת הפרקים מתומחרת בנפרד",
  ],
  priceTitle: "כמה עולה חבילת ההשקה",
  prices: [{ id: "podcast_launch_package" }],
  priceNote: "הקלטת הפרקים בנפרד, לפי חבילות הפודקאסט.",
  alternatives: {
    title: "חבילת השקה, או משהו אחר?",
    items: [
      {
        "href": "/podcast/podcast-production",
        "label": "הפקת פודקאסט",
        "body": "כבר יש לכם פורמט, ואתם רוצים הפקה שוטפת של פרקים."
      },
      {
        "href": "/podcast/podcast-recording",
        "label": "הקלטת פודקאסט",
        "body": "רוצים רק להקליט פרק."
      },
      {
        "href": "/podcast/subscription",
        "label": "מנוי פודקאסט",
        "body": "רוצים פרקים קבועים כל חודש."
      },
      {
        "href": "/podcast/host-coaching",
        "label": "אימון הנחיה",
        "body": "רוצים להתאמן על ההנחיה לפני הפרק הראשון."
      }
    ],
  },
  faqs: [
    {
      id: "launch-vs-episode",
      question: "מה ההבדל בין חבילת ההשקה להקלטת פרק?",
      answer:
        "חבילת ההשקה היא מה שקורה לפני הפרק הראשון: אפיון, טריילר ועטיפה. הקלטת הפרקים מתומחרת בנפרד, לפי חבילות הפודקאסט.",
    },
    {
      id: "launch-designer",
      question: "מי מעצב את העטיפה?",
      answer: "מעצב מקצועי. הוא עובד גם עם כלי AI, אבל העיצוב נשען על העין והיכולות של מעצב.",
    },
    {
      id: "launch-spotify",
      question: "ההעלאה לספוטיפיי כלולה?",
      answer: "ברוב חבילות הפרקים ההעלאה לספוטיפיי כבר כלולה. בפגישת האפיון בודקים יחד איזו חבילה מתאימה לכם.",
    },
  ],
  whatsapp: {
    packageLabel: "חבילת השקה לפודקאסט חדש",
    priceId: "podcast_launch_package",
    utmCampaign: "podcast_launch",
  },
  related: [
    { href: "/podcast/podcast-production", label: "הפקת פודקאסט" },
    { href: "/podcast/podcast-recording", label: "הקלטת פודקאסט" },
    { href: "/podcast/subscription", label: "מנוי פודקאסט" },
  ],
  draft: !isServiceOfferPublished("/podcast/launch-package"),
};
