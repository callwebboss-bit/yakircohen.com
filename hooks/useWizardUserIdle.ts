"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const DEFAULT_IDLE_MS = 45_000;

/** שורש בועת העזרה (WizardIdleHelpBubble) מסומן ב-data-wizard-idle-help. */
function isInsideBubble(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest("[data-wizard-idle-help]") !== null
  );
}

export function useWizardUserIdle(opts: {
  enabled: boolean;
  delayMs?: number;
  targetRef?: RefObject<HTMLElement | null>;
}) {
  const [idle, setIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!opts.enabled) return undefined;

    const delay = opts.delayMs ?? DEFAULT_IDLE_MS;

    function restartTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIdle(true), delay);
    }

    function resetTimer() {
      setIdle(false);
      restartTimer();
    }

    /* לחיצה או מגע בעמוד: הגולש חזר לפעולה, ולכן הבועה נעלמת והטיימר מתחיל מחדש.
       מגע בתוך הבועה עצמה לא נחשב: pointerdown על "הסתירו" או על כפתור
       הוואטסאפ היה מסיר אותה לפני שהלחיצה נחתה. */
    function onPointerActivity(event: Event) {
      if (isInsideBubble(event.target)) return;
      resetTimer();
    }

    /* F-74: מקלדת וגלילה רק מאתחלות את הטיימר, ולא מסתירות בועה שכבר מוצגת.
       אחרת ה-Tab הראשון של משתמש מקלדת (או הגלילה ש-Tab מפעיל כדי להביא
       פקד לתצוגה) הסתיר את הבועה לפני שהמיקוד הגיע אליה. סגירה: "הסתירו",
       Escape (WizardIdleHelpBubble) או מגע בעמוד. */
    function onSoftActivity() {
      restartTimer();
    }

    const root = opts.targetRef?.current ?? document;
    const pointerEvents = ["pointerdown", "touchstart"] as const;
    const softEvents = ["keydown", "scroll"] as const;

    for (const event of pointerEvents) {
      root.addEventListener(event, onPointerActivity, { passive: true });
    }
    for (const event of softEvents) {
      root.addEventListener(event, onSoftActivity, { passive: true });
    }
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of pointerEvents) {
        root.removeEventListener(event, onPointerActivity);
      }
      for (const event of softEvents) {
        root.removeEventListener(event, onSoftActivity);
      }
    };
  }, [opts.enabled, opts.delayMs, opts.targetRef]);

  const dismiss = () => setIdle(false);

  return { idle: opts.enabled ? idle : false, dismiss };
}
