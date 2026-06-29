import Link from "next/link";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";
import {
  NEVERMIND_EXTERNAL_URL,
  STUTTERING_ADULTS_TOOLS,
  STUTTERING_CHILDREN_POINTS,
  STUTTERING_METHOD_STEPS,
  STUTTERING_PROCESS_PILLARS,
  STUTTERING_PROCESS_STAGES,
} from "@/lib/data/academy-stuttering-course-page";

const FEATURES = [
  "גישה רגישה ומותאמת לגיל - ילדים, נוער ומבוגרים",
  "שיטת NeverMind - ביטחון עצמי ודיבור רגוע, לא לחץ",
  "ליווי אישי לצד אפשרות לקורס מסודר באולפן",
  "תרגול מציאותי מול מיקרופון - לא רק תרגילים תיאורטיים",
] as const;

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "who",
    question: "למי זה מתאים?",
    answer:
      "לכל מי שמגמגם ורוצה כלים מעשיים לדיבור יומיומי, שיחות עבודה, הרצאות ומצגות, שיחות זוגיות וחברתיות. מתאים גם להורים שמחפשים כיוון לילד שמגמגם.",
  },
  {
    id: "course-vs-therapy",
    question: "מה ההבדל בין ליווי לקורס?",
    answer: (
      <>
        הליווי הוא מסלול גמיש - פגישות לפי הצורך, עבודה על נקודה ספציפית, ליווי הורים.
        ה
        <Link href="/academy/stuttering-course" className="text-brand-red hover:underline">
          קורס גמגום
        </Link>{" "}
        הוא תוכנית מבנית עם שלבים ברורים ויעדים מדידים. לעיתים מתחילים בליווי ועוברים לקורס.
      </>
    ),
  },
  {
    id: "duration",
    question: "כמה זמן לוקח לראות שינוי?",
    answer:
      "תלוי בגיל, תדירות התרגול ומורכבות המקרה. יש מי שחווה שינוי כבר בפגישה הראשונה; יש תהליך עומק שלוקח חודשים. אין הבטחות קסם - יש תהליך אמיתי עם יעדים ברורים.",
  },
  {
    id: "children",
    question: "מה עושים שלא להחמיר את הגמגום בילד?",
    answer:
      "הדבר הכי חשוב: לא לנסות לתקן. לא להשלים משפטים, לא להגיד 'תאט', לא להביע דאגה גלויה. הילד צריך להרגיש שמאזינים לו - לא לגמגום שלו. אנחנו עובדים יחד עם ההורים בכל שלב.",
  },
  {
    id: "medical",
    question: "זה תחליף לטיפול רפואי או קלינאי?",
    answer:
      "לא. אנחנו מתמחים בליווי דיבור, קצב, נשימה וביטחון עצמי. במקרים שדורשים קלינאי תקשורת רפואי - מפנים ועובדים בשיתוף פעולה.",
  },
  {
    id: "singers",
    question: "אני זמר/ת ומגמגם בדיבור אבל לא בשירה - למה?",
    answer:
      "כי שירה משתמשת בנתיב קוגניטיבי שונה. הגמגום לרוב קשור לחרדת ביצוע בדיבור, לא לכשל מוטורי. אנחנו מכירים את הפרדוקס הזה מקרוב ויש לנו כלים ייעודיים לאנשי קול.",
  },
];

const FAQ_SCHEMA_ITEMS = [
  {
    question: "למי זה מתאים?",
    answer:
      "לכל מי שמגמגם ורוצה כלים מעשיים לדיבור יומיומי, שיחות עבודה, הרצאות ומצגות, שיחות זוגיות וחברתיות. מתאים גם להורים שמחפשים כיוון לילד שמגמגם.",
  },
  {
    question: "מה ההבדל בין ליווי לקורס?",
    answer:
      "הליווי הוא מסלול גמיש - פגישות לפי הצורך, עבודה על נקודה ספציפית, ליווי הורים. קורס גמגום הוא תוכנית מבנית עם שלבים ברורים ויעדים מדידים. לעיתים מתחילים בליווי ועוברים לקורס.",
  },
  {
    question: "כמה זמן לוקח לראות שינוי?",
    answer:
      "תלוי בגיל, תדירות התרגול ומורכבות המקרה. יש מי שחווה שינוי כבר בפגישה הראשונה; יש תהליך עומק שלוקח חודשים. אין הבטחות קסם - יש תהליך אמיתי עם יעדים ברורים.",
  },
  {
    question: "מה עושים שלא להחמיר את הגמגום בילד?",
    answer:
      "הדבר הכי חשוב: לא לנסות לתקן. לא להשלים משפטים, לא להגיד 'תאט', לא להביע דאגה גלויה. הילד צריך להרגיש שמאזינים לו - לא לגמגום שלו. אנחנו עובדים יחד עם ההורים בכל שלב.",
  },
  {
    question: "זה תחליף לטיפול רפואי או קלינאי?",
    answer:
      "לא. אנחנו מתמחים בליווי דיבור, קצב, נשימה וביטחון עצמי. במקרים שדורשים קלינאי תקשורת רפואי - מפנים ועובדים בשיתוף פעולה.",
  },
  {
    question: "אני זמר/ת ומגמגם בדיבור אבל לא בשירה - למה?",
    answer:
      "כי שירה משתמשת בנתיב קוגניטיבי שונה. הגמגום לרוב קשור לחרדת ביצוע בדיבור, לא לכשל מוטורי. אנחנו מכירים את הפרדוקס הזה מקרוב ויש לנו כלים ייעודיים לאנשי קול.",
  },
] as const;

export default function StutteringPageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "שלום, אשמח לשוחח על ליווי בגמגום ולהבין מה מתאים לי",
    utm_source: "website",
    utm_campaign: "stuttering_landing",
  });

  return (
    <>
      <FaqPageSchema items={[...FAQ_SCHEMA_ITEMS]} />
      <ServicePageLayout
      title="טיפול בגמגום"
      subtitle="ליווי מקצועי לדיבור חופשי - בקצב שלכם, עם כלים מעשיים ולא הבטחות ריקות."
      features={FEATURES}
      whatsappText="שלום, אשמח לשוחח על ליווי בגמגום ולהבין מה מתאים לי"
      utmCampaign="stuttering_landing"
    >
      <Container className="space-y-16 py-12 sm:py-16">

        {/* ─── סרטון ─────────────────────────────────────────────────────────── */}
        <section aria-labelledby="stuttering-video-heading">
          <header className="mx-auto mb-6 max-w-2xl text-center">
            <h2
              id="stuttering-video-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              ראו את השיטה בפעולה
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              הסרטון מסביר את הגישה שלנו בפחות מ-3 דקות
            </p>
          </header>
          <div className="mx-auto max-w-2xl">
            <LazyYouTubeEmbed
              embedUrl="https://www.youtube.com/embed/yf004RFUdmM"
              title="טיפול בגמגום - שיטת NeverMind | יקיר כהן הפקות"
            />
          </div>
        </section>

        {/* ─── מה המטרה ──────────────────────────────────────────────────────── */}
        <section className="max-w-3xl" aria-labelledby="stuttering-goal-heading">
          <h2
            id="stuttering-goal-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {`גמגום הוא לא רק "תקיעות" במילים`}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            ברוב המקרים יש מאחוריו לחץ, ציפייה מהסביבה ופחד ממצבים חברתיים.
            המטרה היא לתת כלים לדיבור רגוע יותר - לבנות ביטחון, להפחית את
            ה&quot;צפייה לגמגם&quot; ולדעת להתכונן לרגעים חשובים.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            עובדים מהאולפן במודיעין - תרגול מציאותי מול מיקרופון, לא רק
            תרגילים תיאורטיים. המיקרופון חושף בדיוק מה קורה עם הקול, ומאפשר
            עבודה מדויקת ומהירה יותר.
          </p>
          <blockquote className="mt-6 border-s-2 border-brand-red/40 ps-4 text-sm font-medium italic text-foreground">
            &quot;המטרה היא לא לדבר מושלם. המטרה היא לדבר חופשי.&quot;
          </blockquote>
        </section>

        {/* ─── למה השיטה עובדת אחרת ──────────────────────────────────────────── */}
        <section aria-labelledby="stuttering-why-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="stuttering-why-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              לא &quot;איך להוציא מילה&quot; - אלא &quot;למה היא נתקעת&quot;
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              רוב הטיפולים מתמקדים ב&quot;איך להוציא מילה&quot;. שיטת{" "}
              <a
                href={NEVERMIND_EXTERNAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-red hover:underline"
              >
                NeverMind
              </a>{" "}
              מתמקדת ב&quot;למה המילה נתקעת&quot; - שוברים את מעגל הלחץ לא
              בכוח, אלא בהבנה.
            </p>
          </header>
          <p className="mx-auto mb-4 mt-8 max-w-xl text-center text-sm font-medium text-foreground">
            התהליך שלנו משלב:
          </p>
          <ul className="mx-auto grid max-w-xl gap-2 sm:grid-cols-2">
            {STUTTERING_PROCESS_PILLARS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground"
              >
                <span className="text-brand-red" aria-hidden>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ─── שיטת NeverMind - 3 שלבים ─────────────────────────────────────── */}
        <section aria-labelledby="stuttering-method-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="stuttering-method-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              שיטת NeverMind - איך להפסיק לגמגם
            </h2>
          </header>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {STUTTERING_METHOD_STEPS.map((step) => (
              <div
                key={step.num}
                className="hover-lift rounded-2xl border border-border bg-surface p-6"
              >
                <span className="text-xs font-bold text-brand-red">{step.num}</span>
                <h3 className="mt-2 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ילדים / מבוגרים ──────────────────────────────────────────────── */}
        <section aria-labelledby="stuttering-audiences-heading">
          <h2
            id="stuttering-audiences-heading"
            className="sr-only"
          >
            ליווי לפי גיל
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
                ילדים ונוער
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                טיפול בגמגום אצל ילדים
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                ילד לא צריך להרגיש &quot;מקולקל&quot;. הוא צריך להרגיש מובן.
                עובדים בשיתוף ההורים כדי ליצור בבית מרחב בטוח:
              </p>
              <ul className="mt-4 space-y-2">
                {STUTTERING_CHILDREN_POINTS.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 text-brand-red" aria-hidden>•</span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-medium text-foreground">
                המטרה: שהילד ירצה לדבר, לא יפחד לדבר.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
                מבוגרים ואנשי קול
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                כשהקול הוא הכלי שלך
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                זמרים ודוברי קהל חווים פער כואב: בשירה הכל זורם, בדיבור יש
                חסימה. מכירים את החרדה הזו מקרוב - ויש כלים ייעודיים.
              </p>
              <ul className="mt-4 space-y-2">
                {STUTTERING_ADULTS_TOOLS.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 text-brand-red" aria-hidden>•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── CTA אמצע עמוד ────────────────────────────────────────────────── */}
        <section
          className="rounded-2xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="stuttering-mid-cta-heading"
        >
          <h2
            id="stuttering-mid-cta-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            לא בטוחים מאיפה להתחיל?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            שולחים הודעה - ובונים יחד מסלול שמתאים. ללא התחייבות.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              as="a"
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="shadow-[0_0_20px_rgba(212,43,43,0.3)]"
            >
              שיחת היכרות בוואטסאפ </Button>
            <Button as="a" href={`tel:${CONTACT_PHONE_E164}`} variant="secondary">
              {CONTACT_PHONE_DISPLAY}
            </Button>
          </div>
        </section>

        {/* ─── שלבי התהליך ──────────────────────────────────────────────────── */}
        <section aria-labelledby="stuttering-stages-heading">
          <header className="mb-6 text-center">
            <h2
              id="stuttering-stages-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              שלבי התהליך
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              כל שלב בנוי על הקודם - אין קיצורי דרך, יש יעדים ברורים
            </p>
          </header>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[20rem] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th scope="col" className="px-4 py-3 text-start font-semibold text-foreground">
                    שלב
                  </th>
                  <th scope="col" className="px-4 py-3 text-start font-semibold text-foreground">
                    המיקוד
                  </th>
                </tr>
              </thead>
              <tbody>
                {STUTTERING_PROCESS_STAGES.map((row) => (
                  <tr key={row.stage} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <span className="me-2" aria-hidden>{row.icon}</span>
                      {row.stage}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── סרטון נוסף ────────────────────────────────────────────────────── */}
        <section aria-labelledby="stuttering-video2-heading">
          <header className="mx-auto mb-6 max-w-2xl text-center">
            <h2
              id="stuttering-video2-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              עוד על הגישה שלנו
            </h2>
          </header>
          <div className="mx-auto max-w-2xl">
            <LazyYouTubeEmbed
              embedUrl="https://www.youtube.com/embed/BhZ6Fcqyqqc"
              title="גמגום - טיפול ודיבור חופשי | יקיר כהן הפקות"
            />
          </div>
        </section>

        {/* ─── שאלות נפוצות ─────────────────────────────────────────────────── */}
        <FAQAccordion
          title="שאלות נפוצות - גמגום"
          subtitle="כל מה שרצית לשאול לפני שמתחילים"
          items={FAQ_ITEMS}
          className="py-0"
        />

        {/* ─── מסלולים להמשך ────────────────────────────────────────────────── */}
        <section aria-labelledby="stuttering-paths-heading">
          <header className="mb-6 text-center">
            <h2
              id="stuttering-paths-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              איך ממשיכים?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              בחרו את המסלול שמתאים לכם
            </p>
          </header>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "🎤",
                title: "קורס גמגום מלא",
                desc: "תוכנית מסודרת עם שלבים ויעדים ברורים - מול מיקרופון באולפן.",
                href: "/academy/stuttering-course",
                cta: "לפרטי הקורס",
              },
              {
                icon: "🏥",
                title: "פגישה בקליניקה",
                desc: "פגישה ממוקדת לאבחון ראשוני וגיבוש מסלול אישי.",
                href: "/clinic",
                cta: "לפרטי הקליניקה",
              },
              {
                icon: "💬",
                title: "שיחת היכרות",
                desc: "לא בטוחים? 15 דקות בוואטסאפ יעשו סדר.",
                href: ctaHref,
                cta: "שלחו הודעה",
                external: true,
              },
            ].map(({ icon, title, desc, href, cta, external }) => (
              <div
                key={title}
                className="hover-lift flex flex-col rounded-2xl border border-border bg-surface p-6"
              >
                <p className="text-2xl" aria-hidden>{icon}</p>
                <h3 className="mt-3 font-semibold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{desc}</p>
                {external ? (
                  <Button
                    as="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5"
                  >
                    {cta}
                  </Button>
                ) : (
                  <Button as="link" href={href} variant="outline" className="mt-5">
                    {cta}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

      </Container>
    </ServicePageLayout>
    </>
  );
}
