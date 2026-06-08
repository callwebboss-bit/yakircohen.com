import Link from "next/link";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import StudioPricingGrid from "@/components/services/StudioPricingGrid";
import { STUDIO_PRICING, metadataFromPricing } from "@/lib/data/services";
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
    >
      <div className="mx-auto max-w-[72rem] space-y-12 px-4 sm:px-6 lg:px-8">
        <TrustStatsBar className="rounded-2xl border" />

        <section aria-labelledby="pricing-intro-heading">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              שקיפות מלאה
            </p>
            <h2
              id="pricing-intro-heading"
              className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
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

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/studio" className="font-semibold text-brand-red hover:underline">
              ← חזרה למרכז האולפן
            </Link>
            {" · "}
            <Link href="/pricing" className="font-semibold text-brand-red hover:underline">
              מחירון מרכזי (כל השירותים)
            </Link>
            {" · "}
            <Link href="/book" className="font-semibold text-brand-red hover:underline">
              הזמנה מקוונת
            </Link>
          </p>
        </section>
      </div>

      <StudioPricingGrid tiers={STUDIO_PRICING.tiers} />

      <div className="mx-auto max-w-[72rem] px-4 pb-8 sm:px-6 lg:px-8">
        <section
          className="mt-12 rounded-2xl border border-brand-red/20 bg-gradient-to-b from-brand-red/[0.04] to-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="pricing-cta-heading"
        >
          <h2
            id="pricing-cta-heading"
            className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
          >
            לא בטוחים איזו חבילה מתאימה?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            ספרו לנו מה אתם רוצים להקליט - שיר, ברכה, פודקאסט או סינגל - ונציע
            את החבילה הנכונה בלי לשלם על מה שלא צריך.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={consultHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light sm:w-auto"
            >
              ייעוץ תמחור בוואטסאפ
            </a>
            <Link
              href="/studio/recording-song-modiin/gifts"
              className="inline-flex w-full items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red sm:w-auto"
            >
              מתנות ושוברים
            </Link>
          </div>
        </section>
      </div>
    </ServicePageLayout>
  );
}
