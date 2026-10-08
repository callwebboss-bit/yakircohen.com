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
  /** שורה אחת בלי כותרת - לכותרת הדסקטופ */
  compact?: boolean;
};

/**
 * רצועת בחירה לפי כוונה - שיר / ברכה / פודקאסט וכו'.
 * Overlay מתחת ל-SiteNav או בראש מגירת מובייל.
 */
export default function IntentNavStrip({
  className,
  onNavigate,
  heading = "מה אתם צריכים?",
  compact = false,
}: IntentNavStripProps) {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="בחירה לפי צורך"
      className={cn(className)}
    >
      {!compact && heading ? (
        <p className="mb-2 text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {heading}
        </p>
      ) : null}
      <ul
        className={cn(
          /* F-72 (7.10.2026): ה-scroller חותך (overflow-x:auto) גם את טבעת הפוקוס של
             הצ'יפ, שבולטת 4px (outline 2px + offset 2px). py-1/px-1 נותנים לה מקום,
             ו-my-1 שלילי מבטל את התוספת האנכית כדי שגובה הפס (52px) לא ישתנה. */
          compact
            ? "scroll-area-x scroll-fade-x -my-1 flex flex-nowrap gap-1.5 px-1 py-1"
            : "flex flex-wrap gap-2",
        )}
      >
        {INTENT_NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <li key={item.id} className={compact ? "shrink-0" : undefined}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-full border font-semibold transition-colors duration-200 touch-manipulation",
                  compact
                    ? "min-h-10 px-3 py-1 text-xs"
                    : "min-h-11 px-3.5 py-1.5 text-sm",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  active
                    ? "border-brand-red bg-brand-red/10 text-brand-red-text"
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
