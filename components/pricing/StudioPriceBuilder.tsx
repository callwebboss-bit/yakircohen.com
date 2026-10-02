"use client";

import { useMemo, useState, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import {
  calcStudioPriceBuilder,
  PRICE_BUILDER_DEFAULTS,
  PRICE_BUILDER_DURATION_OPTIONS,
  PRICE_BUILDER_FINISH_OPTIONS,
  PRICE_BUILDER_PARTICIPANT_OPTIONS,
  PRICE_BUILDER_SONG_LINK,
  type PriceBuilderAnswers,
  type PriceBuilderOption,
} from "@/lib/data/studio-price-builder";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function fmtNis(n: number) {
  return `${Math.round(n).toLocaleString("he-IL")} ₪`;
}

function QuestionGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: readonly PriceBuilderOption<T>[];
  onChange: (id: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-foreground">{legend}</legend>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = opt.id === value;
          return (
            <label
              key={opt.id}
              className={cn(
                "flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
                selected
                  ? "border-brand-red bg-brand-red/5"
                  : "border-border bg-background hover:border-brand-red/30 hover:bg-brand-red/5",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.id}
                checked={selected}
                onChange={() => onChange(opt.id)}
                className="mt-1 accent-brand-red"
                aria-label={`${opt.label}. ${opt.hint}`}
              />
              <span>
                <span className="block text-sm font-medium text-foreground">
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {opt.hint}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export type StudioPriceBuilderProps = {
  packages?: ReactNode;
};

export default function StudioPriceBuilder({ packages }: StudioPriceBuilderProps) {
  const [answers, setAnswers] = useState<PriceBuilderAnswers>(PRICE_BUILDER_DEFAULTS);
  const result = useMemo(() => calcStudioPriceBuilder(answers), [answers]);

  function patch<K extends keyof PriceBuilderAnswers>(
    key: K,
    value: PriceBuilderAnswers[K],
  ) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  const whatsappHref = buildWhatsAppHref({
    text: result.whatsappText,
    utm_source: "website",
    utm_campaign: "studio_price_builder",
  });

  return (
    <div
      id="price-builder"
      className="scroll-mt-24 rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <header className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
          בנה את ההזמנה שלך
        </p>
        <h2 className="mt-2 font-serif text-section-title font-semibold text-foreground">
          המחיר תלוי בך - לא בנו
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          שעת חדר באולפן. המחיר נקבע לפי 3 פרמטרים: זמן, כמות אנשים ורמת
          גימור. תענו על השאלות - המחיר מתעדכן מול העיניים. זה המחיר. בלי
          הפתעות.
        </p>
      </header>

      <div className="space-y-6">
        <QuestionGroup
          legend="1. כמה זמן תקליט?"
          name="pb-duration"
          value={answers.duration}
          options={PRICE_BUILDER_DURATION_OPTIONS}
          onChange={(id) => patch("duration", id)}
        />
        <QuestionGroup
          legend="2. כמה משתתפים?"
          name="pb-participants"
          value={answers.participants}
          options={PRICE_BUILDER_PARTICIPANT_OPTIONS}
          onChange={(id) => patch("participants", id)}
        />
        <QuestionGroup
          legend="3. איזה גימור אתה צריך?"
          name="pb-finish"
          value={answers.finish}
          options={PRICE_BUILDER_FINISH_OPTIONS}
          onChange={(id) => patch("finish", id)}
        />
      </div>

      <div
        className="mt-6 rounded-xl border border-brand-red/20 bg-brand-red/5 px-5 py-5"
        aria-live="polite"
      >
        <p className="text-xs font-semibold text-muted-foreground">המחיר שלך</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
          {fmtNis(result.withVat)}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            כולל מע&quot;מ ({fmtNis(result.exVat)} לפני)
          </span>
        </p>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          {result.lines.map((line) => (
            <li key={`${line.label}-${line.exVat}`} className="flex justify-between gap-3">
              <span>{line.label}</span>
              <span className="shrink-0 tabular-nums text-foreground">
                {fmtNis(line.exVat)}
              </span>
            </li>
          ))}
        </ul>
        {result.notes.length > 0 ? (
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {result.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            as="link"
            href={result.bookHref}
            className="min-h-12 w-full sm:w-auto"
          >
            הזמן עכשיו במחיר הזה
          </Button>
          <Button
            as="a"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            className="min-h-12 w-full sm:w-auto"
          >
            רוצה לדבר עם אדם
          </Button>
        </div>
      </div>

      {/* שיר אינו שעת חדר: הקלטה, מיקס ומאסטר במחיר אחד, בטופס נפרד */}
      <p className="mt-4 text-sm text-muted-foreground">
        {PRICE_BUILDER_SONG_LINK.text}{" "}
        <a
          href={PRICE_BUILDER_SONG_LINK.href}
          className="font-semibold text-brand-red underline underline-offset-4"
        >
          {PRICE_BUILDER_SONG_LINK.label}
        </a>
      </p>

      {packages ? (
        <details id="studio-packages" className="mt-6 scroll-mt-24 rounded-xl border border-border bg-background px-4 py-3">
          <summary className="flex min-h-12 cursor-pointer list-none items-center font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
            הצג את כל החבילות
          </summary>
          <div className="mt-4 pb-2">{packages}</div>
        </details>
      ) : null}
    </div>
  );
}
