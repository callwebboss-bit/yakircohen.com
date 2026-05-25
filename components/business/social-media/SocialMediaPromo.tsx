"use client";

import { useSyncExternalStore } from "react";
import { GEO_PROMO } from "@/lib/data/social-media";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { XIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type SocialMediaPromoProps = {
  className?: string;
};

const PROMO_STORAGE_EVENT = "social-media-promo-storage";

function subscribePromoStorage(onStoreChange: () => void) {
  window.addEventListener(PROMO_STORAGE_EVENT, onStoreChange);
  return () => window.removeEventListener(PROMO_STORAGE_EVENT, onStoreChange);
}

function readPromoVisible(): boolean {
  try {
    return sessionStorage.getItem(GEO_PROMO.storageKey) !== "1";
  } catch {
    return true;
  }
}

export default function SocialMediaPromo({ className }: SocialMediaPromoProps) {
  const visible = useSyncExternalStore(
    subscribePromoStorage,
    readPromoVisible,
    () => true,
  );

  function dismiss() {
    try {
      sessionStorage.setItem(GEO_PROMO.storageKey, "1");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(PROMO_STORAGE_EVENT));
  }

  if (!visible) return null;

  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      `מבצע ${GEO_PROMO.discountPercent}% - ניהול סושיאל (${GEO_PROMO.cities.join(", ")})`,
    ),
    utm_campaign: GEO_PROMO.utmCampaign,
  });

  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-red/40 bg-brand-red/8 p-5 sm:p-6",
        className,
      )}
      aria-labelledby="social-promo-heading"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute end-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        aria-label="סגירת המבצע"
      >
        <XIcon size={18} />
      </button>

      <p className="text-xs font-semibold tracking-[0.15em] text-brand-red uppercase">
        מבצע מוגבל
      </p>
      <h2 id="social-promo-heading" className="mt-2 pe-8 text-lg font-semibold text-foreground">
        {GEO_PROMO.headline}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{GEO_PROMO.subline}</p>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        לממש את ההטבה בוואטסאפ
      </a>
    </aside>
  );
}
