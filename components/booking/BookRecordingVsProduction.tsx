import { cn } from "@/lib/utils";

type BookRecordingVsProductionProps = {
  className?: string;
};

export default function BookRecordingVsProduction({
  className,
}: BookRecordingVsProductionProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      <div className="rounded-xl border border-border bg-background p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          הקלטה בלבד
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li>קול מוקלט ומעובד בסיסית</li>
          <li>מיקס ומאסטרינג</li>
          <li>מתאים לתקציב נוח</li>
        </ul>
      </div>
      <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-red">
          הפקה מלאה + שיפור AI
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-foreground">
          <li>תיקון זיופים (Melodyne)</li>
          <li>מיקס מקצועי + מאסטרינג</li>
          <li>נשמע כמו ברדיו — ביטחון מלא</li>
        </ul>
      </div>
    </div>
  );
}
