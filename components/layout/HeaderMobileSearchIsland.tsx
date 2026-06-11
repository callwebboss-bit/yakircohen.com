"use client";

import { SiteSearchLazy } from "@/components/layout/header-lazy";
import Container from "@/components/ui/Container";
import { useRenderCount } from "@/hooks/useRenderCount";

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
      type="button"
      onClick={onExpand}
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-brand-red/50 hover:text-brand-red lg:hidden"
      aria-label="חיפוש באתר"
      aria-expanded={false}
    >
      <SearchIcon />
    </button>
  );
}

export function HeaderMobileSearchBar({ onCollapse }: { onCollapse: () => void }) {
  useRenderCount("HeaderMobileSearchBar");

  return (
    <Container variant="wide" className="relative flex h-16 items-center gap-3 sm:h-[4.25rem] lg:hidden">
      <SiteSearchLazy className="flex-1" autoFocus maxResults={8} />
      <button
        type="button"
        onClick={onCollapse}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-brand-red/50 hover:text-brand-red"
        aria-label="סגירת חיפוש"
      >
        <CloseIcon />
      </button>
    </Container>
  );
}
