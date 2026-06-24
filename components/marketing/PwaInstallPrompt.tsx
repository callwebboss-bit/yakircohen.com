"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "pwa-install-dismissed-until";
const DELAY_MS = 90_000;
const COOLDOWN_DAYS = 7;

type PromptEvent = Event & { prompt: () => Promise<void> };

function subscribeNoop() {
  return () => {};
}

function getIosSnapshot() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) && !("MSStream" in window)
  );
}

function getIosServerSnapshot() {
  return false;
}

function isDismissed() {
  try {
    const until = localStorage.getItem(STORAGE_KEY);
    return until ? Date.now() < Number(until) : false;
  } catch {
    return false;
  }
}

function dismiss() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      String(Date.now() + COOLDOWN_DAYS * 86_400_000),
    );
  } catch {}
}

export default function PwaInstallPrompt() {
  const deferredPrompt = useRef<PromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const isIos = useSyncExternalStore(subscribeNoop, getIosSnapshot, getIosServerSnapshot);

  useEffect(() => {
    if (
      isDismissed() ||
      window.matchMedia("(display-mode: standalone)").matches
    )
      return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as PromptEvent;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Only schedule the banner if there's something to show
    // (iOS instructions OR the native install prompt)
    const timer = setTimeout(() => {
      if (isIos || deferredPrompt.current) setVisible(true);
    }, DELAY_MS);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, [isIos]);

  function handleDismiss() {
    dismiss();
    setVisible(false);
  }

  async function handleInstall() {
    if (deferredPrompt.current) {
      await deferredPrompt.current.prompt();
    }
    handleDismiss();
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="שמור את האתר למסך הבית"
      dir="rtl"
      className="fixed bottom-4 inset-x-4 z-50 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-lg sm:inset-x-auto sm:start-4 sm:w-80"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red text-white text-lg font-bold select-none">
        י
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-snug">
          שמור אותנו למסך הבית
        </p>
        {isIos ? (
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            לחצו <span className="font-medium">שתף</span>{" "}
            <span aria-hidden="true">›</span>{" "}
            <span className="font-medium">הוסף למסך הבית</span>
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            גישה מהירה לאולפן, פודקאסט ואירועים
          </p>
        )}
        {canInstall && (
          <button
            onClick={handleInstall}
            className="mt-2 inline-flex items-center rounded-md bg-brand-red px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            שמור
          </button>
        )}
      </div>
      <button
        onClick={handleDismiss}
        aria-label="סגור"
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
