"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useHeaderMenu } from "@/components/layout/header-menu-context";
import {
  HeaderMobileSearchBar,
  HeaderMobileSearchToggle,
} from "@/components/layout/HeaderMobileSearchIsland";
import { SiteNavDesktop } from "@/components/layout/SiteNav";
import IntentNavStrip from "@/components/layout/IntentNavStrip";
import {
  SiteNavMenuButtonSlot,
  SiteNavMenuIsland,
} from "@/components/layout/SiteNavMenuIsland";
import { SiteSearchLazy } from "@/components/layout/header-lazy";
import SearchKeyboardShortcut from "@/components/layout/SearchKeyboardShortcut";
import StudioLiveIndicator from "@/components/layout/StudioLiveIndicator";
import {
  HeaderDynamicBadgesGroupLazy,
  TimeGreetingLazy,
} from "@/components/layout/header-dynamic-badges-lazy";
import Container from "@/components/ui/Container";
import { CONTACT_PHONE_E164, SITE_LOGO_SRC, SITE_NAME } from "@/lib/constants";
import { CTA_LABELS, TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const HEADER_QUOTE_HIDE_PREFIXES = ["/contact", "/book"] as const;

/**
 * גובה פס הברכה והכוונה בדסקטופ: גבול 1px + padding 0.75rem + צ'יפ min-h-10.
 * הפס מחוץ ל-layout של ה-header (absolute), והמקום שלו שמור ב-spacer מתחת ל-header.
 * ככה ה-header לא משנה גובה בפתיחה ובסגירה, ו-scroll anchoring של Chrome לא מזיז את הגלילה
 * ולא מפעיל מחדש את useScrollDirection בלולאה.
 */
const HEADER_STRIP_HEIGHT = "h-[calc(3.25rem+1px)]";

const headerQuoteWhatsAppHref = buildWhatsAppHref({
  text: `שלום, אשמח להצעת מחיר ${TIME_CLAIMS.quoteHour}.`,
  utm_source: "website",
  utm_campaign: "header_quote_24h",
});

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

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function HeaderQuoteCta() {
  const pathname = usePathname();

  if (matchesPrefix(pathname, HEADER_QUOTE_HIDE_PREFIXES)) {
    return null;
  }

  return (
    <a
      href={headerQuoteWhatsAppHref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        /* bg-brand-red ולא גוון ה-hub. ב-hub האולפן הגוון הוא כתום #d97706, ולבן
           עליו נמדד 3.19:1, מתחת ל-AA, בכל עמוד אולפן. צבע הפעולה נשאר אדום
           בכל hub (הכרעת הבעלים 17: הגוון מפסיק לצבוע כפתורים). */
        "inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-red font-semibold text-white shadow-sm",
        "transition-all duration-fast ease-luxury hover:shadow-md active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
        "min-h-11 px-2.5 py-1.5 text-[11px] leading-tight sm:px-3 sm:text-xs md:px-4 md:text-sm",
      )}
      aria-label={`${CTA_LABELS.headerQuoteHour} בוואטסאפ`}
    >
      <span className="lg:hidden">{CTA_LABELS.headerQuoteHourShort}</span>
      <span className="hidden lg:inline">{CTA_LABELS.headerQuoteHour}</span>
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
      {/* בדיקת הלוגו 7.10.2026: בטלפון הלוגו יצא בערך 25x11 פיקסלים (ריבוע 30x30 עם
          סימן ביחס 2:1, ריפוד p-1 ורווח ריק בתוך ה-viewBox), והוא סימן המותג היחיד
          מתחת ל-640px כי שם העסק מוסתר שם. לכן תיבה מלבנית 2:1 בלי ריפוד.
          רוחב 80 אבל min-w-0 ו-shrink: נמדד באתר החי שב-375px יש ללוגו עד 114px וב-320px
          רק 59px עד הכפתורים (shrink-0), אז במסך צר התיבה מתכווצת ולא דוחפת אותם. */}
      <span className="relative flex h-10 w-20 min-w-0 shrink items-center justify-center overflow-hidden rounded-lg border border-brand-red/25 bg-surface sm:h-11 sm:w-[5.5rem]">
        {/* מעל הקפל, אז eager ולא lazy. בלי preload כדי לא להתחרות בתמונת ה-LCP.
            unoptimized: קובץ SVG מוגש ממילא כמו שהוא (next/dist/shared/lib/get-img-props.js), וכך גודל חדש
            לא יוצר גרסת /_next/image חדשה שתחזיר 402 במכסת Hobby.
            הציור תופס רק x 29.5-359 ו-y 39-183.5 מתוך 400x200 (נמדד ב-scripts/lib/brand-logo.mjs),
            כלומר יושב נמוך ב-5.6% מהגובה, אז ההזזה ממרכזת אותו בתיבה. לא מגדילים כדי לחתוך
            את השוליים: בניסוי על האתר החי הגדלה של 15% שמה את ה-Y מתחת לנקודת
            StudioLiveIndicator שבפינה. */}
        <Image
          src={SITE_LOGO_SRC}
          alt=""
          width={80}
          height={40}
          unoptimized
          className="h-full w-full translate-x-[1.4%] -translate-y-[5.6%] object-contain"
          loading="eager"
          decoding="async"
        />
        <StudioLiveIndicator />
      </span>
      {/* בין 1024 ל-1279 שורת הכפתורים בדסקטופ תופסת 838px (נמדד באתר החי), ונשארו 95-110px
          ללוגו ולשם. השם כבר היה נחתך לארבע אותיות, וליד תיבה של 88 היה נשאר ממנו רק שבר.
          לכן הוא מוסתר בטווח הזה וחוזר מ-xl, שם יש לו מקום מלא. */}
      <span className="hidden min-w-0 flex-col sm:flex lg:hidden xl:flex">
        <span className="truncate text-base font-semibold tracking-tight sm:text-lg">
          {SITE_NAME}
        </span>
        <span className="truncate text-xs text-muted-foreground transition-colors group-hover:text-brand-red-text">
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
  compactChrome,
}: {
  onOpenMobileSearch: () => void;
  menuOpen: boolean;
  buttonId: string;
  drawerId: string;
  onToggleMenu: () => void;
  compactChrome: boolean;
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
            className={cn(mobileIconButtonClass, "hidden sm:inline-flex")}
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
          <HeaderQuoteCta />
          <HeaderDynamicBadgesGroupLazy />
          <Link
            href="/book"
            className="hidden min-h-11 items-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-fast ease-luxury hover:border-brand-red/40 hover:text-brand-red active:scale-95 lg:inline-flex"
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

      <div className="hidden border-t border-border/50 lg:block">
        <Container variant="wide">
          <SiteNavDesktop />
        </Container>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-full hidden overflow-hidden lg:block",
          HEADER_STRIP_HEIGHT,
        )}
      >
        <div
          className={cn(
            "pointer-events-auto h-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80",
            "transition-transform duration-300 ease-luxury motion-reduce:transition-none",
            compactChrome ? "-translate-y-full" : "translate-y-0",
          )}
        >
          <div className="h-full bg-surface/40">
            <Container variant="wide" className="flex items-center gap-4 py-1.5">
              <TimeGreetingLazy compact className="min-w-0 flex-1 py-1" />
              <IntentNavStrip compact className="max-w-[58%] shrink-0" />
            </Container>
          </div>
        </div>
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
        const compactChrome = hidden;
        return (
        <>
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
          {mobileSearchOpen ? (
            <HeaderMobileSearchBar onCollapse={() => setMobileSearchOpen(false)} />
          ) : (
            <HeaderMainBar
              onOpenMobileSearch={() => setMobileSearchOpen(true)}
              menuOpen={menu.menuOpen}
              buttonId={menu.buttonId}
              drawerId={menu.drawerId}
              onToggleMenu={menu.toggleMenu}
              compactChrome={compactChrome}
            />
          )}
        </header>
        <div aria-hidden className={cn("hidden lg:block", HEADER_STRIP_HEIGHT)} />
        </>
        );
      }}
    </SiteNavMenuIsland>
  );
}
