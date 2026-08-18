"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useGlossaryTooltipRegistry } from "@/components/glossary/GlossaryTooltipProvider";
import { cn } from "@/lib/utils";

type GlossaryTermTooltipProps = {
  slug: string;
  href: string;
  definition: string;
  children: ReactNode;
  className?: string;
};

export default function GlossaryTermTooltip({
  slug,
  href,
  definition,
  children,
  className,
}: GlossaryTermTooltipProps) {
  const pathname = usePathname();
  const { claimFirstUse } = useGlossaryTooltipRegistry();
  const [isOpen, setIsOpen] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const descriptionId = useId();
  const isSelfLink = pathname === href;

  useEffect(() => {
    if (isSelfLink) {
      setIsEligible(false);
      return;
    }
    setIsEligible(claimFirstUse(slug));
  }, [claimFirstUse, isSelfLink, slug]);

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const label = useMemo(
    () => (typeof children === "string" ? children : undefined),
    [children],
  );

  if (isSelfLink || !isEligible) {
    return <>{children}</>;
  }

  return (
    <span
      ref={rootRef}
      className={cn("relative inline", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={href}
        aria-describedby={isOpen ? descriptionId : undefined}
        aria-expanded={isOpen}
        className="rounded-sm border-b border-dotted border-foreground/50 text-inherit underline-offset-2 decoration-1 transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={(event) => {
          if (!isOpen) {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {children}
      </Link>
      {isOpen ? (
        <span
          id={descriptionId}
          role="dialog"
          aria-label={label ? `הסבר קצר: ${label}` : "הסבר קצר למונח"}
          className="absolute end-0 top-[calc(100%+0.5rem)] z-30 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground shadow-xl"
        >
          <span className="block text-muted-foreground">{definition}</span>
          <Link
            href={href}
            className="mt-3 inline-flex min-h-12 items-center text-sm font-medium text-brand-red underline-offset-2 hover:underline"
          >
            לערך המלא
          </Link>
        </span>
      ) : null}
    </span>
  );
}
