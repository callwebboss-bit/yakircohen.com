"use client";

import { useRef, type KeyboardEvent } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   useTabs: מודל המקלדת של רכיב tablist (APG), משותף לכל ווידג'טי הטאבים.

   נולד ב-7.10.2026 מהממצא F-70 בדוח הנגישות. בחמשת הווידג'טים (AudienceTabs,
   DjHubCockpitTabs, SingerEventGuideTabs, PricingTierToggle,
   VocalFixPricingBlock) חיצי המקלדת או שלא עשו כלום, או שבחרו טאב בלי להזיז
   אליו את המיקוד, כך שהמיקוד נשאר על הטאב הישן וחישוב החץ הבא יצא מהמקום הלא נכון.

   מה ה-hook נותן לכל טאב (getTabProps):
   - tabIndex מתגלגל: רק הטאב הנבחר ב-Tab, השאר ב-tabIndex=-1.
   - ArrowRight/ArrowLeft מתחשבים בכיוון הכתיבה. ב-RTL, ArrowLeft מוביל לטאב
     הבא ב-DOM (שמוצג משמאל) ו-ArrowRight לקודם; ב-LTR להפך. סיבוב בקצוות.
   - Home ו-End קופצים לראשון ולאחרון.
   - הטאב החדש נבחר (onSelect) וגם מקבל מיקוד (focus), כך שהחץ הבא מחושב ממנו.
   - Enter ורווח ממשיכים לעבוד דרך click הרגיל של הכפתור.

   האינדקס לחישוב הוא של הטאב שקיבל את המקש (לא selectedIndex), ולכן ווידג'ט
   שמחליף תוכן באיחור (עמעום של 120ms ב-AudienceTabs) לא מחשב מנתון ישן.
   ───────────────────────────────────────────────────────────────────────────── */

export type TabsDirection = "ltr" | "rtl";

/**
 * לאיזה אינדקס לעבור כשנלחץ מקש על טאב, או null כשזה לא מקש ניווט של טאבים.
 *
 * - current: האינדקס של הטאב הממוקד.
 * - count: כמה טאבים יש.
 * - dir: כיוון הכתיבה של הרשימה. ב-RTL הטאב הראשון ב-DOM הוא הימני ביותר.
 */
export function nextTabIndex(
  key: string,
  current: number,
  count: number,
  dir: TabsDirection,
): number | null {
  if (count <= 0 || !Number.isInteger(current)) return null;
  switch (key) {
    case "Home":
      return 0;
    case "End":
      return count - 1;
    case "ArrowRight":
      return wrap(current + (dir === "rtl" ? -1 : 1), count);
    case "ArrowLeft":
      return wrap(current + (dir === "rtl" ? 1 : -1), count);
    default:
      return null;
  }
}

function wrap(index: number, count: number): number {
  return ((index % count) + count) % count;
}

export type UseTabsOptions = {
  /** כמה טאבים יש ברשימה. */
  count: number;
  /** האינדקס הנבחר כרגע. */
  selectedIndex: number;
  /** נקרא כשמקש ניווט בוחר טאב אחר. הרכיב מחליף את הנבחר כמו ב-click. */
  onSelect: (index: number) => void;
};

/**
 * שימוש: על כל כפתור role="tab" פורסים {...getTabProps(i)}. הרכיב ממשיך
 * לקבוע בעצמו role, id, aria-selected, aria-controls ו-onClick.
 */
export function useTabs({ count, selectedIndex, onSelect }: UseTabsOptions) {
  const tabRefs = useRef<Array<HTMLElement | null>>([]);
  // בלי נבחר תקף (רשימה ריקה, אינדקס מחוץ לטווח) הטאב הראשון נשאר ב-Tab.
  const rovingIndex =
    selectedIndex >= 0 && selectedIndex < count ? selectedIndex : 0;

  function getTabProps(index: number) {
    return {
      ref: (el: HTMLElement | null) => {
        tabRefs.current[index] = el;
      },
      tabIndex: index === rovingIndex ? 0 : -1,
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        // Alt+חץ הוא "אחורה" בדפדפן, ושילובי Ctrl/Cmd שייכים למערכת.
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        const dir: TabsDirection =
          getComputedStyle(e.currentTarget).direction === "rtl" ? "rtl" : "ltr";
        const next = nextTabIndex(e.key, index, count, dir);
        if (next === null) return;
        e.preventDefault();
        if (next !== index) onSelect(next);
        tabRefs.current[next]?.focus();
      },
    };
  }

  return { getTabProps };
}
