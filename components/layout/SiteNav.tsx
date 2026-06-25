"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import {
  SITE_GLOBAL_LINKS,
  SITE_NAVIGATION,
  HEADER_PRIMARY_NAV,
  HEADER_MORE_SERVICES_NAV,
  getHeaderNavActiveCategory,
  isHeaderNavLinkActive,
  getCategoryForPath,
  type SiteNavCategory,
} from "@/lib/site-architecture";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SiteSearch from "@/components/ui/SiteSearch";


const SERVICE_PICKER_ITEMS = [
  { href: "/studio/recording-song-modiin", label: "🎤 הקלטת שיר" },
  { href: "/podcast", label: "🎙️ פודקאסט" },
  { href: "/events/dj-events", label: "🎧 DJ לחתונה" },
  { href: "/events/attractions", label: "✨ אטרקציות" },
  { href: "/online", label: "🤖 שירותי AI" },
  { href: "/business", label: "🏢 לעסקים" },
] as const;

function ServicePickerDropdown() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "group relative inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-fast ease-luxury active:scale-95",
          open
            ? "bg-surface text-brand-red"
            : "bg-brand-red/8 text-brand-red hover:bg-brand-red/15",
        )}
      >
        בחרו שירות
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div
          className="absolute start-0 top-full z-[60] mt-1.5 min-w-[13rem] rounded-xl border border-border bg-background p-1.5 shadow-xl"
          role="menu"
        >
          {SERVICE_PICKER_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/90 transition-all duration-fast hover:bg-surface hover:text-brand-red active:scale-[0.98]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden
      className={cn(
        "shrink-0 transition-transform duration-200",
        open && "rotate-180",
      )}
    >
      <path
        fill="currentColor"
        d="M4 6l4 4 4-4"
      />
    </svg>
  );
}

const DesktopDropdown = memo(function DesktopDropdown({
  category,
  isActive,
}: {
  category: SiteNavCategory;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Coarse-pointer devices (tablets, phones) use click only - no hover logic
  const isHoverDevice = () =>
    typeof window !== "undefined" &&
    !window.matchMedia("(pointer: coarse)").matches;

  const handleMouseEnter = useCallback(() => {
    if (!isHoverDevice()) return;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isHoverDevice()) return;
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 180);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={cn(
          "group relative inline-flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-fast ease-luxury active:scale-95",
          isActive
            ? "text-[var(--service-accent,#d42b2b)]"
            : "text-foreground/90 hover:bg-surface hover:text-[var(--service-accent,#d42b2b)]",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => {
          clearTimeout(closeTimeoutRef.current!);
          setOpen((v) => !v);
        }}
      >
        {category.label}
        <ChevronIcon open={open} />
        <span
          className={cn(
            "pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full bg-[var(--service-accent,#d42b2b)] transition-transform duration-normal ease-luxury group-hover:scale-x-100",
            (isActive || open) && "scale-x-100",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          className="absolute start-0 top-full z-[60] mt-1.5 min-w-[20rem] max-w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-border bg-background p-2 shadow-xl"
          role="menu"
        >
          {category.featured && category.featured.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-1.5 px-1 pb-2 pt-1">
                {category.featured.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-surface px-2 py-2 text-center text-xs font-semibold text-foreground/90 transition-colors duration-fast hover:bg-[var(--service-accent,#d42b2b)]/8 hover:text-[var(--service-accent,#d42b2b)] active:scale-[0.97]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mx-1 mb-1 border-t border-border/40" />
            </>
          ) : null}
          <Link
            href={category.href}
            role="menuitem"
            className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--service-accent,#d42b2b)] transition-all duration-fast ease-luxury hover:bg-surface active:scale-[0.98]"
            onClick={() => setOpen(false)}
          >
            {category.label} - סקירה
          </Link>
          <ul className="mt-1 max-h-[min(calc(100dvh-7rem),36rem)] overflow-y-auto overscroll-contain pe-0.5 [scrollbar-gutter:stable]">
            {category.children
              .filter((c) => c.href !== category.href)
              .map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    role="menuitem"
                    className="block rounded-lg px-3 py-2.5 text-sm text-foreground/90 transition-all duration-fast ease-luxury hover:bg-surface hover:text-[var(--service-accent,#d42b2b)] active:scale-[0.98]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">{child.label}</span>
                    {child.description ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {child.description}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
});

function MobileAccordion({
  category,
  onNavigate,
}: {
  category: SiteNavCategory;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeCategory = getCategoryForPath(pathname);
  const isActive = activeCategory?.id === category.id;

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        className={cn(
          "flex min-h-[3.75rem] w-full items-center gap-3 py-3.5 text-start transition-all duration-fast ease-luxury active:scale-[0.98]",
          isActive ? "text-[var(--service-accent,#d42b2b)]" : "text-foreground",
        )}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex-1 text-base font-semibold">{category.label}</span>
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <ul className="pb-3 ps-4">
          {category.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-2 transition-all duration-fast ease-luxury hover:bg-surface hover:text-brand-red active:scale-[0.97]"
                onClick={onNavigate}
              >
                <span className="text-sm font-medium text-foreground">{child.label}</span>
                {child.description ? (
                  <span className="mt-0.5 text-xs text-muted-foreground">{child.description}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export type SiteNavProps = {
  menuOpen: boolean;
  onCloseMenu: () => void;
  drawerId: string;
  buttonId: string;
  onToggleMenu: () => void;
};

export function SiteNavMenuButton({
  menuOpen,
  buttonId,
  drawerId,
  onToggleMenu,
}: Pick<SiteNavProps, "menuOpen" | "buttonId" | "drawerId" | "onToggleMenu">) {
  return (
    <button
      id={buttonId}
      type="button"
      className="touch-target inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-all duration-fast ease-luxury hover:border-brand-red/50 hover:text-brand-red active:scale-95 lg:hidden"
      aria-expanded={menuOpen}
      aria-controls={drawerId}
      aria-label={menuOpen ? "סגירת תפריט" : "פתיחת תפריט"}
      onClick={onToggleMenu}
    >
      <span className="relative block h-5 w-6" aria-hidden>
        <span
          className={cn(
            "absolute start-0 top-0 block h-0.5 w-6 bg-current transition-transform duration-normal ease-luxury",
            menuOpen && "top-2 rotate-45",
          )}
        />
        <span
          className={cn(
            "absolute start-0 top-2 block h-0.5 w-6 bg-current transition-opacity duration-normal ease-luxury",
            menuOpen && "opacity-0",
          )}
        />
        <span
          className={cn(
            "absolute start-0 top-4 block h-0.5 w-6 bg-current transition-transform duration-normal ease-luxury",
            menuOpen && "top-2 -rotate-45",
          )}
        />
      </span>
    </button>
  );
}

function DesktopSearchButton() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label="חיפוש באתר"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-fast ease-luxury active:scale-95",
          open
            ? "bg-surface text-[var(--service-accent,#d42b2b)]"
            : "text-foreground/70 hover:bg-surface hover:text-[var(--service-accent,#d42b2b)]",
        )}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-[60] mt-1.5 w-80 rounded-xl border border-border bg-background p-3 shadow-xl">
          <SiteSearch
            autoFocus
            placeholder="חיפוש שירות, מאמר..."
            inputId="desktop-search-input"
          />
        </div>
      ) : null}
    </div>
  );
}

export function SiteNavDesktop() {
  const pathname = usePathname();
  const activeCategory = getHeaderNavActiveCategory(pathname);

  const headerLinkClass = (href: string) =>
    cn(
      "group relative min-h-10 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-fast ease-luxury active:scale-95 xl:px-3",
      isHeaderNavLinkActive(href, pathname)
        ? "text-[var(--service-accent,#d42b2b)]"
        : "text-foreground/90 hover:text-[var(--service-accent,#d42b2b)]",
    );

  return (
    <nav
      className="flex items-center gap-0.5"
      aria-label="ניווט ראשי"
    >
      <ServicePickerDropdown />
      <span aria-hidden className="mx-1 h-4 w-px bg-border" />
      {HEADER_PRIMARY_NAV.map((entry) =>
        entry.kind === "dropdown" ? (
          <DesktopDropdown
            key={entry.category.id}
            category={entry.category}
            isActive={activeCategory?.id === entry.category.id}
          />
        ) : (
          <Link
            key={entry.href}
            href={entry.href}
            className={headerLinkClass(entry.href)}
          >
            {entry.label}
            <span
              className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full bg-[var(--service-accent,#d42b2b)] transition-transform duration-normal ease-luxury group-hover:scale-x-100"
              aria-hidden
            />
          </Link>
        ),
      )}
      <DesktopDropdown
        category={HEADER_MORE_SERVICES_NAV}
        isActive={
          activeCategory?.id === HEADER_MORE_SERVICES_NAV.id ||
          activeCategory?.id === "academy" ||
          activeCategory?.id === "business" ||
          activeCategory?.id === "online" ||
          activeCategory?.id === "video" ||
          activeCategory?.id === "photography"
        }
      />
      <Link
        href="/start"
        className="group relative min-h-10 rounded-lg px-3 py-2 text-sm font-medium text-foreground/90 transition-all duration-fast ease-luxury hover:text-[var(--service-accent,#d42b2b)] active:scale-95"
      >
        איך זה עובד
        <span
          className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full bg-[var(--service-accent,#d42b2b)] transition-transform duration-normal ease-luxury group-hover:scale-x-100"
          aria-hidden
        />
      </Link>
      <Link
        href="/blog"
        className="group relative min-h-10 rounded-lg px-3 py-2 text-sm font-medium text-foreground/90 transition-all duration-fast ease-luxury hover:text-[var(--service-accent,#d42b2b)] active:scale-95"
      >
        מגזין
        <span
          className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full bg-[var(--service-accent,#d42b2b)] transition-transform duration-normal ease-luxury group-hover:scale-x-100"
          aria-hidden
        />
      </Link>
      <DesktopSearchButton />
    </nav>
  );
}

export function SiteNavMobileDrawer({
  menuOpen,
  onCloseMenu,
  drawerId,
}: Pick<SiteNavProps, "menuOpen" | "onCloseMenu" | "drawerId">) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusable = panel
      ? Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute("aria-hidden"))
      : [];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseMenu();
        return;
      }
      if (e.key !== "Tab" || focusable.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, onCloseMenu]);

  return (
    <div
      id={drawerId}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!menuOpen}
      className={cn(
        "fixed inset-0 z-[60] flex h-dvh max-h-dvh flex-col bg-background shadow-lg lg:hidden",
        "transition-[opacity,transform,visibility] duration-normal ease-luxury",
        menuOpen
          ? "pointer-events-auto visible translate-y-0 scale-100 opacity-100"
          : "pointer-events-none invisible translate-y-4 scale-[0.98] opacity-0",
      )}
    >
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-foreground"
          onClick={onCloseMenu}
          aria-label="דף הבית"
        >
          {SITE_NAME}
        </Link>
        <button
          type="button"
          onClick={onCloseMenu}
          className="touch-target flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-all duration-fast ease-luxury hover:bg-surface hover:text-brand-red active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          aria-label="סגירת תפריט"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── Scrollable body (min-h-0 required for flex scroll) ── */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
        <div className="mb-4">
          <SiteSearch />
        </div>
        <p className="mb-3 text-xs font-bold tracking-[0.22em] text-muted-foreground uppercase">
          שירותים
        </p>
        {SITE_NAVIGATION.map((cat) => (
          <MobileAccordion
            key={cat.id}
            category={cat}
            onNavigate={onCloseMenu}
          />
        ))}
        <div className="mt-6 border-t border-border pt-5 pb-2">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-muted-foreground uppercase">
            כללי
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SITE_GLOBAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-fast ease-luxury hover:bg-surface hover:text-brand-red active:scale-[0.97]"
                onClick={onCloseMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/blog"
              className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-brand-red"
              onClick={onCloseMenu}
            >
              מגזין
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer CTAs ── */}
      <div className="shrink-0 border-t border-border bg-surface/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-5">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/book"
            className="flex min-h-[3.25rem] items-center justify-center rounded-xl border border-border bg-background text-sm font-bold transition-all duration-fast ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 hover:text-[var(--service-accent,#d42b2b)] active:scale-[0.97]"
            onClick={onCloseMenu}
          >
            הזמנה
          </Link>
          <Link
            href="/contact"
            className="flex min-h-[3.25rem] items-center justify-center rounded-xl bg-[var(--service-accent,#d42b2b)] text-sm font-bold text-white transition-all duration-fast ease-luxury active:scale-[0.97]"
            onClick={onCloseMenu}
          >
            צור קשר
          </Link>
        </div>
      </div>
    </div>
  );
}

export function useSiteNavMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerId = useId();
  const buttonId = useId();
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  return { menuOpen, closeMenu, toggleMenu, drawerId, buttonId };
}
