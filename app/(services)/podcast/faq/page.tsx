import ServicePageLayout from "@/components/services/ServicePageLayout";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "שאלות ותשובות - הפקת פודקאסטים",
  description:
    "תשובות מקצועיות על מחירי הפקת פודקאסט, הפצה לפלטפורמות, זמני הקלטה באולפן והכנה לפגישת סטודיו במודיעין.",
  slug: "podcast/faq",
  keywords: [
    "שאלות פודקאסט",
    "מחיר אולפן פודקאסט",
    "הפצת פודקאסט",
    "הכנה להקלטה",
  ],
});

const PODCAST_FAQ: FAQItem[] = [
  {
    id: "pricing",
    question: "איך בנויה תמחור הפקת פודקאסט אצלכם?",
    answer:
      "התמחור מותאם לשלב שבו אתם נמצאים: ליווי אסטרטגי והפקה, הקלטה באולפן, עריכה ושיפור AI, או חבילה משולבת. לאחר שיחת אפיון קצרה נשלח הצעת מחיר שקופה לפי היקף פרקים, אורך ותדירות.",
  },
  {
    id: "distribution",
    question: "האם אתם מפיצים את הפודקאסט ל-Spotify ו-Apple Podcasts?",
    answer:
      "כן. אנחנו מלווים בהגדרת ערוץ, העלאת פרקים, מטא-דאטה, תמונות וקישורי האזנה - כולל הנחיה לפרסום עצמאי אם תרצו לשמור שליטה מלאה בחשבון.",
  },
  {
    id: "recording-time",
    question: "כמה זמן לוקחת הקלטת פרק באולפן?",
    answer:
      "פרק של 30–45 דקות לרוב דורש 60–90 דקות בסטודיו כולל התארגנות ובדיקות סאונד. פרקים ארוכים או עם מספר אורחים מתוכננים מראש עם מרווח זמן מורחב.",
  },
  {
    id: "preparation",
    question: "איך להתכונן להקלטת פודקאסט באולפן?",
    answer:
      "מומלץ להגיע עם תסריט או נקודות מפתח, מים, וטלפון על מצב שקט. נשלח צ'ק-ליסט הכנה לפני הפגישה - כולל הנחיות לבגדים, מרחק מהמיקרופון וטיפים לשמירה על אנרגיה במהלך ההקלטה.",
  },
];

const INTRO_FEATURES = [
  "מענה ברור על שאלות נפוצות לפני שמתחילים להקליט",
  "שקיפות בתהליך, בתמחור ובציפיות מהאולפן",
  "ליווי אישי לכל שאלה נוספת שלא מופיעה כאן",
] as const;

export default function PodcastFaqPage() {
  return (
    <ServicePageLayout
      title="שאלות ותשובות נפוצות לפודקאסטים"
      subtitle="ריכזנו את השאלות שמקבלים הכי הרבה מיוצרים ומותגים שמתחילים או מרחיבים פודקאסט - כדי שתגיעו מוכנים, בטוחים ובבהירות מלאה."
      features={[...INTRO_FEATURES]}
      whatsappText="שלום, יש לי שאלה נוספת על הפקת פודקאסט"
      utmCampaign="podcast_faq"
      ctaLabel="שאלתכם לא כאן? דברו איתנו"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FAQAccordion
          items={PODCAST_FAQ}
          title="כל מה שרציתם לדעת"
          subtitle="מחירים, הפצה, זמני סטודיו והכנה להקלטה"
          className="py-0"
        />
      </div>
    </ServicePageLayout>
  );
}
