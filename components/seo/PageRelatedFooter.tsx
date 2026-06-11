import Link from "next/link";
import CategoryRelatedLinks from "@/components/seo/CategoryRelatedLinks";
import { cn } from "@/lib/utils";

const CONVERSION_LINKS = [
  { label: "הזמנה מקוונת", href: "/book" },
  { label: "מחירון מרכזי", href: "/pricing" },
] as const;

export type PageRelatedFooterProps = {
  pathname: string;
  title?: string;
  className?: string;
};

/** Same-category links + book/pricing conversion paths for SEO + discovery. */
export default function PageRelatedFooter({
  pathname,
  title = "עמודים קשורים",
  className,
}: PageRelatedFooterProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <CategoryRelatedLinks pathname={pathname} title={title} />
      <nav
        className="flex flex-wrap justify-center gap-3"
        aria-label="הזמנה ומחירון"
      >
        {CONVERSION_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-brand-red/30 bg-brand-red/5 px-4 py-2 text-sm font-semibold text-brand-red hover:border-brand-red/50"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
