import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ContainerVariant = "default" | "wide";

const variantStyles: Record<ContainerVariant, string> = {
  default: "max-w-[var(--width-content)]",
  wide: "max-w-[88rem]",
};

export type ContainerProps = {
  children: ReactNode;
  variant?: ContainerVariant;
  className?: string;
  as?: ElementType;
};

// IMPROVED: shared content width + horizontal padding — replaces repeated max-w-[72rem] mx-auto px-*
export default function Container({
  children,
  variant = "default",
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
