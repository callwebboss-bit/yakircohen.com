"use client";

import { useState } from "react";
import BookDemoVideoModal from "@/components/booking/BookDemoVideoModal";
import BookPriceDual from "@/components/booking/BookPriceDual";
import {
  buildFastWhatsAppMessage,
  type BookAudienceRoute,
} from "@/lib/data/book-audience-routes";
import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const V_CARD: Record<BookAudienceRoute["variant"], string> = {
  gold: "bg-background border-border hover:border-brand-red/50 hover:shadow-[0_8px_32px_rgba(212,43,43,0.12)]",
  neutral: "bg-background border-border hover:border-foreground/20 hover:shadow-md",
  luxury:
    "border-border bg-surface hover:border-brand-red/40 hover:shadow-[0_8px_32px_rgba(212,43,43,0.12)]",
  academy: "bg-background border-border hover:border-brand-red/40 hover:shadow-md",
  online: "bg-background border-border hover:border-brand-red/40 hover:shadow-md",
};

const V_BADGE: Record<BookAudienceRoute["variant"], string> = {
  gold: "bg-brand-red/10 text-brand-red",
  neutral: "bg-brand-red/10 text-brand-red",
  luxury: "bg-brand-red/20 text-brand-red",
  academy: "bg-brand-red/10 text-brand-red",
  online: "bg-brand-red/10 text-brand-red",
};

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type BookAudienceCardProps = {
  route: BookAudienceRoute;
  boosted?: boolean;
  compact?: boolean;
  onFullPath: (route: BookAudienceRoute, emotionalLabel: string | null) => void;
};

export default function BookAudienceCard({
  route,
  boosted = false,
  compact = false,
  onFullPath,
}: BookAudienceCardProps) {
  const [emotionalId, setEmotionalId] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const emotionalLabel =
    route.emotionalOptions.find((o) => o.id === emotionalId)?.label ?? null;

  const videoId = YOUTUBE_SERVICE_EMBED_IDS[route.demoVideoKey];

  function openFastWhatsApp() {
    const text = buildFastWhatsAppMessage(route, emotionalLabel);
    const href = buildWhatsAppHref({
      text,
      utm_source: "website",
      utm_campaign: route.utm_campaign,
    });
    openWhatsAppLead(href);
  }

  function openFeasibilityCheck() {
    if (!route.feasibilityCheckMessage) return;
    const href = buildWhatsAppHref({
      text: route.feasibilityCheckMessage,
      utm_source: "website",
      utm_campaign: route.feasibilityUtmCampaign ?? route.utm_campaign,
    });
    openWhatsAppLead(href);
  }

  return (
    <>
      <article
        className={cn(
          "relative flex min-w-0 flex-col rounded-2xl border p-5 shadow-sm transition-[border-color,box-shadow,transform]",
          !compact && "hover:-translate-y-0.5",
          V_CARD[route.variant],
          boosted && "ring-2 ring-brand-red/40 ring-offset-2 ring-offset-background",
        )}
      >
        {boosted && (
          <span className="absolute -top-2.5 end-4 rounded-full bg-brand-red px-2.5 py-0.5 text-[0.65rem] font-bold text-white">
            מומלץ עבורך
          </span>
        )}

        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-red/10 text-2xl">
            {route.icon}
          </span>
          <span className={cn("rounded-md px-2.5 py-1 text-[0.62rem] font-bold uppercase", V_BADGE[route.variant])}>
            {route.tag}
          </span>
        </div>

        <h3 className="font-serif text-lg font-semibold leading-snug text-foreground">{route.title}</h3>
        {!compact ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{route.description}</p>
            <p className="mt-2 text-xs italic text-muted-foreground">{route.essenceMicroCopy}</p>
          </>
        ) : (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{route.description}</p>
        )}

        <div className="mt-4">
          <BookPriceDual exVat={route.priceExVat} dualLabel={route.startingPriceDual} size="sm" />
          {route.priceNote ? (
            <p className="mt-1 text-xs text-muted-foreground">{route.priceNote}</p>
          ) : null}
          {!compact ? (
            <p className="mt-2 text-xs leading-snug text-muted-foreground">{route.upsellHint}</p>
          ) : null}
        </div>

        {compact ? null : (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-foreground">{route.emotionalQuestion}</p>
          <div className="flex flex-wrap gap-1.5">
            {route.emotionalOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setEmotionalId(emotionalId === opt.id ? null : opt.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  emotionalId === opt.id
                    ? "border-brand-red bg-brand-red/10 text-brand-red"
                    : "border-border text-muted-foreground hover:border-brand-red/40",
                )}
                aria-pressed={emotionalId === opt.id}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        )}

        {compact ? null : (
        <button
          type="button"
          onClick={() => setVideoOpen(true)}
          className="mt-4 text-xs font-semibold text-brand-red underline-offset-2 hover:underline"
        >
          ▶ איך זה נראה?
        </button>
        )}

        {compact ? null : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={openFastWhatsApp}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1fba59]"
          >
            <WaIcon />
            קבלו הצעה בוואטסאפ
          </button>
          <button
            type="button"
            onClick={() => onFullPath(route, emotionalLabel)}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
          >
            הזמנה מפורטת
          </button>
        </div>
        )}

        {compact ? null : route.feasibilityCheckMessage ? (
          <button
            type="button"
            onClick={openFeasibilityCheck}
            className="mt-2 w-full text-center text-xs font-medium text-brand-red underline-offset-2 hover:underline"
          >
            שלחו קובץ לבדיקת היתכנות חינם ←
          </button>
        ) : null}
      </article>

      <BookDemoVideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoId={videoId}
        title={route.title}
      />
    </>
  );
}
