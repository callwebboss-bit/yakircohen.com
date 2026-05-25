import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import { getIntroSegments } from "@/lib/internal-links/intro-segments";
import { cn } from "@/lib/utils";

export type ContextualIntroParagraphProps = {
  pathname: string;
  className?: string;
};

/**
 * Up to 2–3 in-body internal links per page (data in lib/internal-links/intro-segments.ts).
 */
export default function ContextualIntroParagraph({
  pathname,
  className,
}: ContextualIntroParagraphProps) {
  const segments = getIntroSegments(pathname);
  if (!segments?.length) return null;

  return (
    <p
      className={cn(
        "text-sm leading-relaxed text-muted-foreground sm:text-base",
        className,
      )}
    >
      {segments.map((segment, index) =>
        segment.type === "text" ? (
          <span key={`t-${index}`}>{segment.value}</span>
        ) : (
          <InlineServiceLink key={`l-${segment.href}`} href={segment.href}>
            {segment.label}
          </InlineServiceLink>
        ),
      )}
    </p>
  );
}
