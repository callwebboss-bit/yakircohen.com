import ProcessSteps from "@/components/marketing/ProcessSteps";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { getVoiceoverService } from "@/lib/data/services";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { VOICEOVER_SERVICES_VIDEOS } from "@/lib/data/youtube-showcases";
import { VOICEOVER_HUB_STEPS } from "@/lib/data/voiceover-steps";

const service = getVoiceoverService("voiceover-services");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function VoiceoverServicesPageContent() {
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
        <ContextualIntroParagraph pathname="/voiceover/services" className="max-w-3xl" />
        <ShowcaseVideoSection
          playlistId="voiceover-services"
          sectionId="voiceover-services-videos"
        />
        <ProcessSteps steps={VOICEOVER_HUB_STEPS} heading="איך הקריינות עובדת?" />
        {service.faqs.length > 0 ? (
          <FAQAccordion items={[...service.faqs]} title="שאלות נפוצות" className="py-0" />
        ) : null}
        <PageRelatedFooter pathname="/voiceover/services" />
      </div>
    </ServicePageLayout>
  );
}
