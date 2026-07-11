"use client";

import {
  BOOK_AUDIENCE_ROUTES,
  getAudienceRouteById,
} from "@/lib/data/book-audience-routes";
import { scrollToQuickIntake } from "@/components/booking/BookIntakeCustomCard";
import { useBookPageLayoutOptional } from "@/components/booking/BookPageLayoutContext";
import { useBookWizardLivePriceOptional } from "@/components/booking/BookWizardLivePrice";
import { useBookCoupon } from "@/components/booking/BookCouponContext";
import type { BookCategoryId } from "@/lib/book-url";
import { scrollToBookWizardPanel } from "@/lib/book-scroll";
import { withVat } from "@/lib/data/pricing";
import { applyCouponDiscountExVat } from "@/lib/data/coupon-offers";
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
  const layout = useBookPageLayoutOptional();
  const livePrice = useBookWizardLivePriceOptional()?.livePrice;
  const { offer } = useBookCoupon();

  const intakeInView = layout?.intakeInView ?? false;

  if (!activeCategory) {
    return (
      <div
        className={cn(
          "book-glass-bar fixed inset-x-0 bottom-0 z-40 border-t border-border/50 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] sm:hidden",
          className,
        )}
        role="region"
        aria-label="המשך הזמנה"
      >
        <div className="mx-auto flex max-w-[72rem] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">
              {intakeInView ? "מחיר לפי אפיון" : "בחרו שירות להמשך"}
            </p>
            <p className="text-sm text-muted-foreground">
              {intakeInView
                ? "נחזור עם הצעה אחרי בדיקת החומרים"
                : "או שלחו פנייה מהירה למטה"}
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToQuickIntake}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-brand-red px-4 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            {intakeInView ? "השלמת פרטים" : "פנייה מהירה ↓"}
          </button>
        </div>
      </div>
    );
  }

  const route = resolveRoute(activeCategory, activeRouteId);
  if (!route) return null;

  if (intakeInView && layout?.intakeExpanded) {
    return (
      <div
        className={cn(
          "book-glass-bar fixed inset-x-0 bottom-0 z-40 border-t border-border/50 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] sm:hidden",
          className,
        )}
        role="region"
        aria-label="פנייה מהירה"
      >
        <div className="mx-auto flex max-w-[72rem] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">פנייה מהירה</p>
            <p className="text-sm text-muted-foreground">מחיר לפי אפיון</p>
          </div>
          <button
            type="button"
            onClick={scrollToQuickIntake}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-brand-red px-4 text-sm font-semibold text-white"
          >
            המשך למטה
          </button>
        </div>
      </div>
    );
  }

  const baseExVat =
    livePrice != null ? livePrice.totalExVat : route.priceExVat;
  const discountedExVat = applyCouponDiscountExVat(offer, baseExVat);
  const totalWithVat = withVat(discountedExVat);
  const title = livePrice?.title ?? route.title;

  function scrollToWizard() {
    scrollToBookWizardPanel();
  }

  return (
    <div
      className={cn(
        "book-glass-bar fixed inset-x-0 bottom-0 z-40 border-t border-border/50 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] sm:hidden",
        className,
      )}
      role="region"
      aria-label="סיכום מחיר והמשך"
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
          onClick={scrollToWizard}
          aria-label={`השלמת פרטים ב${title}`}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-red px-4 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          השלמת פרטים
        </button>
      </div>
    </div>
  );
}
