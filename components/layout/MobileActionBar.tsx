"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { useKeyboardOpen } from "@/hooks/useKeyboardOpen";
import { usePastFold } from "@/hooks/useScrollDirection";
import { hasMobileActionBar } from "@/lib/action-bar-routes";
import { trackConversion } from "@/lib/analytics/conversion-events";
import {
  getMobileDecisiveNav,
  getMobileStickyCtaContext,
} from "@/lib/mobile-sticky-context";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/* תגית מחיר. אין כזו ב-components/ui/Icons.tsx, ובשלב 9 היא עוברת ל-sprite האחיד */
function PriceTagIcon() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.82 8.82a2 2 0 0 0 2.82 0l7.18-7.18a2 2 0 0 0 0-2.82z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

/* גובה אחיד: כל שלוש הפעולות הן תא באותו גובה (--action-bar-h, ב-globals.css),
   כך ש"הפעולה הראשית" מובחנת בצבע ולא בגודל. הפס מתחיל ב-safe-area של המכשיר.
   תופס את כל תחתית המסך במובייל ולכן אלמנטים צפים אחרים מוסיפים --float-inset. */
const cellClass =
  "flex h-[var(--action-bar-h)] touch-manipulation flex-col items-center justify-center gap-0.5 text-xs font-semibold leading-tight transition-colors duration-fast active:bg-foreground/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-red";

/**
 * פס פעולה יחיד לתחתית המסך במובייל: וואטסאפ, מחירון, הזמנה. מחליף את הכפתור
 * הצף של וואטסאפ, את הכפתור הצף של שליחת קובץ ואת הסרגל הדביק (MobileStickyCta).
 * בדסקטופ הפס לא קיים וכפתור הוואטסאפ הצף נשאר (FloatingFabs).
 *
 * התאים לפי בחירת הבעלים, 11.10.2026 (תוכנית הבהירות, שלב 1): הענף
 * feature/popup-manager שם "שלחו קובץ" באמצע, והבעלים בחר במחירון, כי זו
 * השאלה שכמעט כל לקוח שואל. "מחירון" קופץ לבלוק המחיר בעמוד עצמו בעמודי DJ
 * ואירועים, כמו בסרגל הקודם (getMobileDecisiveNav).
 */
export default function MobileActionBar() {
  const pathname = usePathname() ?? "/";
  const keyboardOpen = useKeyboardOpen();
  const pastFold = usePastFold();

  if (!hasMobileActionBar(pathname)) return null;

  const context = getMobileStickyCtaContext(pathname);
  const { pricingHref, bookHref } = getMobileDecisiveNav(pathname);
  const whatsAppHref = buildWhatsAppHref({
    text: context.text,
    utm_source: "website",
    utm_campaign: context.utm_campaign,
  });

  return (
    <nav
      aria-label="ניווט מהיר"
      aria-hidden={keyboardOpen || undefined}
      inert={keyboardOpen}
      data-lead-surface="mobile_action_bar"
      className={cn(
        "mobile-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md md:hidden",
        "transition-transform duration-200 ease-luxury motion-reduce:transition-none",
        keyboardOpen && "pointer-events-none translate-y-full",
        /* במסך הראשון ה-CTA של העמוד עצמו חשוב יותר (החלטת 7.10, 9f143ac1). רק
           נראות, בלי שינוי פריסה: --float-inset נשאר יציב, ולכן אין קפיצה. */
        !pastFold && "invisible opacity-0 pointer-events-none",
      )}
    >
      <ul className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
        <li>
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            data-lead-tracked
            onClick={() =>
              trackConversion("whatsapp_fab_click", {
                campaign: context.utm_campaign,
                surface: "mobile_action_bar",
              })
            }
            className={cn(cellClass, "text-foreground")}
          >
            <WhatsAppIcon size={22} />
            <span>וואטסאפ</span>
          </a>
        </li>
        <li>
          <Link
            href={pricingHref}
            className={cn(cellClass, "text-foreground")}
          >
            <PriceTagIcon />
            <span>מחירון</span>
          </Link>
        </li>
        <li>
          <Link
            href={bookHref}
            className={cn(
              cellClass,
              /* bg-brand-red ולא גוון ה-hub. באולפן הגוון הוא כתום #d97706, ולבן
                 עליו נמדד 3.19:1, מתחת ל-AA. צבע הפעולה נשאר אדום בכל hub. */
              "bg-brand-red text-white active:bg-brand-red-dark",
            )}
          >
            <CalendarIcon size={22} />
            <span>הזמנה</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
