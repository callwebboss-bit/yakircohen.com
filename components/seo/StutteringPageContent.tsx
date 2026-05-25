import Link from "next/link";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const FEATURES = [
  "גישה רגישה ומותאמת לגיל - ילדים, נוער ומבוגרים",
  "שיטת NeverMind - דגש על ביטחון ודיבור רגוע",
  "ליווי אישי, לא שיטה של לחץ",
  "אפשרות לשילוב עם קורס מובנה באקדמיה",
] as const;

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "who",
    question: "למי זה מתאים?",
    answer:
      "למי שמגמגם ורוצה כלים מעשיים לדיבור יומיומי, הרצאות, שיחות או עבודה מול מיקרופון. מתאימים גם להורים שמחפשים כיוון לילד.",
  },
  {
    id: "course-vs-therapy",
    question: "מה ההבדל בין טיפול לקורס?",
    answer: (
      <>
        בדף זה מדובר על ליווי ותיאום כללי. לתוכנית לימוד מסודרת - ראו{" "}
        <Link href="/academy/stuttering-course" className="text-brand-red hover:underline">
          קורס גמגום
        </Link>{" "}
        או פגישה ב
        <Link href="/clinic" className="text-brand-red hover:underline">
          {" "}
          הקליניקה
        </Link>
        .
      </>
    ),
  },
  {
    id: "duration",
    question: "כמה זמן לוקח לראות שינוי?",
    answer:
      "תלוי בגיל, בתדירות התרגול ובמורכבות. אין הבטחת קסם - יש תהליך הדרגתי עם יעדים ברורים.",
  },
  {
    id: "medical",
    question: "זה תחליף לטיפול רפואי?",
    answer:
      "לא. אנחנו מתמחים בליווי דיבור ומוזיקה. במקרים רפואיים מפנים לגורם מתאים ועובדים בשיתוף כשצריך.",
  },
];

export default function StutteringPageContent() {
  return (
    <ServicePageLayout
      title="טיפול בגמגום"
      subtitle="ליווי מקצועי לדיבור חופשי יותר - בקצב שלכם, עם כלים מעשיים ולא עם הבטחות ריקות."
      features={FEATURES}
      whatsappText="שלום, אשמח לשמוע על ליווי בגמגום"
      utmCampaign="stuttering_landing"
    >
      <div className="mx-auto max-w-[72rem] space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <section className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-foreground">מה המטרה בתהליך</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            גמגום הוא לא רק “טכניקה שחסרה” - לעיתים יש גם מתח, ציפייה מהסביבה ופחד ממצבים חברתיים.
            המטרה היא לתת לכם כלים לדיבור רגוע יותר, לבנות ביטחון ולדעת איך להתכונן לרגעים חשובים.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            באולפן במודיעין משלבים ניסיון בעבודה עם קול, הקלטה ומיקרופון - מה שמאפשר תרגול מציאותי,
            לא רק תרגילים תיאורטיים.
          </p>
        </section>

        <section aria-labelledby="stuttering-paths-heading">
          <h2 id="stuttering-paths-heading" className="text-lg font-semibold text-foreground">
            איך מתחילים
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            <li>
              <Link
                href="/clinic"
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
              >
                פגישה בקליניקה
              </Link>
            </li>
            <li>
              <Link
                href="/academy/stuttering-course"
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
              >
                קורס גמגום מלא
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
              >
                שאלה כללית
              </Link>
            </li>
          </ul>
        </section>

        <FAQAccordion title="שאלות נפוצות - גמגום" items={FAQ_ITEMS} />
      </div>
    </ServicePageLayout>
  );
}
