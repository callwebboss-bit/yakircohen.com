"use client";

import Link from "next/link";
import LazyYouTubePlayer from "@/components/marketing/LazyYouTubePlayer";
import {
  getStudioSessionClipPrices,
  STUDIO_SESSION_CLIP_CATALOG_ID,
  STUDIO_SESSION_CLIP_HEADING,
  STUDIO_SESSION_CLIP_INTRO,
  STUDIO_SESSION_CLIP_VIDEO_TITLE,
  STUDIO_SESSION_CLIP_YOUTUBE_ID,
} from "@/lib/data/studio-session-clip";
import { catalogWithVat } from "@/lib/data/pricing-catalog";
import { CTA_LABELS } from "@/lib/data/conversion-copy";
import { resolvePricingBookHref } from "@/lib/data/pricing-book-map";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type StudioSessionClipOfferProps = {
  className?: string;
  headingLevel?: "h2" | "h3";
};

export default function StudioSessionClipOffer({
  className,
  headingLevel = "h2",
}: StudioSessionClipOfferProps) {
  const prices = getStudioSessionClipPrices();
  const Heading = headingLevel;
  const bookHref = resolvePricingBookHref(STUDIO_SESSION_CLIP_CATALOG_ID) ?? "/book#studio";
  const quoteHref = buildWhatsAppHref({
    text: "שלום, ראיתי את דוגמת הקליפ מהסשן באולפן. אשמח לקליפ כזה מההקלטה - בלי עריכה או עם עריכה.",
    utm_source: "website",
    utm_campaign: "studio_session_clip",
  });

  return (
    <section
      className={cn("rounded-2xl border border-border bg-surface p-5 sm:p-6", className)}
      aria-labelledby="studio-session-clip-heading"
    >
      <Heading
        id="studio-session-clip-heading"
        className="font-serif text-lg font-semibold text-foreground sm:text-xl"
      >
        {STUDIO_SESSION_CLIP_HEADING}
      </Heading>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {STUDIO_SESSION_CLIP_INTRO}
      </p>

      <div className="mt-4">
        <LazyYouTubePlayer
          videoId={STUDIO_SESSION_CLIP_YOUTUBE_ID}
          title={STUDIO_SESSION_CLIP_VIDEO_TITLE}
        />
      </div>

      <ul className="mt-4 space-y-1.5 text-sm text-foreground">
        <li>
          בלי עריכה: {prices.rawExVat.toLocaleString("he-IL")} ₪ + מע״מ ={" "}
          {catalogWithVat(prices.rawExVat).toLocaleString("he-IL")} ₪
        </li>
        <li>
          {prices.editedLabel}: {prices.editedExVat.toLocaleString("he-IL")} ₪ + מע״מ ={" "}
          {catalogWithVat(prices.editedExVat).toLocaleString("he-IL")} ₪
        </li>
      </ul>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link
          href={bookHref}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          {CTA_LABELS.bookNowOpenSlot}
        </Link>
        <a
          href={quoteHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#178741] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0f6e34] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          {CTA_LABELS.getQuote}
        </a>
      </div>
    </section>
  );
}
