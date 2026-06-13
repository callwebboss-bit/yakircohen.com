import { metadataFromPricing } from "@/lib/data/service-metadata";
import Link from "next/link";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import StudioPricingGrid from "@/components/services/StudioPricingGrid";
import { STUDIO_PRICING } from "@/lib/data/services";
import { PRICES_EXCLUDE_VAT_NOTE } from "@/lib/data/pricing";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export const metadata = metadataFromPricing(STUDIO_PRICING);

const consultHref = buildWhatsAppHref({
  text: "שלום, מעוניין/ת בייעוץ תמחור לאולפן - אשמח לשמוע על החבילות",
  utm_source: "website",
  utm_campaign: "studio_pricing_consult",
});

export default function StudioPricingPage() {
  return (
    <ServicePageLayout
      title={STUDIO_PRICING.title}
      subtitle={STUDIO_PRICING.subtitle}
      features={STUDIO_PRICING.features}
      whatsappText="שלום, מעוניין לקבל הצעת מחיר מותאמת לאולפן"
      utmCampaign="studio_pricing_general"
      bookSlug="studio/pricing"
      ctaLabel="ייעוץ תמחור בוואטסאפ"
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
      </Container>

      <StudioPricingGrid tiers={STUDIO_PRICING.tiers} />

      <Container className="pb-8">
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
              ייעוץ תמחור בוואטסאפ
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
  );
}
