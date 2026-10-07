"use client";

import BookUpsellSection from "@/components/booking/BookUpsellSection";
import PriceWithVat from "@/components/booking/PriceWithVat";
import type { BookingUpsellItem } from "@/lib/data/booking-shared";
import { cn } from "@/lib/utils";
import { useModalA11y } from "@/hooks/useModalA11y";

type SmartAddonDrawerProps = {
  open: boolean;
  packageLabel: string;
  basePriceExVat: number;
  items: readonly BookingUpsellItem[];
  selected: ReadonlySet<string>;
  onToggle: (id: string) => void;
  onClose: () => void;
  onContinue: () => void;
};

export default function SmartAddonDrawer({
  open,
  packageLabel,
  basePriceExVat,
  items,
  selected,
  onToggle,
  onClose,
  onContinue,
}: SmartAddonDrawerProps) {
  /* F-18, 7.10.2026: המגירה כבר מיקדה את הפקד הראשון, אבל בלי לולאת Tab
     ובלי החזרת מיקוד (D5-06: 7 מתוך 30 לחיצות Tab יצאו מהמגירה). ה-hook
     מוסיף אותם, יחד עם נעילת גלילה ו-Escape. */
  const panelRef = useModalA11y({
    active: open && items.length > 0,
    onEscape: onClose,
  });

  if (!open || items.length === 0) return null;

  const addonTotal = items
    .filter((i) => selected.has(i.id))
    .reduce((sum, i) => sum + i.price, 0);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-background/60"
        aria-label="סגירת מגירת תוספות"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="smart-addon-drawer-title"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface shadow-2xl",
          "pb-[calc(1rem+env(safe-area-inset-bottom,0px))]",
        )}
      >
        <div className="mx-auto max-w-lg px-4 pt-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 id="smart-addon-drawer-title" className="text-base font-semibold text-foreground">
              תוספות ל-{packageLabel}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground"
              aria-label="סגור"
            >
              ✕
            </button>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            אופציונלי, אפשר לסגור פרטים בוואטסאפ אחרי השליחה.
          </p>
          <BookUpsellSection
            title="שדרוגים מהמחירון"
            items={items}
            selected={selected}
            onToggle={onToggle}
            className="border-0 bg-transparent p-0 shadow-none"
          />
          <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-surface/95 px-4 py-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">סה״כ משוער</span>
              <PriceWithVat amountExVat={basePriceExVat + addonTotal} size="md" />
            </div>
            <button
              type="button"
              onClick={onContinue}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-red text-sm font-semibold text-white transition-colors hover:bg-brand-red/90"
            >
              המשיכו לפרטים
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
