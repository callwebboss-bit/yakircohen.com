"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import AccessibilityToggle from "@/components/ui/AccessibilityToggle";
import ChatWidget from "@/components/ui/ChatWidget";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import { usePastFold, useScrollDirection } from "@/hooks/useScrollDirection";
import {
  hasMobileActionBar,
  isQuietRoute,
  matchesRoutePrefix,
} from "@/lib/action-bar-routes";
import { cn } from "@/lib/utils";

/** Routes with their own bottom CTA / sticky bar - hide duplicate floating WhatsApp. */
const HIDE_FLOATING_WHATSAPP_PREFIXES = ["/contact", "/book", "/admin"] as const;

/** Chat widget only on conversion surfaces - skip content-heavy paths. */
/** /admin: כלי פנימי של יקיר, הכפתורים ללקוחות רק מסתירים בו כרטיסים. */
const HIDE_CHAT_PREFIXES = [
  "/admin",
  "/blog",
  "/gallery",
  "/portfolio",
  "/privacy",
  "/terms",
  "/accessibility",
  "/sustainability",
] as const;

/** Calculator and contact flows need FABs lifted above sticky UI.
 *  /pricing (11.10.2026): לעמוד יש סרגל תחתון משלו (PricingStickyBookCta), ובנייד
 *  הנגישות והוואטסאפ כיסו את "הזמנה מקוונת" (נמדד באתר החי, בהירות שלב 1). */
const ELEVATED_FLOATING_PREFIXES = [
  "/contact",
  "/book",
  "/pricing",
  "/events/attractions",
  "/events/dj-events",
] as const;

/* כל מיקום תחתון כאן מוסיף את --float-inset (globals.css): פס הפעולה התחתון
   במובייל, או 0 בדסקטופ ובעמוד בלי פס. כך הכפתורים יושבים מעליו ולא מתחתיו.
   (בהירות שלב 1, 11.10.2026, מתוך feature/popup-manager של 7.10.2026.) */
const BASE_BOTTOM = "bottom-[calc(var(--float-inset)+1.5rem)] sm:bottom-8";
const ELEVATED_BOTTOM =
  "bottom-[calc(var(--float-inset)+5.5rem)] sm:bottom-[6.5rem]";

/* F-02 (7.10.2026): הכפתורים נעלמים בגלילה למטה אבל נשארים בסדר הטאב, ולכן
   כפתור ממוקד היה בלתי נראה (2.4.7). כל מי שמחזיק פוקוס חוזר להיות גלוי.
   כשהמחלקה יושבת על האלמנט הממוקד עצמו (<a> של וואטסאפ) זה
   focus-visible, וכשהיא יושבת על עטיפה (הצ'אט) זה focus-within.
   לא inert, aria-hidden או visibility:hidden: הם מוציאים את הכפתור מסדר
   הטאב ומפעילים את aria-hidden-focus. */
const scrollHideOnFocusable =
  "opacity-0 pointer-events-none translate-y-2 focus-visible:opacity-100 focus-visible:pointer-events-auto focus-visible:translate-y-0";
const scrollHideOnWrapper =
  "opacity-0 pointer-events-none translate-y-2 focus-within:opacity-100 focus-within:pointer-events-auto focus-within:translate-y-0";

/** במסך הראשון בנייד הכפתורים הצפים לא מכסים את ה-CTA של העמוד. כפתור הנגישות נשאר תמיד. */
const firstFoldHide = "max-md:invisible max-md:opacity-0 max-md:pointer-events-none";

/**
 * הכפתורים הצפים שנשארו אחרי פס הפעולה התחתון (MobileActionBar).
 * - וואטסאפ: בדסקטופ צף כמו קודם. במובייל הוא תא בפס, ונשאר צף רק בעמוד בלי פס.
 * - צ'אט ונגישות: לא חלק מהפס. במובייל הם עולים מעליו.
 * - שליחת קובץ: כבר לא צף. /online נגיש מהתפריט ומדף הבית.
 * עמוד שקט (lib/action-bar-routes.ts) מסתיר את כל מה שמכירתי, חוץ מהנגישות.
 */
export default function FloatingFabs() {
  const pathname = usePathname();
  const scrollDir = useScrollDirection();
  const pastFold = usePastFold();
  const [chatOpen, setChatOpen] = useState(false);

  const quiet = isQuietRoute(pathname);
  const hideWhatsApp =
    quiet || matchesRoutePrefix(pathname, HIDE_FLOATING_WHATSAPP_PREFIXES);
  const hideChat = quiet || matchesRoutePrefix(pathname, HIDE_CHAT_PREFIXES);
  const elevated = matchesRoutePrefix(pathname, ELEVATED_FLOATING_PREFIXES);
  const whatsAppInBar = hasMobileActionBar(pathname);

  // Hide FABs on scroll-down; never hide while chat panel is open.
  const fabsHidden = scrollDir === "down" && !chatOpen;

  /* וואטסאפ: בדסקטופ בלי שינוי. במובייל הוא נעלם כשהפס מחליף אותו. */
  const fabPosition = cn(
    "transition-[opacity,transform] duration-300",
    elevated ? ELEVATED_BOTTOM : BASE_BOTTOM,
    whatsAppInBar && "max-md:hidden",
    fabsHidden && scrollHideOnFocusable,
  );

  // F-02 (החלטת בעלים 10.9.2026): ווידג'ט הנגישות לא מוסתר בגלילה. מי שצריך
  // אותו חייב למצוא אותו, והדיאלוג הפתוח שלו לא דוהה בזמן שקוראים אותו.
  const a11yFabPosition = cn(
    elevated ? ELEVATED_BOTTOM : "bottom-[calc(var(--float-inset)+1.5rem)]",
  );

  /* צ'אט מעל כפתור הנגישות, באותם הפרשים שהיו לפני הפס */
  const chatFabPosition = cn(
    "transition-[opacity,transform] duration-300",
    elevated
      ? "bottom-[calc(var(--float-inset)+10.5rem)] sm:bottom-[11.5rem]"
      : "bottom-[calc(var(--float-inset)+5.5rem)] sm:bottom-[6.5rem]",
    fabsHidden && !chatOpen && scrollHideOnWrapper,
    !pastFold && !chatOpen && firstFoldHide,
  );

  const handleChatOpenChange = useCallback((open: boolean) => {
    setChatOpen(open);
  }, []);

  return (
    /* F-51 (7.10.2026): קופסה אמיתית ולא display:contents, כי contents מאבד את
       ה-landmark בחלק מהדפדפנים. כל הילדים position:fixed, אז לקופסה אין גובה
       והפריסה לא משתנה. ה-class נשאר כי globals.css בוחר את ילדיה הישירים. */
    <aside aria-label="פעולות מהירות" className="floating-fabs-cluster">
      {!hideChat ? (
        <ChatWidget className={chatFabPosition} onOpenChange={handleChatOpenChange} />
      ) : null}
      {!hideWhatsApp ? (
        <WhatsAppWidget className={cn(fabPosition, !pastFold && firstFoldHide)} />
      ) : null}
      <AccessibilityToggle className={a11yFabPosition} />
    </aside>
  );
}
