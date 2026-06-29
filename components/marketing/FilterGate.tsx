"use client";

import { useEffect, useState } from "react";
import FilterGateSkeleton from "@/components/marketing/FilterGateSkeleton";
import StudioRecordingBooking from "@/components/marketing/StudioRecordingBooking";
import { STUDIO_RECORDING_PACKAGES } from "@/lib/data/studio-recording-booking";
import type { RecordingTypeId, StudioPackageId } from "@/lib/data/studio-recording-booking";
import type { PriceItemId } from "@/lib/data/pricing-catalog";
import {
  FILTER_QUESTIONS,
  FILTER_STORAGE_KEY,
  type FilterAnswers,
  type PurposeId,
  type TimelineId,
} from "@/lib/data/filter-questions";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const BROWSING_WA_HREF = buildWhatsAppHref({
  text: buildServiceWhatsAppText("הקלטה באולפן"),
  utm_source: "website",
  utm_campaign: "filter_browsing_cta",
});

type FilterView = "gate" | "browsing" | "wizard";

function PricingOverview({ onProceed }: { onProceed: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        הנה סקירה של המסלולים שלנו. כשתהיו מוכנים, נשמח לעזור.
      </p>

      <div className="space-y-3">
        {STUDIO_RECORDING_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 text-xl" aria-hidden="true">
                {pkg.emoji}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{pkg.name}</p>
                <p className="truncate text-xs text-muted-foreground">{pkg.description}</p>
              </div>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-sm font-bold text-brand-red">
                {pkg.price.toLocaleString("he-IL")} ₪
              </p>
              <p className="text-[0.65rem] text-muted-foreground">לפני מע״מ</p>
            </div>
          </div>
        ))}
      </div>

      <a
        href={BROWSING_WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
      >
        שאלות? נדבר בוואטסאפ
      </a>

      <button
        type="button"
        onClick={onProceed}
        className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-brand-red"
      >
        מוכן להזמין - עבור לאשף </button>
    </div>
  );
}

type FilterGateProps = {
  initialFilterPreset?: Partial<FilterAnswers>;
  skipGate?: boolean;
  initialEmotionalLabel?: string | null;
  routeId?: string | null;
  initialStudioPackageId?: StudioPackageId | null;
  initialRecordingTypeId?: RecordingTypeId | null;
  pricingCatalogId?: PriceItemId | null;
};

function readStoredAnswers(): FilterAnswers | null {
  try {
    const saved = sessionStorage.getItem(FILTER_STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as FilterAnswers;
  } catch {
    return null;
  }
}

function deriveView(
  hydrated: boolean,
  skipGate: boolean,
  timeline: TimelineId | null,
  purpose: PurposeId | null,
  browsingDismissed: boolean,
): FilterView | null {
  if (!hydrated) return null;
  const hasAnswers = timeline !== null && purpose !== null;
  if (skipGate && hasAnswers) return "wizard";
  if (hasAnswers && timeline === "just_browsing" && !browsingDismissed) return "browsing";
  if (hasAnswers) return "wizard";
  return "gate";
}

export default function FilterGate({
  initialFilterPreset,
  skipGate = false,
  initialEmotionalLabel,
  routeId = null,
  initialStudioPackageId = null,
  initialRecordingTypeId = null,
  pricingCatalogId = null,
}: FilterGateProps = {}) {
  const [hydrated, setHydrated] = useState(false);
  const [timeline, setTimeline] = useState<TimelineId | null>(
    initialFilterPreset?.timeline ?? null,
  );
  const [purpose, setPurpose] = useState<PurposeId | null>(
    initialFilterPreset?.purpose ?? null,
  );
  const [browsingDismissed, setBrowsingDismissed] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      if (skipGate && initialFilterPreset?.timeline && initialFilterPreset?.purpose) {
        setTimeline(initialFilterPreset.timeline);
        setPurpose(initialFilterPreset.purpose);
        setHydrated(true);
        return;
      }

      const stored = readStoredAnswers();
      if (stored) {
        setTimeline(stored.timeline);
        setPurpose(stored.purpose);
        if (stored.timeline !== "just_browsing") {
          setBrowsingDismissed(true);
        }
      } else if (initialFilterPreset?.timeline && initialFilterPreset?.purpose) {
        setTimeline(initialFilterPreset.timeline);
        setPurpose(initialFilterPreset.purpose);
        if (initialFilterPreset.timeline !== "just_browsing") {
          setBrowsingDismissed(true);
        }
      }

      setHydrated(true);
    });
  }, [skipGate, initialFilterPreset]);

  const view = deriveView(hydrated, skipGate, timeline, purpose, browsingDismissed);
  const canAdvance = timeline !== null && purpose !== null;

  const handleAdvance = () => {
    if (!timeline || !purpose) return;
    const answers: FilterAnswers = { timeline, purpose };
    try {
      sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* sessionStorage unavailable */
    }
    if (timeline === "just_browsing") {
      setBrowsingDismissed(false);
    } else {
      setBrowsingDismissed(true);
    }
  };

  const handleBrowsingProceed = () => {
    const stored = readStoredAnswers();
    if (stored) {
      setTimeline(stored.timeline);
      setPurpose(stored.purpose);
    }
    setBrowsingDismissed(true);
  };

  if (view === null) return <FilterGateSkeleton />;

  if (view === "wizard") {
    const filterAnswers: FilterAnswers | null =
      timeline !== null && purpose !== null ? { timeline, purpose } : null;
    return (
      <StudioRecordingBooking
        filterAnswers={filterAnswers}
        initialEmotionalLabel={initialEmotionalLabel}
        routeId={routeId}
        initialStudioPackageId={initialStudioPackageId}
        initialRecordingTypeId={initialRecordingTypeId}
        pricingCatalogId={pricingCatalogId}
      />
    );
  }

  if (view === "browsing") {
    return <PricingOverview onProceed={handleBrowsingProceed} />;
  }

  return (
    <div className="mx-auto max-w-xl space-y-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div>
        <p className="mb-2 text-xs font-bold tracking-widest text-brand-red uppercase">
          שאלה 1 מתוך 2
        </p>
        <h3 className="mb-4 text-base font-semibold text-foreground">
          {FILTER_QUESTIONS[0].text}
        </h3>
        <div className="flex flex-wrap gap-2">
          {FILTER_QUESTIONS[0].options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTimeline(opt.id)}
              aria-pressed={timeline === opt.id}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                timeline === opt.id
                  ? "border-brand-red bg-brand-red/8 text-brand-red shadow-sm ring-1 ring-brand-red/30"
                  : "border-border bg-background text-foreground hover:border-brand-red/40",
              )}
            >
              <span aria-hidden="true">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold tracking-widest text-brand-red uppercase">
          שאלה 2 מתוך 2
        </p>
        <h3 className="mb-4 text-base font-semibold text-foreground">
          {FILTER_QUESTIONS[1].text}
        </h3>
        <div className="flex flex-wrap gap-2">
          {FILTER_QUESTIONS[1].options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPurpose(opt.id)}
              aria-pressed={purpose === opt.id}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                purpose === opt.id
                  ? "border-brand-red bg-brand-red/8 text-brand-red shadow-sm ring-1 ring-brand-red/30"
                  : "border-border bg-background text-foreground hover:border-brand-red/40",
              )}
            >
              <span aria-hidden="true">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdvance}
        disabled={!canAdvance}
        className={cn(
          "w-full rounded-xl py-3.5 text-sm font-semibold transition-colors",
          canAdvance
            ? "bg-brand-red text-white hover:bg-brand-red-light"
            : "cursor-not-allowed bg-border text-muted-foreground",
        )}
      >
        כניסה לאשף ההזמנה </button>
    </div>
  );
}
