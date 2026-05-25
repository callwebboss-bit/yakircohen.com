import CategoryRelatedLinks from "@/components/seo/CategoryRelatedLinks";
import { cn } from "@/lib/utils";

export type PageRelatedFooterProps = {
  pathname: string;
  title?: string;
  className?: string;
};

/** Same-category pill links (max 3) for SEO + discovery. */
export default function PageRelatedFooter({
  pathname,
  title = "עמודים קשורים",
  className,
}: PageRelatedFooterProps) {
  return (
    <CategoryRelatedLinks
      pathname={pathname}
      title={title}
      className={cn("mt-4", className)}
    />
  );
}
