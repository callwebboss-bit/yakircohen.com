"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MATANOT_EVENT_CARDS } from "@/lib/data/matanot-page";
import { claimBottomSlot, releaseBottomSlot } from "@/lib/bottom-overlay-slot";
import { trackConversion } from "@/lib/analytics/conversion-events";

/**
 * מאתר מתנה - עוזר קצר ולא-פולשני שמחליף את פופ-אפ הקופון העונתי.
 *
 * תיאום עם שאר ה-UI התחתון:
 * - תופס את המשבצת המשותפת (bottom-overlay-slot) כדי שלא ייערם עם סרגלים אחרים.
 * - ממוקם ב-bottom-28 ומרחף מעל מקבץ ה-FAB והסרגל הדביק במקום לכסות אותם, כך
 *   שכפתור הוואטסאפ וווידג'ט הנגישות נשארים גלויים ולחיצים. עדיף למקם נכון
 *   מאשר להסתיר UI קיים, ולכן אין כאן דגל CSS להסתרה.
 * - עמודים עם סרגל CTA תחתון משלהם מוחרגים ב-HIDE_PREFIXES.
 * - נסגר ומחזיר את המשבצת בכל ניווט, כדי שלא יחזיק אותה לכל הסשן.
 */

const LS_SNOOZE = "yc_gift_finder_snooze";
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000; // 3 ימים
const SHOW_DELAY_MS = 8000;
const SCROLL_MIN = 0.2;

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

function isSnoozed(): boolean {
  try {
    const raw = localStorage.getItem(LS_SNOOZE);
    return raw ? Date.now() < Number(raw) : false;
  } catch {
    return false;
  }
}

function setSnooze(): void {
  try {
    localStorage.setItem(LS_SNOOZE, String(Date.now() + SNOOZE_MS));
  } catch {
    /* ignore */
  }
}

export default function GiftFinderPopup() {
  const pathname = usePathname() ?? "/";
  const [visible, setVisible] = useState(false);
  const triggeredRef = useRef(false);
  const lastPathRef = useRef(pathname);
  const rootRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const headingId = useId();

  const pathHidden =
    HIDE_EXACT.includes(pathname) ||
    HIDE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  /** מסתיר ומחזיר את המשבצת בלי לשרוף את ה-snooze */
  const retire = useCallback(() => {
    setVisible(false);
    releaseBottomSlot("gift");
  }, []);

  const close = useCallback(
    (reason: "dismiss" | "navigate") => {
      const owned = rootRef.current?.contains(document.activeElement) ?? false;
      setSnooze();
      retire();
      trackConversion("gift_finder_close", { reason });
      if (reason === "dismiss" && owned) previousFocusRef.current?.focus?.();
    },
    [retire],
  );

  /* טריגר: מזרימים טיימר רק אחרי שהגולש גלל מספיק, והמאזין מסיר את עצמו. */
  useEffect(() => {
    if (pathHidden || triggeredRef.current || isSnoozed()) return undefined;
    let timer = 0;
    let rafId = 0;
    const arm = () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        if (triggeredRef.current || !claimBottomSlot("gift")) return;
        triggeredRef.current = true;
        previousFocusRef.current = document.activeElement as HTMLElement;
        setVisible(true);
        trackConversion("gift_finder_show", {});
      }, SHOW_DELAY_MS);
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
        if (window.scrollY / max >= SCROLL_MIN) {
          window.removeEventListener("scroll", onScroll);
          arm();
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) window.clearTimeout(timer);
      /* בלי ביטול ה-rAF, callback שנותר בתור יכול לדרוך טיימר חדש שה-cleanup
         כבר לא יכול לנקות - וזה היה מדליק את הדגל בלי פופ-אפ על המסך. */
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [pathHidden, pathname]);

  /* בכל ניווט: להחזיר את המשבצת במקום להחזיק אותה לכל הסשן */
  useEffect(() => {
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;
    retire();
  }, [pathname, retire]);

  /* שחרור בטיחות ב-unmount */
  useEffect(() => () => releaseBottomSlot("gift"), []);

  /* Escape רק כשהפוקוס בתוך הפופ-אפ, כדי לא לחטוף Escape מהעמוד */
  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (!rootRef.current?.contains(document.activeElement)) return;
      close("dismiss");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, close]);

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
      className="fixed inset-x-4 bottom-28 z-50 rounded-2xl border border-catalog-gold/40 bg-surface p-4 shadow-lg sm:inset-x-auto sm:start-4 sm:max-w-sm"
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
