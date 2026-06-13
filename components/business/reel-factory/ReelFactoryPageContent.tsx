import Link from "next/link";
import ReelFactoryAudienceGrid from "@/components/business/reel-factory/ReelFactoryAudienceGrid";
import ReelFactoryOneOffPricing from "@/components/business/reel-factory/ReelFactoryOneOffPricing";
import ReelFactoryPipeline from "@/components/business/reel-factory/ReelFactoryPipeline";
import ReelFactoryRetainerTiers from "@/components/business/reel-factory/ReelFactoryRetainerTiers";
import ReelFactoryTermsBlock from "@/components/business/reel-factory/ReelFactoryTermsBlock";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import Container from "@/components/ui/Container";
import FAQAccordion from "@/components/ui/FAQAccordion";
import {
  ABOUT_PARAGRAPHS,
  FAQ_ITEMS,
  HUB_WHATSAPP_TEXT,
  PAGE_FEATURES,
  REEL_FACTORY_BRAND,
  REEL_FACTORY_TAGLINE,
} from "@/lib/data/reel-factory";

export default function ReelFactoryPageContent() {
  return (
    <ServicePageLayout
      title={`${REEL_FACTORY_BRAND} | ${REEL_FACTORY_TAGLINE}`}
      subtitle="סיימתם אירוע ב-2 בלילה - מקבלים רילס Rave ערוך ב-12 בצהריים. בלי לשבת על עריכה."
      features={PAGE_FEATURES}
      scarcityLabel="פס ייצור 24 שעות - עדיפות לחברי מנוי"
      whatsappText={HUB_WHATSAPP_TEXT}
      utmCampaign="reel_factory_hub"
      ctaLabel="התחילו עם מפעל הרילס"
    >
      <ReelFactoryPipeline />

      <Container className="space-y-14 py-12 sm:py-16">
        <ReelFactoryAudienceGrid />

        <section aria-labelledby="reel-about-heading">
          <h2 id="reel-about-heading" className="sr-only">
            אודות {REEL_FACTORY_BRAND}
          </h2>
          <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <ReelFactoryOneOffPricing />
        <ReelFactoryRetainerTiers />
        <ReelFactoryTermsBlock />

        <FAQAccordion title={`שאלות נפוצות - ${REEL_FACTORY_BRAND}`} items={FAQ_ITEMS} />

        <nav aria-label="קישורים קשורים" className="border-t border-border pt-8">
          <h2 className="text-sm font-semibold text-foreground">שירותים קשורים</h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            <li>
              <Link
                href="/business/social-media"
                className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                ניהול סושיאל לעסקים
              </Link>
            </li>
            <li>
              <Link
                href="/video"
                className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                הפקות וידאו
              </Link>
            </li>
            <li>
              <Link
                href="/online/vocal-fix/send-file"
                className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                שליחת קבצים
              </Link>
            </li>
            <li>
              <Link
                href="/events/dj-events"
                className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                תקליטן לאירועים
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </ServicePageLayout>
  );
}
