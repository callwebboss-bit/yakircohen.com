"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  scanBookingDrafts,
  sessionRescuerDismissKey,
  type RescuableDraft,
} from "@/lib/booking-draft-rescuer";
import { trackConversion } from "@/lib/analytics/conversion-events";
import { cn } from "@/lib/utils";

export default function SessionRescuerBar() {
  const pathname = usePathname();
  const [draft, setDraft] = useState<RescuableDraft | null>(null);
  const [visible, setVisible] = useState(false);
  const shownRef = useRef<string | null>(null);

  const refresh = useCallback(() => {
    if (pathname?.startsWith("/book")) {
      setVisible(false);
      return;
    }
    const found = scanBookingDrafts();
    if (!found) {
      setDraft(null);
      setVisible(false);
      return;
    }
    try {
      if (sessionStorage.getItem(sessionRescuerDismissKey(found.category)) === "1") {
        setDraft(found);
        setVisible(false);
        return;
      }
    } catch {
      /* private mode */
    }
    setDraft(found);
    setVisible(true);
    const trackKey = `${found.category}:${found.step}`;
    if (shownRef.current !== trackKey) {
      shownRef.current = trackKey;
      trackConversion("session_rescuer_shown", {
        category: found.category,
        step: found.step,
      });
    }
  }, [pathname]);

  useEffect(() => {
    queueMicrotask(() => refresh());
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("yakir-booking-draft:")) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const dismiss = useCallback(() => {
    if (!draft) return;
    try {
      sessionStorage.setItem(sessionRescuerDismissKey(draft.category), "1");
    } catch {
      /* ignore */
    }
    trackConversion("session_rescuer_dismiss", { category: draft.category });
    setVisible(false);
  }, [draft]);

  if (!visible || !draft) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[45] border-t border-brand-red/25 bg-surface/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm",
        "pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground">
          התחלתם להרכיב{" "}
          <span className="font-semibold">{draft.packageLabel}</span>. השארנו את
          המקום פנוי — ממשיכים משלב {draft.stepLabel}?
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            הסתירו
          </button>
          <Link
            href={draft.resumeHref}
            onClick={() =>
              trackConversion("session_rescuer_resume", {
                category: draft.category,
                step: draft.step,
              })
            }
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-red/90"
          >
            המשיכו מהנקודה שעצרתם
          </Link>
        </div>
      </div>
    </div>
  );
}
