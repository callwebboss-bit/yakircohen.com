"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatDaysAgo,
  LIVE_STATUS_PROJECT_IDEAS,
} from "@/lib/data/live-status";

const INTERVAL_MS = 4500;
const OUT_DURATION_MS = 250;

export default function LiveStatusProjectTicker() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let swapTimer: number | undefined;
    const timer = window.setInterval(() => {
      setPhase("out");
      swapTimer = window.setTimeout(() => {
        setIdx((i) => (i + 1) % LIVE_STATUS_PROJECT_IDEAS.length);
        setPhase("in");
      }, OUT_DURATION_MS);
    }, INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
      if (swapTimer !== undefined) window.clearTimeout(swapTimer);
    };
  }, []);

  const current = LIVE_STATUS_PROJECT_IDEAS[idx]!;

  return (
    <Link
      href={current.url}
      title={`${current.title} - הזמינו גם אתם`}
      className="inline-flex min-h-8 max-w-[min(100%,22rem)] items-center overflow-hidden text-muted-foreground transition-colors hover:text-foreground"
      data-testid="live-status-project-ticker"
    >
      <span className="shrink-0 font-semibold text-emerald-700">
        ✅ הושלם לאחרונה:
      </span>
      <span
        key={idx}
        style={{
          animation:
            phase === "in"
              ? `ticker-in ${OUT_DURATION_MS}ms var(--ease-luxury) forwards`
              : `ticker-out ${OUT_DURATION_MS}ms var(--ease-luxury) forwards`,
        }}
        className="ms-1 min-w-0 truncate"
      >
        <span className="font-medium text-foreground">{current.title}</span>
        {" • "}
        <span className="text-muted-foreground">
          {formatDaysAgo(current.daysAgo)}
        </span>
      </span>
    </Link>
  );
}
