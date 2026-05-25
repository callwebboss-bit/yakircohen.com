"use client";

import { ArrowIcon } from "@/components/ui/Icons";

export default function BackToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors duration-300 ease-[var(--ease-luxury)] hover:text-brand-red"
      aria-label="חזרה למעלה"
    >
      <ArrowIcon size={14} className="-rotate-90" />
      חזרה למעלה
    </button>
  );
}
