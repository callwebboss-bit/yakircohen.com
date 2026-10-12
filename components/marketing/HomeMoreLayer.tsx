import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HomeMoreItem = {
  id: string;
  /** השורה שרואים כשהחלק סגור */
  label: string;
  /** מחלקות על עטיפת התוכן, למשל הסתרה מהעין של כותרת שזהה לשורה */
  contentClassName?: string;
  content: ReactNode;
};

type HomeMoreLayerProps = {
  items: readonly HomeMoreItem[];
  /** שם הקבוצה של ה-details. ייחודי לכל שכבה בעמוד */
  name?: string;
  headingId?: string;
  heading?: string;
  intro?: string;
  /**
   * page: שכבה ברוחב מלא, כמו בדף הבית.
   * inset: בתוך Container של עמוד שירות, בלי ריפוד ורוחב משלה.
   */
  variant?: "page" | "inset";
};

/**
 * שכבת "עוד" (תוכנית הבהירות, שלבים 7 ו-8, D87, 11-12.10.2026). רכיב שרת.
 *
 * כל מה שלא בשכבה הראשית יושב כאן, כל חלק ב-<details name> משלו: רק אחד פתוח
 * בכל פעם, בלי JS. שום דבר לא נמחק. התוכן נשאר ב-HTML, ולכן המילים, הקישורים
 * והכותרות נספרים כמו קודם (seo-diff קורא את ה-HTML הבנוי). סגור, הדפדפן לא
 * מצייר את התוכן, וזה גם חוסך עבודה בטעינה.
 */
export default function HomeMoreLayer({
  items,
  name = "home-more",
  headingId = "home-more-heading",
  heading = "עוד באתר",
  intro = "כל השירותים, המתנות, הדוגמאות והאזורים. כל חלק נפתח בלחיצה.",
  variant = "page",
}: HomeMoreLayerProps) {
  const inset = variant === "inset";
  return (
    <section
      className={cn(!inset && "border-y border-border bg-surface py-10 sm:py-14")}
      aria-labelledby={headingId}
    >
      <div className={cn(!inset && "mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8")}>
        <h2 id={headingId} className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
          {heading}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{intro}</p>
      </div>
      <div
        className={cn(
          "mt-6 divide-y divide-border bg-background",
          inset ? "overflow-hidden rounded-2xl border border-border" : "border-y border-border",
        )}
      >
        {items.map((item) => (
          <details key={item.id} name={name} data-home-more={item.id} className="group">
            <summary
              className={cn(
                "summary-cue flex min-h-14 cursor-pointer list-none items-center font-semibold text-foreground marker:content-none touch-manipulation hover:text-brand-red-text focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-red [&::-webkit-details-marker]:hidden",
                inset ? "px-4 sm:px-5" : "mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8",
              )}
            >
              {item.label}
            </summary>
            <div className={cn("border-t border-border", inset && "space-y-12 p-4 sm:p-6", item.contentClassName)}>
              {item.content}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
