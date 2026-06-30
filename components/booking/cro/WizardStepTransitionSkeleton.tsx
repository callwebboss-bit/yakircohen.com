"use client";

import { useEffect, useState } from "react";

const TRANSITION_MS = 1200;
const MESSAGE_INTERVAL_MS = 400;

export type WizardSkeletonLayout = "packages" | "contact" | "summary";

function SkeletonBody({ layout }: { layout: WizardSkeletonLayout }) {
  if (layout === "packages") {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 rounded-2xl bg-muted/80" />
          <div className="h-24 rounded-2xl bg-muted/60" />
          <div className="h-24 rounded-2xl bg-muted/50" />
          <div className="h-24 rounded-2xl bg-muted/40" />
        </div>
        <div className="h-8 rounded-lg bg-muted/40" />
      </div>
    );
  }
  if (layout === "summary") {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 rounded-2xl bg-muted/80" />
        <div className="h-4 w-2/3 rounded bg-muted/60" />
        <div className="h-4 w-1/2 rounded bg-muted/40" />
        <div className="h-12 rounded-xl bg-muted/50" />
      </div>
    );
  }
  return (
    <div className="animate-pulse space-y-4">
      <div className="mx-auto h-3 w-3/4 rounded bg-muted" />
      <div className="space-y-2">
        <div className="h-12 rounded-xl bg-muted/80" />
        <div className="h-12 rounded-xl bg-muted/60" />
        <div className="h-12 rounded-xl bg-muted/40" />
        <div className="h-12 rounded-xl bg-muted/30" />
      </div>
      <div className="h-12 rounded-xl bg-muted/50" />
    </div>
  );
}

function WizardStepTransitionSkeletonActive({
  messages,
  layout,
  onComplete,
  onAbort,
}: {
  messages: readonly string[];
  layout: WizardSkeletonLayout;
  onComplete: () => void;
  onAbort?: () => void;
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
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
  }, [onComplete, messages.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-surface px-6 py-8 shadow-lg">
        <SkeletonBody layout={layout} />
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

export function WizardStepTransitionSkeleton({
  active,
  messages,
  layout = "contact",
  onComplete,
  onAbort,
}: {
  active: boolean;
  messages: readonly string[];
  layout?: WizardSkeletonLayout;
  onComplete: () => void;
  onAbort?: () => void;
}) {
  if (!active) return null;

  return (
    <WizardStepTransitionSkeletonActive
      key="wizard-step-transition"
      messages={messages}
      layout={layout}
      onComplete={onComplete}
      onAbort={onAbort}
    />
  );
}
