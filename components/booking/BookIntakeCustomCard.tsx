"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const BOOK_QUICK_INTAKE_ID = "book-quick-intake";
export const BOOK_INTAKE_FOCUS_EVENT = "yakir:book-intake-focus";

type BookIntakeCustomCardProps = {
  className?: string;
};

export function scrollToQuickIntake(): void {
  document.getElementById(BOOK_QUICK_INTAKE_ID)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  requestAnimationFrame(() => {
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(BOOK_INTAKE_FOCUS_EVENT));
    }, 80);
  });
}

export default function BookIntakeCustomCard({ className }: BookIntakeCustomCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={scrollToQuickIntake}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          scrollToQuickIntake();
        }
      }}
      className={cn(
        "book-service-card flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 p-5 text-center transition-colors hover:border-brand-red/50",
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-border bg-surface-container-high text-muted-foreground">
        <Plus className="h-8 w-8" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-foreground">התאמה אישית</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        יש פרויקט מורכב? נבנה חבילה לפי הצורך.
      </p>
      <span className="mt-4 text-sm font-semibold text-brand-red">שלחו פנייה מהירה ↓</span>
    </article>
  );
}
