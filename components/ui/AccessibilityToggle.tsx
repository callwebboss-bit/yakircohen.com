"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type A11yOption = "largeText" | "highContrast" | "highlightLinks";
const STORAGE_KEY = "yc_a11y_prefs";

const OPTIONS: Array<{ id: A11yOption; label: string }> = [
  { id: "largeText", label: "הגדלת טקסט" },
  { id: "highContrast", label: "ניגודיות גבוהה" },
  { id: "highlightLinks", label: "הדגשת קישורים" },
];

const DEFAULT_ACTIVE: Record<A11yOption, boolean> = {
  largeText: false,
  highContrast: false,
  highlightLinks: false,
};

function loadPrefs(): Record<A11yOption, boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_ACTIVE, ...(JSON.parse(stored) as Record<string, boolean>) };
  } catch {}
  return { ...DEFAULT_ACTIVE };
}

function savePrefs(prefs: Record<A11yOption, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
}

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
  const [active, setActive] = useState<Record<A11yOption, boolean>>(DEFAULT_ACTIVE);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Load persisted prefs on mount and apply classes immediately
  useEffect(() => {
    const prefs = loadPrefs();
    setActive(prefs);
    const root = document.documentElement;
    root.classList.toggle("a11y-large-text", prefs.largeText);
    root.classList.toggle("a11y-high-contrast", prefs.highContrast);
    root.classList.toggle("a11y-highlight-links", prefs.highlightLinks);
  }, []);

  // Sync HTML classes and persist on every change
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-large-text", active.largeText);
    root.classList.toggle("a11y-high-contrast", active.highContrast);
    root.classList.toggle("a11y-highlight-links", active.highlightLinks);
    savePrefs(active);
  }, [active]);

  // Close on Escape and restore focus
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const toggleOption = useCallback((id: A11yOption) => {
    setActive((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleClose = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-50 pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    >
      {/* Always in DOM so aria-controls is valid; hidden attribute hides it */}
      <div
        id={menuId}
        role="dialog"
        aria-label="תפריט נגישות"
        hidden={!open}
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

      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "סגירת תפריט נגישות" : "פתיחת תפריט נגישות"}
        onClick={() => (open ? handleClose() : setOpen(true))}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface p-3.5 text-foreground shadow-lg transition-transform duration-fast ease-luxury hover:scale-105 hover:border-[var(--service-accent,#d42b2b)]/40 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
      >
        <AccessibilityIcon />
        <span className="sr-only">נגישות</span>
      </button>
    </div>
  );
}
