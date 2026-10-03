import { EXTRA_PERSON_COST_NOTE } from "@/lib/data/participant-cost-copy";
import {
  MOBILE_STUDIO_CHANNELS,
  mobileChannelPriceLine,
  mobileChannelsBreakdown,
} from "@/lib/data/mobile-studio-booking";
import { cn } from "@/lib/utils";

/** דוגמאות בטבלה הקטנה: זוג, ארבעה, והמקסימום */
const EXAMPLE_PEOPLE = [2, 4, MOBILE_STUDIO_CHANNELS.max] as const;

/**
 * אולפן נייד בבית או במשרד (החלטת הבעלים 3.10.2026, סבב שלישי): הקלטת האודיו
 * כלולה בהגעה, וכל אדם נוסף הוא ערוץ נוסף עד 12. מוצג בעמוד האולפן הנייד
 * ובעמוד הפודקאסט הנייד, כולל מע״מ קודם, הכול מהקטלוג.
 */
export default function MobileChannelsNote({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-lg border border-brand-red/30 bg-brand-red/5 px-4 py-3", className)}
    >
      <p className="text-sm font-semibold text-foreground">
        בבית או במשרד: הקלטת האודיו כלולה במחיר ההגעה, לאדם אחד.
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{EXTRA_PERSON_COST_NOTE}.</p>
      <p className="mt-1 text-sm text-foreground">{mobileChannelPriceLine()}.</p>
      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
        {EXAMPLE_PEOPLE.map((people) => {
          const b = mobileChannelsBreakdown(people);
          return (
            <li key={people}>
              <span className="font-medium text-foreground">
                {b.head}: {b.withVat}
              </span>{" "}
              {b.exVat}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
