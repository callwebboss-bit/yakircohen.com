/**
 * /about/faq
 *
 * De-Robotized copy audit (this revision):
 *   ✓ Removed all "-" long dashes from visible text.
 *   ✓ No "חשוב לציין", no robotic list preambles.
 *   ✓ WhatsApp anchors now carry specific, actionable Hebrew text per question:
 *       Q1 (singing) send a voice clip, get a direct verdict
 *       Q2 (podcast) send your available dates, lock the calendar
 *       Q3 (effects) send the hall name, we handle the bureaucracy
 *       Q4 (delivery) send your exact deadline, we figure out the rest
 *   ✓ WhatsApp pre-fill messages give Yakir useful context immediately.
 */

import type { Metadata } from "next";
import FAQWithCtaLinks from "@/components/ui/FAQWithCtaLinks";
import { SITE_NAME } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site-url";
import PageBottomCta from "@/components/layout/PageBottomCta";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { CENTRAL_FAQ_ITEMS } from "@/lib/data/faq-central";
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
   • No long dashes (-). Short pause comma or period.
   • No "חשוב לציין" or boilerplate preambles.
   • ctaText: short, specific, actionable - one clear instruction, not a question.
   • whatsappMessage: gives Yakir immediate context (what they need + their situation).
   ───────────────────────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [...CENTRAL_FAQ_ITEMS];

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
        <Section
          padding="sm"
          className="relative overflow-hidden border-b border-border bg-background"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.14),transparent_55%)]"
            aria-hidden="true"
          />

          <Container className="relative max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              {SITE_NAME}
            </p>

            <h1 className="text-hero mt-3 font-serif font-semibold text-foreground">
              שאלות נפוצות ותשובות ברורות
            </h1>

            <p className="text-lead mx-auto mt-5 max-w-2xl text-muted-foreground">
              בלי מילים מסובכות ובלי אותיות קטנות. כל מה שצריך לדעת על
              הסאונד, הציוד, ההקלטות והרחבה שלכם. ותמיד עם דרך ישירה לשאול עוד.
            </p>
          </Container>
        </Section>

        <Section padding="sm" ariaLabelledby="faq-accordion-heading">
          <Container className="max-w-3xl">
            <h2 id="faq-accordion-heading" className="sr-only">
              שאלות ותשובות
            </h2>
            <FAQWithCtaLinks items={FAQ_ITEMS} />
          </Container>
        </Section>

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
