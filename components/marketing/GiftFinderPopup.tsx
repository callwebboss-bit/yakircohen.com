"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef } from "react";
import { useEscapeLayer } from "@/hooks/useEscapeLayer";
import { MATANOT_EVENT_CARDS } from "@/lib/data/matanot-page";
import { usePopupSlot } from "@/hooks/usePopupSlot";
import { isQuietRoute } from "@/lib/action-bar-routes";
import { trackConversion } from "@/lib/analytics/conversion-events";

/**
 * מאתר מתנה - עוזר קצר ולא-פולשני שמחליף את פופ-אפ הקופון העונתי.
 *
 * התזמון (25 שניות או 40 אחוז גלילה), "אחד לביקור", ההסתרה במובייל בזמן מילוי
 * טופס והסגירה ל-30 יום מנוהלים ב-lib/popup-manager.ts. הרכיב מחליט רק באילו
 * עמודים הוא מועמד ומה הוא מציג.
 *
 * - במובייל הוא יושב מעל פס הפעולה התחתון (--float-inset), ובדסקטופ מעל כפתור
 *   הוואטסאפ, כך שאף אחד מהם לא מכוסה.
 * - עמודים עם סרגל CTA תחתון משלהם מוחרגים ב-HIDE_PREFIXES.
 * - נעלם בכל ניווט, כדי שלא יישאר על המסך בעמוד שלא הוצג בו.
 */

/** "/" מוחרג כי בעמוד הבית כבר יש סקשן מתנות עם אותו מסר */
const HIDE_EXACT = ["/"];
/* כולל עמודים שיש להם סרגל CTA תחתון משלהם - לא להתחרות בהמרה הראשית שלהם */
const HIDE_PREFIXES = [
  "/matanot",
  "/book",
  "/contact",
  "/admin",
  "/pricing",
  "/photography",
  "/studio/recording-song-modiin",
];

export default function GiftFinderPopup() {
  const pathname = usePathname() ?? "/";
  const lastPathRef = useRef(pathname);
  const rootRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const showTrackedRef = useRef(false);
  const headingId = useId();

  const pathHidden =
    isQuietRoute(pathname) ||
    HIDE_EXACT.includes(pathname) ||
    HIDE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const { visible, dismiss, release } = usePopupSlot("gift", {
    enabled: !pathHidden,
    priority: 20,
  });

  const close = useCallback(
    (reason: "dismiss" | "navigate") => {
      const owned = rootRef.current?.contains(document.activeElement) ?? false;
      dismiss();
      trackConversion("gift_finder_close", { reason });
      if (reason === "dismiss" && owned) previousFocusRef.current?.focus?.();
    },
    [dismiss],
  );

  /* הצגה נמדדת פעם אחת, גם אם הפופאפ הוסתר וחזר בזמן מילוי טופס */
  useEffect(() => {
    if (!visible || showTrackedRef.current) return;
    showTrackedRef.current = true;
    previousFocusRef.current = document.activeElement as HTMLElement;
    trackConversion("gift_finder_show", {});
  }, [visible]);

  /* בכל ניווט: משחררים את המשבצת בלי לשמור סגירה */
  useEffect(() => {
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;
    release();
  }, [pathname, release]);

  /* Escape מכל מקום בעמוד (F-74). לפני כן רק כשהפוקוס בתוך הפופ-אפ, אבל הוא
     אחרון ב-DOM ולא מקבל מיקוד, כך שמשתמש מקלדת הגיע אליו רק אחרי כל העמוד.
     הוויתור על שער המיקוד בטוח רק בגלל מחסנית השכבות: הפופ-אפ הוא שכבת רקע,
     ולכן Escape של תפריט, צ'אט, פאנל או חלון מודאלי פתוחים לא סוגר אותו ולא
     שורף לו snooze של 3 ימים, וגם לא כשהמיקוד בשדה טקסט. אין סגירה
     אוטומטית בשום מקרה אחר: רק מקש Escape מפורש. */
  useEscapeLayer({
    active: visible && !pathHidden,
    onEscape: () => close("dismiss"),
    ambient: true,
  });

  if (!visible || pathHidden) return null;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-labelledby={headingId}
      data-testid="gift-finder-popup"
      dir="rtl"
      /* bottom-28 בכל הרזולוציות: מרחף מעל מקבץ ה-FAB והסרגל הדביק במקום לכסות
         אותם, כך שכפתור הוואטסאפ נשאר גלוי ולחיץ ואין צורך להסתיר שום דבר. */
      className="fixed inset-x-4 bottom-[calc(var(--float-inset)+7rem)] z-50 rounded-2xl border border-catalog-gold/40 bg-surface p-4 shadow-lg sm:inset-x-auto sm:start-4 sm:max-w-sm"
    >
      <button
        type="button"
        onClick={() => close("dismiss")}
        aria-label="סגירת מאתר המתנות"
        className="absolute end-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <span className="text-2xl" aria-hidden>
        🎁
      </span>
      <p id={headingId} className="mt-1 text-base font-semibold text-foreground">
        מחפשים לעשות מתנה?
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        מתנה מוקלטת לפי סוג האירוע - שיר, ברכה או פודקאסט אישי. בחרו אירוע:
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {MATANOT_EVENT_CARDS.slice(0, 5).map((event) => (
          <li key={event.id}>
            <Link
              href={`/matanot#${event.id}`}
              onClick={() => close("navigate")}
              className="inline-flex rounded-full border border-catalog-gold/40 bg-catalog-gold/10 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-catalog-gold/20"
            >
              {event.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/matanot"
        onClick={() => close("navigate")}
        className="mt-3 inline-block text-sm font-semibold text-brand-red hover:underline"
      >
        לכל רעיונות המתנה
      </Link>
    </div>
  );
}
