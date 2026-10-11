"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useEscapeLayer } from "@/hooks/useEscapeLayer";
import { usePopupSlot } from "@/hooks/usePopupSlot";
import { isQuietRoute } from "@/lib/action-bar-routes";
import { isPopupDismissed } from "@/lib/popup-manager";

/* התזמון, "אחד לביקור" והסגירה ל-30 יום חיים ב-lib/popup-manager.ts. הרכיב
   רק מחליט אם יש מה להציג (iOS, או דפדפן שהציע התקנה) ומצייר. */

type PromptEvent = Event & { prompt: () => Promise<void> };

function subscribeNoop() {
  return () => {};
}

function getIosSnapshot() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) && !("MSStream" in window)
  );
}

function getStandaloneSnapshot() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

function getFalseSnapshot() {
  return false;
}

export default function PwaInstallPrompt() {
  const pathname = usePathname() ?? "/";
  const deferredPrompt = useRef<PromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const isIos = useSyncExternalStore(subscribeNoop, getIosSnapshot, getFalseSnapshot);
  const isStandalone = useSyncExternalStore(
    subscribeNoop,
    getStandaloneSnapshot,
    getFalseSnapshot,
  );

  useEffect(() => {
    if (isStandalone || isPopupDismissed("pwa")) return undefined;
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as PromptEvent;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, [isStandalone]);

  // יש מה להציג רק עם הוראות iOS או עם ההתקנה המקורית של הדפדפן
  const slot = usePopupSlot("pwa", {
    enabled: !isStandalone && (isIos || canInstall) && !isQuietRoute(pathname),
    priority: 10,
  });

  async function handleInstall() {
    if (deferredPrompt.current) {
      await deferredPrompt.current.prompt();
    }
    slot.dismiss();
  }

  /* F-74: Escape סוגר את ההנחיה מכל מקום, כמו כפתור הסגירה (מנהל הפופאפים
     זוכר את הסגירה). שכבת רקע: לא גוברת על תפריט, צ'אט או חלון מודאלי פתוחים. */
  useEscapeLayer({ active: slot.visible, onEscape: slot.dismiss, ambient: true });

  if (!slot.visible) return null;

  return (
    <div
      role="dialog"
      aria-label="שמור את האתר למסך הבית"
      dir="rtl"
      className="fixed bottom-[calc(var(--float-inset)+1rem)] inset-x-4 z-50 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-lg sm:inset-x-auto sm:start-4 sm:w-80"
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
        onClick={slot.dismiss}
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
