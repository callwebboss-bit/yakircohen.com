import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InlineServiceLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/** In-body service pathway link for homepage and editorial copy. */
export default function InlineServiceLink({
  href,
  children,
  className,
}: InlineServiceLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "font-medium text-brand-red underline-offset-4 transition-colors hover:text-brand-red-light hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
