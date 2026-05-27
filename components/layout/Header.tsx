"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  SiteNavDesktop,
  SiteNavMenuButton,
  SiteNavMobileDrawer,
  useSiteNavMenu,
} from "@/components/layout/SiteNav";
import SiteSearch from "@/components/ui/SiteSearch";
import { SITE_LOGO_SRC, SITE_NAME } from "@/lib/constants";

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

export default function Header() {
  const { menuOpen, closeMenu, toggleMenu, drawerId, buttonId } =
    useSiteNavMenu();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header
        data-pagefind-ignore
        className="relative sticky top-0 z-50 border-b border-border"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85"
          aria-hidden
        />

        {/* ── Mobile / tablet search row (replaces first row when open) ── */}
        {searchOpen ? (
          <div className="relative mx-auto flex h-16 max-w-[88rem] items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:hidden">
            <SiteSearch className="flex-1" autoFocus maxResults={8} />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-brand-red/50 hover:text-brand-red"
              aria-label="סגירת חיפוש"
            >
              <CloseIcon />
            </button>
          </div>
        ) : (
          <>
            {/* ── Row 1: Logo + actions ── */}
            <div className="relative mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
              <Link
                href="/"
                className="group flex min-w-0 shrink items-center gap-2.5 leading-tight sm:gap-3"
                onClick={closeMenu}
                aria-label={`${SITE_NAME} - דף הבית`}
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-brand-red/25 bg-surface p-1 sm:h-11 sm:w-11">
                  <Image
                    src={SITE_LOGO_SRC}
                    alt=""
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                    priority
                  />
                </span>
                <span className="hidden min-w-0 flex-col sm:flex">
                  <span className="truncate text-base font-semibold tracking-tight sm:text-lg">
                    {SITE_NAME}
                  </span>
                  <span className="truncate text-xs text-muted-foreground transition-colors group-hover:text-brand-red/80">
                    מודיעין · אולפן ואירועים
                  </span>
                </span>
              </Link>

              <div className="flex shrink-0 items-center gap-2">
                {/* Desktop search */}
                <div className="hidden w-52 lg:block xl:w-64">
                  <SiteSearch />
                </div>
                {/* Mobile / tablet search toggle */}
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-brand-red/50 hover:text-brand-red lg:hidden"
                  aria-label="חיפוש שירות"
                >
                  <SearchIcon />
                </button>
                <Link
                  href="/book"
                  className="hidden min-h-11 items-center rounded-lg border border-border px-3 py-2 text-sm font-semibold transition-colors hover:border-brand-red/40 hover:text-brand-red md:inline-flex"
                >
                  הזמנה
                </Link>
                <Link
                  href="/contact"
                  className="hidden min-h-11 items-center rounded-lg bg-brand-red px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-red-light md:inline-flex"
                >
                  צור קשר
                </Link>
                <SiteNavMenuButton
                  menuOpen={menuOpen}
                  buttonId={buttonId}
                  onToggleMenu={toggleMenu}
                />
              </div>
            </div>

            {/* ── Row 2: Desktop navigation bar ── */}
            <div className="hidden border-t border-border/50 lg:block">
              <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <SiteNavDesktop />
              </div>
            </div>
          </>
        )}
      </header>

      <SiteNavMobileDrawer
        menuOpen={menuOpen}
        onCloseMenu={closeMenu}
        drawerId={drawerId}
      />
    </>
  );
}
