"use client";

import { useEffect, useRef, type RefObject } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   useModalA11y: ניהול מיקוד וגלילה משותף לחלונות role="dialog" aria-modal.

   נולד ב-7.10.2026 מהממצא F-18 בדוח הנגישות: Koalendar, הדגמת הטופס החכם,
   חלון כוונת היציאה, מגירת התוספות וחלון היוטיוב של המשאפ הכריזו על דיאלוג
   מודאלי בלי להזיז מיקוד, בלי לולאת Tab, בלי החזרת מיקוד ובלי נעילת גלילה.

   מה ה-hook עושה בזמן שהחלון פתוח:
   1. מזיז מיקוד לפקד הראשון בחלון (או לחלון עצמו, ראו initialFocus).
   2. Tab ו-Shift+Tab מסתובבים בתוך החלון.
   3. מלכודת גיבוי ב-focusin למקרה שהמיקוד יוצא בלי מקש Tab שאנחנו רואים
      (למשל Tab שיוצא מתוך iframe של יוטיוב).
   4. Escape קורא ל-onEscape, רק לחלון העליון כשכמה חלונות פתוחים יחד.
   5. נועל גלילת body במונה הפניות (lockBodyScroll), כך ששני שכבות לא מוחקות
      זו את הנעילה של זו.
   6. בסגירה מחזיר מיקוד לכפתור שפתח את החלון, אם הוא עדיין בעץ.

   אין inert על אחים: החלונות האלה (והלייטבוקס) לא מרונדרים בפורטל, ולכן
   inert על main היה משתק גם את החלון עצמו.
   ───────────────────────────────────────────────────────────────────────────── */

/* ── Tab loop: הגיון טהור (נבדק ב-useModalA11y.test.ts) ───────────────────── */

/**
 * לאיזה אינדקס להעביר מיקוד כשנלחץ Tab, או null כשסדר ה-Tab הטבעי של הדפדפן
 * נכון ואין מה להתערב.
 *
 * - count: כמה פקדים ניתנים למיקוד יש בחלון.
 * - activeIndex: האינדקס של האלמנט הממוקד ברשימה, או -1 אם הוא מחוץ לרשימה
 *   (body, חלון עצמו, או דף שמאחורי החלון).
 */
export function nextTrapIndex(
  count: number,
  activeIndex: number,
  shift: boolean,
): number | null {
  if (count <= 0) return null;
  if (activeIndex < 0 || activeIndex >= count) return shift ? count - 1 : 0;
  if (shift) return activeIndex === 0 ? count - 1 : null;
  return activeIndex === count - 1 ? 0 : null;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "iframe",
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** פקדים נראים וניתנים למיקוד בתוך container, בסדר ה-DOM. */
export function getFocusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (el) =>
      el.tabIndex >= 0 &&
      !el.hasAttribute("aria-hidden") &&
      el.getClientRects().length > 0 &&
      getComputedStyle(el).visibility !== "hidden",
  );
}

/**
 * מטפל במקש Tab בתוך חלון מודאלי. מחזיר true כשהוא עצר את ברירת המחדל
 * והעביר מיקוד בעצמו. נקרא גם מהלייטבוקס של MediaGallery מתוך handleKey שלו.
 */
export function trapTabKey(
  e: KeyboardEvent,
  container: HTMLElement | null,
): boolean {
  if (e.key !== "Tab" || !container) return false;

  const list = getFocusableWithin(container);
  if (list.length === 0) {
    // אין מה למקד: שומרים את המיקוד על החלון עצמו במקום לדלוג לדף שמאחור.
    e.preventDefault();
    container.focus();
    return true;
  }

  const active = document.activeElement;
  const index = active instanceof HTMLElement ? list.indexOf(active) : -1;
  // מיקוד על אלמנט בתוך החלון שאינו ברשימה (tabindex=-1 וכד'): ה-Tab הטבעי
  // יודע להמשיך ממנו. כשהמיקוד על החלון עצמו או מחוצה לו מושכים פנימה.
  if (
    index === -1 &&
    active instanceof HTMLElement &&
    active !== container &&
    container.contains(active)
  ) {
    return false;
  }

  const target = nextTrapIndex(list.length, index, e.shiftKey);
  if (target === null) return false;
  e.preventDefault();
  list[target].focus();
  return true;
}

/* ── נעילת גלילת body עם מונה פניות ───────────────────────────────────────── */

/**
 * "overflow": overflow:hidden בלבד. הגלילה התכנותית (scrollIntoView) ממשיכה
 * לעבוד, ולכן זה הברירת מחדל לחלונות שהאשף קורא להם באמצע זרימה.
 * "fixed": גם position:fixed עם top שלילי, כדי שהדף לא יקפוץ ולא יגלול ב-iOS
 * (הלייטבוקס של הגלריה, כמו שהיה לפני F-18). בסיום חוזרים לאותה נקודת גלילה.
 */
export type ScrollLockMode = "overflow" | "fixed";

type LockStyle = {
  overflow: string;
  position: string;
  top: string;
  width: string;
};

export function createScrollLock(
  target: { style: LockStyle },
  win: {
    readonly scrollY: number;
    scrollTo: (options: ScrollToOptions) => void;
  },
) {
  const holders = new Map<object, ScrollLockMode>();
  let saved: LockStyle | null = null;
  let fixedY: number | null = null;

  function sync() {
    const style = target.style;
    let needFixed = false;
    for (const mode of holders.values()) if (mode === "fixed") needFixed = true;
    let scrollBackTo: number | null = null;

    if (holders.size > 0 && saved === null) {
      // הפנייה הראשונה שומרת את הערכים הקודמים. לא מוחקים cssText שלם:
      // זה היה מוחק גם נעילה של שכבה אחרת (F-18).
      saved = {
        overflow: style.overflow,
        position: style.position,
        top: style.top,
        width: style.width,
      };
      style.overflow = "hidden";
    }

    if (needFixed && fixedY === null) {
      fixedY = win.scrollY;
      style.position = "fixed";
      style.top = `-${fixedY}px`;
      style.width = "100%";
    } else if (!needFixed && fixedY !== null && saved !== null) {
      style.position = saved.position;
      style.top = saved.top;
      style.width = saved.width;
      scrollBackTo = fixedY;
      fixedY = null;
    }

    if (holders.size === 0 && saved !== null) {
      style.overflow = saved.overflow;
      saved = null;
    }

    // html מוגדר scroll-behavior:smooth, ולכן בלי instant החזרת הגלילה הייתה
    // מונפשת מראש הדף.
    if (scrollBackTo !== null) {
      win.scrollTo({ top: scrollBackTo, left: 0, behavior: "instant" });
    }
  }

  return {
    /** נועל. מחזיר פונקציית שחרור, בטוחה לקריאה כפולה. */
    acquire(mode: ScrollLockMode = "overflow"): () => void {
      const token = {};
      holders.set(token, mode);
      sync();
      let released = false;
      return () => {
        if (released) return;
        released = true;
        holders.delete(token);
        sync();
      };
    },
    /** כמה נעילות פעילות כרגע. */
    count: () => holders.size,
  };
}

let bodyScrollLock: ReturnType<typeof createScrollLock> | null = null;

/** נעילת גלילה משותפת ל-document.body. מחזיר פונקציית שחרור. */
export function lockBodyScroll(mode: ScrollLockMode = "overflow"): () => void {
  if (typeof document === "undefined") return () => {};
  bodyScrollLock ??= createScrollLock(document.body, window);
  return bodyScrollLock.acquire(mode);
}

/* ── ה-hook ───────────────────────────────────────────────────────────────── */

/** חלונות פתוחים לפי סדר הפתיחה; רק האחרון מגיב למקלדת ולמלכודת. */
const modalStack: object[] = [];

export type ModalA11yOptions = {
  /** החלון מוצג כרגע (לא רק mounted). */
  active: boolean;
  /** נקרא ב-Escape. הרכיב מעביר את ה-onClose שלו. */
  onEscape?: () => void;
  /**
   * "first": הפקד הראשון בחלון (ברירת מחדל).
   * "container": החלון עצמו, כשפקד ראשון עלול להיות מופעל בטעות על ידי מקש
   * שהמשתמש עוד מקליד (חלון כוונת יציאה באמצע מילוי טופס).
   */
  initialFocus?: "first" | "container";
  /** נעילת גלילת body (ברירת מחדל: כן). */
  lockScroll?: boolean;
};

/**
 * מחזיר ref שיש לשים על אלמנט הדיאלוג (או על הפאנל שבתוכו, אם יש מחוץ לפאנל
 * כפתורי רקע שלא אמורים להיות עצירת Tab).
 */
export function useModalA11y<T extends HTMLElement = HTMLDivElement>({
  active,
  onEscape,
  initialFocus = "first",
  lockScroll = true,
}: ModalA11yOptions): RefObject<T | null> {
  const containerRef = useRef<T>(null);

  // ה-onClose של ההורים הוא לרוב חץ חדש בכל רינדור. שומרים אותו ב-ref כדי
  // שה-effect הראשי (נעילה, מיקוד, החזרה) ירוץ רק כש-active משתנה.
  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) return undefined;

    const token = {};
    modalStack.push(token);
    const isTop = () => modalStack[modalStack.length - 1] === token;

    const doc = document;
    const opener =
      doc.activeElement instanceof HTMLElement &&
      doc.activeElement !== doc.body
        ? doc.activeElement
        : null;
    const unlockScroll = lockScroll ? lockBodyScroll() : null;

    const container = containerRef.current;
    if (container) {
      if (initialFocus === "container") {
        if (!container.hasAttribute("tabindex")) container.tabIndex = -1;
        container.focus();
      } else {
        (getFocusableWithin(container)[0] ?? container).focus();
      }
    }

    // פוקוס שהגיע מלחיצת עכבר (למשל על כפתור הרקע של המגירה) לא נמשך חזרה.
    let pointerFocus = false;
    const onPointerDown = () => {
      pointerFocus = true;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      pointerFocus = false;
      if (!isTop()) return;
      if (e.key === "Escape") {
        onEscapeRef.current?.();
        return;
      }
      trapTabKey(e, containerRef.current);
    };
    // גיבוי: מיקוד שיצא מהחלון בלי ש-keydown ראינו (Tab שיוצא מ-iframe).
    // המשיכה חזרה נדחית פריים אחד: כשחלון נסגר בלחיצה על "המשך" והאשף ממקד
    // את השלב בו בזמן, החלון כבר נעלם עד אז, וההחזרה לא דורסת את המיקוד שלו.
    let pullFrame = 0;
    const onFocusIn = (e: FocusEvent) => {
      const el = containerRef.current;
      if (pointerFocus || !isTop() || !el) return;
      if (!(e.target instanceof Node) || el.contains(e.target)) return;
      cancelAnimationFrame(pullFrame);
      pullFrame = requestAnimationFrame(() => {
        const now = containerRef.current;
        if (!now || !isTop()) return;
        const current = doc.activeElement;
        if (current && now.contains(current)) return;
        (getFocusableWithin(now)[0] ?? now).focus();
      });
    };

    doc.addEventListener("pointerdown", onPointerDown, true);
    doc.addEventListener("keydown", onKeyDown);
    doc.addEventListener("focusin", onFocusIn);

    return () => {
      doc.removeEventListener("pointerdown", onPointerDown, true);
      doc.removeEventListener("keydown", onKeyDown);
      doc.removeEventListener("focusin", onFocusIn);
      cancelAnimationFrame(pullFrame);
      const at = modalStack.indexOf(token);
      if (at !== -1) modalStack.splice(at, 1);
      unlockScroll?.();

      // מחזירים מיקוד רק אם הוא עדיין "אבוד" (body) או בתוך החלון שנסגר.
      // אם קוד אחר כבר מיקד משהו (כמו גלילה ומיקוד לשלב באשף) לא דורסים אותו.
      const current = doc.activeElement;
      const orphaned =
        !current ||
        current === doc.body ||
        (container !== null && container.contains(current));
      if (opener && opener.isConnected && orphaned) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [active, initialFocus, lockScroll]);

  return containerRef;
}
