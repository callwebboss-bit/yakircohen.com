"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMobileDecisiveNav } from "@/lib/mobile-sticky-context";
import { cn } from "@/lib/utils";

/** דפים עם sticky ייעודי / טופס — לא לכפול */
const HIDE_PREFIXES = ["/contact", "/book", "/pricing"] as const;

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * ניווט החלטתי במובייל: מחירון · הזמנה · דף שירות (hub).
 * WhatsApp נשאר ב-FAB — לא כאן.
 */
export default function MobileStickyCta() {
  const pathname = usePathname() ?? "/";

  if (matchesPrefix(pathname, HIDE_PREFIXES)) {
    return null;
  }

  const { pricingHref, bookHref, serviceHref, serviceLabel } =
    getMobileDecisiveNav(pathname);

  const secondaryClass = cn(
    "inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full border border-border bg-surface px-2 text-sm font-semibold text-foreground",
    "transition-[color,border-color,transform] duration-fast ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 hover:text-[var(--service-accent,#d42b2b)] active:scale-[0.97]",
  );

  return (
    <div
      className="mobile-sticky-cta fixed inset-x-[5.5rem] bottom-[calc(env(safe-area-inset-bottom)_+_0.75rem)] z-40 overflow-hidden rounded-2xl border border-catalog-gold/30 bg-background/95 shadow-[0_8px_24px_rgb(0_0_0_/_0.12)] backdrop-blur-sm transition-opacity duration-300 md:hidden"
      role="navigation"
      aria-label="ניווט מהיר"
    >
      <div className="flex items-center justify-between gap-2 px-3 pt-1.5">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-catalog-gold">
          עכשיו
        </span>
        <span className="h-1 w-8 rounded-full bg-border" aria-hidden="true" />
      </div>
      <div className="h-px w-full bg-[var(--service-accent,#d42b2b)]" aria-hidden="true" />
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-1.5 px-2 py-2">
        <Link href={pricingHref} className={secondaryClass}>
          מחירון
        </Link>
        <Link
          href={bookHref}
          className={cn(
            "inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full bg-[var(--service-accent,#d42b2b)] px-2 text-sm font-semibold text-white",
            "transition-transform duration-fast ease-luxury active:scale-[0.97]",
          )}
        >
          הזמנה
        </Link>
        <Link href={serviceHref} className={cn(secondaryClass, "truncate")}>
          {serviceLabel}
        </Link>
      </div>
    </div>
  );
}
