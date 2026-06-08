import Image from "next/image";
import Link from "next/link";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import Button from "@/components/ui/Button";
import { CTA_LABELS } from "@/lib/data/conversion-copy";
import { SITE_NAME, SITE_STUDIO_IMAGE_SRC } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type HomeHeroProps = {
  heroWhatsAppHref: string;
};

export default function HomeHero({ heroWhatsAppHref }: HomeHeroProps) {
  return (
    <section
      className="relative overflow-hidden border-b border-border bg-background text-foreground"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_70%_0%,rgba(212,43,43,0.08),transparent_50%),radial-gradient(ellipse_60%_50%_at_20%_100%,rgba(212,43,43,0.05),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[72rem] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div className="relative z-10">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            {SITE_NAME}
          </p>
          <h1
            id="hero-heading"
            className="font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            יוצאים עם תוצאה מקצועית - בלי לשרוף זמן וכסף על ניסויים.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            נמאס מפרויקטים שלא מתקדמים?{" "}
            <InlineServiceLink href="/studio">אולפן</InlineServiceLink>,{" "}
            <InlineServiceLink href="/events">אירועים</InlineServiceLink> ו
            <InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink> במודיעין -
            ליווי מקצועי עד לקובץ מוכן. 20+ שנים · 5,000+ לקוחות.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={heroWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-normal ease-luxury",
                "bg-brand-red hover:bg-brand-red-light",
              )}
            >
              {CTA_LABELS.whatsappQuote}
            </a>
            <Button as="link" href="/book" variant="outline">
              {CTA_LABELS.bookTransparent}
            </Button>
          </div>
        </div>

        <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg lg:aspect-square">
          <Image
            src={SITE_STUDIO_IMAGE_SRC}
            alt="אולפן הקלטות ויקיר כהן במודיעין"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 border-t border-border bg-background/90 p-6 backdrop-blur-sm">
            <p className="text-xs font-semibold text-brand-red">
              <Link href="/studio" className="hover:underline">
                אולפן
              </Link>
              {" · "}
              <Link href="/events" className="hover:underline">
                אירועים
              </Link>
              {" · "}
              <Link href="/podcast" className="hover:underline">
                פודקאסט
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
