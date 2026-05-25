import Link from "next/link";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const bundleWhatsAppHref = buildWhatsAppHref({
  text: buildServiceWhatsAppText("חבילה משולבת - אולפן + אפקטים או צילום"),
  utm_source: "website",
  utm_campaign: "home_premium_bundle",
});

export default function PremiumBundleCallout() {
  return (
    <article
      className="col-span-1 rounded-3xl border-2 border-brand-red/25 bg-surface p-8 text-foreground shadow-md sm:col-span-2 lg:col-span-3"
      aria-labelledby="premium-bundle-heading"
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
        שדרוג חבילה
      </p>
      <h3
        id="premium-bundle-heading"
        className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl"
      >
        סוגרים אולפן? בואו נעלה את האירוע בדרגה
      </h3>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        <Link href="/studio" className="font-medium text-brand-red hover:underline">
          סוגרים אולפן
        </Link>
        ? מוסיפים חבילת אפקטים (
        <Link
          href="/events/attractions/wedding-smoking-machine"
          className="font-medium text-brand-red hover:underline"
        >
          עשן כבד
        </Link>{" "}
        +{" "}
        <Link
          href="/events/attractions/cold-fireworks"
          className="font-medium text-brand-red hover:underline"
        >
          זיקוקים
        </Link>
        ) או{" "}
        <Link href="/photography" className="font-medium text-brand-red hover:underline">
          צילום מקצועי
        </Link>{" "}
        ומשדרגים את האירוע. טווח מומלץ:{" "}
        <strong className="text-brand-red">₪1,750</strong> עד{" "}
        <strong className="text-brand-red">₪3,200+</strong>.
      </p>
      <a
        href={bundleWhatsAppHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-brand-red px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
      >
        רוצים חבילה משולבת? בואו נתקתק
      </a>
    </article>
  );
}
