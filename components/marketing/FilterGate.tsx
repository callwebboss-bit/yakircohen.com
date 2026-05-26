"use client";

import { useEffect, useState } from "react";
import StudioRecordingBooking from "@/components/marketing/StudioRecordingBooking";
import { STUDIO_RECORDING_PACKAGES } from "@/lib/data/studio-recording-booking";
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

type GateState = "loading" | "gate" | "wizard" | "browsing";

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
            <p className="shrink-0 text-sm font-bold text-brand-red">
              {pkg.price.toLocaleString("he-IL")} ₪
            </p>
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
        מוכן להזמין — עבור לאשף ←
      </button>
    </div>
  );
}

export default function FilterGate() {
  const [gateState, setGateState] = useState<GateState>("loading");
  const [giftMode, setGiftMode] = useState(false);
  const [timeline, setTimeline] = useState<TimelineId | null>(null);
  const [purpose, setPurpose] = useState<PurposeId | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = sessionStorage.getItem(FILTER_STORAGE_KEY);
        if (saved) {
          const answers: FilterAnswers = JSON.parse(saved);
          if (answers.timeline === "just_browsing") {
            setGateState("browsing");
          } else {
            if (answers.purpose === "gift") setGiftMode(true);
            setGateState("wizard");
          }
        } else {
          setGateState("gate");
        }
      } catch {
        setGateState("gate");
      }
    });
  }, []);

  const canAdvance = timeline !== null && purpose !== null;

  const handleAdvance = () => {
    if (!timeline || !purpose) return;
    const answers: FilterAnswers = { timeline, purpose };
    try {
      sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // sessionStorage unavailable — proceed anyway
    }
    if (timeline === "just_browsing") {
      setGateState("browsing");
    } else {
      if (purpose === "gift") setGiftMode(true);
      setGateState("wizard");
    }
  };

  const handleBrowsingProceed = () => {
    try {
      const saved = sessionStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        const answers: FilterAnswers = JSON.parse(saved);
        if (answers.purpose === "gift") setGiftMode(true);
      }
    } catch {}
    setGateState("wizard");
  };

  if (gateState === "loading") return null;

  if (gateState === "wizard") {
    return <StudioRecordingBooking initialGiftMode={giftMode} />;
  }

  if (gateState === "browsing") {
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
        כניסה לאשף ההזמנה ←
      </button>
    </div>
  );
}
