"use client";

import { useEffect } from "react";
import { BookUniversalIntakeWizardLazy } from "@/components/booking/lazy";
import {
  BOOK_QUICK_INTAKE_ID,
  scrollToQuickIntake,
} from "@/components/booking/BookIntakeCustomCard";
import { useBookPageLayout } from "@/components/booking/BookPageLayoutContext";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export default function BookQuickIntakeSection() {
  const { activeCategory, intakeExpanded, setIntakeExpanded, setIntakeInView } =
    useBookPageLayout();

  useEffect(() => {
    const el = document.getElementById(BOOK_QUICK_INTAKE_ID);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntakeInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.25, rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setIntakeInView]);

  const collapsed = Boolean(activeCategory) && !intakeExpanded;

  return (
    <Section
      id={BOOK_QUICK_INTAKE_ID}
      className={cn("scroll-mt-24 border-t border-border bg-background", collapsed && "py-6")}
    >
      <Container className="max-w-2xl">
        {collapsed ? (
          <div className="rounded-xl border border-border bg-surface px-4 py-4 text-center">
            <p className="text-sm text-muted-foreground">
              ממשיכים בהזמנה למעלה. צריכים משהו אחר?
            </p>
            <button
              type="button"
              onClick={() => {
                setIntakeExpanded(true);
                scrollToQuickIntake();
              }}
              className="mt-2 inline-flex min-h-12 items-center text-sm font-semibold text-brand-red hover:underline"
            >
              שלחו פנייה מהירה
            </button>
          </div>
        ) : (
          <>
            <h2 className="mb-4 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              שלחו פנייה מהירה
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              לא מצאתם כיוון מתאים? תארו בקצרה — אחזור תוך 24 שעות.
            </p>
            <BookUniversalIntakeWizardLazy />
          </>
        )}
      </Container>
    </Section>
  );
}
