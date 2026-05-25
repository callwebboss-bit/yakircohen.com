import type { ReactNode } from "react";

import FAQAccordion from "@/components/ui/FAQAccordion";

import type { ServiceEntity, ServicePricingTier } from "@/lib/data/services";

import ServicePageLayout from "@/components/services/ServicePageLayout";

import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";

import ServicePricingBlock from "@/components/services/ServicePricingBlock";

import StudioUpsellCallout from "@/components/services/StudioUpsellCallout";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";



function getStartingPrice(pricing?: readonly ServicePricingTier[]): string | undefined {

  if (!pricing?.length) return undefined;

  const price = pricing[0].price;

  if (!price || price.includes("הצעה") || price.includes("לפי") || price.includes("תיאום"))

    return undefined;

  return price;

}



export type ServicePageFromRegistryProps = {

  service: ServiceEntity;

  children?: ReactNode;

  portfolioLabel?: string;

  showFaqs?: boolean;

};



export default function ServicePageFromRegistry({

  service,

  children,

  portfolioLabel,

  showFaqs = true,

}: ServicePageFromRegistryProps) {

  const showPortfolio =

    service.mediaType !== "none" ||

    Boolean(service.playlistEmbedUrl?.trim());



  const pageHero = resolveServicePageHeroFromEntity(service);



  const showcaseLabel = portfolioLabel ?? service.title;
  const pagePath = `/${service.slug.replace(/^\/+/, "")}`;

  return (

    <ServicePageLayout

      title={service.title}

      subtitle={service.subtitle}

      features={service.features}

      whatsappText={service.whatsappText}

      startingPrice={getStartingPrice(service.pricing)}

      utmCampaign={service.utmCampaign}

      scarcityLabel={service.scarcityLabel}

      {...pageHero}

    >

      {service.pricing && service.pricing.length > 0 ? (

        <ServicePricingBlock

          tiers={service.pricing}

          serviceTitle={service.title}

          utmCampaignPrefix={service.utmCampaign}

        />

      ) : null}

      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname={pagePath} className="max-w-3xl" />

        {showPortfolio ? (

          <ServiceShowcaseSections

            assetsFolder={service.assetsFolder}

            playlistEmbedUrl={service.playlistEmbedUrl}

            mediaType={service.mediaType}

            galleryLabel={showcaseLabel}

            videoTitle={showcaseLabel}

            videoHeading={

              service.mediaType === "video" ? "צפו בדוגמא מהשטח" : undefined

            }

            videoDescription={

              service.mediaType === "video"

                ? "לצפייה בדוגמא — הוידאו נטען בלחיצה (לא בראש העמוד)"

                : undefined

            }

          />

        ) : null}



        {children}



        {service.category === "studio" ? <StudioUpsellCallout /> : null}



        {showFaqs && service.faqs.length > 0 ? (

          <FAQAccordion

            items={[...service.faqs]}

            title="שאלות נפוצות"

            subtitle="מענים קצרים לפני שמתחילים"

            className="py-0"

          />

        ) : null}

        <PageRelatedFooter pathname={pagePath} />
      </div>

    </ServicePageLayout>

  );

}

