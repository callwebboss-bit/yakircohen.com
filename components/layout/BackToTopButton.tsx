import { ArrowIcon } from "@/components/ui/Icons";

// OPTIMIZED: native anchor — no client JS bundle for scroll
export default function BackToTopButton() {
  return (
    <a
      href="#main-content"
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors duration-300 ease-[var(--ease-luxury)] hover:text-brand-red"
      aria-label="חזרה למעלה"
    >
      <ArrowIcon size={14} className="-rotate-90" />
      חזרה למעלה
    </a>
  );
}
