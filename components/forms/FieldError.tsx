"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldErrorProps = {
  /** מזהה האלמנט, בדרך כלל fieldErrorId(fieldId). נכנס ל-aria-describedby של השדה. */
  id: string;
  /** ריק או חסר: לא מרונדר כלום (כך ניקוי שגיאה כמחרוזת ריקה ממשיך לעבוד). */
  message?: string | null;
  className?: string;
  /**
   * role="alert". רק כשאין שדה שמקבל פוקוס אחרי השליחה (שגיאה של קבוצה, למשל).
   * כשהפוקוס עובר לשדה, ההודעה מוקראת דרך aria-describedby, ו-alert נוסף
   * היה מקריא אותה פעמיים. ראו focusFirstInvalidField ב-lib/scroll-to-error.ts.
   */
  announce?: boolean;
};

/**
 * הודעת שגיאה אחת לכל טפסי הלידים וההזמנות (F-10, F-11, 7.10.2026).
 * צבע text-brand-red-text (7.65:1) במקום text-red-500 (3.7:1), מזהה קבוע
 * שהשדה מפנה אליו, ו-data-field-error ש-scrollAndHighlightFirstError מחפש.
 */
export default function FieldError({ id, message, className, announce }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p
      id={id}
      data-field-error=""
      role={announce ? "alert" : undefined}
      className={cn("mt-1 text-xs text-brand-red-text", className)}
    >
      {message}
    </p>
  );
}

/**
 * מסך הצלחה שמחליף את הטופס: role="status" וטאבינדקס -1, והפוקוס עובר אליו
 * בעלייה (F-11, 7.10.2026). בלי זה הפוקוס נשאר על כפתור שנעלם, וקורא מסך לא
 * שומע שהשליחה הצליחה. אותו דפוס כמו SongCallback ב-SongOfferConfigurator.
 */
export function FocusedStatus({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      className={cn("focus:outline-none", className)}
    >
      {children}
    </div>
  );
}
