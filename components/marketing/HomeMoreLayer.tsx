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
};

/**
 * שכבת "עוד" בדף הבית (תוכנית הבהירות, שלב 7, D87, 11-12.10.2026). רכיב שרת.
 *
 * כל מה שלא בשכבה הראשית יושב כאן, כל חלק ב-<details name="home-more"> משלו:
 * רק אחד פתוח בכל פעם, בלי JS. שום דבר לא נמחק. התוכן נשאר ב-HTML, ולכן
 * המילים, הקישורים והכותרות נספרים כמו קודם (seo-diff קורא את ה-HTML הבנוי).
 * סגור, הדפדפן לא מצייר את התוכן, וזה גם חוסך עבודה בטעינה.
 */
export default function HomeMoreLayer({ items }: HomeMoreLayerProps) {
  return (
    <section className="border-y border-border bg-surface py-10 sm:py-14" aria-labelledby="home-more-heading">
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <h2 id="home-more-heading" className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
          עוד באתר
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          כל השירותים, המתנות, הדוגמאות והאזורים. כל חלק נפתח בלחיצה.
        </p>
      </div>
      <div className="mt-6 divide-y divide-border border-y border-border bg-background">
        {items.map((item) => (
          <details key={item.id} name="home-more" data-home-more={item.id} className="group">
            <summary className="summary-cue mx-auto flex min-h-14 max-w-[72rem] cursor-pointer list-none items-center px-4 font-semibold text-foreground marker:content-none touch-manipulation hover:text-brand-red-text focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-red sm:px-6 lg:px-8 [&::-webkit-details-marker]:hidden">
              {item.label}
            </summary>
            <div className={cn("border-t border-border", item.contentClassName)}>{item.content}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
