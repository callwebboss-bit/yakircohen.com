import Image from "next/image";
import Link from "next/link";
import HomeHeroBadges from "@/components/marketing/HomeHeroBadges";
import HomeIntentPaths from "@/components/marketing/HomeIntentPaths";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import HeroScrollCue from "@/components/marketing/HeroScrollCue";
import HeroTrackedCta from "@/components/marketing/HeroTrackedCta";
import CtaOutcomeSubline from "@/components/marketing/CtaOutcomeSubline";
import { BLUR_DATA_URL } from "@/lib/blur";
import { CTA_LABELS, OUTCOME_CTA } from "@/lib/data/conversion-copy";
import { SITE_NAME, SITE_STUDIO_IMAGE_SRC } from "@/lib/constants";
import { getExVat, type PriceItemId } from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";

/*
 * עוגני המחיר בפסקת הפתיחה (תוכנית שלב 4, WP2-WP3). כל עוגן הוא המוצר שהשורה
 * מדברת עליו: "DJ" הציג עד עכשיו את event_attraction_1 (אטרקציה בודדת, 1,695),
 * ו"פודקאסט" הציג חצי שעה גלם בלי עריכה. DJ מהצוות הוא dj_premium (4 שעות, עד
 * 300 מוזמנים, החלטת הבעלים ED-04), ופרק פודקאסט ערוך הוא podcast_audio.
 * כולל מע״מ קודם ולפני מע״מ בקטן (החלטת הבעלים 2.10.2026).
 */
const STUDIO_FROM_ID: PriceItemId = "blessing_recording";
const DJ_FROM_ID: PriceItemId = "dj_premium";
const ATTRACTION_FROM_ID: PriceItemId = "event_attraction_1";
const PODCAST_FROM_ID: PriceItemId = "podcast_audio";

function HeroPrice({ id }: { id: PriceItemId }) {
  const exVat = getExVat(id);
  const price = formatPrice(exVat, { from: true });
  return (
    <>
      <data value={String(price.totalWithVat)}>{price.headline}</data>{" "}
      <span className="text-sm">({price.vatNote})</span>
    </>
  );
}

export type HomeHeroProps = {
  heroWhatsAppHref: string;
};

export default function HomeHero({ heroWhatsAppHref }: HomeHeroProps) {
  return (
    <Section
      padding="none"
      className="relative min-h-[28rem] overflow-hidden border-b border-border bg-background/40 text-foreground max-lg:min-h-[32rem] sm:max-lg:min-h-[34rem]"
      ariaLabelledby="hero-heading"
    >
      {/* IMPROVED: refined radial gradients for depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-[image:var(--hub-mesh)]"
        aria-hidden="true"
      />

      <Container className="relative grid gap-10 pt-16 pb-10 sm:pt-20 sm:pb-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-24 lg:pb-14">
        <div className="relative z-10">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            {SITE_NAME}
          </p>
          {/* IMPROVED: fluid hero typography */}
          <h1
            id="hero-heading"
            className="soundwave-h1 font-serif text-hero font-semibold text-foreground"
          >
            אולפן הקלטות במודיעין - פודקאסט, שירים ואירועים
          </h1>
          <HomeHeroBadges />
          <p
            id="home-answer"
            data-speakable="true"
            className="text-lead mt-6 max-w-xl text-muted-foreground"
          >
            <InlineServiceLink href="/studio">אולפן</InlineServiceLink>: שירים וברכות,{" "}
            <HeroPrice id={STUDIO_FROM_ID} />.{" "}
            <InlineServiceLink href="/events">אירועים</InlineServiceLink>: DJ מהצוות,{" "}
            <HeroPrice id={DJ_FROM_ID} />, ואטרקציה לאירוע{" "}
            <HeroPrice id={ATTRACTION_FROM_ID} />.{" "}
            <InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink>: פרק ערוך,{" "}
            <HeroPrice id={PODCAST_FROM_ID} />.{" "}
            <InlineServiceLink href="/voiceover">קריינות</InlineServiceLink> בהצעה לפי היקף.{" "}
            <InlineServiceLink href="/online">תיקון זיופים</InlineServiceLink> ושחזור - מרחוק.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <HeroTrackedCta href="/book">{OUTCOME_CTA.heroBookPriceNow}</HeroTrackedCta>
              <Button
                as="a"
                href={heroWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="min-h-12"
              >
                {CTA_LABELS.whatsappQuote}
              </Button>
              <Button
                as="link"
                href="/online"
                variant="outline"
                className="min-h-12"
              >
                {OUTCOME_CTA.heroSendFileFixed}
              </Button>
            </div>
            <CtaOutcomeSubline className="sm:text-start" />
            <HeroScrollCue href="#home-quick-paths" className="sm:justify-start" />
          </div>
        </div>

        {/* IMPROVED: unified aspect-ratio (no lg:aspect-square reflow) + blur placeholder for CLS */}
        <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-catalog-gold/30 bg-surface shadow-lg ring-1 ring-black/5">
          <Image
            src={SITE_STUDIO_IMAGE_SRC}
            alt="אולפן הקלטות מקצועי במודיעין"
            fill
            priority
            fetchPriority="high"
            loading="eager"
            decoding="async"
            sizes="(max-width: 1024px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(0_0_0_/_0.28)_100%)]"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 hidden border-t border-border-subtle bg-background/90 p-6 backdrop-blur-sm">
            <p className="text-xs font-semibold text-brand-red">
              <Link href="/studio" className="rounded-sm transition-colors hover:text-brand-red-light hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
                אולפן
              </Link>
              {" - "}
              <Link href="/events" className="rounded-sm transition-colors hover:text-brand-red-light hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
                אירועים
              </Link>
              {" - "}
              <Link href="/podcast" className="rounded-sm transition-colors hover:text-brand-red-light hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
                פודקאסט
              </Link>
            </p>
          </div>
        </div>
      </Container>

      <Container className="relative pb-14 sm:pb-16 lg:hidden">
        <HomeIntentPaths />
      </Container>
    </Section>
  );
}
