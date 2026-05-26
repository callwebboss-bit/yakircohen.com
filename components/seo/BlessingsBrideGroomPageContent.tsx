import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { getStudioService } from "@/lib/data/services";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { BRIDE_GROOM_BLESSING_VIDEOS } from "@/lib/data/youtube-showcases";

const service = getStudioService("blessings-bride-groom");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function BlessingsBrideGroomPageContent() {
  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={service.features}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-14 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph
          pathname="/studio/blessings/bride-groom-blessing"
          className="max-w-3xl"
        />
        <ShowcaseVideoSection
          heading="דוגמת ברכת חתן וכלה"
          subheading="הקלטה אינטימית באולפן עם עריכה מקצועית"
          videos={BRIDE_GROOM_BLESSING_VIDEOS}
        />
        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={service.playlistEmbedUrl}
          mediaType={service.mediaType}
          galleryLabel="ברכת חתן וכלה"
          galleryLayout="masonry"
        />
        {service.faqs.length > 0 ? (
          <FAQAccordion items={[...service.faqs]} title="שאלות נפוצות" className="py-0" />
        ) : null}
        <PageRelatedFooter pathname="/studio/blessings/bride-groom-blessing" />
      </div>
    </ServicePageLayout>
  );
}
