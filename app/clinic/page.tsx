import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import Button from "@/components/ui/Button";import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  CLINIC_BOOKING_WHATSAPP_TEXT,
  CLINIC_CASE_STUDIES,
} from "@/lib/data/clinic-page";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import {
  CLINIC_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";import { buildWhatsAppHref } from "@/lib/whatsapp";

const clinicBookingHref = buildWhatsAppHref({
  text: CLINIC_BOOKING_WHATSAPP_TEXT,
  utm_source: "website",
  utm_campaign: "clinic_booking",
});

export const metadata: Metadata = metadataForHubSeo(CLINIC_HUB_SEO);

export default function ClinicPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(CLINIC_HUB_SEO)} />
      <div className="min-h-screen bg-background text-foreground">
      <main>
        <Section padding="sm">
          <Container className="max-w-4xl">
        {/* Hero / Intro */}
        <section aria-labelledby="clinic-hero-heading" className="mb-16">
          <header className="mb-8">
            <p className="text-xs font-semibold tracking-[0.22em] text-brand-red">
              מרחב חקירה
            </p>
            <h1
              id="clinic-hero-heading"
              className="text-hero mt-4 font-serif font-semibold"
            >
              מרחב חקירה
            </h1>
          </header>

          <div className="space-y-5 text-sm leading-relaxed sm:text-base">
            <p>
              {`המטרה כאן היא לא לטפל בגמגום. אין כאן קלינאות תקשורת, תרגילי נשימה, או ניסיון "לרפא" אותך. המטרה היא לפרק את ההנחות הנסתרות שמפעילות את התקיעות בזמן אמת.`}
            </p>
            <p>
              גמגום הוא לא רק עניין פיזי. הוא שרשרת של פקודות סותרות שהמוח שולח בו זמנית. צד אחד מנסה להוציא מילה, צד שני מזהה סכנה, שופט את הסיטואציה, ובולם. התוצאה היא קצר במערכת. רוב האנשים נלחמים בתוצאה הפיזית. אנחנו חוקרים את הפקודה שיצרה אותה.
            </p>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <section aria-labelledby="clinic-what-happens-heading">
              <h2
                id="clinic-what-happens-heading"
                className="mb-4 text-sm font-semibold"
              >
                מה קורה במפגש
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed sm:text-base">
                <li>
                  <span className="font-medium">זיהוי המנגנון:</span>{" "}
                  מקלפים מהגמגום את כל הסיפורים והרגשות. מניחים על השולחן את הפעולה המכנית נטו. בודקים בדיוק מה המוח אומר לעצמו שבריר שנייה לפני שהמילה נתקעת.
                </li>
                <li>
                  <span className="font-medium">חקירה לוגית:</span>{" "}
                  משתמשים בשיטת ההיפוך. אנחנו מפרקים את האמונות הנסתרות על דיבור, על קצב, ועל הצד השומע. ברגע שההנחה הקוגניטיבית מתגלה כשגויה, הלחץ המכני משתחרר.
                </li>
                <li>
                  <span className="font-medium">ניתוק הזהות:</span>{" "}
                  מפרידים בין מי שאתה לבין הפעולה הטכנית של הדיבור. מוציאים את הבושה מהמשוואה והופכים את הדיבור לכלי עבודה.
                </li>
              </ul>
            </section>

            <section aria-labelledby="clinic-not-for-heading">
              <h2
                id="clinic-not-for-heading"
                className="mb-4 text-sm font-semibold"
              >
                למי זה לא מתאים
              </h2>
              <p className="text-sm leading-relaxed sm:text-base">
                אין כאן חיבוק, קבוצת תמיכה או ניתוח עבר פסיכולוגי. העבודה מתאימה רק למי שמוכן להסתכל על הדיבור שלו דרך זכוכית מגדלת, בצורה קרה ולוגית, ולהפסיק להתייחס לגמגום כאל טראומה.
              </p>
            </section>
          </div>

          <section aria-labelledby="clinic-result-heading" className="mt-10">
            <h2
              id="clinic-result-heading"
              className="mb-3 text-sm font-semibold"
            >
              התוצאה
            </h2>
            <p className="text-sm leading-relaxed sm:text-base">
              אנחנו לא מבטיחים דיבור חלק ומושלם. אנחנו מפרקים את הפחד מההיתקעות. ברגע שהמאבק המתיש במילים נפסק, נשארת פעולה פשוטה וברורה של העברת מסר, בלי רעשי רקע.
            </p>
          </section>

          <section
            aria-labelledby="clinic-technical-heading"
            className="mt-10 rounded-2xl border border-border bg-surface px-5 py-6 sm:px-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  id="clinic-technical-heading"
                  className="mb-2 text-sm font-semibold"
                >
                  פרטים טכניים
                </h2>
                <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
                  <li>המפגש אורך שעה.</li>
                  <li>מתקיים פנים מול פנים או מרחוק.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  as="a"
                  href={clinicBookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full"
                >
                  תיאום פגישה בוואטסאפ
                </Button>
                <Button
                  as="a"
                  href={`tel:${CONTACT_PHONE_E164}`}
                  variant="secondary"
                  className="rounded-full"
                >
                  {CONTACT_PHONE_DISPLAY}
                </Button>
              </div>
            </div>
          </section>
        </section>

        {/* Section 1: Inversion method */}
        <section
          aria-labelledby="clinic-inversion-heading"
          className="mb-16 space-y-6"
        >
          <header>
            <h2
              id="clinic-inversion-heading"
              className="font-serif text-section-title font-semibold"
            >
              תצוגת תכלית - שיטת ההיפוך
            </h2>
          </header>
          <div className="grid gap-6 rounded-2xl border px-5 py-6 sm:grid-cols-2 sm:px-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                הנחה נסתרת נפוצה
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                ככל שאתאמץ יותר ככה אצליח להוציא את המילה.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                העובדה ההפוכה
              </p>
              <p className="text-sm font-medium leading-relaxed sm:text-base">
                מאמץ בכיוון הלא נכון מייצר רק שחיקה ולחץ פיזי. הבעיה היא לא חוסר מאמץ.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Depth levels */}
        <section
          aria-labelledby="clinic-depth-heading"
          className="mb-16 space-y-6"
        >
          <header>
            <h2
              id="clinic-depth-heading"
              className="font-serif text-section-title font-semibold"
            >
              רמות העומק של החקירה
            </h2>
          </header>
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-border bg-surface/60 p-4">
              <h3 className="mb-2 text-sm font-semibold">רמה בסיסית</h3>
              <p className="text-sm leading-relaxed">
                זיהוי ההנחה שמייצרת את התקיעות הנוכחית.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-surface/60 p-4">
              <h3 className="mb-2 text-sm font-semibold">רמה מתקדמת</h3>
              <p className="text-sm leading-relaxed">
                פירוק מנגנון קבלת ההחלטות הרוחבי.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-surface/60 p-4">
              <h3 className="mb-2 text-sm font-semibold">רמה עמוקה</h3>
              <p className="text-sm leading-relaxed">
                חקירת אמונות הבסיס שמפעילות את המנגנון.
              </p>
            </article>
          </div>
        </section>

        {/* Section 3: Rule of clarity */}
        <section
          aria-labelledby="clinic-clarity-heading"
          className="mb-16 space-y-4"
        >
          <header>
            <h2
              id="clinic-clarity-heading"
              className="font-serif text-section-title font-semibold"
            >
              חוק הבהירות
            </h2>
          </header>
          <p className="max-w-3xl text-sm leading-relaxed sm:text-base">
            אין בחדר ז&apos;רגון מקצועי, מונחים פסיכולוגיים או סיסמאות. הכל מפורק ומוסבר ברמה שגם ילד בן עשר יבין במדויק. בהירות מורידה חסמים ומשדרת שליטה מלאה בעובדות.
          </p>
        </section>

        {/* Section 4: Mechanism visualization */}
        <section
          aria-labelledby="clinic-flow-heading"
          className="mb-16 space-y-6"
        >
          <header>
            <h2
              id="clinic-flow-heading"
              className="font-serif text-section-title font-semibold"
            >
              פירוק המנגנון
            </h2>
          </header>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium shadow-xs">
                פעולה אוטומטית
              </div>
              <div className="h-px w-8 flex-none bg-border sm:w-10" />
              <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium shadow-xs">
                חשיפת אמונת הבסיס
              </div>
              <div className="h-px w-8 flex-none bg-border sm:w-10" />
              <div className="rounded-xl border border-brand-red bg-brand-red/10 px-4 py-3 text-sm font-medium text-brand-red shadow-xs">
                קריסת ההנחה
              </div>
              <div className="h-px w-8 flex-none bg-border sm:w-10" />
              <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium shadow-xs">
                פעולה חדשה
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Field facts */}
        <section
          aria-labelledby="clinic-facts-heading"
          className="mb-8 space-y-4"
        >
          <header>
            <h2
              id="clinic-facts-heading"
              className="font-serif text-section-title font-semibold"
            >
              עובדות שטח
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              מקרים אנונימיים. בלי המלצות או תשבחות, רק תוצאות מכניות.
            </p>
          </header>
          <ul className="space-y-6">
            {CLINIC_CASE_STUDIES.map((study) => (
              <li
                key={study.id}
                className="space-y-3 rounded-2xl border border-border bg-surface/60 p-5 sm:p-6"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    נקודת פתיחה
                  </p>
                  <p className="text-sm leading-relaxed sm:text-base">{study.opening}</p>
                </div>
                <div className="h-px bg-border" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    חקירה
                  </p>
                  <p className="text-sm leading-relaxed sm:text-base">{study.investigation}</p>
                </div>
                <div className="h-px bg-border" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    פעולה
                  </p>
                  <p className="text-sm leading-relaxed sm:text-base">{study.action}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
          </Container>
        </Section>
      </main>
    </div>
    </>
  );
}
