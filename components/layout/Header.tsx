"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SiteNavDesktop,
  SiteNavMenuButton,
  SiteNavMobileDrawer,
  useSiteNavMenu,
} from "@/components/layout/SiteNav";
import SiteSearch from "@/components/ui/SiteSearch";
import { SITE_LOGO_SRC, SITE_NAME } from "@/lib/constants";

export default function Header() {
  const { menuOpen, closeMenu, toggleMenu, drawerId, buttonId } =
    useSiteNavMenu();

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
        <div className="relative mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6 lg:gap-6 lg:px-8">
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

          <SiteNavDesktop />

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden w-[14rem] lg:block">
              <SiteSearch />
            </div>
            <Link
              href="/business/social-media"
              className="hidden min-h-11 items-center rounded-lg border border-border px-3 py-2 text-sm font-semibold transition-colors hover:border-brand-red/40 hover:text-brand-red xl:inline-flex"
            >
              קידום סושיאל
            </Link>
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
      </header>

      <SiteNavMobileDrawer
        menuOpen={menuOpen}
        onCloseMenu={closeMenu}
        drawerId={drawerId}
      />
    </>
  );
}
