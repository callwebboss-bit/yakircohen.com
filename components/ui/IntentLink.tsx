"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * קישור שנטען מראש רק כשיש כוונה: ריחוף, נגיעה או פוקוס מהמקלדת (11.10.2026).
 *
 * למה: <Link> רגיל טוען מראש עמוד סטטי שלם ברגע שהוא נכנס למסך. ביקור אחד
 * ב-/studio עם גלילה לסוף שלח 92 בקשות ברקע ל-48 עמודים אחרים (3.86MB, נמדד
 * באתר החי 11.10.2026), ורוב הקישורים בפוטר ובתפריט. כל בקשה שמפספסת את ה-CDN
 * נספרת ב-Vercel כ-ISR Read, ביחידות של 8KB, ו-ISR Reads הגיע ל-1.5 מיליון.
 *
 * הדפוס הרשמי של Next.js, "Hover-triggered prefetch"
 * (nextjs.org/docs/app/guides/prefetching#hover-triggered-prefetch):
 * prefetch={false} עד שיש כוונה, ואז null שמחזיר את ברירת המחדל. הוספנו נגיעה
 * (מובייל, אין ריחוף) ופוקוס (מקלדת), כדי שגם שם המעבר יהיה מהיר.
 *
 * אותם props בדיוק כמו next/link, כך שאפשר להחליף ייבוא בלי לגעת בשימושים.
 * prefetch לא מתקבל מבחוץ (נחסם בטיפוס): כל המטרה היא שלא ייטען מראש לפני כוונה.
 */
export default function IntentLink({
  onMouseEnter,
  onTouchStart,
  onFocus,
  ...props
}: Omit<ComponentProps<typeof Link>, "prefetch">) {
  const [active, setActive] = useState(false);

  return (
    <Link
      {...props}
      prefetch={active ? null : false}
      onMouseEnter={(e) => {
        setActive(true);
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        setActive(true);
        onTouchStart?.(e);
      }}
      onFocus={(e) => {
        setActive(true);
        onFocus?.(e);
      }}
    />
  );
}
