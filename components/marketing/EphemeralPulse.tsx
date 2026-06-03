"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getPulseForPath } from "@/lib/data/studio-weekly-pulse";

const SESSION_KEY = "yakir-pulse-shown";
const SHOW_DELAY_MS = 10_000;
const SCROLL_THRESHOLD = 0.35;
const AUTO_DISMISS_MS = 7_000;

export default function EphemeralPulse() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pulse = getPulseForPath(pathname);

  function dismiss() {
    setExiting(true);
    setTimeout(() => setVisible(false), 260);
  }

  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY)) return;

    let timeoutFired = false;
    let scrollFired = false;

    function tryShow() {
      if (timeoutFired && scrollFired) {
        if (typeof sessionStorage !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");
        setVisible(true);
        setExiting(false);
        dismissTimerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
      }
    }

    timerRef.current = setTimeout(() => {
      timeoutFired = true;
      tryShow();
    }, SHOW_DELAY_MS);

    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !scrolledRef.current) {
          scrolledRef.current = true;
          scrollFired = true;
          tryShow();
        }
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden
        style={{ position: "absolute", top: `${SCROLL_THRESHOLD * 100}vh`, height: 0, pointerEvents: "none" }}
      />
      {visible ? (
        <aside
          className={`fixed bottom-[5.75rem] end-4 z-40 hidden max-w-[17.5rem] md:block sm:bottom-[6.25rem] sm:end-6 sm:max-w-xs ${exiting ? "pulse-exit" : "pulse-enter"}`}
          aria-label="עדכון מהאולפן"
        >
          <div className="rounded-2xl border border-brand-red/30 bg-surface p-4 text-foreground shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-brand-red uppercase">
                {pulse.kicker}
              </p>
              <button
                type="button"
                onClick={dismiss}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                aria-label="סגור"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {pulse.body}
              {pulse.footnote ? (
                <>
                  {" "}
                  <span className="text-muted-foreground">{pulse.footnote}</span>
                </>
              ) : null}
            </p>
            <Link
              href={pulse.href}
              className="mt-3 inline-flex text-xs font-semibold text-brand-red underline-offset-4 transition-colors hover:underline"
              onClick={dismiss}
            >
              {pulse.linkLabel}
            </Link>
          </div>
        </aside>
      ) : null}
    </>
  );
}
