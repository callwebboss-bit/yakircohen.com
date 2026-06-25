"use client";

import {
  BOOK_AUDIENCE_ROUTES,
  buildFastWhatsAppMessage,
  getAudienceRouteById,
} from "@/lib/data/book-audience-routes";
import { useBookWizardLivePriceOptional } from "@/components/booking/BookWizardLivePrice";
import type { BookCategoryId } from "@/lib/book-url";
import { withVat } from "@/lib/data/pricing";
import { catalogWithVat } from "@/lib/data/pricing-catalog";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type BookStickyMobileBarProps = {
  activeCategory: BookCategoryId | null;
  activeRouteId?: string | null;
  className?: string;
};

function resolveRoute(
  category: BookCategoryId,
  routeId: string | null | undefined,
) {
  if (routeId) {
    return getAudienceRouteById(routeId) ?? null;
  }
  return BOOK_AUDIENCE_ROUTES.find((r) => r.categoryId === category) ?? null;
}

export default function BookStickyMobileBar({
  activeCategory,
  activeRouteId = null,
  className,
}: BookStickyMobileBarProps) {
  if (!activeCategory) return null;

  const route = resolveRoute(activeCategory, activeRouteId);
  if (!route) return null;

  const livePrice = useBookWizardLivePriceOptional()?.livePrice;
  const totalWithVat =
    livePrice != null
      ? withVat(livePrice.totalExVat)
      : catalogWithVat(route.priceExVat);
  const title = livePrice?.title ?? route.title;
  const waText = buildFastWhatsAppMessage(route);
  const waHref = buildWhatsAppHref({
    text: waText,
    utm_source: "website",
    utm_campaign: `${route.utm_campaign}_sticky`,
  });

  function openWa() {
    openWhatsAppLead(waHref);
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md sm:hidden",
        className,
      )}
      role="region"
      aria-label="סיכום מחיר והמשך בוואטסאפ"
    >
      <div className="mx-auto flex max-w-[72rem] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-foreground">{title}</p>
          <p className="text-sm font-bold tabular-nums text-brand-red">
            {totalWithVat.toLocaleString("he-IL")} ₪ סופי
          </p>
        </div>
        <button
          type="button"
          onClick={openWa}
          aria-label={`קבלו הצעה בוואטסאפ ל${title} - ${totalWithVat.toLocaleString("he-IL")} שקל סופי`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1fba59]"
        >
          וואטסאפ
        </button>
      </div>
    </div>
  );
}
