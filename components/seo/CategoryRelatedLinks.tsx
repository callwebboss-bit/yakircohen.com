import Link from "next/link";
import { getSameCategoryLinks } from "@/lib/site-architecture";

export type CategoryRelatedLinksProps = {
  pathname: string;
  title?: string;
  className?: string;
};

/**
 * קישורים פנימיים באותה קטגוריה בלבד (SEO + UX).
 */
export default function CategoryRelatedLinks({
  pathname,
  title = "עמודים קשורים",
  className = "",
}: CategoryRelatedLinksProps) {
  const links = getSameCategoryLinks(pathname).slice(0, 3);
  if (links.length === 0) return null;

  return (
    <section
      className={`flex flex-wrap justify-center gap-3 ${className}`}
      aria-label={title}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
        >
          {item.label}
        </Link>
      ))}
    </section>
  );
}
