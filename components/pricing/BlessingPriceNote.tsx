import { EXTRA_PERSON_COST_NOTE } from "@/lib/data/participant-cost-copy";
import {
  blessingFamilyExampleLine,
  blessingPriceLine,
  blessingSpeakersPriceLine,
  blessingTextRewriteLine,
} from "@/lib/data/blessing-offer";
import {
  BLESSING_NO_TIME_LIMIT_NOTE,
  BLESSING_REMOTE_NOTE,
  BLESSING_REMOTE_TRADEOFF_NOTE,
  BLESSING_TEXT_POLISH_NOTE,
} from "@/lib/data/pricing-catalog";
import { cn } from "@/lib/utils";

/**
 * מחיר ברכה ודרשה (החלטות 5.10.2026 (ברכות)): אותו מחיר, בלי הגבלת זמן, דובר
 * אחד כלול וכל דובר נוסף בתוספת, ליטוש טקסט כלול וכתיבה מחדש בתוספת, והקלטה
 * מרחוק באותו מחיר עם הוויתור בגלוי. הכול מהקטלוג, כולל מע״מ קודם.
 */
export default function BlessingPriceNote({
  className,
  showRemote = true,
}: {
  className?: string;
  showRemote?: boolean;
}) {
  return (
    <div
      className={cn("rounded-lg border border-brand-red/30 bg-brand-red/5 px-4 py-3 text-start", className)}
      data-blessing-price
    >
      <p className="text-sm font-semibold text-foreground">{blessingPriceLine()}.</p>
      <p className="mt-1 text-sm text-foreground">{BLESSING_NO_TIME_LIMIT_NOTE}.</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{EXTRA_PERSON_COST_NOTE}.</p>
      <p className="mt-1 text-sm text-foreground">
        דובר אחד כלול. {blessingSpeakersPriceLine()}.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{blessingFamilyExampleLine()}.</p>
      <p className="mt-2 text-sm text-foreground">
        {BLESSING_TEXT_POLISH_NOTE}. {blessingTextRewriteLine()}.
      </p>
      {showRemote ? (
        <p className="mt-2 text-xs text-muted-foreground">
          {BLESSING_REMOTE_NOTE}. {BLESSING_REMOTE_TRADEOFF_NOTE}.
        </p>
      ) : null}
    </div>
  );
}
