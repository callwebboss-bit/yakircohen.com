import YouTube from "@/components/YouTube";
import SoundImprovementShowcase from "@/components/seo/SoundImprovementShowcase";
import {
  PROPOSAL_CLIP_FEATURED_VIDEO_ID,
  PROPOSAL_CLIP_VIDEOS,
  PROPOSAL_PITCH_AUDIO_DEMO_ID,
} from "@/lib/data/proposal-clip-gifts-page";
import { cn } from "@/lib/utils";

export type ProposalGiftPitchProofSectionProps = {
  className?: string;
  /** כותרת ראשית */
  heading?: string;
  /** טקסט מבוא מתחת לכותרת */
  intro?: string;
  /** הצג את קליפ היוטיוב אחרי לפני/אחרי */
  showVideo?: boolean;
  /** הסתר כותרת ומבוא (לשילוב בעמוד עם כותרת משלהם) */
  showHeader?: boolean;
  headingId?: string;
};

const DEFAULT_HEADING = "לפני תיקון זיופים, אחרי - ואז הקליפ המלא";
const DEFAULT_INTRO =
  "שמעו את אותו קטע מהאולפן. אחר כך צפו בקליפ המתננה - מתאים למי שמתלבט אם להזמין עם תיקון זיופים או בלי.";

export default function ProposalGiftPitchProofSection({
  className,
  heading = DEFAULT_HEADING,
  intro = DEFAULT_INTRO,
  showVideo = true,
  showHeader = true,
  headingId = "proposal-pitch-proof-heading",
}: ProposalGiftPitchProofSectionProps) {
  const featuredClip = PROPOSAL_CLIP_VIDEOS[0];

  return (
    <section
      className={cn("space-y-8", className)}
      aria-labelledby={showHeader ? headingId : undefined}
    >
      {showHeader ? (
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            לפני / אחרי + קליפ
          </p>
          <h2
            id={headingId}
            className="mt-3 font-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </header>
      ) : null}

      <div className="mx-auto max-w-2xl">
        <SoundImprovementShowcase
          demoId={PROPOSAL_PITCH_AUDIO_DEMO_ID}
          context="page"
        />
      </div>

      {showVideo ? (
        <div className="mx-auto max-w-3xl space-y-3">
          <p className="text-center text-sm font-medium text-foreground">
            הקליפ המלא - אחרי התיקון
          </p>
          <div className="aspect-video overflow-hidden rounded-2xl bg-neutral-900 shadow-lg">
            <YouTube
              videoId={featuredClip?.videoId ?? PROPOSAL_CLIP_FEATURED_VIDEO_ID}
              title={featuredClip?.title ?? "קליפ מתננה מהאולפן"}
              fillParent
            />
          </div>
          {featuredClip?.title ? (
            <p className="text-center text-xs text-muted-foreground">
              {featuredClip.title}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
