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
import VoiceoverNarratorCompare from "@/components/seo/VoiceoverNarratorCompare";
import FAQAccordion from "@/components/ui/FAQAccordion";
import type { ShowcaseVideoItem } from "@/lib/data/video-catalog";

const bookCta = resolveServiceBookCta("voiceover");

/** קריינות אנושית לאפליקציות - דוגמאות אמיתיות, לא קול מסונתז */
const APP_VOICEOVER_DEMOS: readonly ShowcaseVideoItem[] = [
  {
    videoId: "AlkFbRo_WWo",
    title: "קריינות לאפליקציה, דוגמה ראשונה",
    description: "קריינות אנושית לאפליקציה, הוקלטה באולפן. הקריין: יקיר כהן.",
  },
  {
    videoId: "cwr2_-cWoHo",
    title: "קריינות לאפליקציה, דוגמה שנייה",
    description: "דוגמה נוספת לקריינות אנושית לאפליקציה. הקריין: יקיר כהן.",
  },
];

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
      pagePath="/voiceover"
      faqs={service.faqs}
      {...heroProps}
    >
      <Container className="space-y-14 py-12 sm:py-16">
        <VoiceoverNarratorCompare context="page" />
        <ShowcaseVideoSection playlistId="voiceover-hub" />
        <ShowcaseVideoSection
          videos={APP_VOICEOVER_DEMOS}
          heading="קריינות אנושית לאפליקציות"
          subheading="קריין אנושי אמיתי, לא קול מסונתז. הקריין: יקיר כהן."
          kicker="אפליקציות"
          sectionId="app-voiceover-demos"
          initialVisible={2}
        />
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
        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ששואלים אותנו הרבה לפני שמזמינים"
            className="py-0"
          />
        ) : null}
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
