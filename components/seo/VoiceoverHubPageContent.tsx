import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
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
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import { VOICEOVER_HUB_VIDEOS } from "@/lib/data/youtube-showcases";

const bookCta = resolveServiceBookCta("voiceover");

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
      showBookCtaInHero={Boolean(bookCta)}
      bookHref={bookCta?.bookHref}
      bookLabel={bookCta?.bookLabel}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-14 px-4 sm:px-6 lg:px-8">
        <ShowcaseVideoSection playlistId="voiceover-hub" />
        <ServiceHubLinks
          heading="שירותי קריינות"
          subheading="בחרו מסלול מותאם או התחילו בייעוץ קצר בוואטסאפ."
          links={getVoiceoverHubLinks()}
          headingId="voiceover-tracks-heading"
        />
        <ClientJourneySteps variant="studio" display="compact" />
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
