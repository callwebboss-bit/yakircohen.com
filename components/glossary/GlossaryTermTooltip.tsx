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
import { useEscapeLayer } from "@/hooks/useEscapeLayer";
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

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [isOpen]);

  /* Escape דרך מחסנית השכבות (F-74): שכבה אינטראקטיבית, כך שפופ-אפ רקע גלוי
     (מאתר מתנות) לא נסגר יחד עם ה-tooltip באותה לחיצה. */
  useEscapeLayer({ active: isOpen, onEscape: () => setIsOpen(false) });

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
      /* F-27: הסגירה במיקוד יוצא יושבת על השורש ולא על הקישור. ככה Tab מהמונח
         אל "לערך המלא" שבתוך ה-tooltip לא סוגר אותו לפני שהמיקוד הגיע אליו.
         relatedTarget=null לא סוגר: ב-Safari לחיצה על קישור לא ממקדת אותו,
         והסגירה הייתה מסירה את ה-tooltip לפני שהלחיצה על "לערך המלא" נחתה.
         סגירה גם בלחיצה בחוץ (mousedown) וב-Escape, ולכן אין מצב תקוע. */
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node)) return;
        if (rootRef.current?.contains(next)) return;
        setIsOpen(false);
      }}
    >
      <Link
        href={href}
        aria-describedby={isOpen ? descriptionId : undefined}
        aria-expanded={isOpen}
        className="rounded-sm border-b border-dotted border-foreground/50 text-inherit underline-offset-2 decoration-1 transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        onFocus={() => setIsOpen(true)}
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
        /* F-27 (1.4.13 Hoverable): הרווח של 0.5rem בין המונח לכרטיס היה שטח מת
           שסגר את ה-tooltip ברגע שהעכבר יצא מהקישור. עכשיו הרווח הוא pt-2 של
           עטיפה שקופה, צאצא של השורש שמחזיק את onMouseLeave, והכרטיס יושב
           באותו מקום חזותי כמו קודם. */
        <span className="absolute end-0 top-full z-30 w-72 max-w-[calc(100vw-2rem)] pt-2">
          <span
            id={descriptionId}
            role="dialog"
            aria-label={label ? `הסבר קצר: ${label}` : "הסבר קצר למונח"}
            className="block rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground shadow-xl"
          >
            <span className="block text-muted-foreground">{definition}</span>
            <Link
              href={href}
              className="mt-3 inline-flex min-h-12 items-center text-sm font-medium text-brand-red underline-offset-2 hover:underline"
            >
              לערך המלא
            </Link>
          </span>
        </span>
      ) : null}
    </span>
  );
}
