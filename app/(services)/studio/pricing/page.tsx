import { metadataFromPricing } from "@/lib/data/service-metadata";
import Link from "next/link";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import StudioPricingGrid from "@/components/services/StudioPricingGrid";
import StudioPricingAccordion from "@/components/seo/StudioPricingAccordion";
import ProposalGiftPitchProofSection from "@/components/seo/ProposalGiftPitchProofSection";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import PricingTierToggle from "@/components/ui/PricingTierToggle";
import PricingComparisonTable from "@/components/pricing/PricingComparisonTable";
import StudioPriceBuilder from "@/components/pricing/StudioPriceBuilder";
import { STUDIO_PRICING } from "@/lib/data/services";
import { PRICES_EXCLUDE_VAT_NOTE } from "@/lib/data/pricing";
import { SKEPTICISM_CTA } from "@/lib/data/conversion-copy";
import { getSuitedForById } from "@/lib/data/pricing-catalog";
import { STUDIO_EXTRA_PARTICIPANT_PRICE } from "@/lib/data/studio-recording-booking";
import { STUDIO_PRICING_ACCORDION_PANELS } from "@/lib/data/studio-pricing-accordion";
import { buildPricingOffersSchema } from "@/lib/seo/page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { absoluteUrl } from "@/lib/site-url";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export const metadata = metadataFromPricing(STUDIO_PRICING);

const consultHref = buildWhatsAppHref({
  text: "שלום, מעוניין/ת בייעוץ תמחור לאולפן - אשמח לשמוע על החבילות",
  utm_source: "website",
  utm_campaign: "studio_pricing_consult",
});

/** חבילות לפי תוצאה - שעת חדר בלי עריכה נשארת באקורדיון */
const STUDIO_OUTCOME_TIERS = STUDIO_PRICING.tiers.filter(
  (tier) => tier.id !== "half-hour" && tier.id !== "hourly",
);

/** מובייל: החבילה המומלצת = החבילה המסומנת featured (אותו סימון כמו בדסקטופ) */
const recommendedTierIndex = Math.max(
  STUDIO_OUTCOME_TIERS.findIndex((tier) => tier.featured),
  0,
);

/** המלצה לפי צורך - "מתאים ל" מקטלוג המחירים, בלי מסרים חדשים */
const NEED_GUIDE = [
  {
    need: getSuitedForById("blessing_recording"),
    tier: "הקלטת ברכה",
    href: "/studio/blessings",
  },
  {
    need: getSuitedForById("cover_song"),
    tier: "שיר מוכן באולפן",
    href: "/studio/recording-song-modiin",
  },
  {
    need: getSuitedForById("song_package"),
    tier: "שיר Pro",
    href: "/studio/recording-song-modiin",
  },
  {
    need: getSuitedForById("single_production"),
    tier: "הפקת סינגל מלא",
    href: "/studio/recording-song-modiin",
  },
] as const;

const pageUrl = absoluteUrl("studio/pricing");
const pricingOffersSchema = buildPricingOffersSchema(
  pageUrl,
  STUDIO_PRICING_ACCORDION_PANELS.map((panel) => ({
    id: panel.id,
    name: panel.title,
    description: `${panel.suitedFor}. ${panel.priceNote}`,
    priceExVat: panel.priceExVat,
  })),
);

export default function StudioPricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(pricingOffersSchema) }}
      />
      <ServicePageLayout
        title={STUDIO_PRICING.title}
        subtitle={STUDIO_PRICING.subtitle}
        features={STUDIO_PRICING.features}
        whatsappText="שלום, מעוניין לקבל הצעת מחיר מותאמת לאולפן"
        utmCampaign="studio_pricing_general"
        bookSlug="studio/pricing"
        ctaLabel="ייעוץ אישי בוואטסאפ"
        category="studio"
      >
      <Container className="space-y-12">
        <TrustStatsBar className="rounded-2xl border" />

        <section aria-labelledby="pricing-intro-heading">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              שקיפות מלאה
            </p>
            <h2
              id="pricing-intro-heading"
              className="mt-3 font-serif text-section-title font-semibold text-foreground"
            >
              בחרו חבילה - בלי הפתעות
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {PRICES_EXCLUDE_VAT_NOTE}. כל חבילה כוללת ליווי טכני, חדר שקט וציוד
              מקצועי. לא בטוחים? נעזור לבחור בוואטסאפ.
            </p>
            <ContextualIntroParagraph
              pathname="/studio/pricing"
              className="mx-auto mt-3 max-w-xl text-center"
            />
          </header>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {[
              "תמחור לפי פרויקט",
              "שדרוגים: מיקס, קליפ, מוזיקה",
              "שובר מתנה זמין",
              "תיאום גמיש בערב",
            ].map((chip) => (
              <li
                key={chip}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden />
                {chip}
              </li>
            ))}
          </ul>

          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-sm text-muted-foreground">
            <Link
              href="/studio"
              className="inline-flex min-h-11 items-center font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            > חזרה למרכז האולפן
            </Link>
            <span aria-hidden>-</span>
            <Link
              href="/pricing"
              className="inline-flex min-h-11 items-center font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              מחירון מרכזי (כל השירותים)
            </Link>
            <span aria-hidden>-</span>
            <Link
              href="/book"
              className="inline-flex min-h-11 items-center font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              הזמנה מקוונת
            </Link>
          </p>
        </section>

        <StudioPriceBuilder
          packages={
            <>
              <div className="md:hidden">
                <PricingTierToggle
                  tiers={STUDIO_OUTCOME_TIERS}
                  recommendedIndex={recommendedTierIndex}
                  className="mx-auto max-w-sm"
                />
              </div>
              <div className="hidden md:block">
                <StudioPricingGrid tiers={STUDIO_OUTCOME_TIERS} />
              </div>
            </>
          }
        />

        <section aria-labelledby="need-guide-heading">
          <h2
            id="need-guide-heading"
            className="text-center font-serif text-xl font-semibold text-foreground"
          >
            לא בטוחים? 4 שאלות למעלה
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
            תענו על 4 שאלות בבונה המחיר - נמליץ על החבילה לפי הקטלוג. לא רוצים
            להתלבט?{" "}
            <a
              href={consultHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center font-semibold text-brand-red hover:underline"
            >
              נעזור בוואטסאפ
            </a>
            .
          </p>
          <ul className="mx-auto mt-4 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
            {NEED_GUIDE.map((item) => (
              <li
                key={item.tier}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="text-muted-foreground">{item.need}</span>
                {" - "}
                <InlineServiceLink href={item.href}>{item.tier}</InlineServiceLink>
              </li>
            ))}
          </ul>
        </section>

        <StudioPricingAccordion />
      </Container>

      <Container className="pb-8">
        <section
          className="mt-12 rounded-2xl border border-border bg-surface px-4 py-8 sm:px-8"
          aria-labelledby="studio-expert-tip-heading"
        >
          <h2
            id="studio-expert-tip-heading"
            className="text-center font-serif text-section-title font-semibold text-foreground"
          >
            טיפ מומחה לפני שבוחרים חבילה
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            שלוש שאלות קובעות את המחיר: מה משך ההקלטה, כמה אנשים, ואיזה גימור.
            התשובות שלכם קובעות את המחיר. לא אנחנו. תזיזו את הבחירות למעלה.
          </p>
          <ol className="mx-auto mt-5 max-w-xl space-y-2 text-sm text-foreground">
            <li>1. ברכה או שיר קצר - מסלול ברכה. שיר מוכן - קלאסי. סינגל מסחרי - הפקה מלאה.</li>
            <li>2. אדם אחד - מחיר בסיס. שניים ומעלה - תוספת {STUDIO_EXTRA_PARTICIPANT_PRICE} ₪ למקליט נוסף.</li>
            <li>3. שעת חדר בלי עריכה שייכת לפודקאסט ולקריינות, לא לשיר במתנה.</li>
          </ol>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
            {SKEPTICISM_CTA}
          </p>
        </section>

        <section className="mt-12" aria-labelledby="studio-comparison-heading">
          <h2
            id="studio-comparison-heading"
            className="text-center font-serif text-section-title font-semibold text-foreground"
          >
            לא רק אולפן: השוואה לפודקאסט, שיר ושירותים מרחוק
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
            אם ההקלטה שלכם היא פרק{" "}
            <InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink>, קובץ
            קיים שצריך{" "}
            <InlineServiceLink href="/online/vocal-fix">תיקון מרחוק</InlineServiceLink>{" "}
            או הקלטה{" "}
            <InlineServiceLink href="/studio/mobile-studio">בבית שלכם</InlineServiceLink>{" "}
            - יש מסלול ייעודי. {PRICES_EXCLUDE_VAT_NOTE}.
          </p>
          <PricingComparisonTable
            headingId="studio-comparison-heading"
            className="mx-auto mt-6 max-w-4xl"
          />
        </section>

        <section
          className="mt-12 rounded-2xl border border-border bg-surface px-4 py-10 sm:px-8"
          aria-labelledby="studio-pricing-pitch-proof-heading"
        >
          <ProposalGiftPitchProofSection
            headingId="studio-pricing-pitch-proof-heading"
            heading="עם תיקון זיופים או בלי? שמעו לפני שמחליטים"
            intro="שיר מוכן כולל תיקון זיופים. ברכה והקלטה מהבית - בלי. שמעו את ההבדל ואז צפו בקליפ המלא."
          />
        </section>

        <section
          className="mt-12 rounded-2xl border border-brand-red/20 bg-gradient-to-b from-brand-red/[0.04] to-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="pricing-cta-heading"
        >
          <h2
            id="pricing-cta-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            לא בטוחים איזו חבילה מתאימה?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            ספרו לנו מה אתם רוצים להקליט - שיר, ברכה, פודקאסט או סינגל - ונציע
            את החבילה הנכונה בלי לשלם על מה שלא צריך.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              as="a"
              href={consultHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              ייעוץ אישי עם בן אדם אמיתי
            </Button>
            <Button
              as="link"
              href="/studio/recording-song-modiin/gifts"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              מתנות ושוברים
            </Button>
          </div>
        </section>
      </Container>
    </ServicePageLayout>
    </>
  );
}
