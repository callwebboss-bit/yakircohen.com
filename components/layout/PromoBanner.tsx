"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MESSAGES = [
  { icon: "🔥", text: "פנויים השבוע ל-3 פרויקטים בלבד", href: "/book" },
  { icon: "🎁", text: "מקליטים שיר? קבלו קליפ BTS במתנה", href: "/studio/recording-song-modiin" },
  { icon: "🎙️", text: "פודקאסט ראשון? עריכה ראשונה חינם", href: "/podcast/podcast-editing" },
] as const;

export default function PromoBanner() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      const swap = setTimeout(() => {
        setIdx((i) => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 300);
      return () => clearTimeout(swap);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  const msg = MESSAGES[idx]!;

  return (
    <div className="relative flex h-8 items-center justify-center overflow-hidden bg-brand-red px-10">
      <Link
        href={msg.href}
        style={{ opacity: fade ? 1 : 0, transition: "opacity 0.3s ease" }}
        className="flex items-center gap-1.5 text-xs font-semibold text-white hover:underline"
      >
        <span aria-hidden>{msg.icon}</span>
        {msg.text}
      </Link>
      <button
        type="button"
        aria-label="סגור הודעה"
        onClick={() => setDismissed(true)}
        className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-white/60 transition-colors hover:text-white"
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
