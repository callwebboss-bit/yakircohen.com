"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  SITE_GLOBAL_LINKS,
  SITE_NAVIGATION,
  type SiteNavCategory,
} from "@/lib/site-architecture";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SiteSearch from "@/components/ui/SiteSearch";

const NAV_ICONS: Record<string, string> = {
  podcast: "🎙️",
  studio: "🎵",
  voiceover: "🎤",
  events: "🎉",
  video: "📹",
  photography: "📸",
  academy: "🎓",
  online: "🤖",
};

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

function DesktopDropdown({ category }: { category: SiteNavCategory }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const isActive =
    pathname === category.href || pathname.startsWith(`${category.href}/`);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 180); // 180ms delay before closing
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
          "inline-flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "text-brand-red"
            : "text-foreground/90 hover:bg-surface hover:text-brand-red",
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
      </button>
      {open ? (
        <div
          className="absolute start-0 top-full z-[60] mt-1.5 min-w-[18rem] max-w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-border bg-background p-2 shadow-xl"
          role="menu"
        >
          <Link
            href={category.href}
            role="menuitem"
            className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-red hover:bg-surface"
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
                    className="block rounded-lg px-3 py-2.5 text-sm text-foreground/90 transition-colors hover:bg-surface hover:text-brand-red"
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
}

function MobileAccordion({
  category,
  onNavigate,
}: {
  category: SiteNavCategory;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive =
    pathname === category.href || pathname.startsWith(`${category.href}/`);
  const icon = NAV_ICONS[category.id];

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        className={cn(
          "flex min-h-[3.75rem] w-full items-center gap-3 py-3.5 text-start",
          isActive ? "text-brand-red" : "text-foreground",
        )}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-lg" aria-hidden>
            {icon}
          </span>
        )}
        <span className="flex-1 text-base font-semibold">{category.label}</span>
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <ul className="pb-3 ps-11">
          {category.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-2 hover:bg-surface hover:text-brand-red"
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
  onToggleMenu,
}: Pick<SiteNavProps, "menuOpen" | "buttonId" | "onToggleMenu">) {
  return (
    <button
      id={buttonId}
      type="button"
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:border-brand-red/50 hover:text-brand-red lg:hidden"
      aria-expanded={menuOpen}
      aria-label={menuOpen ? "סגירת תפריט" : "פתיחת תפריט"}
      onClick={onToggleMenu}
    >
      <span className="relative block h-5 w-6" aria-hidden>
        <span
          className={cn(
            "absolute start-0 top-0 block h-0.5 w-6 bg-current transition-transform duration-300",
            menuOpen && "top-2 rotate-45",
          )}
        />
        <span
          className={cn(
            "absolute start-0 top-2 block h-0.5 w-6 bg-current transition-opacity duration-300",
            menuOpen && "opacity-0",
          )}
        />
        <span
          className={cn(
            "absolute start-0 top-4 block h-0.5 w-6 bg-current transition-transform duration-300",
            menuOpen && "top-2 -rotate-45",
          )}
        />
      </span>
    </button>
  );
}

export function SiteNavDesktop() {
  return (
    <nav
      className="flex items-center gap-0.5"
      aria-label="ניווט ראשי"
    >
      {SITE_NAVIGATION.map((cat) => (
        <DesktopDropdown key={cat.id} category={cat} />
      ))}
      <Link
        href="/blog"
        className="min-h-10 rounded-lg px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-brand-red"
      >
        מגזין
      </Link>
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
        "fixed inset-0 z-[60] flex h-dvh max-h-dvh flex-col bg-background lg:hidden",
        "transition-[opacity,visibility] duration-250",
        menuOpen
          ? "pointer-events-auto visible opacity-100"
          : "pointer-events-none invisible opacity-0",
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
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface hover:text-brand-red"
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
                className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-brand-red"
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
            className="flex min-h-[3.25rem] items-center justify-center rounded-xl border border-border bg-background text-sm font-bold transition-colors hover:border-brand-red/40 hover:text-brand-red"
            onClick={onCloseMenu}
          >
            הזמנה
          </Link>
          <Link
            href="/contact"
            className="flex min-h-[3.25rem] items-center justify-center rounded-xl bg-brand-red text-sm font-bold text-white transition-colors hover:bg-brand-red-light"
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
