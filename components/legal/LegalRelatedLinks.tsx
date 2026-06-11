import Link from "next/link";
import { FOOTER_LEGAL_LINKS, type LegalPageHref } from "@/lib/constants";

type LegalRelatedLinksProps = {
  /** Current page href - excluded from the list */
  currentHref?: LegalPageHref;
};

export default function LegalRelatedLinks({ currentHref }: LegalRelatedLinksProps) {
  const links = FOOTER_LEGAL_LINKS.filter((item) => item.href !== currentHref);

  return (
    <nav
      className="mt-12 rounded-xl border border-border bg-surface/60 p-5 sm:p-6"
      aria-label="מסמכים קשורים"
    >
      <h2 className="text-sm font-semibold text-foreground">מסמכים קשורים</h2>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            צור קשר
          </Link>
        </li>
        <li>
          <Link
            href="/book"
            className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            הזמנה מקוונת
          </Link>
        </li>
      </ul>
    </nav>
  );
}
