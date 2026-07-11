import Link from "next/link";
import { cn } from "@/lib/utils";

export type HeroScrollCueProps = {
  href: string;
  className?: string;
};

export default function HeroScrollCue({ href, className }: HeroScrollCueProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center text-sm font-medium text-muted-foreground",
        "transition-colors hover:text-brand-red",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
        "motion-safe:animate-hero-scroll-bounce motion-reduce:animate-none",
        className,
      )}
      aria-label="גללו לתגליות נוספות"
    >
      גללו לתגליות נוספות ↓
    </Link>
  );
}
