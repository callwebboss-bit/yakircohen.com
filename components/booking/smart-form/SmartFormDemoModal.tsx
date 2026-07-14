"use client";

import { useEffect } from "react";
import { getAudioDemo, type AudioDemoId } from "@/lib/data/audio-demos";
import PremiumCrossfadePlayer from "@/components/ui/PremiumCrossfadePlayer";

type SmartFormDemoModalProps = {
  open: boolean;
  demoId: AudioDemoId;
  onClose: () => void;
};

export default function SmartFormDemoModal({
  open,
  demoId,
  onClose,
}: SmartFormDemoModalProps) {
  const demo = getAudioDemo(demoId);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !demo || demo.status === "pending") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="דוגמה לפני ואחרי"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="סגור"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">תראו איך זה נשמע</p>
            <p className="mt-1 text-xs text-muted-foreground">
              לפני ואחרי - תוצאה, לא שעות עבודה
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] touch-manipulation rounded-lg text-muted-foreground hover:bg-surface"
            aria-label="סגור"
          >
            ✕
          </button>
        </div>
        <PremiumCrossfadePlayer
          beforeSrc={demo.beforeSrc}
          afterSrc={demo.afterSrc}
          beforeLabel={demo.beforeLabel}
          afterLabel={demo.afterLabel}
          storageKey={`smart-form-${demo.storageKey}`}
        />
      </div>
    </div>
  );
}
