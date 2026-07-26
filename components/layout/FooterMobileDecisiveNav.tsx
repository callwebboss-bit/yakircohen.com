"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMobileDecisiveNav } from "@/lib/mobile-sticky-context";
import { CTA_LABELS } from "@/lib/data/conversion-copy";

/**
 * רצועת החלטה בראש הפוטר במובייל — מחירון / הזמנה / hub.
 * md:hidden; לא מחליף את מפת האתר ל-SEO.
 */
export default function FooterMobileDecisiveNav() {
  const pathname = usePathname() ?? "/";
  const { pricingHref, bookHref, serviceHref, serviceLabel } =
    getMobileDecisiveNav(pathname);

  const items = [
    { href: pricingHref, label: "מחירון" },
    { href: bookHref, label: CTA_LABELS.bookOnline },
    { href: serviceHref, label: serviceLabel },
  ] as const;

  return (
    <nav
      className="mb-8 md:hidden"
      aria-label="ניווט מהיר בפוטר"
    >
      <p className="text-sm font-semibold text-[var(--footer-fg)]">התחילו כאן</p>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[var(--footer-border)] bg-white/5 px-2 text-center text-xs font-semibold text-[var(--footer-fg)] transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
