import Image from "next/image";
import Link from "@/components/ui/IntentLink";
import HomeHeroBadges from "@/components/marketing/HomeHeroBadges";
import HomeDoors from "@/components/marketing/HomeDoors";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import HeroScrollCue from "@/components/marketing/HeroScrollCue";
import HeroTrackedCta from "@/components/marketing/HeroTrackedCta";
import CtaOutcomeSubline from "@/components/marketing/CtaOutcomeSubline";
import SongIncludedLine from "@/components/pricing/SongIncludedLine";
import { BLUR_DATA_URL } from "@/lib/blur";
import { CTA_LABELS, OUTCOME_CTA } from "@/lib/data/conversion-copy";
import { SITE_NAME, SITE_STUDIO_IMAGE_SRC } from "@/lib/constants";

/* פסקת הפתיחה (#home-answer) בלי מחירים מ-11.10.2026: המחיר מופיע על כל דלת
   (HomeDoors), והבעלים ביקש לקצר. */

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

      {/*
        ק7 (11.10.2026): סדר בטלפון - טקסט, דלתות, כפתורים, תמונה, כדי שהדלתות
        ייכנסו לשני המסכים הראשונים. בדסקטופ - טקסט וכפתורים מימין לתמונה,
        והדלתות ברוחב מלא מתחתם. המיקום בדסקטופ מפורש (col/row), ולכן סדר
        ה-DOM נשאר סדר הקריאה בטלפון. התמונה לא ממוקדת, ולכן סדר הטאב לא משתנה.
      */}
      <Container className="relative grid gap-8 pt-16 pb-14 sm:pt-20 sm:pb-16 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8 lg:pt-24">
        <div className="relative z-10 lg:col-start-1 lg:row-start-1">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-red-text uppercase">
            {SITE_NAME}
          </p>
          {/* IMPROVED: fluid hero typography. ה-H1 לפי D93, ה-title לא משתנה */}
          <h1
            id="hero-heading"
            className="soundwave-h1 font-serif text-hero font-semibold text-foreground"
          >
            אולפן הקלטות במודיעין - שירים, מתנות ופודקאסט
          </h1>
          <HomeHeroBadges />
          <p
            id="home-answer"
            data-speakable="true"
            className="text-lead mt-6 max-w-xl text-muted-foreground"
          >
            {/* קצר ובלי מחירים: המחיר כבר על כל דלת, ושורת "מה כלול" באה מיד אחרי
                (הבעלים, 11.10.2026: "לקצר", עד אז 590 הופיע שלוש פעמים בראש הדף) */}
            <InlineServiceLink href="/studio/recording-song-modiin">הקלטת שיר</InlineServiceLink>{" "}
            או <InlineServiceLink href="/studio/blessings">ברכה מוקלטת</InlineServiceLink>, גם
            כמתנה, ו<InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink> באולפן או
            אצלכם. גם DJ ל<InlineServiceLink href="/events">אירועים</InlineServiceLink>, שירותים{" "}
            <InlineServiceLink href="/business">לעסקים</InlineServiceLink> ו
            <InlineServiceLink href="/online">תיקון זיופים</InlineServiceLink> מרחוק.
          </p>
          {/* D102: שורה נפרדת ולא בתוך #home-answer, שהוא תשובת ה-AEO של העמוד */}
          <SongIncludedLine className="mt-3 max-w-xl" />
        </div>

        <HomeDoors className="relative z-10 lg:col-span-2 lg:row-start-3" />

        <div className="relative z-10 flex flex-col gap-3 lg:col-start-1 lg:row-start-2">
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
          {/* שלב 7: המסלולים עברו לשכבת "עוד", והחלק הבא אחרי הפתיחה הוא "איך זה עובד" */}
          <HeroScrollCue href="#journey-compact-general" className="sm:justify-start" />
        </div>

        {/* IMPROVED: unified aspect-ratio (no lg:aspect-square reflow) + blur placeholder for CLS */}
        <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-catalog-gold/30 bg-surface shadow-lg ring-1 ring-black/5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
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
    </Section>
  );
}
