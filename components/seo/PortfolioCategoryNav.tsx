"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/** id הוא ה-id של האלמנט בעמוד */
export type PortfolioCategoryNavItem = { id: string; label: string };

/**
 * ניווט הקטגוריות בתיק העבודות. מסמן את הקטגוריה שבמסך ב-aria-current,
 * כדי שקורא מסך ומשתמש מקלדת יידעו איפה הם (11.10.2026).
 */
export default function PortfolioCategoryNav({
  items,
}: {
  items: readonly PortfolioCategoryNavItem[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) setActiveId(first.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  /* בנייד הרצועה גוללת לרוחב: מביאים את הקטגוריה הפעילה לתצוגה.
     גוללים רק את הרצועה. scrollIntoView היה עוצר את הגלילה החלקה של העמוד
     באמצע הדרך לקטגוריה שנלחצה (נמדד 11.10.2026). */
  useEffect(() => {
    if (!activeId) return;
    const chip = document.querySelector<HTMLElement>(
      `[data-portfolio-nav="${activeId}"]`,
    );
    const strip = chip?.parentElement;
    if (!chip || !strip) return;
    const c = chip.getBoundingClientRect();
    const s = strip.getBoundingClientRect();
    const pad = 16;
    if (c.left < s.left + pad) strip.scrollBy({ left: c.left - s.left - pad });
    else if (c.right > s.right - pad) strip.scrollBy({ left: c.right - s.right + pad });
  }, [activeId]);

  return (
    <nav
      className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      aria-label="קטגוריות תיק עבודות"
    >
      <Container className="flex gap-1 overflow-x-auto py-3">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-portfolio-nav={item.id}
              aria-current={active ? "location" : undefined}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                active
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-border bg-surface text-foreground hover:border-brand-red/40 hover:text-brand-red",
              )}
            >
              {item.label}
            </a>
          );
        })}
      </Container>
    </nav>
  );
}
