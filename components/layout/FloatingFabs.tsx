"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import AccessibilityToggle from "@/components/ui/AccessibilityToggle";
import ChatWidget from "@/components/ui/ChatWidget";
import SendFileFab from "@/components/ui/SendFileFab";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import { usePastFold, useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

/** Routes with their own bottom CTA / sticky bar - hide duplicate floating WhatsApp. */
const HIDE_FLOATING_WHATSAPP_PREFIXES = ["/contact", "/book", "/admin"] as const;

const HIDE_SEND_FILE_PREFIXES = ["/contact", "/book", "/online", "/admin"] as const;

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

/** Calculator and contact flows need FABs lifted above sticky UI. */
const ELEVATED_FLOATING_PREFIXES = [
  "/contact",
  "/book",
  "/events/attractions",
  "/events/dj-events",
] as const;

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

const elevatedPosition =
  "bottom-[5.5rem] sm:bottom-[6.5rem] max-md:bottom-[5.5rem]";

/* F-02 (7.10.2026): הכפתורים נעלמים בגלילה למטה אבל נשארים בסדר הטאב, ולכן
   כפתור ממוקד היה בלתי נראה (2.4.7). כל מי שמחזיק פוקוס חוזר להיות גלוי.
   כשהמחלקה יושבת על האלמנט הממוקד עצמו (<a> של וואטסאפ ושל שליחת קובץ) זה
   focus-visible, וכשהיא יושבת על עטיפה (הצ'אט) זה focus-within.
   לא inert, aria-hidden או visibility:hidden: הם מוציאים את הכפתור מסדר
   הטאב ומפעילים את aria-hidden-focus. */
const scrollHideOnFocusable =
  "opacity-0 pointer-events-none translate-y-2 focus-visible:opacity-100 focus-visible:pointer-events-auto focus-visible:translate-y-0";
const scrollHideOnWrapper =
  "opacity-0 pointer-events-none translate-y-2 focus-within:opacity-100 focus-within:pointer-events-auto focus-within:translate-y-0";

/** במסך הראשון בנייד הכפתורים הצפים לא מכסים את ה-CTA של העמוד. כפתור הנגישות נשאר תמיד. */
const firstFoldHide = "max-md:invisible max-md:opacity-0 max-md:pointer-events-none";

/** All floating FABs - deferred after MobileStickyCta. */
export default function FloatingFabs() {
  const pathname = usePathname();
  const scrollDir = useScrollDirection();
  const pastFold = usePastFold();
  const [chatOpen, setChatOpen] = useState(false);

  const hideWhatsApp = matchesPrefix(pathname, HIDE_FLOATING_WHATSAPP_PREFIXES);
  const hideSendFile = matchesPrefix(pathname, HIDE_SEND_FILE_PREFIXES);
  const hideChat = matchesPrefix(pathname, HIDE_CHAT_PREFIXES);
  const elevated = matchesPrefix(pathname, ELEVATED_FLOATING_PREFIXES);

  // Hide FABs on scroll-down; never hide while chat panel is open.
  const fabsHidden = scrollDir === "down" && !chatOpen;

  // WhatsApp (end) sits in the side gutter beside the sticky bar.
  const fabPosition = cn(
    "transition-[opacity,transform] duration-300",
    elevated && elevatedPosition,
    fabsHidden && scrollHideOnFocusable,
  );

  // F-02 (החלטת בעלים 10.9.2026): ווידג'ט הנגישות לא מוסתר בגלילה. מי שצריך
  // אותו חייב למצוא אותו, והדיאלוג הפתוח שלו לא דוהה בזמן שקוראים אותו.
  const a11yFabPosition = cn(elevated && elevatedPosition);

  const chatFabPosition = cn(
    "transition-[opacity,transform] duration-300",
    elevated
      ? "bottom-[10.5rem] sm:bottom-[11.5rem] max-md:bottom-[10.5rem]"
      : "bottom-[5.5rem] sm:bottom-[6.5rem]",
    fabsHidden && !chatOpen && scrollHideOnWrapper,
    !pastFold && !chatOpen && firstFoldHide,
  );

  const sendFilePosition = cn(
    "left-6 sm:left-8",
    "transition-[opacity,transform] duration-300",
    elevated
      ? "bottom-[14.5rem] sm:bottom-[15.5rem] max-md:bottom-[14.5rem]"
      : "bottom-[9.5rem] sm:bottom-[10.5rem]",
    fabsHidden && scrollHideOnFocusable,
    !pastFold && firstFoldHide,
  );

  const handleChatOpenChange = useCallback((open: boolean) => {
    setChatOpen(open);
  }, []);

  return (
    /* F-51 (7.10.2026): קופסה אמיתית ולא display:contents, כי contents מאבד את
       ה-landmark בחלק מהדפדפנים. כל הילדים position:fixed, אז לקופסה אין גובה
       והפריסה לא משתנה. ה-class נשאר כי globals.css בוחר את ילדיה הישירים. */
    <aside aria-label="פעולות מהירות" className="floating-fabs-cluster">
      {!hideSendFile ? <SendFileFab className={sendFilePosition} /> : null}
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
