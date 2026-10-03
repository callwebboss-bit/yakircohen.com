import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import BlessingsProcessGrid from "@/components/blessings/BlessingsProcessGrid";
import BlessingsRelatedNav from "@/components/blessings/BlessingsRelatedNav";
import BlessingsSectionHeader from "@/components/blessings/BlessingsSectionHeader";
import BlessingsWhyGrid from "@/components/blessings/BlessingsWhyGrid";
import BatMitzvahClipShowcase from "@/components/seo/BatMitzvahClipShowcase";
import ProposalGiftPitchProofSection from "@/components/seo/ProposalGiftPitchProofSection";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import SongOfferSection from "@/components/pricing/SongOfferSection";
import {
  VIDEO_CLIP_PROCESS,
  VIDEO_CLIP_WHY,
} from "@/lib/data/blessings-subpages";
import { getStudioService } from "@/lib/data/services";
import { BLESSINGS_VIDEO_CLIP_VIDEOS } from "@/lib/data/youtube-showcases";

const service = getStudioService("blessings-video-clip");

const RELATED_LINKS = [
  { href: "/studio/blessings", label: "כל סוגי הברכות" },
  { href: "/studio/blessings/bat-mitzvah-clip", label: "קליפ בת מצווה" },
  { href: "/studio/recording-song-modiin", label: "הקלטת שיר" },
  { href: "/studio/recording-song-modiin/gifts", label: "מתנות מהאולפן" },
  { href: "/studio/pricing", label: "מחירון" },
] as const;

export default function BlessingsVideoClipPageContent() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="דוגמאות קליפים מהאולפן"
      showPortfolio={false}
    >
      <TrustStatsBar variant="compact" className="rounded-2xl border" />

      {/* שיר וקליפ: הטופס עם הקליפ הערוך מסומן מראש. אפשר להוריד אותו ולהשאיר שיר בלבד */}
      <SongOfferSection
        source="/studio/blessings/video-clip"
        initialAddonIds={["studio_session_clip_edited"]}
        utmCampaign="video_clip_song_offer"
        pitchDemoHref="#video-clip-pitch-proof"
        intro="הקלטת שיר עם קליפ ערוך מהסשן. המחיר כולל מע״מ, ואפשר לשנות את הבחירה."
      />

      <section aria-labelledby="video-clip-why-heading">
        <BlessingsSectionHeader
          id="video-clip-why-heading"
          eyebrow="שיר + וידאו"
          title="חוויה אחת: סאונד אולפן וקליפ מלוטש"
          description="הקלטה, צילום ועריכה במקום אחד - מתנה משפחתית, בר/בת מצווה או שיר לחתונה."
        />
        <BlessingsWhyGrid items={VIDEO_CLIP_WHY} />
      </section>

      <section aria-labelledby="video-clip-process-heading">
        <BlessingsSectionHeader
          id="video-clip-process-heading"
          eyebrow="התהליך"
          title="יום הפקה - מהתכנון ועד הקליפ"
        />
        <BlessingsProcessGrid steps={VIDEO_CLIP_PROCESS} />
      </section>

      <section
        className="rounded-2xl border border-brand-red/20 bg-gradient-to-b from-brand-red/[0.04] to-surface p-6 sm:p-8"
        aria-labelledby="video-clip-includes-heading"
      >
        <BlessingsSectionHeader
          id="video-clip-includes-heading"
          eyebrow="מה כלול"
          title="מה מקבלים בחבילה?"
          description="אפשר גם הקלטת שיר בלבד - בלי צילום. מורידים את הקליפ בטופס למעלה."
        />
        <ul className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
          {service.features.map((feature) => (
            <li
              key={feature}
              className="flex gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
            >
              <span className="text-brand-red" aria-hidden>
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section
        id="video-clip-pitch-proof"
        className="scroll-mt-24 rounded-2xl border border-border bg-surface p-6 sm:p-8"
        aria-labelledby="video-clip-pitch-proof-heading"
      >
        <ProposalGiftPitchProofSection
          headingId="video-clip-pitch-proof-heading"
          heading="מה עושה תוספת תיקון הזיופים? שמעו לפני ואחרי"
          intro="תיקון זיופים לא כלול במחיר הבסיס, ומוסיפים אותו בטופס למעלה. שמעו את ההבדל ואז צפו בקליפ המלא."
        />
      </section>

      {/* בלי faqItems: שתי שאלות בת המצווה לא מוצגות בעמוד הזה, ונשלחו לגוגל
          כטקסט מוסתר. */}
      <BatMitzvahClipShowcase heading="קליפ בת מצווה - דוגמה מלאה" />

      <ShowcaseVideoSection playlistId="blessings-video-clip" />

      <BlessingsRelatedNav links={RELATED_LINKS} />
    </ServicePageFromRegistry>
  );
}
