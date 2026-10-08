"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import {
  SITE_GLOBAL_LINKS,
  HEADER_PRIMARY_NAV,
  HEADER_MORE_SERVICES_NAV,
  getMobileNavSections,
  getHeaderNavActiveCategory,
  isHeaderNavLinkActive,
  getCategoryForPath,
  type SiteNavCategory,
} from "@/lib/site-architecture";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SiteSearch from "@/components/ui/SiteSearch";
import IntentNavStrip from "@/components/layout/IntentNavStrip";


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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // F-04 (7.10.2026): טקסט ניווט פעיל והובר, וסרגל התחתון, בצבע --service-accent-ink
  // ולא בגוון הגולמי: כתום 3.04, ציאן 2.32, ירוק 3.60 על #fafaf8, מתחת ל-4.5.
  // ה-fallback הוא האדום של המותג, כך שבית, מחירון ויצירת קשר לא משתנים.
  // F-15 (7.10.2026): תבנית disclosure ולא menu. הפאנל נטען רק כשהוא פתוח,
  // ולכן aria-controls מוצג רק אז ולא מצביע על id שאינו קיים.
  const panelId = useId();

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
    const closeNow = () => {
      setOpen(false);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) closeNow();
    };
    // F-24 (7.10.2026): Escape סוגר גם תפריט שנפתח ב-hover. הפוקוס חוזר
    // לכפתור רק אם הוא היה בתוך ה-wrapper, כדי לא לגזול אותו ממקום אחר.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const focusWasInside = wrapRef.current?.contains(document.activeElement);
      closeNow();
      if (focusWasInside) triggerRef.current?.focus();
    };
    // F-24: Tab החוצה סוגר את התפריט. focusin על ה-document ולא focusout על
    // ה-wrapper: ב-Safari ו-Firefox במק לחיצה על קישור לא ממקדת אותו, ו-focusout
    // עם relatedTarget=null היה מוחק את התפריט באמצע הלחיצה ובולע אותה.
    const onFocusIn = (e: FocusEvent) => {
      if (e.target instanceof Node && !wrapRef.current?.contains(e.target)) {
        closeNow();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "group relative inline-flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-fast ease-luxury active:scale-95",
          isActive
            ? "text-[var(--service-accent-ink,var(--color-brand-red))]"
            : "text-foreground/90 hover:bg-surface hover:text-[var(--service-accent-ink,var(--color-brand-red))]",
        )}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => {
          clearTimeout(closeTimeoutRef.current!);
          setOpen((v) => !v);
        }}
      >
        {category.label}
        <ChevronIcon open={open} />
        <span
          className={cn(
            "pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full bg-[var(--service-accent-ink,var(--color-brand-red))] transition-transform duration-normal ease-luxury group-hover:scale-x-100",
            (isActive || open) && "scale-x-100",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={panelId}
          className="absolute start-0 top-full z-[60] mt-1.5 min-w-[20rem] max-w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-border bg-background p-2 shadow-xl"
        >
          {category.featured && category.featured.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-1.5 px-1 pb-2 pt-1">
                {category.featured.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-surface px-2 py-2 text-center text-xs font-semibold text-foreground/90 transition-colors duration-fast hover:bg-[var(--service-accent,#d42b2b)]/8 hover:text-[var(--service-accent-ink,var(--color-brand-red))] active:scale-[0.97]"
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
            className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--service-accent-ink,var(--color-brand-red))] transition-all duration-fast ease-luxury hover:bg-surface active:scale-[0.98]"
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
                    className="block rounded-lg px-3 py-2.5 text-sm text-foreground/90 transition-all duration-fast ease-luxury hover:bg-surface hover:text-[var(--service-accent-ink,var(--color-brand-red))] active:scale-[0.98]"
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
          isActive ? "text-[var(--service-accent-ink,var(--color-brand-red))]" : "text-foreground",
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // F-25 (7.10.2026): הפופאובר נמחק מה-DOM עם הפוקוס בתוכו, והפוקוס נופל
      // ל-body. חוזרים לכפתור רק אם הפוקוס היה בתוך ה-wrapper.
      const focusWasInside = wrapRef.current?.contains(document.activeElement);
      setOpen(false);
      if (focusWasInside) triggerRef.current?.focus();
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
        ref={triggerRef}
        type="button"
        aria-label="חיפוש באתר"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-fast ease-luxury active:scale-95",
          open
            ? "bg-surface text-[var(--service-accent-ink,var(--color-brand-red))]"
            : "text-foreground/70 hover:bg-surface hover:text-[var(--service-accent-ink,var(--color-brand-red))]",
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
        ? "text-[var(--service-accent-ink,var(--color-brand-red))]"
        : "text-foreground/90 hover:text-[var(--service-accent-ink,var(--color-brand-red))]",
    );

  return (
    <nav
      className="flex items-center gap-0.5"
      aria-label="ניווט ראשי"
    >
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
              className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full bg-[var(--service-accent-ink,var(--color-brand-red))] transition-transform duration-normal ease-luxury group-hover:scale-x-100"
              aria-hidden
            />
          </Link>
        ),
      )}
      <DesktopDropdown
        category={HEADER_MORE_SERVICES_NAV}
        isActive={activeCategory?.id === HEADER_MORE_SERVICES_NAV.id}
      />
      <DesktopSearchButton />
    </nav>
  );
}

function MobileFeaturedGrid({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mb-6">
      <IntentNavStrip onNavigate={onNavigate} heading="מה אתם צריכים?" />
    </div>
  );
}

export function SiteNavMobileDrawer({
  menuOpen,
  onCloseMenu,
  drawerId,
  buttonId,
}: Pick<SiteNavProps, "menuOpen" | "onCloseMenu" | "drawerId" | "buttonId">) {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const { primary, secondary } = getMobileNavSections();

  // F-25 (7.10.2026): סגירה בכפתור X או ב-Esc מחזירה את הפוקוס לכפתור ההמבורגר,
  // כי הדרואר נמחק עם הפוקוס בתוכו והוא נופל ל-body. ההחזרה לא יושבת ב-cleanup
  // של ה-effect: ה-cleanup רץ גם בלחיצה על קישור (מעבר עמוד), ושם הפוקוס
  // צריך להישאר על העמוד החדש. fallback לפי id: ב-Safari במק לחיצה על כפתור
  // לא ממקדת אותו, ואז activeElement בפתיחה הוא body.
  const closeAndRestoreFocus = useCallback(() => {
    onCloseMenu();
    const opener = openerRef.current?.isConnected
      ? openerRef.current
      : document.getElementById(buttonId);
    opener?.focus();
  }, [onCloseMenu, buttonId]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    // שומרים את הפותח לפני שהפוקוס עובר לתוך הדרואר. התנאי panel.contains
    // מגן מפני הרצה חוזרת של ה-effect (StrictMode) אחרי שהפוקוס כבר בפנים.
    const active = document.activeElement;
    if (
      !openerRef.current &&
      active instanceof HTMLElement &&
      active !== document.body &&
      !panel?.contains(active)
    ) {
      openerRef.current = active;
    }
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
        closeAndRestoreFocus();
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
  }, [menuOpen, closeAndRestoreFocus]);

  return (
    <div
      id={drawerId}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="תפריט האתר"
      aria-hidden={!menuOpen}
      inert={!menuOpen}
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
          aria-label={`${SITE_NAME} - דף הבית`}
        >
          {SITE_NAME}
        </Link>
        <button
          type="button"
          onClick={closeAndRestoreFocus}
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
        <MobileFeaturedGrid onNavigate={onCloseMenu} />
        <p className="mb-3 text-xs font-bold tracking-[0.22em] text-muted-foreground uppercase">
          שירותים עיקריים
        </p>
        {primary.map((cat) => (
          <MobileAccordion
            key={cat.id}
            category={cat}
            onNavigate={onCloseMenu}
          />
        ))}
        <p className="mb-3 mt-4 text-xs font-bold tracking-[0.22em] text-muted-foreground uppercase">
          כל השירותים
        </p>
        {secondary.map((cat) => (
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
            className="flex min-h-[3.25rem] items-center justify-center rounded-xl border border-border bg-background text-sm font-bold transition-all duration-fast ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 hover:text-[var(--service-accent-ink,var(--color-brand-red))] active:scale-[0.97]"
            onClick={onCloseMenu}
          >
            הזמנה
          </Link>
          {/* F-05 (7.10.2026): bg-brand-red ולא גוון ה-hub, כמו ב-MobileStickyCta. לבן על
              הגוון הגולמי נמדד 2.42 (ציאן) עד 3.76:1, מתחת ל-4.5. */}
          <Link
            href="/contact"
            className="flex min-h-[3.25rem] items-center justify-center rounded-xl bg-brand-red text-sm font-bold text-white transition-all duration-fast ease-luxury active:scale-[0.97]"
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
