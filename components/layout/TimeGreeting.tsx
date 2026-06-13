"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getTipForPath } from "@/lib/data/greeting-tips";

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 11) return "בוקר טוב ☀️";
  if (hour >= 11 && hour < 17) return "שלום 👋";
  if (hour >= 17 && hour < 21) return "ערב טוב 🌆";
  return "לילה טוב 🌙";
}

export default function TimeGreeting() {
  const pathname = usePathname();
  const [greeting, setGreeting] = useState<string | null>(null);
  const tip = getTipForPath(pathname);

  useEffect(() => {
    queueMicrotask(() => setGreeting(getGreeting(new Date().getHours())));
  }, []);

  // OPTIMIZED: fixed-height shell prevents CLS while client time resolves (SSG-safe vs SSR time)
  return (
    <div className="flex min-h-[1.75rem] items-center gap-3 py-1.5 text-xs text-muted-foreground">
      {greeting ? (
        <>
          <span className="font-medium text-foreground">{greeting}</span>
          <span aria-hidden className="text-border">
            -
          </span>
          <span>{tip}</span>
        </>
      ) : (
        <span className="invisible select-none" aria-hidden>
          שלום
        </span>
      )}
    </div>
  );
}
