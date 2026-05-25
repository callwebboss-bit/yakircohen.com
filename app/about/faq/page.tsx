/**
 * /about/faq
 *
 * De-Robotized copy audit (this revision):
 *   ✓ Removed all "-" long dashes from visible text.
 *   ✓ No "חשוב לציין", no robotic list preambles.
 *   ✓ WhatsApp anchors now carry specific, actionable Hebrew text per question:
 *       Q1 (singing)   → send a voice clip, get a direct verdict
 *       Q2 (podcast)   → send your available dates, lock the calendar
 *       Q3 (effects)   → send the hall name, we handle the bureaucracy
 *       Q4 (delivery)  → send your exact deadline, we figure out the rest
 *   ✓ WhatsApp pre-fill messages give Yakir useful context immediately.
 */

import type { Metadata } from "next";
import Link from "next/link";
import FAQWithCtaLinks, {
  type FaqCtaItem,
} from "@/components/ui/FAQWithCtaLinks";
import { SITE_NAME } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site-url";
import PageBottomCta from "@/components/layout/PageBottomCta";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

/* ─────────────────────────────────────────────────────────────────────────────
   Metadata
   ───────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = constructMetadata({
  title: "שאלות נפוצות",
  description:
    "מענה ברור לשאלות הנפוצות ביותר על הקלטות באולפן, פודקאסטים, זמני עריכה ותיאום אפקטים מול אולמות, בלי מילים מסובכות ובלי אותיות קטנות.",
  slug: "about/faq",
  keywords: [
    "שאלות נפוצות",
    "אולפן הקלטות",
    "פודקאסט",
    "DJ אירועים",
    "עשן כבד",
    "ברכות חתונה",
    "עריכת סאונד",
  ],
});

/* ─────────────────────────────────────────────────────────────────────────────
   FAQ data
   ─────────────────────────────────────────────────────────────────────────────
   Copy rules:
   • No long dashes (-). Short pause → comma or period.
   • No "חשוב לציין" or boilerplate preambles.
   • ctaText: short, specific, actionable - one clear instruction, not a question.
   • whatsappMessage: gives Yakir immediate context (what they need + their situation).
   ───────────────────────────────────────────────────────────────────────────── */

const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "fake-singing",
    question: "אני לא זמר או זמרת, מה קורה אם אזייף בהקלטת השיר?",
    answer:
      "זה החלק הכי כיפי אצלנו. רוב האנשים שמגיעים לאולפן לא עמדו מול מיקרופון בחיים שלהם. אנחנו משתמשים בטכנולוגיית תיקון סאונד מתקדמת שמיישרת את הקול ומלטשת אותו, יחד עם הדרכה צמודה וסבלנית בזמן ההקלטה. אף אחד לא יוצא מכאן עם זיופים, באחריות.",
    /* Specific anchor: ask them to send a voice sample for an honest verdict */
    ctaText: "שלחו לנו 10 שניות של הקול שלכם ותחליטו אחרי",
    whatsappMessage:
      "שלום, אני רוצה להקליט שיר לאירוע אבל חושש מהזיופים. מצרף קטע קצר של הקול שלי לפני שסוגרים.",
    utm_campaign: "faq_fake_singing",
  },
  {
    id: "podcast-timing",
    question: "כמה זמן מראש צריך לתאם איתכם הקלטת פודקאסט או פרק עסקי?",
    answer:
      "האולפן עובד בצורה דינמית אבל היומנים מתמלאים מהר, במיוחד בימי ההקלטות המרוכזים. הכי בטוח לסגור שבוע עד שבועיים מראש כדי להבטיח את השעות הנוחות לכם, במיוחד אם אתם צריכים סשן עריכה מהיר מיד לאחר מכן.",
    /* Specific anchor: send available dates to lock the calendar */
    ctaText: "שלחו את הימים שנוחים לכם ונחסום מקום ביומן",
    whatsappMessage:
      "שלום, אנחנו רוצים להקליט פרק לפודקאסט. הימים הנוחים לנו: [הוסיפו ימים]. יש זמינות?",
    utm_campaign: "faq_podcast_timing",
  },
  {
    id: "effects-coordination",
    question: "איך מתבצע התיאום של האפקטים (עשן כבד, זיקוקים) מול אולם האירועים?",
    answer:
      "בשיטת שגר ושכח. מהרגע שסוגרים איתנו את חבילת האפקטים או עמדת ה-LED, אתם מתרכזים באירוע שלכם. אנחנו יוצרים קשר ישירות מול מנהל האולם, בודקים את זרם החשמל הנדרש, מוודאים אישורי בטיחות לזיקוקים הקרים ומגיעים להתקין הכל שעות לפני שהאורחים נכנסים.",
    /* Specific anchor: send hall name so they handle the paperwork */
    ctaText: "שלחו שם האולם ואנחנו מסדרים את כל הבירוקרטיה ישירות מולם",
    whatsappMessage:
      "שלום, האולם שלנו הוא [שם האולם]. נשמח שתתאמו את האפקטים ישירות מולם.",
    utm_campaign: "faq_effects_coordination",
  },
  {
    id: "delivery-time",
    question: "תוך כמה זמן קובץ הסאונד או הסרטון הערוך מוכן?",
    answer:
      "אנחנו לא אוהבים למרוח זמן. שירים וברכות לאירועים עוברים עריכה ומיקס ומוכנים בדרך כלל תוך ימים בודדים. פודקאסטים ותכנים עסקיים מקבלים עדיפות עריכה כדי שלא תפספסו את ציר הזמן השיווקי שלכם. יש לכם אירוע דחוף, תגידו מראש ונעשה הכל כדי לתקתק את זה.",
    /* Specific anchor: send the hard deadline so we can assess feasibility */
    ctaText: "יש לכם תאריך אחרון בראש? שלחו ונחשב יחד מה אפשרי",
    whatsappMessage:
      "שלום, יש לנו פרויקט סאונד שצריך לסיים עד [תאריך]. מה הכי מהיר שאפשר לתזמן הקלטה ועריכה?",
    utm_campaign: "faq_delivery_time",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   JSON-LD structured data
   ───────────────────────────────────────────────────────────────────────────── */

const FAQ_BOTTOM_WHATSAPP = buildWhatsAppHref({
  text: buildServiceWhatsAppText("שאלה מעמוד שאלות נפוצות"),
  utm_source: "website",
  utm_campaign: "faq_bottom_cta",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: absoluteUrl("about/faq"),
  name: `שאלות נפוצות | ${SITE_NAME}`,
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

/* ─────────────────────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────────────────────── */

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="bg-background">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.14),transparent_55%)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              {SITE_NAME}
            </p>

            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              שאלות נפוצות ותשובות ברורות
            </h1>

            {/* No long dash: was "שלכם - ותמיד" → now split into two sentences */}
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              בלי מילים מסובכות ובלי אותיות קטנות. כל מה שצריך לדעת על
              הסאונד, הציוד, ההקלטות והרחבה שלכם. ותמיד עם דרך ישירה לשאול עוד.
            </p>
          </div>
        </section>

        {/* ── Accordion ── */}
        <section
          className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
          aria-label="שאלות ותשובות"
        >
          <FAQWithCtaLinks items={FAQ_ITEMS} />
        </section>

        <PageBottomCta
          layout="section"
          variant="whatsapp"
          className="bg-surface"
          kicker="נשאר לכם ספק?"
          heading="שאלו אותנו ישירות, אנחנו כאן"
          description="ענו לנו בוואטסאפ וניצור קשר תוך שעות ספורות. אין כאן בוטים. מענה אישי מהצוות."
          headingId="faq-bottom-cta-heading"
          whatsappHref={FAQ_BOTTOM_WHATSAPP}
          whatsappLabel="שאלה? שלחו הודעה בוואטסאפ"
          showBookContact
        />
      </div>
    </>
  );
}
