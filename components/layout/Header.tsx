"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useScrollDirection";
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
import SearchKeyboardShortcut from "@/components/layout/SearchKeyboardShortcut";
import StudioLiveIndicator from "@/components/layout/StudioLiveIndicator";
import TimeGreeting from "@/components/layout/TimeGreeting";
import PromoBanner from "@/components/layout/PromoBanner";
import Container from "@/components/ui/Container";
import {
  CONTACT_PHONE_E164,
  SITE_LOGO_SRC,
  SITE_NAME,
} from "@/lib/constants";
import { isLikelyAvailableForWhatsApp } from "@/lib/business-hours";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const headerWhatsAppHref = buildWhatsAppHref({
  text: "שלום, אשמח לשמוע על השירותים שלכם.",
  utm_source: "website",
  utm_campaign: "header_wa_badge",
});

function subscribeAvailability() {
  return () => {};
}

function getAvailabilitySnapshot() {
  return isLikelyAvailableForWhatsApp();
}

function getAvailabilityServerSnapshot() {
  return true;
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 4h3l1.5 5-2 1.2a11 11 0 005.8 5.8L18 14l5 1.5v3a2 2 0 01-2.1 2 17.5 17.5 0 01-14.4-14.4A2 2 0 016.5 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WhatsAppAvailabilityBadge() {
  const available = useSyncExternalStore(
    subscribeAvailability,
    getAvailabilitySnapshot,
    getAvailabilityServerSnapshot,
  );

  return (
    <a
      href={headerWhatsAppHref}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-green-500/40 hover:text-foreground lg:flex"
      aria-label={available ? "זמין עכשיו בוואטסאפ" : "חוזרים תוך כמה דק' בוואטסאפ"}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${available ? "bg-green-500" : "bg-yellow-500"}`}
        aria-hidden
      />
      {available ? "זמין עכשיו בוואטסאפ" : "חוזרים תוך כמה דק'"}
    </a>
  );
}

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
          אולפן, DJ, פודקאסט ואטרקציות
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
  const mobileIconButtonClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background text-foreground/80 transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red md:hidden";

  return (
    <>
      <Container variant="wide" className="relative flex h-16 items-center justify-between gap-3 sm:h-[4.25rem]">
        <HeaderLogo />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden w-52 lg:block xl:w-64">
            <SiteSearchLazy />
          </div>
          <HeaderMobileSearchToggle onExpand={onOpenMobileSearch} />
          <a
            href={`tel:${CONTACT_PHONE_E164}`}
            className={mobileIconButtonClass}
            aria-label="חיוג מהיר"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>
          <Link
            href="/book"
            className={cn(mobileIconButtonClass, "bg-brand-red/10 text-brand-red hover:bg-brand-red/15")}
            aria-label="הזמנה מקוונת"
          >
            <CalendarIcon className="h-5 w-5" />
          </Link>
          <WhatsAppAvailabilityBadge />
          <Link
            href="/book"
            className="hidden min-h-11 items-center rounded-lg bg-[var(--service-accent,#d42b2b)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-fast ease-luxury hover:shadow-md active:scale-95 md:inline-flex"
          >
            הזמינו
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
  const scrollDir = useScrollDirection(8);

  return (
    <SiteNavMenuIsland>
      {(menu) => {
        const hidden =
          scrollDir === "down" && !menu.menuOpen && !mobileSearchOpen;
        return (
        <header
          data-pagefind-ignore
          className={cn(
            "relative sticky top-0 z-50 border-b border-border [contain:layout_style]",
            "transition-transform duration-300 ease-[var(--ease-luxury)]",
            hidden && "max-md:-translate-y-full",
          )}
        >
          <SearchKeyboardShortcut />
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80"
            aria-hidden
          />
          <PromoBanner />

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
        );
      }}
    </SiteNavMenuIsland>
  );
}
