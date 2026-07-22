"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { INTENT_NAV_ITEMS } from "@/lib/data/intent-nav";
import { cn } from "@/lib/utils";

export type IntentNavStripProps = {
  className?: string;
  /** כשמוצג במגירה - סוגרים אחרי ניווט */
  onNavigate?: () => void;
  /** כותרת קצרה מעל הרצועה */
  heading?: string;
};

/**
 * רצועת בחירה לפי כוונה - שיר / ברכה / פודקאסט וכו'.
 * Overlay מתחת ל-SiteNav או בראש מגירת מובייל.
 */
export default function IntentNavStrip({
  className,
  onNavigate,
  heading = "מה אתם צריכים?",
}: IntentNavStripProps) {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="בחירה לפי צורך"
      className={cn(className)}
    >
      {heading ? (
        <p className="mb-2 text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {heading}
        </p>
      ) : null}
      <ul className="flex flex-wrap gap-2">
        {INTENT_NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  active
                    ? "border-brand-red bg-brand-red/10 text-brand-red"
                    : "border-border bg-background text-foreground hover:border-brand-red/40 hover:text-brand-red",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
