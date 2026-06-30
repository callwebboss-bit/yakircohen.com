"use client";

import { useEffect, useState } from "react";

const TRANSITION_MS = 1200;
const MESSAGE_INTERVAL_MS = 400;

export function WizardStepTransitionSkeleton({
  active,
  messages,
  onComplete,
  onAbort,
}: {
  active: boolean;
  messages: readonly string[];
  onComplete: () => void;
  onAbort?: () => void;
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setMessageIndex(0);
      return undefined;
    }

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      onComplete();
      return undefined;
    }

    const messageTimer = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, MESSAGE_INTERVAL_MS);

    const doneTimer = window.setTimeout(() => {
      onComplete();
    }, TRANSITION_MS);

    return () => {
      window.clearInterval(messageTimer);
      window.clearTimeout(doneTimer);
    };
  }, [active, onComplete, messages.length]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-surface px-6 py-8 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-3 w-3/4 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-10 rounded-xl bg-muted/80" />
            <div className="h-10 rounded-xl bg-muted/60" />
            <div className="h-10 rounded-xl bg-muted/40" />
          </div>
          <div className="mx-auto h-3 w-1/2 rounded bg-muted" />
        </div>
        <p className="mt-5 text-center text-sm font-medium text-foreground transition-opacity duration-200">
          {messages[messageIndex]}
        </p>
        {onAbort ? (
          <button
            type="button"
            onClick={onAbort}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            ביטול
          </button>
        ) : null}
      </div>
    </div>
  );
}
