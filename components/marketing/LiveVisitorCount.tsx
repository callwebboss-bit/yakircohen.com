"use client";

import { useEffect, useState } from "react";
import { UsersIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const POLL_MS = 45_000;

type LiveVisitorsResponse = {
  configured: boolean;
  visitors: number | null;
  fetchedAt: string;
};

export default function LiveVisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchVisitors() {
      try {
        const res = await fetch("/api/live-visitors", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as LiveVisitorsResponse;
        if (cancelled) return;
        setConfigured(data.configured);
        setVisitors(data.configured ? data.visitors : null);
      } catch {
        if (!cancelled) {
          setConfigured(false);
          setVisitors(null);
        }
      }
    }

    void fetchVisitors();
    const interval = window.setInterval(() => void fetchVisitors(), POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  if (configured === false) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex min-h-[1.25rem] items-center gap-2",
        configured === null && "invisible",
      )}
      data-testid="live-visitor-count"
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        {visitors !== null ? (
          <>
            <span className="absolute inline-flex h-full w-full motion-reduce:animate-none animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </>
        ) : null}
      </span>
      <UsersIcon size={16} className="shrink-0 text-emerald-700" />
      <span className="text-muted-foreground">
        {visitors !== null ? (
          <>
            <span className="font-medium text-foreground">{visitors}</span> גולשים כרגע
          </>
        ) : (
          <span aria-hidden="true">0 גולשים כרגע</span>
        )}
      </span>
    </div>
  );
}
