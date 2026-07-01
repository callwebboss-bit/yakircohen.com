"use client";

import { useState } from "react";
import BookDemoVideoModal from "@/components/booking/BookDemoVideoModal";
import { formatNis } from "@/lib/data/pricing";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { CroDecoyPackage } from "@/lib/book-wizard-cro/types";
import { cn } from "@/lib/utils";

export function WizardDecoyCard({
  decoy,
  escapeWaHref,
  className,
}: {
  decoy: CroDecoyPackage;
  escapeWaHref: string;
  className?: string;
}) {
  const [videoOpen, setVideoOpen] = useState(false);
  const waitlistHref = buildWhatsAppHref({
    text: `שלום, אשמח לרשום ברשימת המתנה ל-${decoy.name}`,
    utm_source: "website",
    utm_campaign: decoy.waitlistUtmCampaign,
  });

  return (
    <>
      <div
        className={cn(
          "rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/20 p-5 opacity-95",
          className,
        )}
        aria-label={decoy.ariaLabel}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_min(220px,34%)] lg:items-start">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {decoy.badge}
            </p>
            <h3 className="text-lg font-semibold text-foreground">
              <span aria-hidden="true">{decoy.emoji} </span>
              {decoy.name}
            </h3>
            <p className="text-sm text-muted-foreground">{decoy.description}</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {decoy.highlights.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">{decoy.footnote}</p>
            <div className="pt-1">
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {formatNis(decoy.priceExVat)}
              </p>
              <p className="text-xs text-muted-foreground">לפני מע״מ · לא לרכישה בטופס</p>
            </div>
          </div>

          {decoy.youtubeVideoId ? (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="group relative block w-full overflow-hidden rounded-xl border border-border bg-black text-start"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${decoy.youtubeVideoId}/hqdefault.jpg`}
                alt=""
                className="aspect-video w-full object-cover transition-transform duration-normal group-hover:scale-[1.02]"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-2xl text-white">
                ▶
              </span>
              <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-xs font-semibold text-white">
                דוגמה מהאולפן
              </span>
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a
            href={escapeWaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[var(--service-accent,#d42b2b)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {decoy.ctaPrimary}
          </a>
          <a
            href={waitlistHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-border px-4 py-2 text-center text-xs font-semibold text-foreground hover:border-[var(--service-accent,#d42b2b)]/40"
          >
            {decoy.ctaSecondary}
          </a>
        </div>
      </div>

      {decoy.youtubeVideoId ? (
        <BookDemoVideoModal
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          videoId={decoy.youtubeVideoId}
          title={decoy.name}
        />
      ) : null}
    </>
  );
}
