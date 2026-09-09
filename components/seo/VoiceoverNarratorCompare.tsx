"use client";

import { useCallback, useRef } from "react";
import Button from "@/components/ui/Button";
import HubDualCta from "@/components/marketing/HubDualCta";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import { trackConversion } from "@/lib/analytics/conversion-events";
import { CTA_LABELS } from "@/lib/data/conversion-copy";
import {
  VOICEOVER_COMPARE_BOOK_CTA,
  VOICEOVER_COMPARE_DISCLAIMER,
  VOICEOVER_COMPARE_HEADING,
  VOICEOVER_COMPARE_HUB_HREF,
  VOICEOVER_COMPARE_JSON_LD,
  VOICEOVER_COMPARE_LEAD,
  VOICEOVER_COMPARE_ROWS,
  VOICEOVER_COMPARE_SECTION_ID,
  VOICEOVER_COMPARE_SERVICES_HREF,
  VOICEOVER_COMPARE_SERVICES_LABEL,
  VOICEOVER_COMPARE_SKEPTICISM,
  VOICEOVER_COMPARE_WA_TEXT,
  VOICEOVER_OTHER_LABEL,
  VOICEOVER_OTHER_NOTE,
  VOICEOVER_OTHER_SRC,
  VOICEOVER_YAKIR_LABEL,
  VOICEOVER_YAKIR_NOTE,
  VOICEOVER_YAKIR_SRC,
  type VoiceoverNarratorCompareContext,
} from "@/lib/data/voiceover-narrator-compare";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  context?: VoiceoverNarratorCompareContext;
  className?: string;
};

export default function VoiceoverNarratorCompare({
  context = "page",
  className,
}: Props) {
  const otherRef = useRef<HTMLAudioElement>(null);
  const yakirRef = useRef<HTMLAudioElement>(null);
  const isCompact = context === "compact";
  const showJsonLd = context !== "compact";
  const bookCta = VOICEOVER_COMPARE_BOOK_CTA;

  const waHref = buildWhatsAppHref({
    text: VOICEOVER_COMPARE_WA_TEXT,
    utm_source: "website",
    utm_campaign: `voiceover_compare_${context}`,
  });

  const handlePlayStart = useCallback(() => {
    trackConversion("portfolio_demo_play", {
      variant: "voiceover_compare",
      context,
    });
  }, [context]);

  function pauseOther(playing: "other" | "yakir") {
    if (playing === "other") yakirRef.current?.pause();
    else otherRef.current?.pause();
  }

  const players = (
    <div className={cn("grid gap-3 sm:grid-cols-2", isCompact ? "mt-3" : "mt-4")}>
      <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
        <p className="text-xs font-semibold text-muted-foreground">{VOICEOVER_OTHER_LABEL}</p>
        <p className="mt-0.5 text-[0.65rem] leading-relaxed text-muted-foreground">
          {VOICEOVER_OTHER_NOTE}
        </p>
        <audio
          ref={otherRef}
          controls
          preload="metadata"
          dir="ltr"
          className="mt-2 w-full"
          onPlay={() => {
            pauseOther("other");
            handlePlayStart();
          }}
          aria-label="דוגמת קריינות של קריין אחר, לא יקיר כהן"
        >
          <source src={VOICEOVER_OTHER_SRC} type="audio/mpeg" />
        </audio>
      </div>
      <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-3 sm:p-4">
        <p className="text-xs font-semibold text-brand-red">{VOICEOVER_YAKIR_LABEL}</p>
        <p className="mt-0.5 text-[0.65rem] leading-relaxed text-muted-foreground">
          {VOICEOVER_YAKIR_NOTE}
        </p>
        <audio
          ref={yakirRef}
          controls
          preload="metadata"
          dir="ltr"
          className="mt-2 w-full"
          onPlay={() => {
            pauseOther("yakir");
            handlePlayStart();
          }}
          aria-label="דוגמת קריינות של יקיר כהן, שלוש גרסאות ביצוע"
        >
          <source src={VOICEOVER_YAKIR_SRC} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );

  if (isCompact) {
    return (
      <section
        id={VOICEOVER_COMPARE_SECTION_ID}
        className={cn(
          "rounded-2xl border border-border bg-surface p-4 sm:p-5",
          className,
        )}
        aria-labelledby={`${VOICEOVER_COMPARE_SECTION_ID}-heading`}
      >
        <h2
          id={`${VOICEOVER_COMPARE_SECTION_ID}-heading`}
          className="text-sm font-semibold text-foreground"
        >
          {VOICEOVER_COMPARE_HEADING}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {VOICEOVER_COMPARE_LEAD} {VOICEOVER_COMPARE_DISCLAIMER}
        </p>
        {players}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          להזמנת{" "}
          <InlineServiceLink href={VOICEOVER_COMPARE_HUB_HREF}>קריינות</InlineServiceLink>
          {" - "}
          <InlineServiceLink href={VOICEOVER_COMPARE_SERVICES_HREF}>
            {VOICEOVER_COMPARE_SERVICES_LABEL}
          </InlineServiceLink>
          {"."}
        </p>
      </section>
    );
  }

  return (
    <>
      {showJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(VOICEOVER_COMPARE_JSON_LD),
          }}
        />
      ) : null}
      <section
        id={VOICEOVER_COMPARE_SECTION_ID}
        className={cn(
          "scroll-mt-24 rounded-2xl border border-border bg-surface p-4 sm:p-6",
          className,
        )}
        aria-labelledby={`${VOICEOVER_COMPARE_SECTION_ID}-heading`}
      >
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            דוגמת האזנה
          </p>
          <h2
            id={`${VOICEOVER_COMPARE_SECTION_ID}-heading`}
            className="mt-2 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {VOICEOVER_COMPARE_HEADING}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground">
            {VOICEOVER_COMPARE_LEAD}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {VOICEOVER_COMPARE_DISCLAIMER}
          </p>
        </header>

        {players}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[18rem] text-start text-xs sm:text-sm">
            <caption className="sr-only">
              השוואת זהות בין דוגמת קריין אחר לבין קריינות של יקיר כהן
            </caption>
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-2 pe-2 font-medium" scope="col" />
                <th className="px-2 pb-2 font-semibold text-foreground" scope="col">
                  {VOICEOVER_OTHER_LABEL}
                </th>
                <th className="ps-2 pb-2 font-semibold text-brand-red" scope="col">
                  {VOICEOVER_YAKIR_LABEL}
                </th>
              </tr>
            </thead>
            <tbody>
              {VOICEOVER_COMPARE_ROWS.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-border/60 last:border-0"
                >
                  <th
                    scope="row"
                    className="py-2.5 pe-2 text-start font-medium text-muted-foreground"
                  >
                    {row.label}
                  </th>
                  <td className="px-2 py-2.5 text-muted-foreground">{row.other}</td>
                  <td className="ps-2 py-2.5 font-medium text-foreground">
                    {row.yakir}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          להזמנת{" "}
          <InlineServiceLink href={VOICEOVER_COMPARE_HUB_HREF}>קריינות</InlineServiceLink>
          {" או לסקירת "}
          <InlineServiceLink href={VOICEOVER_COMPARE_SERVICES_HREF}>
            {VOICEOVER_COMPARE_SERVICES_LABEL}
          </InlineServiceLink>
          {"."}
        </p>

        {bookCta ? (
          <HubDualCta
            className="mt-5"
            align="start"
            whatsappHref={waHref}
            whatsappLabel={CTA_LABELS.whatsappQuote}
            bookHref={bookCta.bookHref}
            bookLabel={bookCta.bookLabel}
          />
        ) : (
          <div className="mt-5">
            <Button as="link" href={VOICEOVER_COMPARE_SERVICES_HREF}>
              {VOICEOVER_COMPARE_SERVICES_LABEL}
            </Button>
          </div>
        )}

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {VOICEOVER_COMPARE_SKEPTICISM}
        </p>
      </section>
    </>
  );
}
