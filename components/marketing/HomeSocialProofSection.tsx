import Link from "next/link";
import YouTubeShowcase from "@/components/marketing/YouTubeShowcase";
import GoogleRatingBadge from "@/components/marketing/GoogleRatingBadge";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import SoundImprovementShowcase from "@/components/seo/SoundImprovementShowcase";
import {
  GoogleReviews,
  InstagramFeed,
} from "@/components/marketing/SocialProofWidgets";

export { GoogleReviews as GoogleReviewsEmbed } from "@/components/marketing/SocialProofWidgets";
export { InstagramFeed as ElfsightInstagramFeed } from "@/components/marketing/SocialProofWidgets";

export default function HomeSocialProofSection() {
  return (
    <section
      className="border-y border-border bg-surface py-16 sm:py-20 lg:py-24"
      aria-labelledby="social-proof-heading"
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            מהשטח
          </p>
          <h2
            id="social-proof-heading"
            className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            רואים, שומעים, מאמינים
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            סרטון מה
            <InlineServiceLink href="/studio">אולפן</InlineServiceLink>, ביקורות
            Google ופיד אינסטגרם. הכל במקום אחד.
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
          <YouTubeShowcase />
        </div>

        <div className="mt-12">
          <h3 className="text-center font-serif text-xl font-semibold text-foreground sm:text-2xl">
            שמעו את ההבדל בעצמכם
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            דוגמאות אמיתיות מהאולפן - לפני ואחרי. הקליקו על הנגן כדי להשוות.
          </p>

          <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-foreground">
                הקלטת שירה באולפן
              </p>
              <SoundImprovementShowcase
                demoId="recording-vocal-polish"
                context="compact"
              />
              <Link
                href="/studio/recording-song-modiin"
                className="mt-3 inline-block text-xs font-semibold text-brand-red hover:underline"
              >
                להקלטת שיר באולפן </Link>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-foreground">
                ניקוי רעשים לפודקאסט
              </p>
              <SoundImprovementShowcase
                demoId="podcast-zoom-cleanup"
                variant="remote"
                context="compact"
              />
              <Link
                href="/podcast/podcast-editing"
                className="mt-3 inline-block text-xs font-semibold text-brand-red hover:underline"
              >
                לעריכת פודקאסט </Link>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-foreground">
                שחזור הקלטה ישנה ב-AI
              </p>
              <SoundImprovementShowcase
                demoId="weber-restoration"
                context="compact"
              />
              <Link
                href="/online/vocal-fix"
                className="mt-3 inline-block text-xs font-semibold text-brand-red hover:underline"
              >
                לשחזור הקלטה </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <GoogleRatingBadge />
            <GoogleReviews compactHeader heading="ביקורות Google" />
          </div>
          <InstagramFeed
            heading="אינסטגרם"
            subheading="רגעים מהשטח"
          />
        </div>
      </div>
    </section>
  );
}
