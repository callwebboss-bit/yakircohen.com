"use client";

import { useState } from "react";
import Link from "next/link";
import { UNIFIED_CALC_CATEGORIES } from "@/lib/data/unified-calculator";

const VAT = 0.18;

function fmtNis(n: number) {
  return `${Math.round(n).toLocaleString("he-IL")} ₪`;
}

export default function UnifiedPricingCalculator() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [optionId, setOptionId] = useState<string | null>(null);
  const [skeleton, setSkeleton] = useState(false);

  const category = UNIFIED_CALC_CATEGORIES.find((c) => c.id === categoryId) ?? null;
  const option = category?.options.find((o) => o.id === optionId) ?? null;
  const exVat = option?.exVat ?? null;
  const withVat = exVat !== null ? Math.round(exVat * (1 + VAT)) : null;

  function pickCategory(id: string) {
    if (id === categoryId) {
      setCategoryId(null);
      setOptionId(null);
      return;
    }
    setSkeleton(true);
    setOptionId(null);
    setCategoryId(id);
    setTimeout(() => setSkeleton(false), 160);
  }

  return (
    <div id="calculator" className="scroll-mt-24 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
          מחשבון מחיר מיידי
        </p>
        <h2 className="mt-1 font-serif text-xl font-semibold text-foreground sm:text-2xl">
          בנו את ההזמנה שלכם
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          בחרו קטגוריה ושירות - המחיר מתעדכן ברגע, ללא הרשמה.
        </p>
      </header>

      {/* Step 1: Category buttons */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="קטגוריית שירות">
        {UNIFIED_CALC_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            aria-pressed={cat.id === categoryId}
            onClick={() => pickCategory(cat.id)}
            className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red ${
              cat.id === categoryId
                ? "border-brand-red bg-brand-red/10 text-brand-red"
                : "border-border bg-background text-foreground hover:border-brand-red/40 hover:bg-brand-red/5"
            }`}
          >
            <span className="text-xl" aria-hidden="true">
              {cat.emoji}
            </span>
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* Step 2: Options */}
      {categoryId && (
        <div className="mt-5">
          {skeleton ? (
            <div className="space-y-2.5" aria-busy="true" aria-label="טוען אפשרויות">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[3.75rem] animate-pulse rounded-xl bg-border/50" />
              ))}
            </div>
          ) : (
            <fieldset>
              <legend className="sr-only">בחרו שירות ב{category?.title}</legend>
              <div className="space-y-2">
                {category?.options.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
                      opt.id === optionId
                        ? "border-brand-red bg-brand-red/5"
                        : "border-border bg-background hover:border-brand-red/30 hover:bg-brand-red/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="calc-option"
                        value={opt.id}
                        checked={opt.id === optionId}
                        onChange={() => setOptionId(opt.id)}
                        className="accent-brand-red"
                        aria-label={opt.label}
                      />
                      <div>
                        <p className="text-sm font-medium leading-tight text-foreground">
                          {opt.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{opt.note}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                      {fmtNis(opt.exVat)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      )}

      {/* Price result */}
      {exVat !== null && withVat !== null && category && (
        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-brand-red/20 bg-brand-red/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-foreground">
              {fmtNis(withVat)}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                כולל מע&quot;מ ({fmtNis(exVat)} לפני)
              </span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              מחיר החל מ - הצעה מדויקת, בדרך כלל תוך 24 שעות
            </p>
          </div>
          <Link
            href={category.bookHref}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            להזמנה מקוונת
          </Link>
        </div>
      )}

      {!categoryId && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          בחרו קטגוריה כדי לראות שירותים ומחיר
        </p>
      )}
    </div>
  );
}
