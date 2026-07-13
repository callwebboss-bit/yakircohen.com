import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import HubPageSchema from "@/components/seo/HubPageSchema";
import AnswerBlock from "@/components/seo/AnswerBlock";
import SpeakableSchema from "@/components/seo/SpeakableSchema";
import HubServiceIndexStatic from "@/components/seo/HubServiceIndexStatic";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
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
  PRICES_EXCLUDE_VAT_NOTE,
  PRICES_LAST_UPDATED,
  PRICING_HUB_SECTIONS,
} from "@/lib/data/pricing-hub";
import { PRICING_FAQ_ITEMS } from "@/lib/data/pricing-faq";
import { breadcrumbListJsonLd } from "@/lib/breadcrumbs/build-trail";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import CheckoutTrustMicro from "@/components/legal/CheckoutTrustMicro";
import PricingStickyBookCta from "@/components/pricing/PricingStickyBookCta";
import PricingHubSectionsAccordion from "@/components/pricing/PricingHubSectionsAccordion";
import PricingFaqSection from "@/components/pricing/PricingFaqSection";
import PricingHesitantCta from "@/components/pricing/PricingHesitantCta";
import ProposalGiftPitchProofSection from "@/components/seo/ProposalGiftPitchProofSection";
import UnifiedPricingCalculator from "@/components/calculators/UnifiedPricingCalculator";
import PricingInquiryFormLazy from "@/components/pricing/PricingInquiryFormLazy";
import LeadFormSkeleton from "@/components/leads/LeadFormSkeleton";
import { formatMeNis, STUDIO_HALF_HOUR_NIS } from "@/lib/data/pricing";
import { absoluteUrl } from "@/lib/site-url";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = metadataForHubSeo(PRICING_HUB_SEO);

const linkClass =
  "inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

const pricingFaqSchema = buildFaqSchema(
  PRICING_FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answerPlain })),
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
      <SpeakableSchema
        url={absoluteUrl("pricing")}
        cssSelector={["#pricing-answer"]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(pricingItemListSchema) }}
      />
      {pricingFaqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(pricingFaqSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(pricingOffersSchema) }}
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
            <AnswerBlock id="pricing-answer">
              מחירון שירותי אולפן, פודקאסט ואירועים במודיעין. חצי שעה באולפן {formatMeNis(STUDIO_HALF_HOUR_NIS)} לפני מע״מ. הזמנה ב-/book או בוואטסאפ.
            </AnswerBlock>
            <p className="text-lead mx-auto mt-4 max-w-xl text-muted-foreground">
              {PRICING_FRAMING_LINE} מחירים קבועים. {PRICES_EXCLUDE_VAT_NOTE}.
              שורות עם מחיר התחלה מסומנות ב&quot;מ-&quot;. מע״מ מוצג בלחיצה על כל שורה.
            </p>
            <ContextualIntroParagraph pathname="/pricing" className="mx-auto mt-4 max-w-xl text-center" />
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
              <Link
                href="/pricing?ask=studio#pricing-inquiry"
                className={`${linkClass} text-sm text-muted-foreground hover:text-brand-red`}
              >
                פנייה עם פרטים
              </Link>
            </div>
            <div id="pricing-hero-sentinel" aria-hidden />
          </Container>
        </Section>

        <TrustStatsBar variant="compact" />

        <Section padding="sm" className="border-b border-border bg-background">
          <Container className="max-w-3xl">
            <UnifiedPricingCalculator />
          </Container>
        </Section>

        <PricingHubQuickNav />

        <Section padding="sm">
          <Container className="max-w-3xl">
            <p className="mb-4 text-xs text-muted-foreground">
              {PRICES_EXCLUDE_VAT_NOTE}. מע״מ מוצג בלחיצה על כל שורה.
            </p>
            <PricingHubSectionsAccordion
              sections={PRICING_HUB_SECTIONS}
              midPageSlot={<PricingHesitantCta />}
            />
          </Container>
        </Section>

        <Section padding="sm" className="border-t border-border bg-background">
          <Container className="max-w-3xl">
            <PricingHesitantCta />
          </Container>
        </Section>

        <Section padding="sm" className="border-t border-border bg-surface">
          <Container className="max-w-3xl">
            <div className="rounded-2xl border border-border bg-background px-4 py-10 sm:px-8">
              <ProposalGiftPitchProofSection
                headingId="pricing-pitch-proof-heading"
                heading="עם תיקון זיופים או בלי? שמעו לפני שמחליטים"
                intro="רוב חבילות האולפן כוללות תיקון זיופים. אם אתם מתלבטים בין מסלולים - שמעו את ההבדל ואז צפו בקליפ המלא."
              />
            </div>
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

        <PricingFaqSection />

        <Section padding="sm" className="border-t border-border bg-surface">
          <Container className="max-w-3xl">
            <h2 className="font-serif text-section-title font-semibold text-foreground">
              יש לכם שאלה על המחירים?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              השאירו פרטים ונחזור אליכם בדרך כלל תוך 24 שעות.
            </p>
            <div className="mt-6">
              <Suspense fallback={<LeadFormSkeleton />}>
                <PricingInquiryFormLazy />
              </Suspense>
            </div>
          </Container>
        </Section>

        <Section padding="sm" className="border-t border-border bg-background">
          <Container className="max-w-3xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-brand-red/20 bg-brand-red/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  מחפשים מתנה? שובר מתנה לאולפן
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  מ-750 ₪ - אולפן, אטרקציות והפקות לאירועים. ניתן לפדיון גמיש.
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

        <Section padding="sm" className="border-t border-border bg-background">
          <Container className="max-w-3xl">
            <CheckoutTrustMicro />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
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
