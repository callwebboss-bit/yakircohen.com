"use client";

import { cn } from "@/lib/utils";

type BookDraftRecoveryBannerProps = {
  savedAt?: string | null;
  onDismiss?: () => void;
  onClear?: () => void;
  className?: string;
};

export default function BookDraftRecoveryBanner({
  savedAt,
  onDismiss,
  onClear,
  className,
}: BookDraftRecoveryBannerProps) {
  if (!savedAt && !onDismiss) return null;

  const formatted = savedAt
    ? new Date(savedAt).toLocaleDateString("he-IL", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <p
      className={cn(
        "rounded-lg border border-brand-red/20 bg-brand-red/5 px-4 py-2 text-xs text-muted-foreground",
        className,
      )}
      role="status"
    >
      {formatted
        ? `שחזרנו טיוטה שמורה מ-${formatted}. `
        : "שחזרנו את הטיוטה האחרונה שלכם מהדפדפן. "}
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="font-semibold text-brand-red underline-offset-2 hover:underline"
        >
          התחילו מחדש
        </button>
      ) : null}
      {onDismiss ? (
        <>
          {onClear ? " - " : null}
          <button
            type="button"
            onClick={onDismiss}
            className="font-semibold text-brand-red underline-offset-2 hover:underline"
          >
            הסתירו
          </button>
        </>
      ) : null}
    </p>
  );
}
