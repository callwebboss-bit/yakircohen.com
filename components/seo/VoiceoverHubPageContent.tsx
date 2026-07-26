import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import Container from "@/components/ui/Container";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import HubDecisionMatrix from "@/components/seo/HubDecisionMatrix";
import HubAudienceFitBlock from "@/components/seo/HubAudienceFitBlock";
import { VOICEOVER_HUB_DECISIONS } from "@/lib/data/hub-decision-matrix";
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
      valueFrame="קול מקצועי מוכן - בלי ניסויים, בלי לחפש קריין בחוץ"
      {...heroProps}
    >
      <Container className="space-y-14 py-12 sm:py-16">
        <ShowcaseVideoSection playlistId="voiceover-hub" />
        <HubAudienceFitBlock hubPath="/voiceover" />
        <HubDecisionMatrix
          rows={VOICEOVER_HUB_DECISIONS}
          heading="מה מתאים לי?"
          headingId="voiceover-hub-decision-heading"
        />
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
      </Container>
    </ServicePageLayout>
  );
}
