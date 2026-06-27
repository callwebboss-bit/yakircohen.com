import type { Metadata } from "next";
import Link from "next/link";
import HubPageSchema from "@/components/seo/HubPageSchema";
import HubServiceIndexStatic from "@/components/seo/HubServiceIndexStatic";
import PricingHubQuickNav from "@/components/marketing/PricingHubQuickNav";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { buildFaqSchema, buildItemListSchema, buildPricingOffersSchema } from "@/lib/seo/page-schema";
import {
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
  PRICING_HUB_SEO,
} from "@/lib/seo/hub-pages";
import { SITE_NAME } from "@/lib/constants";
import { PRICING_FRAMING_LINE } from "@/lib/data/conversion-copy";
import {
  formatHubPriceRow,
  PRICES_EXCLUDE_VAT_NOTE,
  PRICES_LAST_UPDATED,
  PRICING_HUB_SECTIONS,
} from "@/lib/data/pricing-hub";
import { breadcrumbListJsonLd } from "@/lib/breadcrumbs/build-trail";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import PricingStickyBookCta from "@/components/pricing/PricingStickyBookCta";
import PricingInquiryForm from "@/components/pricing/PricingInquiryForm";
import {
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
  PODCAST_EDITING_PER_HOUR_NIS,
} from "@/lib/data/pricing";
import { absoluteUrl } from "@/lib/site-url";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = metadataForHubSeo(PRICING_HUB_SEO);

const linkClass =
  "inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

const PRICING_FAQ = [
  {
    question: "כמה עולה שעת הקלטה באולפן?",
    answer: `חצי שעה באולפן עולה ${STUDIO_HALF_HOUR_NIS.toLocaleString("he-IL")} ₪ לפני מע״מ, ושעה מלאה עולה ${STUDIO_ONE_HOUR_NIS.toLocaleString("he-IL")} ₪ לפני מע״מ. כל המחירים כוללים ליווי טכני מלא.`,
  },
  {
    question: "כמה עולה הקלטת פודקאסט?",
    answer:
      "פודקאסט אודיו מ-950 ₪ לפרק (הקלטה + עריכה + מסירה לספוטיפיי). פודקאסט וידאו מ-1,650 ₪. חבילות תוכן מלאות עם רילז מ-2,800 ₪.",
  },
  {
    question: `כמה עולה עריכת פודקאסט?`,
    answer: `עריכת פודקאסט עולה ${PODCAST_EDITING_PER_HOUR_NIS.toLocaleString("he-IL")} ₪ לשעת חומר גולמי, לפני מע״מ. כולל ניקוי רעשים, סנכרון וכתוביות.`,
  },
  {
    question: "האם המחירים כוללים מע״מ?",
    answer:
      'לא – כל המחירים המוצגים הם לפני מע״מ (+18%). ליד כל שורה מוצג גם המחיר כולל מע״מ, ובטופס ההזמנה המקוונת נראה המחיר הסופי עם מע״מ.',
  },
  {
    question: "איך מזמינים שירות?",
    answer:
      "דרך טופס ההזמנה המקוונת בכתובת /book – בוחרים שירות, רואים מחיר סופי, מאשרים תאריך. ניתן גם לפנות בוואטסאפ.",
  },
  {
    question: "האם יש חבילות מוכנות?",
    answer:
      "כן – חבילות מוכנות לאולפן, פודקאסט וחתונות בעמוד /packages. כולל מחיר שקוף לפני ואחרי מע״מ.",
  },
] as const;

const pricingFaqSchema = buildFaqSchema(
  PRICING_FAQ.map((f) => ({ question: f.question, answer: f.answer })),
);

const breadcrumbSchema = breadcrumbListJsonLd([
  { href: "/", label: "ראשי" },
  { href: "/pricing", label: "מחירון" },
]);

const pricingOffersSchema = buildPricingOffersSchema(
  absoluteUrl("pricing"),
  PRICING_HUB_SECTIONS.flatMap((section) =>
    section.rows.map((row) => ({
      id: `${section.id}-${row.label.replace(/\s+/g, "-")}`,
      name: row.label,
      description: section.title,
      priceExVat: row.exVat,
    })),
  ),
);

const pricingItemListSchema = buildItemListSchema(
  "מחירון מרכזי",
  PRICING_HUB_SECTIONS.map((section) => ({
    name: section.title,
    url: absoluteUrl(section.href.replace(/^\/+/, "")),
    description: section.description,
  })),
);

export default function PricingHubPage() {
  const hubSchema = hubSchemaPropsFromSeo(PRICING_HUB_SEO);

  return (
    <>
      <HubPageSchema {...hubSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingItemListSchema) }}
      />
      {pricingFaqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingOffersSchema) }}
      />
      <article className="bg-background">
        <Section padding="sm" className="border-b border-border bg-background text-center">
          <Container className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              {SITE_NAME}
            </p>
            <h1 className="text-hero mt-3 font-serif font-semibold text-foreground">
              מחירון מרכזי
            </h1>
            <p className="text-lead mx-auto mt-4 max-w-xl text-muted-foreground">
              {PRICING_FRAMING_LINE} המחירים <strong>החל מ-</strong> ({PRICES_EXCLUDE_VAT_NOTE}). ליד כל שורה מופיע גם המחיר כולל מע״מ.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              עודכן: {PRICES_LAST_UPDATED}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/book" className={`${linkClass} text-sm font-semibold text-brand-red hover:underline`}>
                הזמנה מקוונת עם מחיר שקוף
              </Link>
              <a
                href={buildWhatsAppHref({ text: "היי, אשמח לפרטים על המחירים", source: "pricing-hero" })}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} text-sm text-muted-foreground hover:text-brand-red`}
              >
                שאלה? וואטסאפ
              </a>
            </div>
            <div id="pricing-hero-sentinel" aria-hidden />
          </Container>
        </Section>

        <TrustStatsBar variant="compact" />

        <PricingHubQuickNav />

        <Section padding="sm">
          <Container className="max-w-3xl space-y-12">
            {PRICING_HUB_SECTIONS.map((section) => (
              <section id={section.id} key={section.id} aria-labelledby={`pricing-${section.id}`}>
                <h2
                  id={`pricing-${section.id}`}
                  className="font-serif text-section-title font-semibold text-foreground"
                >
                  <Link
                    href={section.href}
                    className={`${linkClass} hover:text-brand-red`}
                  >
                    {section.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface">
                  {section.rows.map((row) => (
                    <li
                      key={row.label}
                      className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{row.label}</p>
                        {row.note ? (
                          <p className="text-xs text-muted-foreground">{row.note}</p>
                        ) : null}
                      </div>
                      <p className="text-sm font-semibold text-foreground tabular-nums">
                        {formatHubPriceRow(row.exVat)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link
                    href={section.href}
                    className={`${linkClass} font-semibold text-brand-red hover:underline`}
                  >
                    פרטים נוספים
                  </Link>
                  {section.bookHref ? (
                    <Link
                      href={section.bookHref}
                      className={`${linkClass} text-muted-foreground hover:text-brand-red`}
                    >
                      הזמנה מקוונת
                    </Link>
                  ) : null}
                </div>
              </section>
            ))}
          </Container>
        </Section>

        <HubServiceIndexStatic
          heading="מקטעי מחירון"
          links={PRICING_HUB_SECTIONS.map((section) => ({
            href: section.href,
            title: section.title,
            description: section.description,
          }))}
        />

        {/* FAQ Section – AEO */}
        <Section padding="sm" className="border-t border-border bg-surface">
          <Container className="max-w-3xl">
            <h2 className="font-serif text-section-title font-semibold text-foreground">
              שאלות נפוצות על מחירים
            </h2>
            <dl className="mt-6 space-y-6">
              {PRICING_FAQ.map((item) => (
                <div key={item.question} className="faq-answer">
                  <dt className="text-sm font-semibold text-foreground">{item.question}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>

        {/* Pricing inquiry form */}
        <Section padding="sm" className="border-t border-border bg-surface">
          <Container className="max-w-3xl">
            <h2 className="font-serif text-section-title font-semibold text-foreground">
              יש לכם שאלה על המחירים?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              השאירו פרטים ונחזור אליכם תוך 24 שעות.
            </p>
            <div className="mt-6">
              <PricingInquiryForm />
            </div>
          </Container>
        </Section>

        {/* Voucher CTA card */}
        <Section padding="sm" className="border-t border-border bg-background">
          <Container className="max-w-3xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-brand-red/20 bg-brand-red/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  מחפשים מתנה? שובר מתנה לאולפן
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  מ-750 ₪ – אולפן, אטרקציות והפקות לאירועים. ניתן לפדיון גמיש.
                </p>
              </div>
              <Link
                href="/voucher"
                className="inline-flex min-h-10 items-center rounded-xl border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white"
              >
                לרכישת שובר
              </Link>
            </div>
          </Container>
        </Section>

        {/* Policy & contact footer strip */}
        <Section padding="sm" className="border-t border-border bg-background">
          <Container className="max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <Link href="/privacy" className={`${linkClass} hover:text-brand-red`}>
                  מדיניות פרטיות
                </Link>
                <Link href="/terms" className={`${linkClass} hover:text-brand-red`}>
                  תנאי שימוש
                </Link>
                <Link href="/accessibility" className={`${linkClass} hover:text-brand-red`}>
                  הצהרת נגישות
                </Link>
                <Link href="/contact" className={`${linkClass} hover:text-brand-red`}>
                  צרו קשר
                </Link>
              </div>
              <Link
                href="/book"
                className={`${linkClass} rounded-xl bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:opacity-90`}
              >
                הזמנה מקוונת
              </Link>
            </div>
          </Container>
        </Section>
        <div id="pricing-footer-sentinel" aria-hidden />
        <PricingStickyBookCta />
      </article>
    </>
  );
}
