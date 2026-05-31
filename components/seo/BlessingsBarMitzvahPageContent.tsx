import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import BlessingsProcessGrid from "@/components/blessings/BlessingsProcessGrid";
import BlessingsRelatedNav from "@/components/blessings/BlessingsRelatedNav";
import BlessingsSectionHeader from "@/components/blessings/BlessingsSectionHeader";
import BlessingsWhyGrid from "@/components/blessings/BlessingsWhyGrid";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  BAR_MITZVAH_PROCESS,
  BAR_MITZVAH_WHY,
} from "@/lib/data/blessings-subpages";
import { getStudioService } from "@/lib/data/services";
import { BAR_MITZVAH_BLESSING_VIDEOS } from "@/lib/data/youtube-showcases";

const service = getStudioService("blessings-bar-mitzvah");

const RELATED_LINKS = [
  { href: "/studio/blessings", label: "כל סוגי הברכות" },
  { href: "/studio/blessings/video-clip", label: "שיר + קליפ" },
  { href: "/studio/recording-song-modiin/gifts", label: "מתנות מהאולפן" },
  { href: "/studio/pricing", label: "מחירון" },
] as const;

export default function BlessingsBarMitzvahPageContent() {
  return (
    <ServicePageFromRegistry service={service} portfolioLabel="ברכות בר/בת מצווה">
      <TrustStatsBar variant="compact" className="rounded-2xl border" />

      <section aria-labelledby="bar-mitzvah-why-heading">
        <BlessingsSectionHeader
          id="bar-mitzvah-why-heading"
          eyebrow="למה מוקלט?"
          title="ברכה שמכבדת את הרגע - בלי לחץ על הבמה"
          description="דרשה, ברכת הכהנים או ברכה אישית - מקליטים בשקט, עורכים בקצב נכון, ומוסרים קובץ מוכן לאירוע."
        />
        <BlessingsWhyGrid items={BAR_MITZVAH_WHY} />
      </section>

      <section aria-labelledby="bar-mitzvah-process-heading">
        <BlessingsSectionHeader
          id="bar-mitzvah-process-heading"
          eyebrow="התהליך"
          title="איך זה עובד?"
        />
        <BlessingsProcessGrid steps={BAR_MITZVAH_PROCESS} />
      </section>

      <ShowcaseVideoSection
        kicker="דוגמאות"
        heading="דוגמאות ברכות ושיר לבר/בת מצווה"
        subheading="הקלטה באולפן, עריכה ותיקון קול - לצפייה בלחיצה"
        videos={BAR_MITZVAH_BLESSING_VIDEOS}
        initialVisible={3}
      />

      <BlessingsRelatedNav links={RELATED_LINKS} />
    </ServicePageFromRegistry>
  );
}
