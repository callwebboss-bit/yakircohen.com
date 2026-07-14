"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "משקלל נתוני הפקה...",
  "מכין את היומן...",
] as const;

type SmartFormLoadingProps = {
  active: boolean;
  durationMs?: number;
  onDone: () => void;
};

export default function SmartFormLoading({
  active,
  durationMs = 1500,
  onDone,
}: SmartFormLoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setMessageIndex(0);
      return;
    }

    setMessageIndex(0);
    const swapId = window.setTimeout(() => setMessageIndex(1), Math.floor(durationMs / 2));
    const doneId = window.setTimeout(() => onDone(), durationMs);

    return () => {
      window.clearTimeout(swapId);
      window.clearTimeout(doneId);
    };
  }, [active, durationMs, onDone]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-white p-6 text-center shadow-lg">
        <div
          className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-brand-red border-t-transparent"
          aria-hidden
        />
        <p className="text-sm font-medium text-foreground">{MESSAGES[messageIndex]}</p>
      </div>
    </div>
  );
}
