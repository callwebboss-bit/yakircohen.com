"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  PROMO_DISMISSED_EVENT,
  SS_PROMO_DISMISSED,
} from "@/lib/coupon-banner-storage";

const MESSAGES = [
  { icon: "🔥", text: "עובדים על 5 עד 7 פרויקטים בשבוע", href: "/book" },
  { icon: "🎁", text: "מקליטים שיר? קבלו קליפ BTS במתנה", href: "/studio/recording-song-modiin" },
  { icon: "🎙️", text: "פודקאסט ראשון? עריכה ראשונה חינם", href: "/podcast/podcast-editing" },
] as const;

function persistPromoDismissed() {
  try {
    sessionStorage.setItem(SS_PROMO_DISMISSED, "true");
  } catch {
    /* blocked */
  }
  window.dispatchEvent(new Event(PROMO_DISMISSED_EVENT));
}

export default function PromoBanner() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(SS_PROMO_DISMISSED) === "true");
    } catch {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    if (dismissed !== false) {
      delete document.documentElement.dataset.promoBanner;
      return undefined;
    }
    document.documentElement.dataset.promoBanner = "open";
    return () => {
      delete document.documentElement.dataset.promoBanner;
    };
  }, [dismissed]);

  useEffect(() => {
    if (dismissed) return undefined;
    const timer = setInterval(() => {
      setFade(false);
      const swap = setTimeout(() => {
        setIdx((i) => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 300);
      return () => clearTimeout(swap);
    }, 5000);
    return () => clearInterval(timer);
  }, [dismissed]);

  if (dismissed !== false) return null;

  const msg = MESSAGES[idx]!;

  return (
    <div className="relative flex h-10 items-center justify-center overflow-hidden bg-brand-red px-10">
      <Link
        href={msg.href}
        style={{ opacity: fade ? 1 : 0, transition: "opacity 0.3s ease" }}
        className="flex items-center gap-2 text-sm font-bold text-white hover:underline"
      >
        <span aria-hidden className="text-base">{msg.icon}</span>
        {msg.text}
      </Link>
      <button
        type="button"
        aria-label="סגור הודעה"
        onClick={() => {
          persistPromoDismissed();
          setDismissed(true);
        }}
        className="absolute end-3 top-1/2 -translate-y-1/2 min-h-11 min-w-11 touch-manipulation p-1 text-white/60 transition-colors hover:text-white"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden
        >
          <line x1="1" y1="1" x2="9" y2="9" />
          <line x1="9" y1="1" x2="1" y2="9" />
        </svg>
      </button>
    </div>
  );
}
