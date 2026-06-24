"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GREETING_TIPS, GENERAL_TIPS } from "@/lib/data/greeting-tips";

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 11) return "בוקר טוב ☀️";
  if (hour >= 11 && hour < 17) return "שלום 👋";
  if (hour >= 17 && hour < 21) return "ערב טוב 🌆";
  return "לילה טוב 🌙";
}

// Deduplicate GREETING_TIPS by href, then append general tips
const ALL_ITEMS = [
  ...GREETING_TIPS.filter(
    (t, i, arr) => arr.findIndex((x) => x.href === t.href) === i,
  ),
  ...GENERAL_TIPS,
];

const INTERVAL = 4000;
const OUT_DURATION = 250;

export default function TimeGreeting() {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    queueMicrotask(() => setGreeting(getGreeting(new Date().getHours())));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase("out");
      const swap = setTimeout(() => {
        setIdx((i) => (i + 1) % ALL_ITEMS.length);
        setPhase("in");
      }, OUT_DURATION);
      return () => clearTimeout(swap);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const current = ALL_ITEMS[idx]!;

  return (
    <div className="flex min-h-[1.75rem] items-center gap-3 py-1.5 text-xs text-muted-foreground overflow-hidden">
      {/* LIVE indicator */}
      <span className="flex shrink-0 items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <span className="font-semibold tracking-wide text-red-500">LIVE</span>
      </span>

      <span aria-hidden className="text-border">|</span>

      {/* Time greeting */}
      {greeting && (
        <>
          <span className="shrink-0 font-medium text-foreground">{greeting}</span>
          <span aria-hidden className="text-border">·</span>
        </>
      )}

      {/* Animated ticker item */}
      <Link
        key={idx}
        href={current.href}
        style={{
          animation:
            phase === "in"
              ? `ticker-in ${OUT_DURATION}ms var(--ease-luxury) forwards`
              : `ticker-out ${OUT_DURATION}ms var(--ease-luxury) forwards`,
        }}
        className="min-w-0 truncate hover:text-foreground hover:underline"
      >
        {current.tip}
      </Link>
    </div>
  );
}
