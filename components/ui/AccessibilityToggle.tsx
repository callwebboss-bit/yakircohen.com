"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

type A11yOption = "largeText" | "highContrast" | "highlightLinks";

const OPTIONS: Array<{
  id: A11yOption;
  label: string;
}> = [
  { id: "largeText", label: "הגדלת טקסט" },
  { id: "highContrast", label: "ניגודיות גבוהה" },
  { id: "highlightLinks", label: "הדגשת קישורים" },
];

function AccessibilityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}

export default function AccessibilityToggle({
  className = "",
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Record<A11yOption, boolean>>({
    largeText: false,
    highContrast: false,
    highlightLinks: false,
  });
  const menuId = useId();

  const syncHtmlClasses = useCallback((next: Record<A11yOption, boolean>) => {
    const root = document.documentElement;
    root.classList.toggle("a11y-large-text", next.largeText);
    root.classList.toggle("a11y-high-contrast", next.highContrast);
    root.classList.toggle("a11y-highlight-links", next.highlightLinks);
  }, []);

  useEffect(() => {
    syncHtmlClasses(active);
  }, [active, syncHtmlClasses]);

  const toggleOption = (id: A11yOption) => {
    setActive((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-50 pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    >
      {open ? (
        <div
          id={menuId}
          role="dialog"
          aria-label="תפריט נגישות"
          className="absolute bottom-14 left-0 w-56 rounded-xl border border-border bg-surface p-4 text-foreground shadow-lg"
        >
          <p className="mb-3 text-sm font-semibold">נגישות</p>
          <ul className="space-y-2">
            {OPTIONS.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => toggleOption(option.id)}
                  aria-pressed={active[option.id]}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-start text-sm transition-colors",
                    active[option.id]
                      ? "bg-brand-red text-white"
                      : "bg-background hover:bg-brand-red/10",
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "סגירת תפריט נגישות" : "פתיחת תפריט נגישות"}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface p-3.5 text-foreground shadow-lg transition-transform duration-fast ease-luxury hover:scale-105 hover:border-[var(--service-accent,#d42b2b)]/40 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
      >
        <AccessibilityIcon />
        <span className="sr-only">נגישות</span>
      </button>
    </div>
  );
}
