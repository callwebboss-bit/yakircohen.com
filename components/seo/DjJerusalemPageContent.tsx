import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const FEATURES = [
  "ניסיון באירועים דתיים, מעורבים וחילוניים בירושלים והסביבה",
  "מוזיקה מדויקת לקבלת פנים, חופה, ריקודים ושיא הלילה",
  "ציוד סאונד מקצועי ועמדה מסודרת - הגעה בזמן והקמה רגועה",
  "תיאום מראש עם אולם, חופה, צלם ואטרקציות",
] as const;

const AREAS = [
  "ירושלים והסביבה הקרובה",
  "מודיעין · מבשרת · צור הדסה",
  "בית שמש · רמת בית שמש",
  "מעלה אדומים · גבעת זאב (בתיאום מראש)",
] as const;

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "religious",
    question: "אתם מתאימים לחתונה דתית?",
    answer:
      "כן. אנחנו רגילים לעבוד עם קהל דתי ומעורב - כולל רגישות לשעות, לשירי חופה ולרגעים שקטים בטקס.",
  },
  {
    id: "equipment",
    question: "מה כלול בעמדת ה-DJ?",
    answer:
      "עמדה, סאונד לאולם, מיקרופון לאירועים ותאורה בסיסית לעמדה. צרכים מיוחדים - מוסיפים בתיאום.",
  },
  {
    id: "travel",
    question: "יש תוספת הגעה לירושלים?",
    answer:
      "תלוי במיקום האירוע והשעה. נציין במפורש בהצעת המחיר לפני אישור - בלי הפתעות.",
  },
  {
    id: "playlist",
    question: "אפשר לשלוח רשימת שירים מראש?",
    answer:
      "מומלץ. שולחים לנו שירי חובה, שירים שלא להשמיע, וסגנון כללי - ובונים יחד את הערב.",
  },
];

export default function DjJerusalemPageContent() {
  return (
    <ServicePageLayout
      title="תקליטן לחתונה בירושלים"
      subtitle="מוזיקה לאירוע דתי או מעורב - מהקבלת פנים ועד סוף הלילה, עם הקשבה לקהל ולרגעים בטקס."
      features={FEATURES}
      whatsappText="שלום, אשמח לשמוע על תקליטן לחתונה בירושלים"
      utmCampaign="dj_jerusalem"
    >
      <div className="mx-auto max-w-[72rem] space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <section aria-labelledby="jerusalem-areas-heading">
          <h2
            id="jerusalem-areas-heading"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            אזורי שירות
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            מגיעים לאירועים בירושלים וביישובים סמוכים. לא בטוחים אם האולם בטווח?
            שלחו כתובת בוואטסאפ ונאשר תוך דקות.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {AREAS.map((area) => (
              <li
                key={area}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
              >
                {area}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="jerusalem-style-heading">
          <h2
            id="jerusalem-style-heading"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            סגנונות ורגעים בערב
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "קבלת פנים וחופה",
                text: "מוזיקה רגועה ומרוממת לכניסות, שירי חופה מוכרים או גרסאות מותאמות - בתיאום עם הרב או המנחה.",
              },
              {
                title: "ריקודים ושיא הלילה",
                text: "מעבר הדרגתי מאווירה חגיגית לרחבה מלאה - עם שירים שהקהל מכיר ואוהב.",
              },
              {
                title: "אירועים דתיים",
                text: "הפרדה בין רגעים שקטים לטקס לבין ריקודים - בלי להפתיע את המשפחה.",
              },
              {
                title: "שילוב עם אטרקציות",
                text: "תיאום עם עשן, זיקוקים קרים או עמדת לד - כדי שהאפקטים ייכנסו בדיוק בזמן.",
              },
            ].map((block) => (
              <div
                key={block.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-foreground">{block.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="jerusalem-links-heading">
          <h2
            id="jerusalem-links-heading"
            className="text-lg font-semibold text-foreground"
          >
            שירותים משלימים לחתונה
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {[
              { href: "/events/dj-events", label: "כל שירותי ה-DJ" },
              { href: "/events/attractions", label: "אטרקציות לאירוע" },
              { href: "/studio/blessings/bride-groom-blessing", label: "ברכת חתן וכלה" },
              { href: "/photography/wedding", label: "צילום חתונה" },
              { href: "/blog/wedding-songs-chuppah", label: "שירים לחופה" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-brand-red/40 hover:text-brand-red"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FAQAccordion
          title="שאלות נפוצות - DJ בירושלים"
          items={FAQ_ITEMS}
        />
              <PageRelatedFooter pathname="/dj-events/cities/jerusalem" />

            </div>
    </ServicePageLayout>
  );
}
