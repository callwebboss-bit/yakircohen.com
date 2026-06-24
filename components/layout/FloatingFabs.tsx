"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import AccessibilityToggle from "@/components/ui/AccessibilityToggle";
import ChatWidget from "@/components/ui/ChatWidget";
import SendFileFab from "@/components/ui/SendFileFab";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

/** Routes with their own bottom CTA / sticky bar — hide duplicate floating WhatsApp. */
const HIDE_FLOATING_WHATSAPP_PREFIXES = ["/contact", "/book"] as const;

const HIDE_SEND_FILE_PREFIXES = ["/contact", "/book", "/online"] as const;

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
const mobileStickyLift = "max-md:bottom-[4.5rem]";

const scrollHide = "opacity-0 pointer-events-none translate-y-2";

/** All floating FABs — deferred after MobileStickyCta. */
export default function FloatingFabs() {
  const pathname = usePathname();
  const scrollDir = useScrollDirection();
  const [chatOpen, setChatOpen] = useState(false);

  const hideWhatsApp = matchesPrefix(pathname, HIDE_FLOATING_WHATSAPP_PREFIXES);
  const hideSendFile = matchesPrefix(pathname, HIDE_SEND_FILE_PREFIXES);
  const elevated = matchesPrefix(pathname, ELEVATED_FLOATING_PREFIXES);
  const showMobileSticky = !hideWhatsApp;

  // Hide FABs on scroll-down; never hide while chat panel is open.
  const fabsHidden = scrollDir === "down" && !chatOpen;

  // WhatsApp + AccessibilityToggle share the same vertical position (right / left-6)
  const fabPosition = cn(
    "transition-[opacity,transform] duration-300",
    elevated && elevatedPosition,
    showMobileSticky && !elevated && mobileStickyLift,
    fabsHidden && scrollHide,
  );

  // ChatWidget sits one FAB-height above the a11y toggle (takes old sendFilePosition slot)
  const chatFabPosition = cn(
    "transition-[opacity,transform] duration-300",
    elevated
      ? "bottom-[10.5rem] sm:bottom-[11.5rem] max-md:bottom-[10.5rem]"
      : showMobileSticky
        ? "bottom-[8.5rem] sm:bottom-[9rem] max-md:bottom-[8.5rem]"
        : "bottom-[5.5rem] sm:bottom-[6.5rem]",
    // Keep chat FAB visible even while panel is open (don't hide it)
    fabsHidden && !chatOpen && scrollHide,
  );

  // SendFileFab bumped up by one slot (4 rem) to make room for ChatWidget
  const sendFilePosition = cn(
    "left-6 sm:left-8",
    "transition-[opacity,transform] duration-300",
    elevated
      ? "bottom-[14.5rem] sm:bottom-[15.5rem] max-md:bottom-[14.5rem]"
      : showMobileSticky
        ? "bottom-[12.5rem] sm:bottom-[13rem] max-md:bottom-[12.5rem]"
        : "bottom-[9.5rem] sm:bottom-[10.5rem]",
    fabsHidden && scrollHide,
  );

  const handleChatOpenChange = useCallback((open: boolean) => {
    setChatOpen(open);
  }, []);

  return (
    <>
      {!hideSendFile ? <SendFileFab className={sendFilePosition} /> : null}
      <ChatWidget className={chatFabPosition} onOpenChange={handleChatOpenChange} />
      {!hideWhatsApp ? <WhatsAppWidget className={fabPosition} /> : null}
      <AccessibilityToggle className={fabPosition} />
    </>
  );
}
