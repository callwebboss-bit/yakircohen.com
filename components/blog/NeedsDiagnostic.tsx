"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { DiagnosticConfig, DiagnosticQuestion } from "@/lib/data/blog-diagnostic";
import { cn } from "@/lib/utils";

type NeedsDiagnosticProps = {
  config: DiagnosticConfig;
};

export default function NeedsDiagnostic({ config }: NeedsDiagnosticProps) {
  const baseId = useId();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const selectedDirections = config.questions
    .map((question) => {
      const optionId = answers[question.id];
      if (!optionId) return null;
      return question.options.find((option) => option.id === optionId)?.direction ?? null;
    })
    .filter((value): value is string => Boolean(value));

  const allAnswered = selectedDirections.length === config.questions.length;
  const headingId = `${baseId}-heading`;

  return (
    <section
      className="mt-12 rounded-2xl border border-border bg-surface p-5 sm:p-8"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="font-serif text-2xl font-semibold tracking-tight text-foreground">
        {config.heading}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{config.intro}</p>

      <div className="mt-8 space-y-8">
        {config.questions.map((question) => (
          <DiagnosticQuestionBlock
            key={question.id}
            question={question}
            selectedId={answers[question.id] ?? null}
            name={`${baseId}-${question.id}`}
            onSelect={(optionId) =>
              setAnswers((current) => ({ ...current, [question.id]: optionId }))
            }
          />
        ))}
      </div>

      {allAnswered ? (
        <p className="mt-8 border-t border-border pt-6 text-base leading-relaxed text-foreground">
          הכיוון הטכני: {selectedDirections.join(" · ")}. אם רוצים שנעשה את העבודה -{" "}
          <Link
            href={config.bookHref}
            className="inline-flex min-h-12 items-center font-semibold text-brand-red underline-offset-2 hover:underline"
          >
            {config.bookCtaLabel}
          </Link>
          .
        </p>
      ) : null}

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{config.expertTipText}</p>
    </section>
  );
}

function DiagnosticQuestionBlock({
  question,
  selectedId,
  name,
  onSelect,
}: {
  question: DiagnosticQuestion;
  selectedId: string | null;
  name: string;
  onSelect: (optionId: string) => void;
}) {
  const descriptionId = `${name}-desc`;
  const selected = question.options.find((option) => option.id === selectedId) ?? null;

  return (
    <fieldset className="space-y-3" aria-describedby={descriptionId}>
      <legend className="text-base font-semibold text-foreground">{question.title}</legend>
      <p id={descriptionId} className="text-sm leading-relaxed text-muted-foreground">
        {question.description}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                "flex min-h-12 cursor-pointer items-center rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                isSelected
                  ? "border-brand-red bg-brand-red/10 text-brand-red"
                  : "border-border bg-background text-foreground hover:border-brand-red/40",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {selected ? (
        <div className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
          <p>{selected.recommendation}</p>
          {selected.ctaHref && selected.ctaLabel ? (
            <Link
              href={selected.ctaHref}
              className="mt-3 inline-flex min-h-12 items-center font-semibold text-brand-red underline-offset-2 hover:underline"
            >
              {selected.ctaLabel}
            </Link>
          ) : null}
        </div>
      ) : null}
    </fieldset>
  );
}
