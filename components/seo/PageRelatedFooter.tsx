import Link from "next/link";
import {
  getPageRelatedTrio,
  type RelatedRole,
} from "@/lib/data/service-fit-matrix";
import { getNextUpSuggestion } from "@/lib/data/next-up";
import { cn } from "@/lib/utils";

export type PageRelatedFooterProps = {
  pathname: string;
  title?: string;
  className?: string;
};

const ROLE_HINT: Record<RelatedRole, string> = {
  primary: "המשך מומלץ",
  complementary: "משלים",
  comparative: "להשוואה",
};

/**
 * 2–3 קישורים מדורגים בסוף דף — לא קיר לינקים.
 * ראשי מ-next-up כשקיים; המרה (מחירון/הזמנה) ב-sticky, לא כאן.
 * לא מציג NextUpSuggestionBlock בנפרד כדי לא לכפול.
 */
export default function PageRelatedFooter({
  pathname,
  title = "המשך",
  className,
}: PageRelatedFooterProps) {
  const trio = getPageRelatedTrio(pathname);
  if (trio.length === 0) return null;

  const nextUp = getNextUpSuggestion(pathname);
  const primary = trio.find((l) => l.role === "primary");
  const rest = trio.filter((l) => l.role !== "primary");

  return (
    <nav
      className={cn("space-y-4", className)}
      aria-label={title}
    >
      {primary ? (
        <div className="rounded-2xl border border-brand-red/25 bg-brand-red/[0.04] px-5 py-5 text-center sm:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-brand-red uppercase">
            {ROLE_HINT.primary}
          </p>
          {nextUp && nextUp.href === primary.href ? (
            <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">
              {nextUp.prompt}
            </p>
          ) : null}
          <Link
            href={primary.href}
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-6 text-sm font-bold text-white transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            {primary.label}
            <span aria-hidden="true" className="ms-1">
              ›
            </span>
          </Link>
        </div>
      ) : null}

      {rest.length > 0 ? (
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {rest.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground underline-offset-2 hover:text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                <span className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground/80 uppercase">
                  {ROLE_HINT[item.role]}
                </span>
                <span className="font-medium text-foreground">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
