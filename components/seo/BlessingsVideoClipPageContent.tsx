import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import BlessingsProcessGrid from "@/components/blessings/BlessingsProcessGrid";
import BlessingsRelatedNav from "@/components/blessings/BlessingsRelatedNav";
import BlessingsSectionHeader from "@/components/blessings/BlessingsSectionHeader";
import BlessingsWhyGrid from "@/components/blessings/BlessingsWhyGrid";
import BatMitzvahClipShowcase from "@/components/seo/BatMitzvahClipShowcase";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  VIDEO_CLIP_PROCESS,
  VIDEO_CLIP_WHY,
} from "@/lib/data/blessings-subpages";
import { getStudioService } from "@/lib/data/services";
import { BLESSINGS_VIDEO_CLIP_VIDEOS } from "@/lib/data/youtube-showcases";
import { BAT_MITZVAH_CLIP_FAQ } from "@/lib/data/bat-mitzvah-gifts-page";

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
          description="אפשר גם הקלטת שיר בלבד - בלי צילום. נתאים לפי הצורך."
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

      <BatMitzvahClipShowcase
        heading="קליפ בת מצווה - דוגמה מלאה"
        faqItems={BAT_MITZVAH_CLIP_FAQ.slice(0, 2).map((item) => ({
          question: item.question,
          answer: item.answer,
        }))}
      />

      <ShowcaseVideoSection playlistId="blessings-video-clip" />

      <BlessingsRelatedNav links={RELATED_LINKS} />
    </ServicePageFromRegistry>
  );
}
