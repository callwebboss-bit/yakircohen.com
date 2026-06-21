import Image from "next/image";
import Link from "next/link";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { BLUR_DATA_URL } from "@/lib/blur";
import { CTA_LABELS } from "@/lib/data/conversion-copy";
import { SITE_NAME, SITE_STUDIO_IMAGE_SRC } from "@/lib/constants";

export type HomeHeroProps = {
  heroWhatsAppHref: string;
};

export default function HomeHero({ heroWhatsAppHref }: HomeHeroProps) {
  return (
    <Section
      padding="none"
      className="relative overflow-hidden border-b border-border bg-background text-foreground"
      ariaLabelledby="hero-heading"
    >
      {/* IMPROVED: refined radial gradients for depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_70%_0%,rgba(212,43,43,0.1),transparent_50%),radial-gradient(ellipse_60%_50%_at_20%_100%,rgba(212,43,43,0.06),transparent_55%)]"
        aria-hidden="true"
      />

      <Container className="relative grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
        <div className="relative z-10">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            {SITE_NAME}
          </p>
          {/* IMPROVED: fluid hero typography */}
          <h1
            id="hero-heading"
            className="font-serif text-hero font-semibold text-foreground"
          >
            אולפן הקלטות, פודקאסט ואירועים במודיעין. תהליך מובנה מההקלטה ועד לקובץ סופי.
          </h1>
          <p className="text-lead mt-6 max-w-xl text-muted-foreground">
            <InlineServiceLink href="/studio">אולפן</InlineServiceLink>,{" "}
            <InlineServiceLink href="/events">אירועים</InlineServiceLink> ו
            <InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink> במודיעין.
            ליווי טכני מלא מתחילת הפרויקט ועד המסירה. 20 שנות ניסיון, 5,000 פרויקטים.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* IMPROVED: Button primitive for WhatsApp CTA */}
            <Button
              as="a"
              href={heroWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
            >
              {CTA_LABELS.whatsappQuote}
            </Button>
            <Button as="link" href="/book" variant="outline">
              {CTA_LABELS.bookTransparent}
            </Button>
          </div>
        </div>

        {/* IMPROVED: unified aspect-ratio (no lg:aspect-square reflow) + blur placeholder for CLS */}
        <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
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
    </Section>
  );
}
