import Link from "next/link";

type BusinessCrossLinkProps = {
  title: string;
  text: string;
  href: string;
  linkLabel?: string;
};

/** פסקה + CTA ל-B2B — בלי duplicate content בגוף העמוד */
export default function BusinessCrossLink({
  title,
  text,
  href,
  linkLabel = "לפרטים לעסקים",
}: BusinessCrossLinkProps) {
  return (
    <aside
      className="rounded-xl border border-brand-red/20 bg-brand-red/5 p-6 sm:p-8"
      aria-label={title}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
        {title}
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        {linkLabel} ←
      </Link>
    </aside>
  );
}
