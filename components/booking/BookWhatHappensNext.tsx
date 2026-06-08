import { cn } from "@/lib/utils";

const DEFAULT_STEPS = [
  { number: 1, title: "שולחים הודעה קצרה", body: "בוואטסאפ - בלי התחייבות" },
  { number: 2, title: "מתאמים תאריך ושעה", body: "בגובה העיניים, בקצב שלכם" },
  { number: 3, title: "מגיעים להקליט בכיף", body: "במודיעין - חנייה חופשית" },
] as const;

type BookWhatHappensNextProps = {
  steps?: readonly { number: number; title: string; body: string }[];
  className?: string;
};

export default function BookWhatHappensNext({
  steps = DEFAULT_STEPS,
  className,
}: BookWhatHappensNextProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-4", className)}>
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-red">
        מה קורה עכשיו?
      </p>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((step) => (
          <li key={step.number} className="flex gap-3">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red"
              aria-hidden="true"
            >
              {step.number}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
