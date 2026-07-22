import Link from "next/link";
import { getNextUpSuggestion } from "@/lib/data/next-up";
import { cn } from "@/lib/utils";

export type NextUpSuggestionBlockProps = {
  pathname: string;
  className?: string;
};

/**
 * הצעה אחת להמשך בסוף דף שירות - לא רשימת קישורים.
 */
export default function NextUpSuggestionBlock({
  pathname,
  className,
}: NextUpSuggestionBlockProps) {
  const suggestion = getNextUpSuggestion(pathname);
  if (!suggestion) return null;

  return (
    <aside
      aria-labelledby="next-up-heading"
      className={cn(
        "rounded-2xl border border-brand-red/25 bg-brand-red/[0.04] px-5 py-5 text-center sm:px-8",
        className,
      )}
    >
      <p
        id="next-up-heading"
        className="text-xs font-semibold tracking-[0.18em] text-brand-red uppercase"
      >
        הבא בתור
      </p>
      <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">
        {suggestion.prompt}
      </p>
      <Link
        href={suggestion.href}
        className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-6 text-sm font-bold text-white transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        {suggestion.label}
        <span aria-hidden="true" className="ms-1">
          ›
        </span>
      </Link>
    </aside>
  );
}
