"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const jsonLd = breadcrumbListJsonLd(trail);

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <nav
        aria-label="מיקום בעמוד"
        className={cn(
          "border-b border-border bg-[#FAFAF8]/80",
          className,
        )}
      >
        <ol
          className="mx-auto flex max-w-[72rem] flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2.5 text-sm text-[#1A1A1A]/75 sm:px-6 lg:px-8"
        >
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={item.href} className="inline-flex items-center gap-2">
                {index > 0 ? (
                  <span className="text-[#1A1A1A]/35 select-none" aria-hidden>
                    /
                  </span>
                ) : null}
                {isLast ? (
                  <span className="font-medium text-[#1A1A1A]" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
