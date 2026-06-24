import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  PACKAGE_HUB_CATEGORY_LABELS,
  PACKAGE_HUB_ITEMS,
  type PackageHubCategory,
} from "@/lib/data/packages-hub";
import { PRICING_FRAMING_LINE } from "@/lib/data/conversion-copy";

const CATEGORY_ORDER: PackageHubCategory[] = ["studio", "podcast", "events"];

export default function PackagesHubPageContent() {
  return (
    <article>
      <Section padding="sm" className="border-b border-border">
        <Container className="max-w-5xl">
          <p className="text-xs font-semibold text-muted-foreground">חבילות</p>
          <h1 className="text-hero mt-4 font-semibold text-foreground">
            חבילות מוכנות - אולפן, פודקאסט וחתונות
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">
            שלושה מסלולים פופולריים עם מחירים מהמחירון הקיים. בלי כפילויות, בלי
            הפתעות - פרטים מלאים בדף השירות או בהזמנה המקוונת.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {PRICING_FRAMING_LINE}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="inline-flex min-h-11 items-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              הזמנה עם מחיר סופי
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40"
            >
              מחירון מלא
            </Link>
          </div>
        </Container>
      </Section>

      {CATEGORY_ORDER.map((category) => {
        const items = PACKAGE_HUB_ITEMS.filter((p) => p.category === category);
        if (items.length === 0) return null;

        return (
          <Section
            key={category}
            padding="sm"
            className="border-b border-border"
          >
            <Container className="max-w-5xl">
              <h2 className="font-serif text-section-title font-semibold text-foreground">
                {PACKAGE_HUB_CATEGORY_LABELS[category]}
              </h2>
              <ul className="mt-8 grid gap-6 lg:grid-cols-1">
                {items.map((pkg) => (
                  <li key={pkg.id}>
                    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
                        {pkg.categoryLabel}
                      </p>
                      <h3 className="mt-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
                        {pkg.name}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {pkg.description}
                      </p>
                      <p className="mt-4 text-lg font-semibold text-brand-red">
                        {pkg.priceLabel}
                        {pkg.priceNote ? (
                          <span className="ms-2 text-sm font-normal text-muted-foreground">
                            {pkg.priceNote}
                          </span>
                        ) : null}
                        <span className="block text-xs font-normal text-muted-foreground">
                          + מע״מ
                        </span>
                      </p>
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {pkg.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-2 text-sm text-foreground/90"
                          >
                            <span
                              className="mt-1 text-brand-red"
                              aria-hidden
                            >
                              ✓
                            </span>
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href={pkg.href}
                          className="inline-flex min-h-11 items-center rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
                        >
                          פרטים מלאים
                        </Link>
                        {pkg.bookHref ? (
                          <Link
                            href={pkg.bookHref}
                            className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-brand-red/40"
                          >
                            הזמנה מקוונת
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        );
      })}

      <Section padding="sm">
        <Container className="max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">
            מחפשים מסלול לפי קהל?{" "}
            <Link href="/for-couples" className="text-brand-red hover:underline">
              לזוגות וחתונות
            </Link>
            {" · "}
            <Link href="/for-creators" className="text-brand-red hover:underline">
              ליוצרים
            </Link>
          </p>
        </Container>
      </Section>
    </article>
  );
}
