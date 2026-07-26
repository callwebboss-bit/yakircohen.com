"use client";

import { useEffect, useState } from "react";
import {
  HOLD_ACTIVE_LABEL,
  HOLD_EXPIRED_TEXT,
  HOLD_STORAGE_KEY,
} from "@/lib/data/lead-flow/payment-hold";

type HoldCountdownProps = {
  expiresAt: number | null;
  onExpired?: () => void;
};

function formatRemaining(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function HoldCountdown({ expiresAt, onExpired }: HoldCountdownProps) {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);
  const [storedExpires, setStoredExpires] = useState<number | null>(null);

  useEffect(() => {
    setReady(true);
    setNow(Date.now());
    try {
      const raw = window.localStorage.getItem(HOLD_STORAGE_KEY);
      const parsed = raw ? Number(raw) : NaN;
      if (Number.isFinite(parsed)) setStoredExpires(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (expiresAt != null) {
      setStoredExpires(expiresAt);
      try {
        window.localStorage.setItem(HOLD_STORAGE_KEY, String(expiresAt));
      } catch {
        /* ignore */
      }
    }
  }, [expiresAt, ready]);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [ready]);

  const effective = expiresAt ?? storedExpires;
  const remaining = effective != null ? effective - now : null;
  const expired = remaining != null && remaining <= 0;

  useEffect(() => {
    if (expired) onExpired?.();
  }, [expired, onExpired]);

  if (!ready || effective == null) {
    return (
      <p className="text-sm text-muted-foreground" aria-live="polite">
        הספירה לאחור תופיע אחרי בחירת חבילה.
      </p>
    );
  }

  if (expired) {
    return (
      <p className="text-sm font-medium text-brand-red" role="status">
        {HOLD_EXPIRED_TEXT}
      </p>
    );
  }

  const until = new Date(effective).toLocaleString("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3" aria-live="polite">
      <p className="text-sm font-medium text-foreground">
        {HOLD_ACTIVE_LABEL}: {until}
      </p>
      <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
        {formatRemaining(remaining ?? 0)}
      </p>
    </div>
  );
}
