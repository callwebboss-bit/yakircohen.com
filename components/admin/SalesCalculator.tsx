"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useMemo, useRef, useState } from "react";
import PaymentLinks, { paymentTexts, type PaymentCopyKind } from "@/components/admin/PaymentLinks";
import { copyText, downloadIcs, MorningTable, shortTitle } from "@/components/admin/sales-ui";
import { getExVat } from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";
import { formatNis } from "@/lib/data/pricing";
import type { SalesCard as SalesCardData } from "@/lib/sales/sales-book";
import {
  buildSelectionQuote,
  defaultSelection,
  selectionOptions,
  type SelectionInput,
  type SelectionRegion,
} from "@/lib/sales/selection-quote";
import type { VoucherKind } from "@/lib/sales/voucher";
import { cn } from "@/lib/utils";

/**
 * המחשבון של כרטיס בעמדת המכירות (12.10.2026). הבעלים: "אין לי מחיר לצירוף
 * מסוים, וההודעה כללית". נפתח על כל המסך בטלפון: בוחרים שדרוגים, משתתפים,
 * אזור ומספר אטרקציות, והסכום וההודעה מתעדכנים תוך כדי. בתחתית פס קבוע עם
 * הסכום וכפתור העתקה גדול, כי זה מה שלוחצים עליו באמצע סשן.
 *
 * כל מספר מגיע מ-buildSelectionQuote (lib/sales/selection-quote.ts), שמחשב
 * באותן פונקציות כמו האתר.
 */

export type SalesCopyKind = "message" | "confirm" | PaymentCopyKind;

export type CalculatorVoucherForm = {
  addonIds: string[];
  participants: number | null;
  agreed?: string;
};

type SalesCalculatorProps = {
  card: SalesCardData;
  preset?: Partial<SelectionInput>;
  /** כרטיס לפי מזהה, לאישור הזמנה של חבילת אטרקציות */
  cardById: (id: string) => SalesCardData | undefined;
  onClose: () => void;
  onCopy: (cardId: string, what: SalesCopyKind, withSelection: boolean) => void;
  onVoucher: (card: SalesCardData, kind: VoucherKind, form: CalculatorVoucherForm) => void;
};

function initialSelection(card: SalesCardData, preset: Partial<SelectionInput> | undefined): Required<SelectionInput> {
  const base = defaultSelection(card);
  const options = selectionOptions(card);
  const allowed = new Set(options.addons.map((a) => a.id));
  return {
    addonIds: (preset?.addonIds ?? []).filter((id) => allowed.has(id)),
    participants: preset?.participants ?? base.participants,
    region: preset?.region ?? base.region,
    attractionsCount: preset?.attractionsCount ?? base.attractionsCount,
    activations: preset?.activations ?? base.activations,
  };
}

const chipClass =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50";

function Stepper({
  id,
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const btn =
    "inline-flex size-12 items-center justify-center rounded-md border border-border bg-background text-xl font-semibold text-foreground hover:bg-muted/50 disabled:opacity-40";
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p id={`${id}-label`} className="text-sm font-semibold text-foreground">
          {label}
        </p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div role="group" aria-labelledby={`${id}-label`} className="flex shrink-0 items-center gap-2">
        <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`פחות: ${label}`}>
          −
        </button>
        <output aria-live="polite" className="w-8 text-center text-lg font-semibold tabular-nums text-foreground">
          {value}
        </output>
        <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`עוד: ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}

export default function SalesCalculator({ card, preset, cardById, onClose, onCopy, onVoucher }: SalesCalculatorProps) {
  const options = useMemo(() => selectionOptions(card), [card]);
  const [selection, setSelection] = useState<Required<SelectionInput>>(() => initialSelection(card, preset));
  const [copied, setCopied] = useState<SalesCopyKind | "failed" | null>(null);
  /* כפתורי הלינק נפתחים רק אחרי שההודעה או "רק לוודא" הועתקו (הלינק הוא ההודעה השלישית) */
  const [unlocked, setUnlocked] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const quote = useMemo(() => buildSelectionQuote(card, selection), [card, selection]);
  const pay = useMemo(() => paymentTexts(card, quote), [card, quote]);
  const fmt = (exVat: number, from = false) => formatPrice(exVat, { from, audience: card.audience });
  const total = fmt(quote.totalExVat, quote.priceFrom);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const set = (patch: Partial<SelectionInput>) => setSelection((prev) => ({ ...prev, ...patch }));

  /* שדרוג עם תנאי מסמן גם את התנאי, והסרת תנאי מסירה את מה שתלוי בו */
  const toggleAddon = (id: string) =>
    setSelection((prev) => {
      const picked = new Set(prev.addonIds);
      if (picked.has(id)) {
        picked.delete(id);
        for (const a of options.addons) if (a.requires === id) picked.delete(a.id);
      } else {
        picked.add(id);
        const requires = options.addons.find((a) => a.id === id)?.requires;
        if (requires) picked.add(requires);
      }
      return { ...prev, addonIds: options.addons.filter((a) => picked.has(a.id)).map((a) => a.id) };
    });

  const copy = async (what: SalesCopyKind) => {
    const text = what === "message" ? quote.message : what === "confirm" ? quote.confirmLine : pay.byKind[what];
    if (!text) return;
    const ok = await copyText(text);
    window.clearTimeout(timerRef.current);
    setCopied(ok ? what : "failed");
    timerRef.current = window.setTimeout(() => setCopied(null), 2200);
    if (ok) onCopy(card.id, what, quote.hasSelection);
    if (ok && (what === "message" || what === "confirm")) setUnlocked(true);
  };

  const regionLabel = options.regions?.find((r) => r.id === quote.region)?.label ?? null;
  const voucher = (kind: VoucherKind) => {
    const agreed = [
      quote.region && quote.region !== "center" && regionLabel ? `הגעה: ${regionLabel}` : null,
      quote.activations > 0 ? (quote.activations === 1 ? "הפעלה נוספת" : `${quote.activations} הפעלות נוספות`) : null,
    ].filter((x): x is string => Boolean(x));
    /* בחבילת אטרקציות האישור יוצא על החבילה, לא על אטרקציה בודדת */
    const target = (quote.baseId !== card.id ? cardById(quote.baseId) : undefined) ?? card;
    onVoucher(target, kind, {
      addonIds: quote.addonIds,
      participants: quote.participants,
      ...(agreed.length ? { agreed: agreed.join(", ") } : {}),
    });
  };

  const followUpTitle = `מעקב הצעה · ${shortTitle(card)} · ${quote.priceFrom ? "מ-" : ""}${formatNis(quote.totalInclVat, { withSymbol: false })}`;
  const requiresLabel = (id: string) => options.addons.find((a) => a.id === id)?.label ?? id;
  const rule = options.participants;

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          /* אישור ההזמנה נפתח מעל המחשבון כדיאלוג נפרד. לחיצה בו לא סוגרת את המחשבון */
          onInteractOutside={(e) => e.preventDefault()}
          aria-describedby={undefined}
          className="fixed inset-0 z-50 mx-auto flex max-w-lg flex-col bg-background text-foreground shadow-xl outline-none"
        >
          <header className="flex items-start gap-2 border-b border-border bg-surface px-4 py-2">
            <DialogPrimitive.Close asChild>
              <button type="button" className={cn(chipClass, "shrink-0")}>
                חזרה
              </button>
            </DialogPrimitive.Close>
            <div className="min-w-0 flex-1 py-1">
              <DialogPrimitive.Title className="text-base leading-snug font-semibold text-foreground">
                {card.title}
              </DialogPrimitive.Title>
              <p className="text-xs text-muted-foreground">בסיס: {card.priceLine}</p>
            </div>
          </header>

          <div className="grid flex-1 content-start gap-5 overflow-y-auto overscroll-contain px-4 pt-4 pb-6 text-sm">
            {quote.warnings.length ? (
              <ul role="status" className="grid gap-1 rounded-md bg-accent p-2 text-xs text-brand-red-text">
                {quote.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            ) : null}

            {rule ? (
              <Stepper
                id="calc-participants"
                label={`כמה ${rule.noun}?`}
                hint={`${rule.included === 1 ? `${rule.one} אחד` : `${rule.included} ${rule.noun}`} כלולים. כל נוסף ${fmt(getExVat(rule.extraId)).headline}. עד ${rule.max}.`}
                value={quote.participants ?? rule.min}
                min={rule.min}
                max={rule.max}
                onChange={(participants) => set({ participants })}
              />
            ) : null}

            {options.regions ? (
              <fieldset className="grid gap-2">
                <legend className="text-sm font-semibold text-foreground">איפה?</legend>
                <div className="grid grid-cols-3 gap-2">
                  {options.regions.map((r) => {
                    const checked = quote.region === r.id;
                    return (
                      <label
                        key={r.id}
                        className={cn(
                          "flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-md border px-1 py-1 text-center text-sm",
                          checked
                            ? "border-brand-red bg-accent font-semibold text-brand-red-text"
                            : "border-border bg-background text-foreground",
                        )}
                      >
                        <input
                          type="radio"
                          name="calc-region"
                          value={r.id}
                          checked={checked}
                          onChange={() => set({ region: r.id as SelectionRegion })}
                          className="sr-only"
                        />
                        <span>{r.label}</span>
                        <span className="text-[11px] font-normal text-muted-foreground">
                          {r.travelId ? `+${fmt(getExVat(r.travelId)).headline}` : "בלי תוספת"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            {options.attractions ? (
              <div className="grid gap-4">
                <Stepper
                  id="calc-attractions"
                  label="כמה אטרקציות?"
                  hint="מ-2 מחיר חבילה. מ-4 מחיר פתיחה."
                  value={quote.attractionsCount ?? options.attractions.min}
                  min={options.attractions.min}
                  max={options.attractions.max}
                  onChange={(attractionsCount) => set({ attractionsCount })}
                />
                {options.activationsPerAttraction ? (
                  <Stepper
                    id="calc-activations"
                    label="הפעלות נוספות"
                    hint={`זיקוקים או קונפטי. כל הפעלה ${fmt(getExVat("event_extra_activation")).headline}.`}
                    value={quote.activations}
                    min={0}
                    max={(quote.attractionsCount ?? 1) * options.activationsPerAttraction}
                    onChange={(activations) => set({ activations })}
                  />
                ) : null}
              </div>
            ) : null}

            {options.addons.length ? (
              <section aria-labelledby="calc-addons" className="grid gap-2">
                <h3 id="calc-addons" className="text-sm font-semibold text-foreground">
                  שדרוגים
                </h3>
                <div className="grid gap-2">
                  {options.addons.map((addon) => {
                    const on = quote.addonIds.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleAddon(addon.id)}
                        className={cn(
                          "flex min-h-12 w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-start",
                          on ? "border-brand-red bg-accent" : "border-border bg-background hover:bg-muted/50",
                        )}
                      >
                        <span className="flex min-w-0 items-start gap-2">
                          <span
                            aria-hidden
                            className={cn(
                              "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded border text-xs",
                              on ? "border-brand-red bg-brand-red text-white" : "border-border",
                            )}
                          >
                            {on ? "✓" : ""}
                          </span>
                          <span className="text-foreground">
                            {addon.label}
                            {addon.requires ? (
                              <span className="block text-xs text-muted-foreground">
                                רק עם {requiresLabel(addon.requires)}
                              </span>
                            ) : null}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs whitespace-nowrap text-muted-foreground">
                          {/* "מ-" במקום "+" במחיר התחלה: "+מ-4,897" נקרא כמו טעות */}
                          {addon.priceFrom ? "" : "+"}
                          {fmt(addon.exVat, addon.priceFrom).headline}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <section aria-labelledby="calc-message" className="grid gap-2">
              <h3 id="calc-message" className="text-sm font-semibold text-foreground">
                ההודעה ללקוח
              </h3>
              {copied === "failed" ? (
                <p role="alert" className="text-xs text-brand-red-text">
                  ההעתקה נחסמה. סמנו את ההודעה והעתיקו ביד.
                </p>
              ) : null}
              <p
                data-testid="calc-message"
                className="rounded-lg bg-muted p-3 leading-relaxed whitespace-pre-wrap text-foreground select-text"
              >
                {quote.message}
              </p>
              {quote.confirmLine ? (
                <>
                  <p className="rounded-lg border border-dashed border-border p-3 leading-relaxed text-foreground select-text">
                    {quote.confirmLine}
                  </p>
                  <button type="button" onClick={() => void copy("confirm")} className={cn(chipClass, "justify-self-start")}>
                    {copied === "confirm" ? "הועתק" : "העתק רק לוודא"}
                  </button>
                </>
              ) : null}
            </section>

            <PaymentLinks texts={pay} copied={copied} copy={copy} unlocked={unlocked} />

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => voucher("order")} className={chipClass}>
                אישור הזמנה
              </button>
              <button type="button" onClick={() => voucher("gift")} className={chipClass}>
                שובר מתנה
              </button>
              <button
                type="button"
                onClick={() => downloadIcs(followUpTitle, 24)}
                className={chipClass}
                aria-label="תזכיר לי מחר: קובץ יומן לעוד 24 שעות"
              >
                תזכיר לי מחר
              </button>
              <button
                type="button"
                onClick={() => downloadIcs(followUpTitle, 48)}
                className={chipClass}
                aria-label="תזכיר לי בעוד יומיים: קובץ יומן לעוד 48 שעות"
              >
                בעוד יומיים
              </button>
            </div>

            <details className="rounded-lg border border-border px-3 py-2">
              <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-foreground">
                שורות למורנינג
              </summary>
              <MorningTable
                lines={quote.lines}
                totalExVat={quote.totalExVat}
                totalInclVat={quote.totalInclVat}
                priceFrom={quote.priceFrom}
              />
            </details>

            <details className="rounded-lg border border-border px-3 py-2">
              <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-foreground">
                מה כלול ומה לא
              </summary>
              <div className="grid gap-3 pb-2">
                <section>
                  <h4 className="text-xs font-semibold text-foreground">כלול</h4>
                  {card.included ? (
                    <ul className="mt-1 list-disc space-y-0.5 ps-5 text-foreground">
                      {card.included.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-muted-foreground">פירוט לא הוגדר</p>
                  )}
                </section>
                <section>
                  <h4 className="text-xs font-semibold text-foreground">לא כלול</h4>
                  {card.excluded ? (
                    <ul className="mt-1 list-disc space-y-0.5 ps-5 text-foreground">
                      {card.excluded.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-muted-foreground">פירוט לא הוגדר</p>
                  )}
                </section>
              </div>
            </details>

            {card.pageUrl ? (
              <a
                href={card.pageUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center justify-self-start text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                העמוד באתר
              </a>
            ) : null}
          </div>

          <div className="flex items-center gap-3 border-t border-border bg-surface px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
            <div className="min-w-0 flex-1" aria-live="polite">
              <p data-testid="calc-total" className="text-lg leading-tight font-bold text-foreground tabular-nums">
                {total.headline}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">{total.vatNote}</p>
            </div>
            <button
              type="button"
              onClick={() => void copy("message")}
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-md bg-brand-red px-5 text-base font-semibold text-white hover:bg-brand-red-light"
            >
              {copied === "message" ? "הועתק" : "העתק הודעה"}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
