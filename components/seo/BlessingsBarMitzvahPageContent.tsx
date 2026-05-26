import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { getStudioService } from "@/lib/data/services";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { BAR_MITZVAH_BLESSING_VIDEOS } from "@/lib/data/youtube-showcases";

const service = getStudioService("blessings-bar-mitzvah");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function BlessingsBarMitzvahPageContent() {
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
          pathname="/studio/blessings/bar-mitzvah"
          className="max-w-3xl"
        />
        <ShowcaseVideoSection
          heading="דוגמאות ברכות ושיר לבר/בת מצווה"
          subheading="הקלטה באולפן, עריכה ותיקון קול — כולל שיר עם תיקון זיופים"
          videos={BAR_MITZVAH_BLESSING_VIDEOS}
          initialVisible={3}
        />
        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={service.playlistEmbedUrl}
          mediaType={service.mediaType}
          galleryLabel="ברכות בר/בת מצווה"
          videoHeading="וידאו נוסף מהאולפן"
          galleryLayout="masonry"
        />
        {service.faqs.length > 0 ? (
          <FAQAccordion items={[...service.faqs]} title="שאלות נפוצות" className="py-0" />
        ) : null}
        <PageRelatedFooter pathname="/studio/blessings/bar-mitzvah" />
      </div>
    </ServicePageLayout>
  );
}
