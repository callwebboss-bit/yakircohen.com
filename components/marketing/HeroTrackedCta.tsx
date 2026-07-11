"use client";

import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { fireLeadTouch } from "@/lib/lead-touch";

export type HeroTrackedCtaProps = {
  href: string;
  children: ReactNode;
  source?: string;
  className?: string;
};

export default function HeroTrackedCta({
  href,
  children,
  source = "hero_cta",
  className,
}: HeroTrackedCtaProps) {
  return (
    <Button
      as="link"
      href={href}
      variant="primary"
      className={cn(
        "min-h-14 w-full text-base shadow-[0_0_20px_rgba(212,43,43,0.3)] sm:w-auto sm:text-lg",
        className,
      )}
      onClick={() => fireLeadTouch(source, "book")}
    >
      {children}
    </Button>
  );
}
