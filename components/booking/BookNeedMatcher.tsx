"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AudioShowcase from "@/components/seo/AudioShowcase";
import BookPriceDual from "@/components/booking/BookPriceDual";
import PriceSocialProof from "@/components/booking/PriceSocialProof";
import GlossaryInlineText from "@/components/glossary/GlossaryInlineText";
import StudioSessionClipOffer from "@/components/booking/StudioSessionClipOffer";
import type { BookFullPathSelection } from "@/components/booking/BookAudienceRouter";
import { getAudioDemo } from "@/lib/data/audio-demos";
import { getAudienceRouteById } from "@/lib/data/book-audience-routes";
import {
  BOOK_EDIT_OPTIONS,
  BOOK_PAIN_OPTIONS,
  BOOK_WHERE_OPTIONS,
  matchBookNeed,
  matcherWhatsAppText,
  needsEditQuestion,
  type BookEditId,
  type BookMatcherResult,
  type BookPainId,
  type BookWhereId,
} from "@/lib/data/book-need-matcher";
import { CTA_LABELS, SKEPTICISM_CTA } from "@/lib/data/conversion-copy";
import { getExVat, getPriceTransparencyById, type PriceItemId } from "@/lib/data/pricing-catalog";
import { resolvePricingBookHref } from "@/lib/data/pricing-book-map";
import { trackConversion } from "@/lib/analytics/conversion-events";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type BookNeedMatcherProps = {
  onFullPath: (selection: BookFullPathSelection) => void;
  onShowAllServices: () => void;
};

export default function BookNeedMatcher({
  onFullPath,
  onShowAllServices,
}: BookNeedMatcherProps) {
  const baseId = useId();
  const router = useRouter();
  const [pain, setPain] = useState<BookPainId | null>(null);
  const [where, setWhere] = useState<BookWhereId | null>(null);
  const [edit, setEdit] = useState<BookEditId | null>(null);

  const askEdit = pain ? needsEditQuestion(pain) : false;
  const results = useMemo(() => {
    if (!pain || !where) return [];
    if (askEdit && !edit) return [];
    return matchBookNeed(pain, where, edit);
  }, [pain, where, edit, askEdit]);

  const painLabel = BOOK_PAIN_OPTIONS.find((option) => option.id === pain)?.label ?? "";

  function selectPain(id: BookPainId) {
    setPain(id);
    setWhere(null);
    setEdit(null);
  }

  function selectWhere(id: BookWhereId) {
    setWhere(id);
    setEdit(null);
  }

  function bookResult(item: BookMatcherResult) {
    trackConversion("book_router_select", {
      route_id: item.routeId,
      category: item.categoryId,
    });
    const catalogHref = item.catalogId ? resolvePricingBookHref(item.catalogId) : null;
    if (catalogHref && item.ctaKind === "book") {
      router.push(catalogHref);
      return;
    }
    const route = getAudienceRouteById(item.routeId);
    onFullPath({
      categoryId: item.categoryId,
      routeId: item.routeId,
      filterPreset: route?.filterPreset,
      emotionalLabel: painLabel || item.title,
    });
  }

  function quoteResult(item: BookMatcherResult) {
    const href = buildWhatsAppHref({
      text: matcherWhatsAppText(item, painLabel),
      utm_source: "website",
      utm_campaign: "book_need_matcher",
    });
    openWhatsAppLead(href, { leadCategory: item.categoryId });
  }

  return (
    <section
      className="border-b border-border bg-background px-4 py-8 sm:px-6 lg:px-8"
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="mx-auto max-w-[72rem]">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id={`${baseId}-heading`}
            className="font-serif text-section-title font-semibold text-foreground"
          >
            מה מפריע בהקלטה
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            שלוש שאלות לכל היותר. אחריהן מופיעים השירות, המחיר מהקטלוג, והאזנה לפני/אחרי.
          </p>
        </header>

        <div className="mx-auto mt-8 max-w-3xl space-y-8">
          <MatcherQuestion
            name={`${baseId}-pain`}
            title="מה מפריע הכי הרבה?"
            options={BOOK_PAIN_OPTIONS}
            selectedId={pain}
            onSelect={selectPain}
          />

          {pain ? (
            <MatcherQuestion
              name={`${baseId}-where`}
              title="איפה מקליטים?"
              options={BOOK_WHERE_OPTIONS}
              selectedId={where}
              onSelect={selectWhere}
            />
          ) : null}

          {pain && where && askEdit ? (
            <MatcherQuestion
              name={`${baseId}-edit`}
              title="איזו רמת עריכה צריך?"
              options={BOOK_EDIT_OPTIONS}
              selectedId={edit}
              onSelect={setEdit}
            />
          ) : null}

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((item) => (
                <MatcherResultCard
                  key={item.id}
                  item={item}
                  onBook={() => bookResult(item)}
                  onQuote={() => quoteResult(item)}
                />
              ))}
            </div>
          ) : null}

          <p className="text-center">
            <button
              type="button"
              onClick={onShowAllServices}
              className="inline-flex min-h-12 items-center text-sm font-semibold text-brand-red underline-offset-2 hover:underline"
            >
              כל השירותים
            </button>
          </p>
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            {SKEPTICISM_CTA}
          </p>
        </div>
      </div>
    </section>
  );
}

function MatcherQuestion<T extends string>({
  name,
  title,
  options,
  selectedId,
  onSelect,
}: {
  name: string;
  title: string;
  options: readonly { id: T; label: string }[];
  selectedId: T | null;
  onSelect: (id: T) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-semibold text-foreground">{title}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
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
    </fieldset>
  );
}

function MatcherScopeTooltip({ catalogId }: { catalogId: PriceItemId }) {
  const transparency = getPriceTransparencyById(catalogId);
  const hasBody =
    transparency.included.length > 0 ||
    transparency.excluded.length > 0 ||
    Boolean(transparency.scopeNote);
  if (!hasBody) return null;

  return (
    <details className="mt-3">
      <summary className="flex min-h-12 cursor-pointer list-none items-center text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
        כולל / לא כולל
      </summary>
      <div className="mt-2 space-y-1.5 rounded-lg border border-border/70 bg-background/60 px-2.5 py-2 text-[0.7rem] leading-relaxed text-muted-foreground">
        {transparency.included.length > 0 ? (
          <p>
            <span className="font-semibold text-foreground">כולל: </span>
            <GlossaryInlineText text={transparency.included.join(" · ")} />
          </p>
        ) : null}
        {transparency.excluded.length > 0 ? (
          <p>
            <span className="font-semibold text-foreground">לא כלול: </span>
            <GlossaryInlineText text={transparency.excluded.join(" · ")} />
          </p>
        ) : null}
        {transparency.scopeNote ? (
          <p className="text-foreground/85">
            <GlossaryInlineText text={transparency.scopeNote} />
          </p>
        ) : null}
      </div>
    </details>
  );
}

function MatcherResultCard({
  item,
  onBook,
  onQuote,
}: {
  item: BookMatcherResult;
  onBook: () => void;
  onQuote: () => void;
}) {
  const demo = getAudioDemo(item.demoId);
  const exVat = item.catalogId ? getExVat(item.catalogId) : null;

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h3 className="font-serif text-lg font-semibold text-foreground">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        <GlossaryInlineText text={item.why} />
      </p>
      <p className="mt-2 text-xs font-medium text-brand-red">
        <GlossaryInlineText text={item.outputHint} />
      </p>

      {exVat != null && item.catalogId ? (
        <BookPriceDual className="mt-4" exVat={exVat} size="sm" />
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">הצעת מחיר לפי היקף ומרחק.</p>
      )}

      {item.catalogId ? <MatcherScopeTooltip catalogId={item.catalogId} /> : null}

      {item.categoryId === "studio" ? (
        <StudioSessionClipOffer className="mt-4" headingLevel="h3" />
      ) : null}

      {demo && demo.status === "ready" ? (
        <div className="mt-4">
          <AudioShowcase
            variant={item.showcaseVariant}
            context="compact"
            beforeSrc={demo.beforeSrc}
            afterSrc={demo.afterSrc}
            beforeLabel={demo.beforeLabel}
            afterLabel={demo.afterLabel}
            storageKey={`book-matcher-${demo.storageKey}`}
            beforeNote={demo.beforeNote}
            afterNote={demo.afterNote}
          />
        </div>
      ) : null}

      <PriceSocialProof className="mt-4" testimonialIndex={item.testimonialIndex} />

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {item.ctaKind === "book" ? (
          <>
            <button
              type="button"
              onClick={onBook}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              {CTA_LABELS.bookNowOpenSlot}
            </button>
            <button
              type="button"
              onClick={onQuote}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#178741] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0f6e34] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              {CTA_LABELS.getQuote}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onQuote}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#178741] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0f6e34] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:col-span-2"
          >
            {CTA_LABELS.getQuote}
          </button>
        )}
      </div>
    </article>
  );
}
