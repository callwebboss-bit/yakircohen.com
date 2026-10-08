"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollableTableProps = {
  /** שם הטבלה בעברית. נשמע כשהמקלדת מגיעה לאזור הגלילה, למשל "טבלת השוואה: ..." */
  label: string;
  className?: string;
  children: ReactNode;
};

/** הפרש של פיקסל אחד הוא עיגול של הדפדפן ולא גלילה אמיתית */
const OVERFLOW_TOLERANCE_PX = 1;

/**
 * עוטף טבלה רחבה בגלילה אופקית (F-22, ביקורת נגישות 7.10.2026).
 *
 * אזור גלילה בלי אלמנט שמקבל פוקוס לא נגיש למקלדת ב-Safari, ובלי שם הוא
 * מוקרא כ"קבוצה" אנונימית. כשהטבלה באמת גולשת (scrollWidth > clientWidth)
 * האזור מקבל tabIndex, role="region" ושם, וטבעת פוקוס. כשהיא נכנסת במלואה
 * הוא נשאר div רגיל, כדי שלא יתווספו עצירות טאב ו-landmarks מיותרים.
 *
 * ה-HTML מהשרת זהה תמיד (בלי תכונות הנגישות): המדידה רצה רק בלקוח, מתוך
 * callback של ResizeObserver, ולכן אין הבדל בין SSR להידרציה.
 */
export default function ScrollableTable({
  label,
  className,
  children,
}: ScrollableTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const measure = () => {
      setOverflowing(el.scrollWidth - el.clientWidth > OVERFLOW_TOLERANCE_PX);
    };
    const observer = new ResizeObserver(measure);
    // האזור עצמו (שינוי רוחב מסך) והטבלה שבתוכו (שינוי תוכן או גופן)
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-x-auto",
        overflowing &&
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
        className,
      )}
      {...(overflowing
        ? { tabIndex: 0, role: "region", "aria-label": label }
        : null)}
    >
      {children}
    </div>
  );
}
