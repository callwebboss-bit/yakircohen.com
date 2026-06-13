import JourneyStepsLink from "@/components/marketing/JourneyStepsLink";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { getVoiceoverService } from "@/lib/data/services";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { VOICEOVER_COURSE_VIDEOS } from "@/lib/data/youtube-showcases";

const service = getVoiceoverService("voiceover-course");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function VoiceoverCoursePageContent() {
  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={service.features}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      bookSlug={service.slug}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-14 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/voiceover/course" className="max-w-3xl" />
        <ShowcaseVideoSection
          playlistId="voiceover-course"
          sectionId="voiceover-course-videos"
        />
        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={service.playlistEmbedUrl}
          mediaType={service.mediaType}
          galleryLabel="קורס קריינות"
          galleryLayout="masonry"
        />
        <section className="py-4">
          <JourneyStepsLink variant="studio" />
        </section>
        {service.faqs.length > 0 ? (
          <FAQAccordion items={[...service.faqs]} title="שאלות ששואלים אותנו הרבה לפני שמזמינים" className="py-0" />
        ) : null}
        <PageRelatedFooter pathname="/voiceover/course" />
      </div>
    </ServicePageLayout>
  );
}
