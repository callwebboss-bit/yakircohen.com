import FAQAccordion from "@/components/ui/FAQAccordion";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import EventFilmingPhotoGalleries from "@/components/seo/EventFilmingPhotoGalleries";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { getVideoService } from "@/lib/data/services";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";

const service = getVideoService("video-event-filming");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function EventFilmingPageContent() {
  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={service.features}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      bookSlug={service.slug}
      heroGallerySectionId="event-filming-gallery-best"
      pagePath="/video/event-filming"
      faqs={service.faqs}
      {...heroProps}
      heroScrollTarget={pageHero.heroImageSrc ? "gallery" : undefined}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/video/event-filming" className="max-w-3xl" />

        <EventFilmingPhotoGalleries />

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={service.playlistEmbedUrl}
          mediaType="video"
          galleryLabel="צילום והפקת וידאו לאירועים"
          videoTitle="צילום והפקת וידאו לאירועים"
          videoHeading="צפו בדוגמא מהשטח"
          videoDescription="לצפייה בדוגמא - הוידאו נטען בלחיצה"
          showGallery={false}
        />

        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות נפוצות - צילום וידאו לאירועים"
            className="py-0"
          />
        ) : null}

        <PageRelatedFooter pathname="/video/event-filming" />
      </div>
    </ServicePageLayout>
  );
}
