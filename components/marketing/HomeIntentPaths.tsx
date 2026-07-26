import Link from "next/link";
import { HOME_INTENT_PATHS } from "@/lib/data/home-intent-paths";
import { catalogWithVat, getExVat } from "@/lib/data/pricing-catalog";

/**
 * מסלולי בחירה לפי כוונת משתמש - מוצג מעל הקפל, בתוך ה-Hero.
 * תוויות ויעדים זהים ל-Intent-nav; מחירים מ-pricing-catalog.
 */
export default function HomeIntentPaths() {
  return (
    <nav aria-label="בחירת מסלול לפי סוג השירות">
      <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        בחרו לפי צורך - אותם מסלולים כמו בתפריט
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {HOME_INTENT_PATHS.map((path) => {
          const hasNumericPrice =
            path.fromPriceExVat != null || path.priceId != null;
          const exVat = hasNumericPrice
            ? (path.fromPriceExVat ?? (path.priceId ? getExVat(path.priceId) : 0))
            : 0;
          const withVat = catalogWithVat(exVat);

          return (
            <li key={path.id}>
              <Link
                href={path.href}
                prefetch
                className="group flex h-full min-h-12 flex-col gap-1 rounded-xl border border-border bg-surface p-4 transition-colors duration-200 hover:border-brand-red/40 hover:bg-brand-red/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                <span className="text-sm font-bold text-foreground transition-colors group-hover:text-brand-red">
                  {path.title}
                  <span aria-hidden="true"> ›</span>
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {path.outcome}
                </span>
                <span className="mt-auto pt-1 text-xs font-semibold text-brand-red">
                  {hasNumericPrice ? (
                    <>
                      החל מ-{exVat.toLocaleString("he-IL")} ₪ + מע״מ
                      <span className="block font-normal text-muted-foreground">
                        כולל מע״מ: {withVat.toLocaleString("he-IL")} ₪
                      </span>
                    </>
                  ) : (
                    path.priceNote ?? "לפרטים"
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
