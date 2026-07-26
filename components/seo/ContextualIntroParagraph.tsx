import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import ServiceFitSnapshot from "@/components/seo/ServiceFitSnapshot";
import { getIntroSegments } from "@/lib/internal-links/intro-segments";
import { getServiceFit } from "@/lib/data/service-fit-matrix";
import { cn } from "@/lib/utils";

export type ContextualIntroParagraphProps = {
  pathname: string;
  className?: string;
  /**
   * ברירת מחדל: true.
   * כבוי בדפים עם בלוק fit עשיר (AcademyCourseFit / Business audience+outcome).
   */
  showFitSnapshot?: boolean;
};

/**
 * Intro עם קישורי פנים (עד 2–3) + ServiceFitSnapshot כשיש רשומה במטריצה.
 * אם אין intro segments אבל יש fit — מציגים רק את ה-snapshot.
 */
export default function ContextualIntroParagraph({
  pathname,
  className,
  showFitSnapshot = true,
}: ContextualIntroParagraphProps) {
  const segments = getIntroSegments(pathname);
  const hasIntro = Boolean(segments?.length);
  const hasFit =
    showFitSnapshot && getServiceFit(pathname) != null;

  if (!hasIntro && !hasFit) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {hasIntro ? (
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {segments!.map((segment, index) =>
            segment.type === "text" ? (
              <span key={`t-${index}`}>{segment.value}</span>
            ) : (
              <InlineServiceLink key={`l-${segment.href}`} href={segment.href}>
                {segment.label}
              </InlineServiceLink>
            ),
          )}
        </p>
      ) : null}
      {hasFit ? <ServiceFitSnapshot pathname={pathname} /> : null}
    </div>
  );
}
