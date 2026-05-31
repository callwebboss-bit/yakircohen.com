import Link from "next/link";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const FEATURES = [
  "פגישות אישיות במודיעין - סביבה שקטה ופרטית",
  "התאמה לגיל ולמטרות (בית ספר, עבודה, ראיונות)",
  "שילוב תרגול קולי והקלטה כשמתאים",
  "תיאום גמיש עם הורים / בני זוג לפי צורך",
] as const;

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "first",
    question: "מה קורה בפגישה הראשונה?",
    answer:
      "שיחת היכרות, הבנת המצב והמטרות, והצעת מסלול - קורס, מפגשים נוספים או הפניה אם צריך.",
  },
  {
    id: "kids",
    question: "מתאים לילדים?",
    answer:
      "כן, עם ליווי הורים. הגישה רגישה ולא מאיימת - בקצב שמתאים לגיל.",
  },
  {
    id: "location",
    question: "איפה הקליניקה?",
    answer:
      "באזור מודיעין, בקרבת המרכז והסביבה. כתובת מדויקת נשלחת אחרי תיאום בוואטסאפ.",
  },
  {
    id: "price",
    question: "כמה עולה פגישה?",
    answer:
      "המחיר משתנה לפי סוג המפגש והיקף. נשמח לתת הצעה שקופה בוואטסאפ לפני קביעה.",
  },
];

export default function ClinicPageContent() {
  return (
    <ServicePageLayout
      title="קליניקה לטיפול בגמגום"
      subtitle="פגישות אישיות במודיעין - מרחב שקט לעבודה על דיבור, ביטחון וכלים לחיים היומיומיים."
      features={FEATURES}
      whatsappText="שלום, אשמח לקבוע פגישה בקליניקה"
      utmCampaign="clinic_landing"
    >
      <div className="mx-auto max-w-[72rem] space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <section className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-foreground">למי מיועדת הקליניקה</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {`לילדים, נוער ומבוגרים שמחפשים מקום מקצועי לעבוד על גמגום - לא "טיפול מהיר", אלא תהליך עם יעדים ברורים ותמיכה לאורך הדרך.`}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            חלק מהמטופלים מגיעים אחרי שניסו כיוונים אחרים. אחרים מגיעים לפני אירוע חשוב -
            ראיון, שיעור, הקלטה או דיבור מול קהל.
          </p>
        </section>

        <section aria-labelledby="clinic-links-heading">
          <h2 id="clinic-links-heading" className="text-lg font-semibold text-foreground">
            מידע נוסף
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            <li>
              <Link
                href="/stuttering"
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
              >
                על הליווי בגמגום
              </Link>
            </li>
            <li>
              <Link
                href="/academy/stuttering-course"
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
              >
                קורס NeverMind
              </Link>
            </li>
          </ul>
        </section>

        <FAQAccordion title="שאלות נפוצות - הקליניקה" items={FAQ_ITEMS} />
      </div>
    </ServicePageLayout>
  );
}
