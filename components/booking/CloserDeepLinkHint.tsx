"use client";

import { buildCloserDeepLink } from "@/lib/closer-deep-link";

type CloserDeepLinkHintProps = {
  waBody: string;
  className?: string;
};

/** קישור מקומי ל-CLOSER + תזכורת לשלב א׳ הצעת מחיר (לא עולה לשרת). */
export default function CloserDeepLinkHint({ waBody, className }: CloserDeepLinkHintProps) {
  if (!waBody.trim()) return null;
  const href = buildCloserDeepLink(waBody);

  return (
    <div className={className ?? "mt-3 rounded-lg border border-dashed border-border bg-surface/40 p-3 text-xs text-muted-foreground"}>
      <p className="font-medium text-foreground">למפעיל (מקומי בלבד)</p>
      <p className="mt-1">פתחו את הקלוזר עם הליד, ואז שלב א׳ - הצעת מחיר.</p>
      <a
        href={href}
        className="mt-2 inline-flex min-h-12 items-center text-brand-red underline-offset-2 hover:underline"
      >
        פתח ב-CLOSER עם הליד
      </a>
    </div>
  );
}
