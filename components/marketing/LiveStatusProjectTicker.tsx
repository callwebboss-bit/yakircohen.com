"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LiveStatusRealWork } from "@/lib/data/live-status";

const INTERVAL_MS = 4500;
const OUT_DURATION_MS = 250;

/* הרשימה מגיעה כ-prop ולא מיובאת. ייבוא ישיר גרר את
   lib/data/video-catalog.generated.ts (273 סרטונים) לדפדפן, כי זהו רכיב
   לקוח. נתפס על ידי npm run audit:client-data-weight. */
export default function LiveStatusProjectTicker({
  works,
}: {
  works: readonly LiveStatusRealWork[];
}) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || works.length < 2) return;

    let swapTimer: number | undefined;
    const timer = window.setInterval(() => {
      setPhase("out");
      swapTimer = window.setTimeout(() => {
        setIdx((i) => (i + 1) % works.length);
        setPhase("in");
      }, OUT_DURATION_MS);
    }, INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
      if (swapTimer !== undefined) window.clearTimeout(swapTimer);
    };
  }, [works.length]);

  const current = works[idx];
  if (!current) return null;

  return (
    <Link
      href={current.url}
      title={`${current.count} עבודות בתיק, ${current.title}. הזמינו גם אתם`}
      className="inline-flex min-h-8 max-w-[min(100%,22rem)] items-center overflow-hidden text-muted-foreground transition-colors hover:text-foreground"
      data-testid="live-status-project-ticker"
    >
      <span className="shrink-0 font-semibold text-emerald-700">
        מתיק העבודות:
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
        {" · "}
        <span className="text-muted-foreground">{current.count} עבודות</span>
      </span>
    </Link>
  );
}
