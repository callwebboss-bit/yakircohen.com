import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import { getStudioService } from "@/lib/data/services";
import { BAR_MITZVAH_BLESSING_VIDEOS } from "@/lib/data/youtube-showcases";

const service = getStudioService("blessings-bar-mitzvah");

export default function BlessingsBarMitzvahPageContent() {
  return (
    <ServicePageFromRegistry service={service} portfolioLabel="ברכות בר/בת מצווה">
      <ShowcaseVideoSection
        heading="דוגמאות ברכות ושיר לבר/בת מצווה"
        subheading="הקלטה באולפן, עריכה ותיקון קול - לצפייה בלחיצה (לא בראש העמוד)"
        videos={BAR_MITZVAH_BLESSING_VIDEOS}
        initialVisible={3}
      />
    </ServicePageFromRegistry>
  );
}
