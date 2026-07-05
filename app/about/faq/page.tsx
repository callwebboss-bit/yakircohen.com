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
import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import FAQWithCtaLinks from "@/components/ui/FAQWithCtaLinks";
import TableOfContents from "@/components/ui/TableOfContents";
import { SITE_NAME } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site-url";
import PageBottomCta from "@/components/layout/PageBottomCta";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  CENTRAL_FAQ_ITEMS,
  CENTRAL_FAQ_SECTIONS,
  CENTRAL_FAQ_TOC,
  getCentralFaqSectionItems,
} from "@/lib/data/faq-central";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

/* ─────────────────────────────────────────────────────────────────────────────
   Metadata
   ───────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = constructMetadata({
  title: "שאלות נפוצות",
  description:
    "שאלות נפוצות על הקלטות באולפן, תשלום, ביטולים וזמני מסירה. מענה מסודר לפי נושא: אולפן, אירועים, תשלום וזמני אספקה.",
  slug: "about/faq",
  keywords: [
    "שאלות נפוצות",
    "אולפן הקלטות",
    "פודקאסט",
    "DJ אירועים",
    "עשן כבד",
    "ברכות חתונה",
    "עריכת סאונד",
    "תשלום",
    "ביטולים",
    "זמני מסירה",
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

const VERTICAL_FAQ_LINKS = [
  {
    href: "/podcast/faq",
    title: "שאלות על פודקאסט",
    description: "מחירים, אולפן במודיעין, עריכה והפצה.",
  },
  {
    href: "/events/host/faq",
    title: "שאלות על מנחה ואירועים",
    description: "מתי צריך מנחה, תסריט ערב ותיאום מול ספקים.",
  },
  {
    href: "/events/equipment/faq",
    title: "שאלות על ציוד והגברה",
    description: "חבילות הגברה, סאונד צ'ק ואזורי הגעה.",
  },
] as const;

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
              שאלות נפוצות על הקלטות, תשלום, ביטולים וזמני מסירה
            </h1>

            <p className="text-lead mx-auto mt-5 max-w-2xl text-muted-foreground">
              מענה מסודר לפי נושא: אולפן והקלטות, אירועים, תשלום וזמני אספקה.
              בלי מילים מסובכות. לכל שאלה יש גם דרך ישירה לשאול עוד.
            </p>
          </Container>
        </Section>

        <Section padding="sm" ariaLabelledby="faq-content-heading">
          <Container className="max-w-3xl space-y-12">
            <h2 id="faq-content-heading" className="sr-only">
              שאלות ותשובות לפי נושא
            </h2>

            <ContextualIntroParagraph pathname="/about/faq" />

            <TableOfContents entries={CENTRAL_FAQ_TOC} className="max-w-md" />

            {CENTRAL_FAQ_SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
                aria-labelledby={`${section.id}-heading`}
              >
                <header className="mb-6">
                  <h2
                    id={`${section.id}-heading`}
                    className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                  >
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {section.subtitle}
                  </p>
                </header>
                <FAQWithCtaLinks items={getCentralFaqSectionItems(section)} />
              </section>
            ))}

            <section
              className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
              aria-labelledby="faq-vertical-heading"
            >
              <h2
                id="faq-vertical-heading"
                className="text-xl font-semibold text-foreground sm:text-2xl"
              >
                שאלות לפי תחום
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                לשאלות מפורטות יותר על פודקאסט, מנחה אירועים או ציוד והגברה.
              </p>
              <ul className="mt-6 space-y-4">
                {VERTICAL_FAQ_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group block rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:border-brand-red/40"
                    >
                      <span className="font-semibold text-foreground group-hover:text-brand-red">
                        {link.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {link.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
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
