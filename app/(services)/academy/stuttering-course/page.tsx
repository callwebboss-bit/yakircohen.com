import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/metadata";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import FAQWithCtaLinks, {
  type FaqCtaItem,
} from "@/components/ui/FAQWithCtaLinks";
import ShareButton from "@/components/ui/ShareButton";
import {
  NEVERMIND_EXTERNAL_URL,
  STUTTERING_ADULTS_TOOLS,
  STUTTERING_CHILDREN_POINTS,
  STUTTERING_METHOD_STEPS,
  STUTTERING_PROCESS_PILLARS,
  STUTTERING_PROCESS_STAGES,
} from "@/lib/data/academy-stuttering-course-page";

export const metadata: Metadata = constructMetadata({
  title: "קורס הפסקת גמגום | שיטת NeverMind | יקיר כהן הפקות",
  description:
    "תוכנית טיפולית מקיפה לגמגום לילדים ומבוגרים. שיטת NeverMind: נשימה, ביטחון עצמי ודיבור חופשי. קורס מול מיקרופון באולפן במודיעין.",
  slug: "academy/stuttering-course",
  keywords: [
    "קורס גמגום",
    "הפסקת גמגום",
    "NeverMind",
    "גמגום ילדים",
    "גמגום מבוגרים",
    "דיבור חופשי",
  ],
});

const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "severe-cases",
    question: "האם זה מתאים גם למקרים קשים?",
    answer:
      "כן. האבחון הראשוני מותאם אישית לכל אדם. בין אם המקור רגשי, פיזיולוגי או שפתי - בנינו כלים לכל מצב.",
    ctaText: "שלחו הודעה לאבחון ראשוני",
    whatsappMessage:
      "היי יקיר! יש לי/לנו מקרה של גמגום שרוצה לשמוע אם השיטה שלכם מתאימה. אשמח לשוחח.",
    utm_campaign: "stuttering_faq_severe",
  },
  {
    id: "duration",
    question: "כמה זמן לוקח התהליך?",
    answer:
      "כל אחד והקצב שלו. יש שינויים כבר בפגישה הראשונה, ויש תהליך עומק שבונה הרגלים חדשים לאורך זמן.",
    ctaText: "שלחו פרטים ונבנה תכנית אישית",
    whatsappMessage:
      "היי יקיר! רוצה להבין כמה זמן יכול לקחת התהליך במקרה שלי/שלנו. אשמח לשיחה קצרה.",
    utm_campaign: "stuttering_faq_duration",
  },
  {
    id: "musical-talent",
    question: "האם צריך כישרון מוזיקלי?",
    answer:
      "ממש לא. אנחנו משתמשים בכלים מוזיקליים (קצב, נשימה) כעזר טכני, אבל זה קורס לדיבור, לא לשירה.",
    ctaText: "שאלו על הקורס",
    whatsappMessage: "היי יקיר! יש לי שאלה על קורס הגמגום שלכם.",
    utm_campaign: "stuttering_faq_music",
  },
  {
    id: "register",
    question: "איך נרשמים?",
    answer:
      "פשוט שולחים הודעה בוואטסאפ או משאירים פרטים. נתאם שיחת היכרות קצרה ונבנה יחד מסלול קורס ייעודי עבורך.",
    ctaText: "התחילו בשיחת היכרות",
    whatsappMessage:
      "היי יקיר! אני רוצה להירשם / לשמוע על קורס הגמגום. אשמח לשיחת היכרות.",
    utm_campaign: "stuttering_faq_register",
  },
];

export default function StutteringCoursePage() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! אני מתעניין/ת בקורס הגמגום ושיטת NeverMind. אשמח לשיחת היכרות קצרה ולהבין אם זה מתאים לי.",
    utm_source: "academy",
    utm_campaign: "stuttering_cta",
  });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט ארגוני" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  ראשי
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/academy"
                  className="hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  האקדמיה
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-foreground" aria-current="page">
                קורס גמגום
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            קורס הפסקת גמגום
          </h1>

          <p className="mx-auto mt-4 text-base font-medium text-foreground sm:text-lg">
            לדבר בחופשיות ובביטחון
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            תוכנית טיפולית מקיפה לגמגום לילדים ומבוגרים. שיטת NeverMind
            ייחודית המשלבת נשימה, ביטחון עצמי ודיבור חופשי.
          </p>

          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            שיחת היכרות בוואטסאפ ←
          </a>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-12 sm:py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            קורס גמגום מול מיקרופון
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            לדבר בחופשיות. בלי פחד. בלי להתחבא.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            גמגום הוא לא רק &quot;תקיעות&quot; במילים. זה הרגע לפני שאתה לוחץ
            על עצמך. הפחד להיתקע. המחשבה &quot;מה יחשבו עלי?&quot;.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          הדיבור שלך שווה הכל
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          לכן בנינו קורס שמגיע לשורש העניין - לא רק הטכניקה, אלא השקט הנפשי
          שמאחוריו.
        </p>
        <blockquote className="mx-auto mt-6 max-w-lg border-s-2 border-brand-red/40 ps-4 text-start text-sm font-medium italic text-foreground">
          &quot;המטרה היא לא לדבר מושלם. המטרה היא לדבר חופשי.&quot;
        </blockquote>
      </section>

      <section
        className="mx-auto max-w-2xl px-4 pb-4 pt-2 sm:px-6 lg:px-8"
        aria-labelledby="stuttering-video-heading"
      >
        <h2
          id="stuttering-video-heading"
          className="mb-4 text-center text-lg font-semibold text-foreground sm:text-xl"
        >
          ראו את השיטה בפעולה
        </h2>
        <LazyYouTubeEmbed
          embedUrl="https://www.youtube.com/embed/yf004RFUdmM"
          title="קורס הפסקת גמגום — שיטת NeverMind | יקיר כהן הפקות"
        />
      </section>

      <section className="border-t border-border bg-surface py-12 sm:py-14">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              למה השיטה שלנו עובדת אחרת?
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              לא &quot;איך להוציא מילה&quot;. אלא &quot;למה היא נתקעת&quot;
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              רוב הטיפולים מתמקדים רק ב&quot;איך להוציא מילה&quot;. אנחנו
              מתמקדים ב&quot;למה המילה נתקעת&quot;. הגמגום נובע מלחץ, חרדה
              ופחד מהגמגום עצמו - מעגל קסמים ששוברים אותו לא בכוח, אלא
              בהבנה.
            </p>
          </header>

          <p className="mb-4 text-center text-sm font-medium text-foreground">
            התהליך שלנו משלב:
          </p>
          <ul className="mx-auto grid max-w-xl gap-2 sm:grid-cols-2">
            {STUTTERING_PROCESS_PILLARS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground"
              >
                <span className="text-brand-red" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              ילדים
            </p>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              טיפול בגמגום אצל ילדים
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              ילד לא צריך להרגיש &quot;מקולקל&quot;. הוא צריך להרגיש מובן.
              אנחנו עובדים בשיתוף ההורים כדי ליצור בבית מרחב בטוח:
            </p>
            <ul className="mt-4 space-y-2">
              {STUTTERING_CHILDREN_POINTS.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 text-brand-red" aria-hidden="true">
                    •
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-medium text-foreground">
              המטרה: שהילד ירצה לדבר, לא יפחד לדבר.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              מבוגרים וזמרים
            </p>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              כשהקול הוא הכלי שלך
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              זמרים ודוברי קהל חווים פער כואב: בשירה הכל זורם, בדיבור יש
              חסימה. אנחנו מבינים את החרדה הזו מקרוב.
            </p>
            <p className="mt-3 text-sm font-medium text-foreground">
              איך עובדים על זה?
            </p>
            <ul className="mt-3 space-y-2">
              {STUTTERING_ADULTS_TOOLS.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 text-brand-red" aria-hidden="true">
                    •
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              השיטה - איך להפסיק לגמגם
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              לפי שיטת &quot;השם לא משנה&quot; -{" "}
              <a
                href={NEVERMIND_EXTERNAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-red hover:underline"
              >
                NeverMind.co.il
              </a>
            </p>
          </header>

          <div className="grid gap-5 sm:grid-cols-3">
            {STUTTERING_METHOD_STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <span className="text-xs font-bold text-brand-red">
                  {step.num}
                </span>
                <h3 className="mt-2 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6 lg:px-8">
        <p className="text-sm italic text-muted-foreground">
          &quot;גם בני גנץ למד שדיבור זה קודם כל ראש שקט.&quot;
        </p>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          שלבי התהליך: התגברות על גמגום
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[20rem] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th
                  scope="col"
                  className="px-4 py-3 text-start font-semibold text-foreground"
                >
                  שלב בתהליך
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-start font-semibold text-foreground"
                >
                  המיקוד
                </th>
              </tr>
            </thead>
            <tbody>
              {STUTTERING_PROCESS_STAGES.map((row) => (
                <tr
                  key={row.stage}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    <span className="me-2" aria-hidden="true">
                      {row.icon}
                    </span>
                    {row.stage}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.focus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          מה לומדים בקורס?
        </h2>
        <p className="mb-8 text-sm text-muted-foreground">
          שאלות נפוצות על התהליך וההתאמה האישית
        </p>
        <FAQWithCtaLinks items={FAQ_ITEMS} />
      </section>

      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            אם אתה רוצה להפסיק לגמגם
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            אתה צריך להבין את עצמך. ואם אתה רוצה להבין את עצמך - הקורס הזה
            הוא המקום להתחיל. שולחים הודעה בוואטסאפ, מתאמים שיחת היכרות
            קצרה ובונים יחד מסלול ייעודי.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              aria-label="שיחת היכרות לקורס גמגום בוואטסאפ"
            >
              שיחת היכרות בוואטסאפ ←
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              השארת פרטים
            </Link>
          </div>
          <p className="mx-auto mt-6 max-w-md text-xs text-muted-foreground">
            גם דרך{" "}
            <Link href="/stuttering" className="text-brand-red hover:underline">
              עמוד הליווי הכללי
            </Link>{" "}
            או{" "}
            <Link href="/clinic" className="text-brand-red hover:underline">
              הקליניקה
            </Link>
          </p>
          <div className="mt-5 flex justify-center">
            <ShareButton title="קורס הפסקת גמגום | שיטת NeverMind | יקיר כהן הפקות" />
          </div>
        </div>
      </section>
    </div>
  );
}
