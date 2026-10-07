"use client";

import { useEffect } from "react";
import { SiteSearchLazy } from "@/components/layout/header-lazy";
import Container from "@/components/ui/Container";
import { useRenderCount } from "@/hooks/useRenderCount";

/** ה-id של כפתור פתיחת החיפוש. Header מחזיר אליו את הפוקוס אחרי שהשורה נסגרת. */
export const MOBILE_SEARCH_TOGGLE_ID = "header-mobile-search-toggle";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/** Mobile search toggle + expanded search row (isolated re-render boundary). */
export function HeaderMobileSearchToggle({
  onExpand,
}: {
  onExpand: () => void;
}) {
  useRenderCount("HeaderMobileSearchToggle");

  return (
    <button
      id={MOBILE_SEARCH_TOGGLE_ID}
      type="button"
      onClick={onExpand}
      className="touch-target inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground transition-all duration-fast ease-luxury hover:border-brand-red/50 hover:text-brand-red active:scale-95 lg:hidden"
      aria-label="חיפוש באתר"
      aria-expanded={false}
    >
      <SearchIcon />
    </button>
  );
}

export function HeaderMobileSearchBar({ onCollapse }: { onCollapse: () => void }) {
  useRenderCount("HeaderMobileSearchBar");

  // F-25 (7.10.2026): Esc סוגר את שורת החיפוש. כש-combobox פתוח עם תוצאות
  // (aria-expanded=true) הלחיצה הראשונה שייכת ל-SiteSearch, שסוגר את הרשימה,
  // והשנייה סוגרת את השורה. capture כדי לקרוא את המצב לפני שהמאזין של
  // SiteSearch על ה-document מעדכן אותו.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (
        e.target instanceof HTMLElement &&
        e.target.getAttribute("aria-expanded") === "true"
      ) {
        return;
      }
      onCollapse();
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [onCollapse]);

  return (
    <Container variant="wide" className="relative flex h-16 items-center gap-3 sm:h-[4.25rem] lg:hidden">
      <SiteSearchLazy className="flex-1" autoFocus maxResults={8} />
      <button
        type="button"
        onClick={onCollapse}
        className="touch-target flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-all duration-fast ease-luxury hover:border-brand-red/50 hover:text-brand-red active:scale-95"
        aria-label="סגירת חיפוש"
      >
        <CloseIcon />
      </button>
    </Container>
  );
}
