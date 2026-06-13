import type { ReactNode } from "react";
import FAQAccordion from "@/components/ui/FAQAccordion";
import type { ServiceEntity, ServicePricingTier } from "@/lib/data/services";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import StudioUpsellCallout from "@/components/services/StudioUpsellCallout";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServicePageSchema from "@/components/seo/ServicePageSchema";
import {
  SERVICE_GALLERY_MAX_IMAGES,
  withServicePageHeroDefaults,
} from "@/lib/service-page-ui";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
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
  /** Hide built-in gallery/video showcase when custom content provides it */
  showPortfolio?: boolean;
};

export default function ServicePageFromRegistry({
  service,
  children,
  portfolioLabel,
  showFaqs = true,
  showPortfolio = true,
}: ServicePageFromRegistryProps) {
  const showPortfolioSection =
    showPortfolio &&
    (service.mediaType !== "none" || Boolean(service.playlistEmbedUrl?.trim()));

  const pageHero = resolveServicePageHeroFromEntity(service);
  const heroProps = withServicePageHeroDefaults(pageHero);
  const showcaseLabel = portfolioLabel ?? service.title;
  const pagePath = `/${service.slug.replace(/^\/+/, "")}`;
  const bookCta = resolveServiceBookCta(service.slug);

  return (
    <>
      <ServicePageSchema service={service} />
      {showFaqs && service.faqs.length > 0 ? (
        <FaqPageSchema
          items={service.faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          }))}
        />
      ) : null}
      <ServicePageLayout
      title={service.title}
      category={service.category}
      subtitle={service.subtitle}
      features={service.features}
      whatsappText={service.whatsappText}
      startingPrice={getStartingPrice(service.pricing)}
      utmCampaign={service.utmCampaign}
      scarcityLabel={service.scarcityLabel}
      showBookCtaInHero={Boolean(bookCta)}
      bookHref={bookCta?.bookHref}
      bookLabel={bookCta?.bookLabel}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname={pagePath} className="max-w-3xl" />

        {showPortfolioSection ? (
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
                ? "לצפייה בדוגמא - הוידאו נטען בלחיצה (לא בראש העמוד)"
                : undefined
            }
            galleryInitialVisible={SERVICE_GALLERY_MAX_IMAGES}
            galleryLayout="masonry"
          />
        ) : null}

        {children}

        {service.category === "studio" ? <StudioUpsellCallout /> : null}

        <ServicePagePricingSection service={service} />

        {showFaqs && service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ששואלים אותנו הרבה לפני שמזמינים"
            subtitle="מענים קצרים לפני שמתחילים"
            className="py-0"
          />
        ) : null}

        <PageRelatedFooter pathname={pagePath} />
      </div>
    </ServicePageLayout>
    </>
  );
}
