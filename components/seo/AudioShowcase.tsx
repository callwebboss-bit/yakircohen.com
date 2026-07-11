"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback } from "react";
import { trackConversion } from "@/lib/analytics/conversion-events";
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

export type AudioShowcaseVariant = "remote" | "vocal" | "restoration";
export type AudioShowcaseContext = "page" | "wizard" | "compact";

type Props = {
  variant: AudioShowcaseVariant;
  context?: AudioShowcaseContext;
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  storageKey?: string;
  beforeNote?: string;
  afterNote?: string;
};

const CONTENT = {
  remote: {
    eyebrow: "שיפור סאונד מרחוק",
    beforeLabel: "הקלטה סלולרית",
    afterLabel: "אחרי עריכה",
    supportText:
      "הודעות קוליות, הקלטות מהטלפון או מזום - הופכות להקלטה נקייה ומקצועית.",
    ctaLabel: "שלחו לנו הודעה ונבדוק את ההקלטה שלכם.",
    waText: "שלום, קראתי על שיפור סאונד מרחוק ואשמח לבדוק את ההקלטה שלי.",
    waCampaign: "audio_showcase_remote",
    jsonLdName: "הדגמת שיפור סאונד מרחוק - לפני ואחרי עריכה מקצועית",
    jsonLdDesc:
      "השוואת שמע: הקלטה מסלולרית לפני עריכה, מול הגרסה הסופית אחרי מיקס, מאסטרינג ודיוק.",
  },
  vocal: {
    eyebrow: "הפקת שירה",
    tooltip: "חברו אוזניות כדי לשמוע את ההבדל",
    beforeLabel: "שירה גולמית",
    afterLabel: "אחרי דיוק והפקה",
    supportText:
      "הכוונה מקצועית באולפן ודיוק ווקאלי שמוציאים את המקסימום מכל קול.",
    ctaLabel: "לפרטים על הקלטת שירה.",
    ctaHref: "/studio/recording-song-modiin",
    jsonLdName: "הדגמת הפקת שירה - לפני ואחרי עריכה מקצועית",
    jsonLdDesc:
      "השוואת שמע: שירה גולמית לפני עריכה, מול הגרסה הסופית אחרי מיקס, מאסטרינג ודיוק ווקאלי.",
  },
  restoration: {
    eyebrow: "שחזור / שיפור הקלטות ישנות",
    tooltip: "חברו אוזניות - דוגמה מהקלטה פגומה מאוד",
    beforeLabel: "הקלטה פגומה (מקור)",
    afterLabel: "אחרי שחזור מקצועי + AI",
    supportText:
      "פודקאסטים ישנים, הרצאות, קלטות VHS או cassette, הקלטות זום רועשות - דוגמה קיצונית. ככל שהמקור ברור יותר, התוצאה מדויקת יותר.",
    ctaLabel: "שלחו קובץ לבדיקה בוואטסאפ - נגיד בכנות מה אפשר להציל.",
    waText:
      "שלום, שמעתי את דוגמת השחזור באתר - אשמח לשלוח הקלטה ישנה/פגומה לבדיקה.",
    waCampaign: "audio_showcase_restoration",
    jsonLdName: "הדגמת שחזור אודיו - לפני ואחרי עיבוד מקצועי",
    jsonLdDesc:
      "השוואת שמע: הקלטה פגומה או ישנה לפני שחזור, מול הגרסה המשופרת אחרי AI ועריכה ידנית. התוצאה תלויה באיכות המקור.",
  },
} as const;

export default function AudioShowcase({
  variant,
  context = "page",
  beforeSrc,
  afterSrc,
  beforeLabel: beforeLabelOverride,
  afterLabel: afterLabelOverride,
  storageKey,
  beforeNote,
  afterNote,
}: Props) {
  const c = CONTENT[variant];
  const beforeLabel = beforeLabelOverride ?? c.beforeLabel;
  const afterLabel = afterLabelOverride ?? c.afterLabel;
  const isFullPage = context === "page";
  const isCompact = context === "compact";

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
    variant === "remote" || variant === "restoration"
      ? buildWhatsAppHref({
          text:
            variant === "restoration"
              ? CONTENT.restoration.waText
              : CONTENT.remote.waText,
          utm_source: "website",
          utm_campaign:
            variant === "restoration"
              ? CONTENT.restoration.waCampaign
              : CONTENT.remote.waCampaign,
        })
      : null;

  const playerKey = storageKey ?? variant;

  const handlePlayStart = useCallback(() => {
    trackConversion("portfolio_demo_play", { variant, context });
  }, [variant, context]);

  return (
    <>
      {isFullPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <figure
        className={
          isFullPage
            ? "space-y-4"
            : isCompact
              ? "max-w-lg space-y-2"
              : "max-w-sm space-y-3"
        }
        aria-label={c.jsonLdName}
      >
        {isFullPage && (
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
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
          storageKey={playerKey}
          onPlayStart={handlePlayStart}
        />

        {(beforeNote || afterNote) && (
          <div
            dir="ltr"
            className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2"
          >
            {beforeNote ? (
              <p dir="rtl">
                לפני: {beforeNote}
              </p>
            ) : null}
            {afterNote ? (
              <p dir="rtl" className="sm:text-end">
                אחרי: {afterNote}
              </p>
            ) : null}
          </div>
        )}

        <figcaption className={isFullPage ? "space-y-2" : "sr-only"}>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {c.supportText}
          </p>

          {isFullPage && waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brand-red hover:underline"
            >
              {variant === "restoration"
                ? CONTENT.restoration.ctaLabel
                : CONTENT.remote.ctaLabel}
            </a>
          )}

          {isFullPage && variant === "vocal" && (
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
