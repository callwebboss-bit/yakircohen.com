import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { HOME_QUICK_PATHS } from "@/lib/data/home-quick-paths";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";

export default function HomeQuickPaths() {
  return (
    <Section
      padding="sm"
      className="border-b border-border bg-surface"
      ariaLabelledby="quick-paths-heading"
    >
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="quick-paths-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            4 מסלולים - בחרו וקבלו מחיר
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            כל מסלול: מה מקבלים, למי זה מתאים, ומחיר התחלה.
          </p>
        </header>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_QUICK_PATHS.map((path) => {
            const priceExVat =
              path.fromPriceExVat ??
              (path.priceId ? getExVat(path.priceId) : 0);
            const priceLabel = formatFromPriceDual(priceExVat).replace(
              "כרגע: ",
              "",
            );

            return (
              <li key={path.id}>
                <article className="flex h-full flex-col rounded-xl border border-border bg-background p-5 shadow-sm">
                  <p className="text-2xl" aria-hidden="true">
                    {path.emoji}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {path.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {path.description}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      מתאים ל:{" "}
                    </span>
                    {path.suitedFor}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-brand-red">
                    {priceLabel}
                  </p>
                  <div className="mt-4 flex-1" />
                  <Link
                    href={path.href}
                    prefetch
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-brand-red/40 bg-brand-red/5 px-4 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                  >
                    לפרטים
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
