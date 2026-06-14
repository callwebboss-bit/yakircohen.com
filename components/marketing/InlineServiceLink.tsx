import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InlineServiceLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

/** In-body service pathway link for homepage and editorial copy. */
export default function InlineServiceLink({
  href,
  children,
  className,
  ariaLabel,
}: InlineServiceLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "link-underline font-medium text-brand-red transition-colors hover:text-brand-red-light",
        className,
      )}
    >
      {children}
    </Link>
  );
}
