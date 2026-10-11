"use client";

import Link from "@/components/ui/IntentLink";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { scanBookingDrafts, type RescuableDraft } from "@/lib/booking-draft-rescuer";
import { usePopupSlot } from "@/hooks/usePopupSlot";
import { trackConversion } from "@/lib/analytics/conversion-events";
import { useEscapeLayer } from "@/hooks/useEscapeLayer";
import { cn } from "@/lib/utils";

/* הרכיב סורק טיוטות ומחליט אם יש מה להציע. מתי להציג (25 שניות או 40 אחוז
   גלילה, אחד לביקור, לא בזמן מילוי טופס במובייל) ואיך הסגירה נשמרת מנוהלים
   ב-lib/popup-manager.ts. הסגירה היא לפי טיוטה (scope), כך שטיוטה חדשה מציעה
   שוב גם בתוך 30 הימים של סגירת הקודמת. */

export default function SessionRescuerBar() {
  const pathname = usePathname();
  const [draft, setDraft] = useState<RescuableDraft | null>(null);
  const shownRef = useRef<string | null>(null);

  const onBookPage = pathname?.startsWith("/book") ?? false;

  const refresh = useCallback(() => {
    setDraft(scanBookingDrafts());
  }, []);

  useEffect(() => {
    queueMicrotask(() => refresh());
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("yakir-booking-draft:")) refresh();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  const slot = usePopupSlot("rescuer", {
    enabled: !!draft && !onBookPage,
    priority: 40,
    scope: draft ? `${draft.category}:${draft.savedAt}` : undefined,
  });

  useEffect(() => {
    if (!slot.visible || !draft) return;
    const trackKey = `${draft.category}:${draft.step}:${draft.savedAt}`;
    if (shownRef.current === trackKey) return;
    shownRef.current = trackKey;
    trackConversion("session_rescuer_shown", {
      category: draft.category,
      step: draft.step,
    });
  }, [slot.visible, draft]);

  const { dismiss: dismissSlot } = slot;
  const dismiss = useCallback(() => {
    if (!draft) return;
    trackConversion("session_rescuer_dismiss", { category: draft.category });
    dismissSlot();
  }, [draft, dismissSlot]);

  /* F-74: Escape סוגר את הסרגל מכל מקום, כמו "הסתירו". שכבת רקע: לא גוברת על
     תפריט, צ'אט או חלון מודאלי פתוחים, ולא פועלת כשהמיקוד בשדה טקסט. */
  useEscapeLayer({ active: slot.visible && !!draft, onEscape: dismiss, ambient: true });

  if (!slot.visible || !draft) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-[var(--float-inset)] z-[45] border-t border-brand-red/25 bg-surface/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm",
        "pb-[calc(0.75rem+var(--float-safe))]",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground">
          התחלתם להרכיב{" "}
          <span className="font-semibold">{draft.packageLabel}</span>. שמרנו את
          הבחירות שלכם - ממשיכים משלב {draft.stepLabel}?
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
