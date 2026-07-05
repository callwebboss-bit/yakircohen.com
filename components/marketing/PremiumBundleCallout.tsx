// UI-EXCEPTION: full-width grid span promo - see docs/ui-exceptions.md
import Link from "next/link";
import Button from "@/components/ui/Button";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const bundleWhatsAppHref = buildWhatsAppHref({
  text: buildServiceWhatsAppText("חבילה משולבת - אולפן + אפקטים או צילום"),
  utm_source: "website",
  utm_campaign: "home_premium_bundle",
});

export default function PremiumBundleCallout() {
  return (
    <article
      className="col-span-1 rounded-3xl border-2 border-brand-red/25 bg-surface p-8 text-foreground shadow-md sm:col-span-2 lg:col-span-4"
      aria-labelledby="premium-bundle-heading"
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
        שדרוג חבילה
      </p>
      <h3
        id="premium-bundle-heading"
        className="mt-3 font-serif text-section-title font-semibold leading-snug text-foreground"
      >
        סוגרים אולפן? בואו נעלה את האירוע בדרגה
      </h3>
      <p className="text-lead mt-4 max-w-3xl text-muted-foreground">
        <Link
          href="/studio"
          className="font-medium text-brand-red transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          סוגרים אולפן
        </Link>
        ? מוסיפים חבילת אפקטים (
        <Link
          href="/events/attractions/wedding-smoking-machine"
          className="font-medium text-brand-red transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          עשן כבד
        </Link>{" "}
        +{" "}
        <Link
          href="/events/attractions/cold-fireworks"
          className="font-medium text-brand-red transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          זיקוקים
        </Link>
        ) או{" "}
        <Link
          href="/photography"
          className="font-medium text-brand-red transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          צילום מקצועי
        </Link>{" "}
        ומשדרגים את האירוע. טווח מומלץ:{" "}
        <strong className="text-brand-red">₪1,750</strong> עד{" "}
        <strong className="text-brand-red">₪3,200+</strong>.
      </p>
      <Button
        as="a"
        href={bundleWhatsAppHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 px-8"
      >
        רוצים חבילה משולבת? בואו נתקתק
      </Button>
    </article>
  );
}
