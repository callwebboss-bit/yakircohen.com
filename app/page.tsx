import type { Metadata } from "next";
import HomePageSections from "@/components/marketing/HomePageSections";
import EphemeralPulse from "@/components/marketing/EphemeralPulse";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_ROBOTS,
} from "@/lib/seo-config";
import { SITE_URL } from "@/lib/site-url";
import { buildFaqSchema } from "@/lib/seo/page-schema";

const HOME_TITLE = "יקיר כהן הפקות | אולפן, פודקאסט ואירועים במודיעין";
const HOME_DESCRIPTION =
  "אולפן, פודקאסט ואירועים במודיעין. קריינות, DJ ושחזור סאונד ב-AI.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    ...DEFAULT_TWITTER,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  robots: SITE_ROBOTS,
};

const HOME_FAQ_SCHEMA = buildFaqSchema([
  {
    question: "איפה האולפן ויש חנייה?",
    answer: "האולפן ממוקם בעמק איילון 34, מודיעין מכבים רעות. חניה פרטית בשטח.",
  },
  {
    question: "יש לכם הקלטה ישנה או רועשת?",
    answer: "שלחו את הקובץ. מנקים רעשים, מיישרים עוצמה, ומחזירים קול שאפשר להפיץ דרך שחזור סאונד ב-AI.",
  },
  {
    question: "האם השירות כולל הגעה לאירועים?",
    answer: "כן. DJ והגברה, עשן כבד, בועות, זיקוקים קרים ועוד זמינים לאירועי שטח. החבילה נבנית לפי סוג האירוע ומיקומו.",
  },
  {
    question: "כמה עולה הקלטה או אירוע?",
    answer: "ברכה והקלטה קצרה החל מ-450 ₪ + מע\"מ. פודקאסט פיילוט מ-490 ₪ + מע\"מ. בהזמנה מקוונת רואים מחיר סופי מיד.",
  },
  {
    question: "תוך כמה זמן מקבלים קובץ מוכן?",
    answer: "הקלטה באולפן: בדרך כלל מספר ימים עד שבועיים, תלוי בעריכה. פודקאסט ואירועים: לפי היקף הפרויקט. לוח זמנים ברור נקבע בשיחה הראשונה.",
  },
  {
    question: "לאיזה אזורים אתם מגיעים?",
    answer: "האולפן במודיעין. לאירועים מגיעים לירושלים, למרכז ולכל הארץ. הקלטות בירושלים בתיאום מראש.",
  },
  {
    question: "איך משלמים?",
    answer: "אשראי, Bit, PayBox, Apple Pay ו-PayPal לפי תיאום. חשבונית מס מסודרת. פרטי כרטיס אשראי לא נשמרים באתר.",
  },
  {
    question: "מה קורה אם צריך לבטל או לשנות תאריך?",
    answer: "עדכנו אותנו בהקדם בוואטסאפ. ננסה לתאם מועד חלופי. מדיניות ביטולים מפורטת בתנאי השירות.",
  },
]);

export default function HomePage() {
  const heroWhatsAppHref = buildWhatsAppHref({
    text: "שלום, אשמח לייעוץ והצעת מחיר לפרויקט שלי.",
    utm_source: "website",
    utm_campaign: "hero_cta",
  });

  const bottomWhatsAppHref = buildWhatsAppHref({
    text: "שלום, אני מוכן/ה להתחיל פרויקט - אשמח לשיחה קצרה.",
    utm_source: "website",
    utm_campaign: "bottom_cta",
  });

  return (
    <>
      {HOME_FAQ_SCHEMA && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_FAQ_SCHEMA) }}
        />
      )}
      <HomePageSections
        heroWhatsAppHref={heroWhatsAppHref}
        bottomWhatsAppHref={bottomWhatsAppHref}
      />
      <EphemeralPulse />
    </>
  );
}
