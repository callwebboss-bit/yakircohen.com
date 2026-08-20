import Image from "next/image";
import Link from "next/link";
import LivePulseBadge from "@/components/marketing/LivePulseBadge";
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
import { getExVat } from "@/lib/data/pricing-catalog";

const STUDIO_FROM_EX_VAT = getExVat("blessing_recording");
const EVENTS_FROM_EX_VAT = getExVat("event_attraction_1");
const PODCAST_FROM_EX_VAT = getExVat("studio_half_hour");

export type HomeHeroProps = {
  heroWhatsAppHref: string;
};

export default function HomeHero({ heroWhatsAppHref }: HomeHeroProps) {
  return (
    <Section
      padding="none"
      className="relative overflow-hidden border-b border-border bg-background/40 text-foreground"
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
            <InlineServiceLink href="/studio">אולפן</InlineServiceLink>: שירים וברכות, החל מ-
            <data value={String(STUDIO_FROM_EX_VAT)}>
              {STUDIO_FROM_EX_VAT.toLocaleString("he-IL")}
            </data>{" "}
            ₪ + מע״מ.{" "}
            <InlineServiceLink href="/events">אירועים</InlineServiceLink>: DJ והגברה, החל מ-
            <data value={String(EVENTS_FROM_EX_VAT)}>
              {EVENTS_FROM_EX_VAT.toLocaleString("he-IL")}
            </data>{" "}
            ₪ + מע״מ.{" "}
            <InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink> ו
            <InlineServiceLink href="/voiceover">קריינות</InlineServiceLink>, החל מ-
            <data value={String(PODCAST_FROM_EX_VAT)}>
              {PODCAST_FROM_EX_VAT.toLocaleString("he-IL")}
            </data>{" "}
            ₪ + מע״מ.{" "}
            <InlineServiceLink href="/online">תיקון זיופים</InlineServiceLink> ושחזור - מרחוק.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <LivePulseBadge />
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
          <div className="absolute inset-x-0 bottom-0 border-t border-border-subtle bg-background/90 p-6 backdrop-blur-sm">
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
