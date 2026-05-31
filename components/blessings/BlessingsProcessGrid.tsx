import type { BlessingsProcessStep } from "@/lib/data/blessings-subpages";

export type BlessingsProcessGridProps = {
  steps: readonly BlessingsProcessStep[];
};

export default function BlessingsProcessGrid({ steps }: BlessingsProcessGridProps) {
  return (
    <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step) => (
        <li
          key={step.step}
          className="rounded-2xl border border-border bg-surface p-5 text-center"
        >
          <span className="text-xs font-bold tracking-widest text-brand-red">
            {step.step}
          </span>
          <h3 className="mt-2 text-sm font-semibold text-foreground">{step.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
