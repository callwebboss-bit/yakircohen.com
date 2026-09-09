"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { PricingTier } from "@/lib/data/services";

type PricingTierToggleProps = {
  tiers: readonly PricingTier[];
  /** Index of the tier to highlight as recommended (0-based). */
  recommendedIndex?: number;
  className?: string;
};

function durationToIso(text?: string): string | undefined {
  if (!text) return undefined;
  const hours = text.match(/(\d+)\s*שע/);
  const mins = text.match(/(\d+)\s*דק/);
  if (hours && mins) return `PT${hours[1]}H${mins[1]}M`;
  if (hours) return `PT${hours[1]}H`;
  if (mins) return `PT${mins[1]}M`;
  if (/חצי שעה/.test(text)) return "PT30M";
  if (/שעה/.test(text)) return "PT1H";
  return undefined;
}

export default function PricingTierToggle({
  tiers,
  recommendedIndex = 0,
  className,
}: PricingTierToggleProps) {
  const [activeIdx, setActiveIdx] = useState(recommendedIndex);
  const active = tiers[activeIdx];
  if (!active) return null;

  const href = buildWhatsAppHref({
    text: active.whatsappText,
    utm_source: "pricing_toggle",
    utm_campaign: active.utmCampaign,
  });
  const durationIso = durationToIso(active.scope?.duration);

  return (
    <div className={cn("rounded-2xl border border-border bg-background", className)} dir="rtl">
      <div
        role="tablist"
        aria-label="בחר חבילה"
        className="flex overflow-hidden rounded-t-2xl border-b border-border"
      >
        {tiers.map((tier, idx) => (
          <button
            key={tier.id}
            type="button"
            role="tab"
            aria-selected={idx === activeIdx}
            aria-controls={`tier-panel-${tier.id}`}
            id={`tier-tab-${tier.id}`}
            onClick={() => setActiveIdx(idx)}
            className={cn(
              "hardware-toggle flex-1 px-3 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--service-accent,#d42b2b)]",
              idx === activeIdx
                ? "bg-[var(--service-accent,#d42b2b)] text-white"
                : "bg-muted/40 text-muted-foreground hover:bg-muted",
              idx === recommendedIndex && idx !== activeIdx && "ring-1 ring-inset ring-[var(--service-accent,#d42b2b)]/30",
            )}
          >
            {tier.name}
          </button>
        ))}
      </div>

      <div
        id={`tier-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`tier-tab-${active.id}`}
        className="p-5 space-y-4"
      >
        <div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {active.priceExVat != null ? (
              <data value={String(active.priceExVat)}>{active.price}</data>
            ) : (
              active.price
            )}
          </p>
          {active.scope?.duration ? (
            <p className="text-xs text-muted-foreground mt-0.5">
              {durationIso ? (
                <time dateTime={durationIso}>{active.scope.duration}</time>
              ) : (
                active.scope.duration
              )}
            </p>
          ) : null}
          {active.priceNote && (
            <p className="text-xs text-muted-foreground mt-0.5">{active.priceNote}</p>
          )}
        </div>

        <p className="text-sm text-foreground leading-relaxed">{active.description}</p>

        <ul className="space-y-1.5" aria-label="מה כלול">
          {active.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-0.5 text-[var(--service-accent,#d42b2b)] shrink-0" aria-hidden>✓</span>
              {h}
            </li>
          ))}
        </ul>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 w-full touch-manipulation items-center justify-center rounded-xl bg-[var(--service-accent,#d42b2b)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
        >
          להזמנה בוואטסאפ
        </a>

        <p className="text-center text-[10px] text-muted-foreground">
          *המחירים לפני מע״מ (18%)
        </p>
      </div>
    </div>
  );
}
