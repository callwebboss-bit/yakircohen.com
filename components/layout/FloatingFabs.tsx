"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import AccessibilityToggle from "@/components/ui/AccessibilityToggle";
import ChatWidget from "@/components/ui/ChatWidget";
import SendFileFab from "@/components/ui/SendFileFab";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

/** Routes with their own bottom CTA / sticky bar - hide duplicate floating WhatsApp. */
const HIDE_FLOATING_WHATSAPP_PREFIXES = ["/contact", "/book"] as const;

const HIDE_SEND_FILE_PREFIXES = ["/contact", "/book", "/online"] as const;

/** Chat widget only on conversion surfaces - skip content-heavy paths. */
const HIDE_CHAT_PREFIXES = [
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

const scrollHide = "opacity-0 pointer-events-none translate-y-2";

/** All floating FABs - deferred after MobileStickyCta. */
export default function FloatingFabs() {
  const pathname = usePathname();
  const scrollDir = useScrollDirection();
  const [chatOpen, setChatOpen] = useState(false);

  const hideWhatsApp = matchesPrefix(pathname, HIDE_FLOATING_WHATSAPP_PREFIXES);
  const hideSendFile = matchesPrefix(pathname, HIDE_SEND_FILE_PREFIXES);
  const hideChat = matchesPrefix(pathname, HIDE_CHAT_PREFIXES);
  const elevated = matchesPrefix(pathname, ELEVATED_FLOATING_PREFIXES);

  // Hide FABs on scroll-down; never hide while chat panel is open.
  const fabsHidden = scrollDir === "down" && !chatOpen;

  // WhatsApp (end) + AccessibilityToggle (start) sit in side gutters beside the sticky bar.
  const fabPosition = cn(
    "transition-[opacity,transform] duration-300",
    elevated && elevatedPosition,
    fabsHidden && scrollHide,
  );

  const chatFabPosition = cn(
    "transition-[opacity,transform] duration-300",
    elevated
      ? "bottom-[10.5rem] sm:bottom-[11.5rem] max-md:bottom-[10.5rem]"
      : "bottom-[5.5rem] sm:bottom-[6.5rem]",
    fabsHidden && !chatOpen && scrollHide,
  );

  const sendFilePosition = cn(
    "left-6 sm:left-8",
    "transition-[opacity,transform] duration-300",
    elevated
      ? "bottom-[14.5rem] sm:bottom-[15.5rem] max-md:bottom-[14.5rem]"
      : "bottom-[9.5rem] sm:bottom-[10.5rem]",
    fabsHidden && scrollHide,
  );

  const handleChatOpenChange = useCallback((open: boolean) => {
    setChatOpen(open);
  }, []);

  return (
    <div className="floating-fabs-cluster contents">
      {!hideSendFile ? <SendFileFab className={sendFilePosition} /> : null}
      {!hideChat ? (
        <ChatWidget className={chatFabPosition} onOpenChange={handleChatOpenChange} />
      ) : null}
      {!hideWhatsApp ? <WhatsAppWidget className={fabPosition} /> : null}
      <AccessibilityToggle className={fabPosition} />
    </div>
  );
}
