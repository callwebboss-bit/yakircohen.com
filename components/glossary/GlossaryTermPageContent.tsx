import Link from "next/link";
import GlossaryInlineText from "@/components/glossary/GlossaryInlineText";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import AnswerBlock from "@/components/seo/AnswerBlock";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import type { GlossaryTerm } from "@/lib/data/glossary";
import {
  buildGlossaryFaqItem,
  getCriticalMistakesForGlossaryTerm,
  getGlossaryTermBySlug,
} from "@/lib/data/glossary";
import {
  buildDefinedTermSchema,
  buildGlossaryTermWebPageSchema,
} from "@/lib/seo/glossary-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

export default function GlossaryTermPageContent({ term }: { term: GlossaryTerm }) {
  const faqItem = buildGlossaryFaqItem(term);
  const criticalMistakes = getCriticalMistakesForGlossaryTerm(term);
  const relatedTerms = (term.relatedTerms ?? [])
    .map((slug) => getGlossaryTermBySlug(slug))
    .filter((item): item is GlossaryTerm => Boolean(item));

  const definedTermSchema = buildDefinedTermSchema(term);
  const pageSchema = buildGlossaryTermWebPageSchema(term);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify([definedTermSchema, pageSchema]),
        }}
      />
      <FaqPageSchema items={[faqItem]} />

      <div className="bg-background">
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-brand-red">ערך במונחון</p>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              {term.termHe}
            </h1>
            {term.termEn || term.aliases?.length ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {term.termEn ? <span>{term.termEn}</span> : null}
                {term.aliases?.length ? (
                  <span>
                    {term.termEn ? " - " : ""}
                    שמות נוספים: {term.aliases.join(", ")}
                  </span>
                ) : null}
              </p>
            ) : null}
            <div className="mt-6 max-w-3xl">
              <AnswerBlock>
                <GlossaryInlineText text={term.definition} />
              </AnswerBlock>
            </div>
            {term.also ? (
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                <GlossaryInlineText text={term.also} />
              </p>
            ) : null}
          </div>
        </section>

        <section className="mx-auto grid max-w-4xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
          {relatedTerms.length ? (
            <section>
              <h2 className="text-xl font-semibold text-foreground">מונחים קשורים</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {relatedTerms.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/glossary/${related.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:border-brand-red hover:text-brand-red"
                  >
                    {related.termHe}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {term.relatedService ? (
            <section className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="text-xl font-semibold text-foreground">איפה פוגשים את המונח בפועל</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                המונח הזה מופיע גם בהקשר מעשי של{" "}
                <InlineServiceLink href={term.relatedService.href}>
                  {term.relatedService.label}
                </InlineServiceLink>
                .
              </p>
            </section>
          ) : null}

          {criticalMistakes ? (
            <section className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="text-xl font-semibold text-foreground">
                טעויות קריטיות שעושים
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {criticalMistakes.mistakes.map((mistake) => (
                  <li key={mistake} className="flex gap-3">
                    <span className="mt-0.5 text-brand-red" aria-hidden>
                      -
                    </span>
                    <GlossaryInlineText text={mistake} />
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl border border-border bg-background p-4">
                <h3 className="text-sm font-semibold text-foreground">
                  איך אצלנו חוסכים את זה
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <GlossaryInlineText text={criticalMistakes.prevention} />
                </p>
              </div>
            </section>
          ) : null}

          {term.longTail?.length ? (
            <section>
              <h2 className="text-xl font-semibold text-foreground">ניסוחים נפוצים</h2>
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {term.longTail.map((variant) => (
                  <li key={variant} className="rounded-xl border border-border bg-surface px-4 py-3">
                    {variant}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h2 className="text-xl font-semibold text-foreground">שאלה קצרה</h2>
            <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-base font-semibold text-foreground">{faqItem.question}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <GlossaryInlineText text={faqItem.answer} />
              </p>
            </div>
          </section>
        </section>
      </div>
    </>
  );
}
