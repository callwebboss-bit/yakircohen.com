import Link from "next/link";
import { cn } from "@/lib/utils";

type SendFileFabProps = {
  className?: string;
};

/** צף - שליחת קובץ לבדיקה מהירה (/online). תוספת, לא מחליף WhatsApp. */
export default function SendFileFab({ className }: SendFileFabProps) {
  return (
    <Link
      href="/online"
      aria-label="שלחו קובץ לבדיקה מהירה"
      className={cn(
        "fixed z-50 inline-flex min-h-12 max-w-[11rem] items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-lg transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:text-sm",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <span aria-hidden="true">📎</span>
      <span>שלחו קובץ</span>
    </Link>
  );
}
