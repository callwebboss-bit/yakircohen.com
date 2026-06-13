"use client";

import { useEffect } from "react";

const KOALENDAR_URL = "https://koalendar.com/e/Studio?embed=true";
const KOALENDAR_DIRECT = "https://koalendar.com/e/Studio";

type KoalendarModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function KoalendarModal({ open, onClose }: KoalendarModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="קביעת פגישת ייעוץ"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col rounded-2xl bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">קביעת פגישת ייעוץ</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              בחרו חריץ זמן נוח - ייעוץ חינמי 15 דקות עם יקיר
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגור"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* iFrame */}
        <div className="relative h-[560px] overflow-hidden rounded-b-2xl">
          {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
          <iframe
            src={KOALENDAR_URL}
            title="קביעת פגישת ייעוץ"
            className="h-full w-full border-0"
            loading="lazy"
            allow="camera; microphone"
          />
          {/* Fallback link in case iframe is blocked */}
          <noscript>
            <a
              href={KOALENDAR_DIRECT}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-surface text-sm font-medium text-brand-red underline"
            >
              פתחו לוח הזמנות בחלון חדש </a>
          </noscript>
        </div>

        <div className="border-t border-border px-5 py-3 text-center">
          <a
            href={KOALENDAR_DIRECT}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-brand-red hover:underline"
          >
            פתחו בחלון חדש </a>
        </div>
      </div>
    </div>
  );
}
