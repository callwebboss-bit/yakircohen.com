"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useHeaderMenu } from "@/components/layout/header-menu-context";
import {
  HeaderMobileSearchBar,
  HeaderMobileSearchToggle,
} from "@/components/layout/HeaderMobileSearchIsland";
import { SiteNavDesktop } from "@/components/layout/SiteNav";
import {
  SiteNavMenuButtonSlot,
  SiteNavMenuIsland,
} from "@/components/layout/SiteNavMenuIsland";
import { SiteSearchLazy } from "@/components/layout/header-lazy";
import StudioLiveIndicator from "@/components/layout/StudioLiveIndicator";
import TimeGreeting from "@/components/layout/TimeGreeting";
import Container from "@/components/ui/Container";
import { SITE_LOGO_SRC, SITE_NAME } from "@/lib/constants";

function HeaderLogo() {
  const { closeMenu } = useHeaderMenu();

  return (
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
        <StudioLiveIndicator />
      </span>
      <span className="hidden min-w-0 flex-col sm:flex">
        <span className="truncate text-base font-semibold tracking-tight sm:text-lg">
          {SITE_NAME}
        </span>
        <span className="truncate text-xs text-muted-foreground transition-colors group-hover:text-brand-red/80">
          מודיעין - אולפן ואירועים
        </span>
      </span>
    </Link>
  );
}

function HeaderMainBar({
  onOpenMobileSearch,
  menuOpen,
  buttonId,
  drawerId,
  onToggleMenu,
}: {
  onOpenMobileSearch: () => void;
  menuOpen: boolean;
  buttonId: string;
  drawerId: string;
  onToggleMenu: () => void;
}) {
  return (
    <>
      <Container variant="wide" className="relative flex h-16 items-center justify-between gap-3 sm:h-[4.25rem]">
        <HeaderLogo />

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden w-52 lg:block xl:w-64">
            <SiteSearchLazy />
          </div>
          <HeaderMobileSearchToggle onExpand={onOpenMobileSearch} />
          <Link
            href="/book"
            className="hidden min-h-11 items-center rounded-lg border border-border px-3 py-2 text-sm font-semibold transition-all duration-fast ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 hover:text-[var(--service-accent,#d42b2b)] active:scale-95 md:inline-flex"
          >
            הזמנה
          </Link>
          <Link
            href="/contact"
            className="hidden min-h-11 items-center rounded-lg bg-[var(--service-accent,#d42b2b)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-fast ease-luxury hover:shadow-md active:scale-95 md:inline-flex"
          >
            צור קשר
          </Link>
          <SiteNavMenuButtonSlot
            menuOpen={menuOpen}
            buttonId={buttonId}
            drawerId={drawerId}
            onToggleMenu={onToggleMenu}
          />
        </div>
      </Container>

      <div className="hidden border-t border-border/30 lg:block">
        <Container variant="wide">
          <TimeGreeting />
        </Container>
      </div>

      <div className="hidden border-t border-border/50 lg:block">
        <Container variant="wide">
          <SiteNavDesktop />
        </Container>
      </div>
    </>
  );
}

export default function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <SiteNavMenuIsland>
      {(menu) => (
        <header
          data-pagefind-ignore
          className="relative sticky top-0 z-50 border-b border-border [contain:layout_style]"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80"
            aria-hidden
          />

          {mobileSearchOpen ? (
            <HeaderMobileSearchBar onCollapse={() => setMobileSearchOpen(false)} />
          ) : (
            <HeaderMainBar
              onOpenMobileSearch={() => setMobileSearchOpen(true)}
              menuOpen={menu.menuOpen}
              buttonId={menu.buttonId}
              drawerId={menu.drawerId}
              onToggleMenu={menu.toggleMenu}
            />
          )}
        </header>
      )}
    </SiteNavMenuIsland>
  );
}
