import Link from "next/link";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import Container from "@/components/ui/Container";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import {
  EVENT_ATTRACTION_FROM_NIS,
  formatMeNis,
  formatNis,
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
} from "@/lib/data/pricing";

const FEATURES = [
  "שובר דיגיטלי או מודפס - לפי מה שנוח למקבל",
  "מתאים לאולפן, אטרקציות לאירוע או שילוב חבילות",
  `אולפן: ${formatNis(STUDIO_HALF_HOUR_NIS)} חצי שעה - ${formatNis(STUDIO_ONE_HOUR_NIS)} שעה`,
  "תיאום אישי בוואטסאפ - בלי טפסים מסורבלים",
] as const;

const TIERS = [
  {
    title: "שובר בסיס",
    range: formatMeNis(STUDIO_HALF_HOUR_NIS),
    desc: `חצי שעה באולפן (${formatNis(STUDIO_HALF_HOUR_NIS)}) או אטרקציה לאירוע (מ-${EVENT_ATTRACTION_FROM_NIS.toLocaleString("he-IL")} ₪) - מתנה ליום הולדת או חתונה.`,
  },
  {
    title: "שובר משודרג",
    range: "₪2,500 - ₪3,200",
    desc: "שילוב אולפן + אפקטים, או חבילת אטרקציות - ערך גבוה יותר למקבל.",
  },
  {
    title: "שובר מותאם",
    range: "לפי בחירה",
    desc: "בונים יחד חבילה לפי תקציב וסוג האירוע - נשמח לייעץ.",
  },
] as const;

const bookCta = resolveServiceBookCta("voucher");

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "validity",
    question: "כמה זמן השובר בתוקף?",
    answer:
      "בדרך כלל שנה ממועד הרכישה. אם צריך תאריך אחר - כותבים לנו בוואטסאפ ומתאימים.",
  },
  {
    id: "redeem",
    question: "איך מממשים את השובר?",
    answer: (
      <>
        שולחים לנו הודעה בוואטסאפ עם מספר השובר (או שם המזמין), בוחרים תאריך פנוי
        ומתאמים פרטים. אפשר גם דרך{" "}
        <Link href={bookCta?.bookHref ?? "/book#studio"} className="text-brand-red hover:underline">
          עמוד ההזמנה
        </Link>
        .
      </>
    ),
  },
  {
    id: "transfer",
    question: "אפשר להעביר את השובר למישהו אחר?",
    answer: "כן. השובר ניתן למימוש על ידי המקבל או מי שהעבירו אליו - בכפוף לתיאום מראש.",
  },
  {
    id: "combine",
    question: "אפשר לשלב שובר עם חבילה קיימת?",
    answer:
      "בהחלט. לעיתים מוסיפים שובר כשדרוג לאירוע שכבר סגור - נבדוק יחד מה מתאים.",
  },
];

export default function VoucherPageContent() {
  return (
    <ServicePageLayout
      title="שובר מתנה"
      subtitle="מתנה לאולפן, אטרקציות או הפקה - בוחרים טווח מחיר, מקבלים שובר מעוצב ומתאמים מועד בקלות."
      features={FEATURES}
      whatsappText="שלום, אשמח לשמוע על שובר מתנה"
      utmCampaign="voucher_page"
      showBookCtaInHero={Boolean(bookCta)}
      bookHref={bookCta?.bookHref}
      bookLabel={bookCta?.bookLabel}
    >
      <Container className="space-y-14 py-12 sm:py-16">
        <section aria-labelledby="voucher-tiers-heading">
          <h2
            id="voucher-tiers-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            טווחי מחיר מומלצים
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            המחיר הסופי תלוי בסוג השירות ובתאריך. אלה נקודות פתיחה נפוצות - נעדכן
            אתכם בוואטסאפ לפני סגירה.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {TIERS.map((tier) => (
              <li
                key={tier.title}
                className="hover-lift rounded-xl border border-border bg-surface p-6"
              >
                <p className="text-xs font-bold tracking-wider text-brand-red uppercase">
                  {tier.title}
                </p>
                <p className="mt-2 text-xl font-bold text-foreground">{tier.range}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {tier.desc}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="voucher-process-heading">
          <h2
            id="voucher-process-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            איך זה עובד
          </h2>
          <ol className="mt-6 space-y-4">
            {[
              "שולחים לנו בוואטסאפ מה מתנה אתם רוצים לתת (אולפן, אטרקציות, שילוב).",
              "מקבלים הצעת מחיר ואישור - ואז שובר עם פרטי מימוש.",
              "המקבל יוצר קשר, בוחר תאריך ומגיע לאירוע או לאולפן.",
            ].map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-border bg-surface p-5 text-sm leading-relaxed text-foreground"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="voucher-links-heading">
          <h2
            id="voucher-links-heading"
            className="text-lg font-semibold text-foreground"
          >
            למה אפשר להשתמש בשובר
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {[
              { href: "/studio/recording-song-modiin/gifts", label: "מתנות מהאולפן" },
              { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
              { href: "/studio/blessings", label: "ברכות מוקלטות" },
              { href: "/studio/blessings/bat-mitzvah-clip", label: "קליפ בת מצווה" },
              { href: "/events/attractions", label: "אטרקציות לאירוע" },
              { href: "/podcast/podcast-studio-modiin", label: "הקלטת פודקאסט" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FAQAccordion
          title="שאלות נפוצות על שובר מתנה"
          subtitle="עוד שאלה? כתבו לנו בוואטסאפ - נשיב מהר."
          items={FAQ_ITEMS}
        />
      </Container>
    </ServicePageLayout>
  );
}
