"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import {
  breadcrumbListJsonLd,
  buildBreadcrumbTrail,
} from "@/lib/breadcrumbs/build-trail";
import { cn } from "@/lib/utils";

export type BreadcrumbsProps = {
  className?: string;
};

export default function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname() ?? "/";
  const trail = buildBreadcrumbTrail(pathname);

  if (trail.length === 0) return null;

  return (
    <nav
        aria-label="מיקום בעמוד"
        className={cn(
          // IMPROVED: theme tokens replace hardcoded hex colors
          "min-h-[2.5rem] border-b border-border bg-background/80 backdrop-blur-sm",
          className,
        )}
      >
        <Container
          as="ol"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2.5 text-sm text-muted-foreground"
        >
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={item.href} className="inline-flex items-center gap-2">
                {index > 0 ? (
                  <span className="select-none text-border" aria-hidden>
                    /
                  </span>
                ) : null}
                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="touch-target inline-flex min-h-11 items-center rounded-sm px-1 transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </Container>
      </nav>
  );
}
