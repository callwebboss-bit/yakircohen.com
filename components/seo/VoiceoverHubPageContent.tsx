import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import {
  getVoiceoverHubLinks,
  getVoiceoverService,
} from "@/lib/data/services";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { VOICEOVER_HUB_VIDEOS } from "@/lib/data/youtube-showcases";

const service = getVoiceoverService("voiceover-hub");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function VoiceoverHubPageContent() {
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
        <ShowcaseVideoSection
          heading="דוגמאות קריינות מהאולפן"
          subheading="פרסומות, תדמית ומסרים מותגיים - איכות שידורית"
          videos={VOICEOVER_HUB_VIDEOS}
          initialVisible={3}
        />
        <ServiceHubLinks
          heading="שירותי קריינות"
          subheading="בחרו מסלול מותאם או התחילו בייעוץ קצר בוואטסאפ."
          links={getVoiceoverHubLinks()}
          headingId="voiceover-tracks-heading"
        />
        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={service.playlistEmbedUrl}
          mediaType={service.mediaType}
          galleryLabel="קריינות מקצועית"
          galleryLayout="masonry"
          secondaryEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["voiceover-hub-alt"],
          )}
          secondaryEmbedTitle="קריינות לסרטון תדמית"
        />
      </div>
    </ServicePageLayout>
  );
}
