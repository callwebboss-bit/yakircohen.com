"use client";

import { usePathname } from "next/navigation";
import AccessibilityToggle from "@/components/ui/AccessibilityToggle";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import { cn } from "@/lib/utils";

/** Routes with their own bottom CTA / sticky bar - hide duplicate floating WhatsApp. */
const HIDE_FLOATING_WHATSAPP_PREFIXES = ["/contact", "/book"] as const;

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

export default function SiteFloatingActions() {
  const pathname = usePathname();
  const hideWhatsApp = matchesPrefix(pathname, HIDE_FLOATING_WHATSAPP_PREFIXES);
  const elevated = matchesPrefix(pathname, ELEVATED_FLOATING_PREFIXES);

  return (
    <>
      {!hideWhatsApp ? (
        <WhatsAppWidget
          className={cn(elevated && elevatedPosition)}
        />
      ) : null}
      <AccessibilityToggle
        className={cn(elevated && elevatedPosition)}
      />
    </>
  );
}
