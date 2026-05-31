import YouTubeShowcase from "@/components/marketing/YouTubeShowcase";
import GoogleRatingBadge from "@/components/marketing/GoogleRatingBadge";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
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
