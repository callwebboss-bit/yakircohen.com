import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import BlessingsProcessGrid from "@/components/blessings/BlessingsProcessGrid";
import BlessingsRelatedNav from "@/components/blessings/BlessingsRelatedNav";
import BlessingsSectionHeader from "@/components/blessings/BlessingsSectionHeader";
import BlessingsWhyGrid from "@/components/blessings/BlessingsWhyGrid";
import BlessingsBrideGroomBeforeAfter from "@/components/seo/BlessingsBrideGroomBeforeAfter";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  BRIDE_GROOM_PROCESS,
  BRIDE_GROOM_WHY,
} from "@/lib/data/blessings-subpages";
import { getStudioService } from "@/lib/data/services";
import { BRIDE_GROOM_BLESSING_VIDEOS } from "@/lib/data/youtube-showcases";

const service = getStudioService("blessings-bride-groom");

const RELATED_LINKS = [
  { href: "/studio/blessings", label: "כל סוגי הברכות" },
  { href: "/studio/blessings/bar-mitzvah", label: "בר/בת מצווה" },
  { href: "/studio/blessings/video-clip", label: "שיר + קליפ" },
  { href: "/voucher", label: "שובר מתנה" },
] as const;

export default function BlessingsBrideGroomPageContent() {
  return (
    <ServicePageFromRegistry service={service} portfolioLabel="ברכת חתן וכלה">
      <TrustStatsBar variant="compact" className="rounded-2xl border" />

      <section aria-labelledby="bride-groom-audio-heading">
        <BlessingsSectionHeader
          id="bride-groom-audio-heading"
          eyebrow="שמעו את ההבדל"
          title="לפני ואחרי: איך נשמעת ברכה מלוטשת?"
          description="רוב האנשים שמקליטים ברכה לא עשו זאת מעולם. העריכה היא זו שהופכת את הרגע לבלתי נשכח."
        />
        <div className="mt-8">
          <BlessingsBrideGroomBeforeAfter />
        </div>
      </section>

      <section aria-labelledby="bride-groom-why-heading">
        <BlessingsSectionHeader
          id="bride-groom-why-heading"
          eyebrow="למה באולפן?"
          title="ברכה שמחברת בין דורות"
        />
        <BlessingsWhyGrid items={BRIDE_GROOM_WHY} />
      </section>

      <section aria-labelledby="bride-groom-process-heading">
        <BlessingsSectionHeader
          id="bride-groom-process-heading"
          eyebrow="התהליך"
          title="מהרגע הראשון ועד לחתונה"
        />
        <BlessingsProcessGrid steps={BRIDE_GROOM_PROCESS} />
      </section>

      <ShowcaseVideoSection
        kicker="דוגמה"
        heading="דוגמת ברכת חתן וכלה"
        subheading="הקלטה אינטימית באולפן עם עריכה מקצועית - לצפייה בלחיצה"
        videos={BRIDE_GROOM_BLESSING_VIDEOS}
      />

      <BlessingsRelatedNav links={RELATED_LINKS} />
    </ServicePageFromRegistry>
  );
}
