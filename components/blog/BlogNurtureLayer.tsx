import Link from "next/link";
import type { BlogNurtureConfig } from "@/lib/data/blog-nurture";

type Props = {
  nurture: BlogNurtureConfig;
  /** קישור ראשי לדף השירות (מה-callout) */
  primaryServiceHref?: string;
  primaryServiceLabel?: string;
};

/**
 * שכבת המרה מעל תוכן הליבה של מאמר - למי זה מתאים + קישורים לשירותים.
 */
export default function BlogNurtureLayer({
  nurture,
  primaryServiceHref,
  primaryServiceLabel,
}: Props) {
  return (
    <div className="mt-12 space-y-8 border-t border-border pt-10">
      <section
        className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
        aria-labelledby="blog-audience-heading"
      >
        <h2
          id="blog-audience-heading"
          className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
        >
          למי זה מתאים
        </h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {nurture.audience.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="blog-service-links-heading">
        <h2
          id="blog-service-links-heading"
          className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
        >
          המשך לשירותים
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          קישורים מדויקים לדפים הרלוונטיים - בלי לנחש לאן להמשיך.
        </p>
        <ul className="mt-5 flex flex-wrap gap-3">
          {primaryServiceHref && primaryServiceLabel ? (
            <li>
              <Link
                href={primaryServiceHref}
                className="inline-flex min-h-12 items-center rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
              >
                {primaryServiceLabel}
              </Link>
            </li>
          ) : null}
          {nurture.serviceLinks.map((link) => {
            if (primaryServiceHref && link.href === primaryServiceHref) {
              return null;
            }
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-12 items-center rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
