"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { GlossaryCategoryId, GlossaryTerm } from "@/lib/data/glossary";
import { GLOSSARY_CATEGORIES } from "@/lib/data/glossary";
import { cn } from "@/lib/utils";

type GlossaryHubContentProps = {
  terms: readonly GlossaryTerm[];
};

export default function GlossaryHubContent({
  terms,
}: GlossaryHubContentProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<GlossaryCategoryId | "all">(
    "all",
  );

  const filteredTerms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return terms.filter((term) => {
      if (activeCategory !== "all" && term.category !== activeCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        term.termHe,
        term.termEn,
        ...(term.aliases ?? []),
        ...(term.longTail ?? []),
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery));
    });
  }, [activeCategory, query, terms]);

  const grouped = useMemo(() => {
    return filteredTerms.reduce<Record<string, GlossaryTerm[]>>((acc, term) => {
      const letter = term.termHe.charAt(0);
      acc[letter] ??= [];
      acc[letter]!.push(term);
      return acc;
    }, {});
  }, [filteredTerms]);

  const letters = Object.keys(grouped).sort(
    (a, b) => a.localeCompare(b, "he"),
  );

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-brand-red">מונחון אורגני</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            מונחון אודיו, אולפן ואירועים
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            עמוד זה מרכז הגדרות קצרות למונחים מקצועיים בתחום האולפן, הפודקאסט,
            ה-DJ והאירועים. כל ערך עונה קודם על מה זה המונח, ואז מפנה לערך מלא
            או לעמוד שירות קשור.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <label className="flex flex-col gap-2 text-sm text-foreground">
              חיפוש מונח
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="EQ, LUFS, צ'ק סאונד, מיתוג קולי"
                className="min-h-12 rounded-xl border border-border bg-background px-4 text-base outline-none transition-colors focus:border-brand-red"
              />
            </label>
            <div className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">{filteredTerms.length} מונחים</div>
              <div className="mt-1">הצגה לפי חיפוש וקטגוריה.</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm transition-colors",
                activeCategory === "all"
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-border bg-background text-foreground hover:border-brand-red/40",
              )}
            >
              הכל
            </button>
            {GLOSSARY_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm transition-colors",
                  activeCategory === category.id
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-border bg-background text-foreground hover:border-brand-red/40",
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 border-b border-border pb-6">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${encodeURIComponent(letter)}`}
              className="inline-flex min-h-11 items-center rounded-full border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-brand-red hover:text-brand-red"
            >
              {letter}
            </a>
          ))}
        </div>

        <div className="mt-8 space-y-10">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${encodeURIComponent(letter)}`}>
              <h2 className="text-2xl font-semibold text-foreground">{letter}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {grouped[letter]!.map((term) => (
                  <article
                    key={term.slug}
                    className="rounded-2xl border border-border bg-surface p-5"
                  >
                    <div className="text-xs text-muted-foreground">
                      {
                        GLOSSARY_CATEGORIES.find(
                          (category) => category.id === term.category,
                        )?.label
                      }
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">
                      <Link
                        href={`/glossary/${term.slug}`}
                        className="transition-colors hover:text-brand-red"
                      >
                        {term.termHe}
                      </Link>
                    </h3>
                    {term.termEn ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {term.termEn}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {term.definition}
                    </p>
                    <Link
                      href={`/glossary/${term.slug}`}
                      className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-brand-red underline-offset-2 hover:underline"
                    >
                      לערך המלא
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
