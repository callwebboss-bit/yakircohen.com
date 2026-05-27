import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import { getStudioService } from "@/lib/data/services";
import { BRIDE_GROOM_BLESSING_VIDEOS } from "@/lib/data/youtube-showcases";

const service = getStudioService("blessings-bride-groom");

export default function BlessingsBrideGroomPageContent() {
  return (
    <ServicePageFromRegistry service={service} portfolioLabel="ברכת חתן וכלה">
      <ShowcaseVideoSection
        heading="דוגמת ברכת חתן וכלה"
        subheading="הקלטה אינטימית באולפן עם עריכה מקצועית - לצפייה בלחיצה"
        videos={BRIDE_GROOM_BLESSING_VIDEOS}
      />
    </ServicePageFromRegistry>
  );
}
