import { metadataFromService } from "@/lib/data/service-metadata";
import Link from "next/link";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import CaseStudySection from "@/components/marketing/CaseStudySection";
import ProductionCalculator from "@/components/marketing/ProductionCalculator";
import StudioClientsStrip from "@/components/marketing/StudioClientsStrip";
import StudioGearRoom from "@/components/marketing/StudioGearRoom";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import HubPageSchema from "@/components/seo/HubPageSchema";
import HubServiceIndexStatic from "@/components/seo/HubServiceIndexStatic";
import StudioHubValueSection from "@/components/seo/StudioHubValueSection";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import ShareButton from "@/components/ui/ShareButton";
import SmartMap from "@/components/ui/SmartMap";
import { hubSchemaPropsFromService } from "@/lib/seo/hub-pages";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { getStudioHubIcon } from "@/lib/data/studio-hub-icons";
import {
  getStudioHubLinks,
  getStudioService,
} from "@/lib/data/services";
import { PORTFOLIO_CATALOG_COUNT } from "@/lib/data/video-catalog.generated";

const service = getStudioService("studio-hub");

export const metadata = metadataFromService(service);

const STUDIO_PRICING_LINK = {
  href: "/studio/pricing",
  title: "מחירון חבילות",
  description: "שקיפות מלאה - שעת אולפן, חבילת שיר והפקת סינגל.",
} as const;

const STUDIO_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      name: "האולפן -- יקיר כהן הפקות",
      image: "https://www.yakircohen.com/images/studio-hero.jpg",
      url: "https://www.yakircohen.com/studio",
      address: {
        "@type": "PostalAddress",
        streetAddress: "עמק איילון 34",
        addressLocality: "מודיעין-מכבים-רעות",
        addressCountry: "IL",
      },
      description:
        "אולפן הקלטות ופודקאסט מבוסס חומרה מתקדמת -- Townsend Sphere L22, UAD Apollo Twin, Allen & Heath -- עם רצפה צפה ובידוד אקוסטי מלא.",
      priceRange: "$$",
    },
    {
      "@type": "Product",
      name: "Townsend Sphere L22",
      description:
        "מיקרופון מודלינג אולפני המשמש כרכיב ליבה בשרשרת ההקלטה של האולפן.",
    },
    {
      "@type": "Product",
      name: "UAD Apollo Twin",
      description:
        "ממשק אודיו מתקדם המיועד להקלטה ועיבוד סאונד בזמן אמת עם DSP מובנה.",
    },
  ],
} as const;

export default function StudioHubPage() {
  const hubLinks = getStudioHubLinks();
  const tracks = [STUDIO_PRICING_LINK, ...hubLinks];
  const trackItems: HubLinkItem[] = tracks.map((track) => {
    const isPricing = track.href === STUDIO_PRICING_LINK.href;
    return {
      href: track.href,
      title: track.title,
      description: track.description,
      icon: getStudioHubIcon(track.href),
      badge: isPricing ? "שקיפות מחירים" : undefined,
      badgeVariant: isPricing ? "red" : undefined,
      isFeatured: isPricing,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(STUDIO_STRUCTURED_DATA) }}
      />
      <HubPageSchema {...hubSchemaPropsFromService(service, "studio")} />
      <HubServiceIndexStatic
        heading="מסלולי האולפן"
        links={tracks.map((track) => ({
          href: track.href,
          title: track.title,
          description: track.description,
        }))}
      />
      <ServicePageFromRegistry
      service={service}
      portfolioLabel="סביבת האולפן"
      showPortfolio={false}
      valueFrame="יוצאים עם קובץ מוכן - בלי ניחושים, בלי הפתעות"
    >
      <div className="space-y-16">
        <StudioHubValueSection />

        <ClientJourneySteps variant="studio" display="compact" />

        <p className="text-center">
          <Link
            href="/portfolio"
            className="text-sm font-semibold text-brand-red hover:underline"
          >
            לכל תיק הווידאו ({PORTFOLIO_CATALOG_COUNT} דוגמאות) </Link>
        </p>

        <TrustStatsBar className="rounded-2xl border" />

        <CaseStudySection hub="studio" className="border-0 bg-transparent px-0" />

        <StudioClientsStrip className="rounded-2xl border-x" />

        <ServiceHubLinks
          heading="שירותי האולפן"
          subheading="בחרו מסלול ממוקד או שלבו מספר שירותים לחבילה מותאמת אישית."
          links={trackItems}
          headingId="studio-tracks-heading"
        />

        <ProductionCalculator className="py-0" />

        <StudioGearRoom />

        <section
          className="overflow-hidden rounded-2xl border border-border bg-surface"
          aria-labelledby="studio-geo-note"
        >
          <div className="px-6 py-8 text-center sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              מיקום ונגישות
            </p>
            <h2
              id="studio-geo-note"
              className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl"
            >
              ממודיעין לירושלים והמרכז
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              האולפן ממוקם במודיעין עם נגישות מהירה מירושלים, השפלה והמרכז. חנייה
              נוחה, תיאום גמיש ושירות מקצועי לכל פרויקט.
            </p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              {[
                "חנייה חופשית בשפע",
                "15 דק׳ מירושלים",
                "נגישות מהשפלה והמרכז",
                "תיאום גמיש בערב",
              ].map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden />
                  {chip}
                </li>
              ))}
            </ul>
            <SmartMap
              address="עמק איילון 34, מודיעין-מכבים-רעות"
              googleMapsUrl="https://maps.google.com/maps?q=עמק+איילון+34+מודיעין&output=embed"
              className="mt-7 text-start"
            />
            <div className="mt-5 flex justify-center">
              <ShareButton title="אולפן הקלטות מקצועי | יקיר כהן הפקות" />
            </div>
          </div>
        </section>
      </div>
    </ServicePageFromRegistry>
    </>
  );
}
