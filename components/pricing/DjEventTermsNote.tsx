import {
  DJ_ATTRACTIONS_DISCOUNT_NOTE,
  DJ_PER_EVENT_NOTE,
  DJ_TRAVEL_CENTER_NOTE,
} from "@/lib/data/pricing-catalog";
import { DJ_TRAVEL_HEADING, getDjTravelFeeRows } from "@/lib/data/dj-travel-fees";
import { cn } from "@/lib/utils";

/**
 * תנאי DJ ליד המחיר (החלטות 5.10.2026 (DJ)): מחיר לאירוע ובלי שעות נוספות,
 * תוספת ההגעה מהקטלוג כולל מע״מ קודם, ו-DJ עם אטרקציות בהצעה אישית.
 * מוצג ב-/events/dj-events, בבר מצווה, בחבילות החתונה ובמחשבון ה-DJ.
 */
export default function DjEventTermsNote({
  className,
  showAttractionsDiscount = true,
}: {
  className?: string;
  showAttractionsDiscount?: boolean;
}) {
  const rows = getDjTravelFeeRows();
  return (
    <div
      className={cn("rounded-lg border border-brand-red/30 bg-brand-red/5 px-4 py-3", className)}
      data-dj-terms
    >
      <p className="text-sm font-semibold text-foreground">{DJ_PER_EVENT_NOTE}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{DJ_TRAVEL_HEADING}</p>
      <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
        {rows.map((r) => (
          <li key={r.id} data-catalog-id={r.id}>
            <span className="font-medium text-foreground">
              {r.area}: {r.headline}
            </span>{" "}
            <span className="text-xs">({r.vatNote})</span>
          </li>
        ))}
        <li>{DJ_TRAVEL_CENTER_NOTE}</li>
      </ul>
      {showAttractionsDiscount ? (
        <p className="mt-2 text-sm text-foreground">{DJ_ATTRACTIONS_DISCOUNT_NOTE}</p>
      ) : null}
    </div>
  );
}
