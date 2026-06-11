import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionPadding = "default" | "sm" | "none";

const paddingStyles: Record<SectionPadding, string> = {
  default:
    "py-[var(--spacing-section-sm)] sm:py-20 lg:py-[var(--spacing-section)]",
  sm: "py-12 sm:py-16 lg:py-20",
  none: "",
};

export type SectionProps = {
  children: ReactNode;
  id?: string;
  ariaLabelledby?: string;
  className?: string;
  padding?: SectionPadding;
  as?: ElementType;
};

// IMPROVED: consistent vertical rhythm using spacing-section tokens
export default function Section({
  children,
  id,
  ariaLabelledby,
  className,
  padding = "default",
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(paddingStyles[padding], className)}
    >
      {children}
    </Tag>
  );
}
