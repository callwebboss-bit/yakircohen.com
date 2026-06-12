"use client";

import { usePathname } from "next/navigation";
import { CONTACT_PHONE_E164 } from "@/lib/constants";
import { getMobileStickyCtaContext } from "@/lib/mobile-sticky-context";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const HIDE_PREFIXES = ["/contact", "/book"] as const;

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function MobileStickyCta() {
  const pathname = usePathname();

  if (matchesPrefix(pathname, HIDE_PREFIXES)) {
    return null;
  }

  const { text, utm_campaign } = getMobileStickyCtaContext(pathname);

  const whatsappHref = buildWhatsAppHref({
    text,
    utm_source: "website",
    utm_campaign,
  });

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden"
      role="region"
      aria-label="יצירת קשר מהירה"
    >
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2 px-3 py-2.5">
        <a
          href={`tel:${CONTACT_PHONE_E164}`}
          className={cn(
            "inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface px-3 text-sm font-semibold text-foreground",
            "transition-[color,border-color,transform] duration-fast ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 hover:text-[var(--service-accent,#d42b2b)] active:scale-[0.97]",
          )}
        >
          חיוג מהיר
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--service-accent,#d42b2b)] px-3 text-sm font-semibold text-white",
            "transition-transform duration-fast ease-luxury active:scale-[0.97]",
          )}
        >
          <WhatsAppIcon size={18} />
          מחיר בוואטסאפ
        </a>
      </div>
    </div>
  );
}
