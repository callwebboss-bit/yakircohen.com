"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePastFold } from "@/hooks/useScrollDirection";
import { getMobileDecisiveNav } from "@/lib/mobile-sticky-context";
import { cn } from "@/lib/utils";

/** דפים עם sticky ייעודי / טופס - לא לכפול. /admin הוא כלי פנימי, הסרגל מסתיר בו כרטיסים. */
const HIDE_PREFIXES = ["/contact", "/book", "/pricing", "/admin"] as const;

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * ניווט החלטתי במובייל: מחירון · הזמנה · דף שירות (hub).
 * WhatsApp נשאר ב-FAB - לא כאן.
 */
export default function MobileStickyCta() {
  const pathname = usePathname() ?? "/";
  const pastFold = usePastFold();

  if (matchesPrefix(pathname, HIDE_PREFIXES)) {
    return null;
  }

  const { pricingHref, bookHref, serviceHref, serviceLabel } =
    getMobileDecisiveNav(pathname);

  /* F-73 (7.10.2026): כל תא מתחיל משליש מהסרגל, יכול לגדול ולא קטן מהתווית שלו, והשורה
     עוטפת כשהשלושה לא נכנסים. קודם grid-cols-3 נתן ~39px לתא ב-320px ו-~56px ב-375px,
     וה-truncate חתך תוויות כמו "אירועים" ו"פודקאסט". תווית היא מילה אחת ולא נשברת בתוך
     התא, אז במסך צר התא האחרון יורד לשורה שנייה והטקסט נשאר שלם (1.4.10). px-1 ולא px-2:
     הריפוד הקטן מוריד את רוחב המינימום של התא, כך שברוב רוחבי הטלפון (360-412px) הסרגל
     נשאר בשורה אחת, וירידה לשורה שנייה קורית רק בצר מאוד או בתווית ארוכה. בשורה
     אחת התאים נשארים שלישים שווים, כך שהמראה לא משתנה.
     ב-hover הטקסט בצבע ה-ink של ה-hub (F-04), לא בגוון הגולמי. */
  const cellClass = "grow basis-[calc((100%_-_0.75rem)/3)]";

  const secondaryClass = cn(
    cellClass,
    "inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full border border-border bg-surface px-1 text-center text-sm font-semibold text-foreground",
    "transition-[color,border-color,transform] duration-fast ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 hover:text-[var(--service-accent-ink,var(--color-brand-red))] active:scale-[0.97]",
  );

  return (
    <div
      className={cn(
        "mobile-sticky-cta fixed inset-x-[5.5rem] bottom-[calc(env(safe-area-inset-bottom)_+_0.75rem)] z-40 overflow-hidden rounded-2xl border border-catalog-gold/30 bg-background/95 shadow-[0_8px_24px_rgb(0_0_0_/_0.12)] backdrop-blur-sm transition-opacity duration-300 md:hidden",
        /* במסך הראשון ה-CTA של העמוד עצמו חשוב יותר. הסרגל מופיע אחרי גלילה קלה. */
        !pastFold && "invisible opacity-0 pointer-events-none",
      )}
      data-lead-surface="mobile_sticky"
      role="navigation"
      aria-label="ניווט מהיר"
    >
      <div className="mx-auto flex max-w-lg flex-wrap gap-1.5 px-2 py-2">
        <Link href={pricingHref} className={secondaryClass}>
          מחירון
        </Link>
        <Link
          href={bookHref}
          className={cn(
            cellClass,
            /* bg-brand-red ולא גוון ה-hub. באולפן הגוון הוא כתום #d97706, ולבן
               עליו נמדד 3.19:1, מתחת ל-AA. צבע הפעולה נשאר אדום בכל hub. */
            "inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full bg-brand-red px-1 text-center text-sm font-semibold text-white",
            "transition-transform duration-fast ease-luxury active:scale-[0.97]",
          )}
        >
          הזמנה
        </Link>
        <Link href={serviceHref} className={secondaryClass}>
          {serviceLabel}
        </Link>
      </div>
    </div>
  );
}
