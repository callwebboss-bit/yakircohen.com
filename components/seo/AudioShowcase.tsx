"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const PremiumCrossfadePlayer = dynamic(
  () => import("@/components/ui/PremiumCrossfadePlayer"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[160px] animate-pulse rounded-2xl border border-border bg-surface" />
    ),
  },
);

export type AudioShowcaseVariant = "remote" | "vocal";
export type AudioShowcaseContext = "page" | "wizard";

type Props = {
  variant: AudioShowcaseVariant;
  context?: AudioShowcaseContext;
  beforeSrc: string;
  afterSrc: string;
};

const CONTENT = {
  remote: {
    eyebrow: "שיפור סאונד מרחוק",
    beforeLabel: "הקלטה סלולרית",
    afterLabel: "אחרי עריכה",
    figcaption: "השוואה בין הקלטה גולמית לבין גרסה מעובדת מקצועית.",
    supportText: "הודעות קוליות רגילות הופכות להקלטה נקייה. 520 ש״ח לעד 5 דקות של שמע.",
    ctaLabel: "שלחו לנו הודעה ונבדוק את ההקלטה שלכם.",
    waText: "שלום, קראתי על שיפור סאונד מרחוק ואשמח לבדוק את ההקלטה שלי.",
    waCampaign: "audio_showcase_remote",
    jsonLdName: "הדגמת שיפור סאונד מרחוק — לפני ואחרי עריכה מקצועית",
    jsonLdDesc: "השוואת שמע: הקלטה מסלולרית לפני עריכה, מולה הגרסה הסופית אחרי מיקס, מאסטרינג ודיוק.",
  },
  vocal: {
    eyebrow: "הפקת שירה",
    tooltip: "חברו אוזניות כדי לשמוע את ההבדל",
    beforeLabel: "שירה גולמית",
    afterLabel: "אחרי דיוק והפקה",
    figcaption: "השוואה בין שירה גולמית לבין גרסה מעובדת מקצועית.",
    supportText: "הכוונה מקצועית באולפן ודיוק ווקאלי שמוציאים את המקסימום מכל קול.",
    ctaLabel: "לפרטים על הקלטת שירה.",
    ctaHref: "/studio/recording-song-modiin",
    jsonLdName: "הדגמת הפקת שירה — לפני ואחרי עריכה מקצועית",
    jsonLdDesc: "השוואת שמע: שירה גולמית לפני עריכה, מולה הגרסה הסופית אחרי מיקס, מאסטרינג ודיוק ווקאלי.",
  },
} as const;

export default function AudioShowcase({
  variant,
  context = "page",
  beforeSrc,
  afterSrc,
}: Props) {
  const c = CONTENT[variant];
  const isPage = context === "page";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: c.jsonLdName,
    description: c.jsonLdDesc,
    encodingFormat: "audio/mpeg",
    inLanguage: "he",
    author: { "@type": "Organization", name: "יקיר כהן הפקות" },
  };

  const waHref =
    variant === "remote"
      ? buildWhatsAppHref({
          text: CONTENT.remote.waText,
          utm_source: "website",
          utm_campaign: CONTENT.remote.waCampaign,
        })
      : null;

  return (
    <>
      {isPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <figure
        className={isPage ? "space-y-4" : "max-w-sm space-y-3"}
        aria-label={c.jsonLdName}
      >
        {isPage && (
          <header className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
              {c.eyebrow}
            </p>
            {"tooltip" in c && (
              <p className="text-xs text-muted-foreground">{c.tooltip}</p>
            )}
          </header>
        )}

        <PremiumCrossfadePlayer
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          beforeLabel={c.beforeLabel}
          afterLabel={c.afterLabel}
          storageKey={variant}
        />

        <figcaption className={isPage ? "space-y-2" : "sr-only"}>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {c.supportText}
          </p>

          {isPage && variant === "remote" && waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brand-red hover:underline"
            >
              {CONTENT.remote.ctaLabel}
            </a>
          )}

          {isPage && variant === "vocal" && (
            <Link
              href={CONTENT.vocal.ctaHref}
              className="text-sm font-medium text-brand-red hover:underline"
            >
              {CONTENT.vocal.ctaLabel}
            </Link>
          )}
        </figcaption>
      </figure>
    </>
  );
}
