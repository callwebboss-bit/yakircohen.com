"use client";

import { useEffect, useRef, useState } from "react";
import { CATALOG_VAT_RATE } from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";
import { formatNis } from "@/lib/data/pricing";
import { buildFollowUpIcs } from "@/lib/sales/ics";
import type { SalesCard as SalesCardData, SalesLine } from "@/lib/sales/sales-book";
import type { VoucherKind } from "@/lib/sales/voucher";
import { cn } from "@/lib/utils";

/**
 * כרטיס שירות בעמדת המכירות. סגור: שם, מחיר וכפתור העתקה, כי ברוב הפניות זה
 * כל מה שצריך באמצע סשן. פתוח: ההודעה, "רק לוודא", מה כלול ומה לא, שדרוגים,
 * משתתפים, צירופים, ושורות למורנינג.
 *
 * כל מספר כאן מגיע מהכרטיס (lib/sales/sales-book.ts, מהקטלוג) ומעוצב ב-
 * formatPrice, כמו באתר: לצרכן כולל מע״מ קודם, לעסק לפני מע״מ קודם.
 */

export type SalesCopyKind = "message" | "confirm";

type SalesCardProps = {
  card: SalesCardData;
  open: boolean;
  highlighted: boolean;
  onToggle: (id: string) => void;
  onCopy: (cardId: string, what: SalesCopyKind) => void;
  onVoucher: (card: SalesCardData, kind: VoucherKind) => void;
};

/* clipboard API, ואם הוא חסום (דפדפן ישן, הקשר לא מאובטח) העתקה דרך שדה זמני */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.cssText = "position:fixed;top:0;opacity:0;pointer-events:none";
      document.body.appendChild(field);
      field.select();
      field.setSelectionRange(0, text.length);
      const ok = document.execCommand("copy");
      field.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/* שם קצר לתזכורת ביומן: "מעקב הצעה · שיר · 590". לשמונת הנפוצים שם של מילה
   או שתיים, לשאר השם מהקטלוג מקוצר בגבול מילה */
const SHORT_TITLE: Readonly<Record<string, string>> = {
  song_recording: "שיר",
  blessing_recording: "ברכה",
  studio_remote: "הקלטה מרחוק",
  podcast_audio: "פודקאסט",
  mobile_podcast_at_home: "אולפן נייד",
  dj_premium: "DJ",
  event_attraction_1: "אטרקציה",
  event_sound_rental: "הגברה",
};
const SHORT_TITLE_MAX = 28;

function shortTitle(card: SalesCardData): string {
  const known = SHORT_TITLE[card.id];
  if (known) return known;
  if (card.title.length <= SHORT_TITLE_MAX) return card.title;
  const cut = card.title.slice(0, SHORT_TITLE_MAX);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 1)).trim();
}

function followUpTitle(card: SalesCardData): string {
  const price = `${card.priceFrom ? "מ-" : ""}${formatNis(card.inclVat, { withSymbol: false })}`;
  return `מעקב הצעה · ${shortTitle(card)} · ${price}`;
}

function downloadIcs(card: SalesCardData, hoursFromNow: 24 | 48): void {
  const ics = buildFollowUpIcs({ title: followUpTitle(card), now: new Date(), hoursFromNow });
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `followup-${hoursFromNow}h.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/* ─── מורנינג ─── */

/* כמו amountText ב-pricing-display.ts: סכום לא שלם עם אגורות ("41.50"), כי
   מחיר לפני מע״מ יכול להיות לא שלם (שמירה קבועה בענן) */
function money(amount: number): string {
  const text = Number.isInteger(amount)
    ? amount.toLocaleString("he-IL")
    : amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${text} ₪`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function MorningTable({
  title,
  lines,
  totalExVat,
  totalInclVat,
  priceFrom,
}: {
  title: string;
  lines: readonly SalesLine[];
  totalExVat: number;
  totalInclVat: number;
  priceFrom: boolean;
}) {
  /* באתר המע״מ מעוגל לשקל על הסכום. מורנינג עלול לחשב באגורות, ואז הסך שונה
     בכמה אגורות (תוכנית עמדת המכירות: 23 מתוך 47 צירופים) */
  const exactTotal = round2(totalExVat * (1 + CATALOG_VAT_RATE));
  const differs = Math.abs(exactTotal - totalInclVat) >= 0.005;
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-foreground">
        {title}
        {priceFrom ? <span className="font-normal text-muted-foreground"> (מחיר התחלה)</span> : null}
      </p>
      <div className="mt-1 overflow-x-auto">
        <table className="w-full min-w-[18rem] text-right text-xs">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-1 pe-2 font-semibold">תיאור</th>
              <th className="py-1 pe-2 font-semibold">כמות</th>
              <th className="py-1 font-semibold">ליחידה לפני מע״מ</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={`${l.id}-${l.qty}`} className="border-t border-border">
                <td className="py-1 pe-2">{l.label}</td>
                <td className="py-1 pe-2 tabular-nums">{l.qty}</td>
                <td className="py-1 whitespace-nowrap tabular-nums">{money(l.unitExVat)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border">
              <td colSpan={2} className="py-1 pe-2">סה״כ לפני מע״מ</td>
              <td className="py-1 whitespace-nowrap tabular-nums">{money(totalExVat)}</td>
            </tr>
            <tr>
              <td colSpan={2} className="py-1 pe-2">מע״מ</td>
              <td className="py-1 whitespace-nowrap tabular-nums">{money(round2(totalInclVat - totalExVat))}</td>
            </tr>
            <tr className="font-semibold">
              <td colSpan={2} className="py-1 pe-2">סה״כ כולל מע״מ</td>
              <td className="py-1 whitespace-nowrap tabular-nums">{money(totalInclVat)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {differs ? (
        <p className="mt-1 text-xs text-muted-foreground">
          מורנינג עשוי לחשב {money(exactTotal)} (מע״מ באגורות). אם יוצא שם סכום אחר מ-{money(totalInclVat)},
          עוצרים לפני ששולחים.
        </p>
      ) : null}
    </div>
  );
}

/* ─── הכרטיס ─── */

const chipClass =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50";

export default function SalesCard({ card, open, highlighted, onToggle, onCopy, onVoucher }: SalesCardProps) {
  const [copied, setCopied] = useState<SalesCopyKind | "failed" | null>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const panelId = `sales-card-panel-${card.id}`;
  const fmt = (exVat: number, from = false) => formatPrice(exVat, { from, audience: card.audience });

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copy = async (what: SalesCopyKind) => {
    const text = what === "message" ? card.message : card.confirmLine;
    if (!text) return;
    const ok = await copyText(text);
    window.clearTimeout(timerRef.current);
    setCopied(ok ? what : "failed");
    timerRef.current = window.setTimeout(() => setCopied(null), 2200);
    if (ok) onCopy(card.id, what);
    /* אם ההעתקה נכשלה, פותחים את הכרטיס כדי שאפשר יהיה לסמן את הטקסט ביד */
    else if (!open) onToggle(card.id);
  };

  const requiresLabel = (id: string) => card.addons.find((a) => a.id === id)?.label ?? id;

  return (
    <article
      id={`sales-card-${card.id}`}
      className={cn(
        "scroll-mt-4 rounded-xl border border-border bg-surface shadow-sm",
        highlighted && "ring-2 ring-brand-red",
      )}
    >
      <div className="flex items-start gap-2 p-3">
        <button
          type="button"
          onClick={() => onToggle(card.id)}
          aria-expanded={open}
          aria-controls={panelId}
          className="min-h-11 min-w-0 flex-1 text-start"
        >
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-foreground">{card.title}</span>
            {card.featured ? (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-brand-red-text">
                נפוץ
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">{card.priceLine}</span>
        </button>
        <button
          type="button"
          onClick={() => void copy("message")}
          aria-label={`העתק הודעה ללקוח: ${card.title}`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-brand-red px-3 py-2 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          {copied === "message" ? "הועתק" : "העתק הודעה"}
        </button>
      </div>

      {open ? (
        <div id={panelId} className="grid gap-4 border-t border-border px-3 pt-3 pb-4 text-sm">
          {copied === "failed" ? (
            <p role="alert" className="text-xs text-brand-red-text">
              ההעתקה נחסמה. סמנו את ההודעה והעתיקו ביד.
            </p>
          ) : null}

          <section aria-label="ההודעה ללקוח" className="grid gap-2">
            <p className="rounded-lg bg-muted p-3 leading-relaxed whitespace-pre-wrap text-foreground select-text">
              {card.message}
            </p>
            {card.confirmLine ? (
              <p className="rounded-lg border border-dashed border-border p-3 leading-relaxed text-foreground select-text">
                {card.confirmLine}
              </p>
            ) : null}
          </section>

          <div className="flex flex-wrap gap-2">
            {card.confirmLine ? (
              <button type="button" onClick={() => void copy("confirm")} className={chipClass}>
                {copied === "confirm" ? "הועתק" : "העתק רק לוודא"}
              </button>
            ) : null}
            <button type="button" onClick={() => onVoucher(card, "order")} className={chipClass}>
              אישור הזמנה
            </button>
            <button type="button" onClick={() => onVoucher(card, "gift")} className={chipClass}>
              שובר מתנה
            </button>
            <button
              type="button"
              onClick={() => downloadIcs(card, 24)}
              className={chipClass}
              aria-label="תזכיר לי מחר: קובץ יומן לעוד 24 שעות"
            >
              תזכיר לי מחר
            </button>
            <button
              type="button"
              onClick={() => downloadIcs(card, 48)}
              className={chipClass}
              aria-label="תזכיר לי בעוד יומיים: קובץ יומן לעוד 48 שעות"
            >
              בעוד יומיים
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <section>
              <h3 className="text-xs font-semibold text-foreground">כלול</h3>
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
              <h3 className="text-xs font-semibold text-foreground">לא כלול</h3>
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

          {card.addons.length ? (
            <section>
              <h3 className="text-xs font-semibold text-foreground">שדרוגים</h3>
              <ul className="mt-1 divide-y divide-border">
                {card.addons.map((addon) => (
                  <li key={addon.id} className="flex flex-wrap items-baseline justify-between gap-x-3 py-1.5">
                    <span className="text-foreground">
                      {addon.label}
                      {addon.requires ? (
                        <span className="text-xs text-muted-foreground"> (רק עם {requiresLabel(addon.requires)})</span>
                      ) : null}
                    </span>
                    <span className="whitespace-nowrap text-muted-foreground">
                      עוד {fmt(addon.exVat, addon.priceFrom).headline}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {card.participants?.length ? (
            <section>
              <h3 className="text-xs font-semibold text-foreground">לפי מספר משתתפים</h3>
              {/* קיבולת האולפן, החלטת הבעלים D64, 7.10.2026 */}
              {card.participantsNote ? (
                <p className="mt-1 text-xs text-muted-foreground">{card.participantsNote}.</p>
              ) : null}
              <table className="mt-1 w-full text-right">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="py-1 pe-2 font-semibold">כמה</th>
                    <th colSpan={2} className="py-1 font-semibold">
                      סה״כ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {card.participants.map((row) => {
                    /* אולפן נייד הוא מחיר התחלה, ולכן גם כל שורה בטבלה */
                    const price = fmt(row.totalExVat, card.priceFrom);
                    return (
                      <tr key={row.count} className="border-t border-border">
                        <td className="py-1 pe-2 tabular-nums">{row.count}</td>
                        <td className="py-1 pe-2 whitespace-nowrap text-foreground">{price.headline}</td>
                        <td className="py-1 text-xs whitespace-nowrap text-muted-foreground">{price.vatNote}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ) : null}

          {card.combos.length ? (
            <section>
              <h3 className="text-xs font-semibold text-foreground">צירופים נפוצים</h3>
              <ul className="mt-1 divide-y divide-border">
                {card.combos.map((combo) => {
                  const price = fmt(combo.totalExVat, combo.priceFrom);
                  return (
                    <li key={combo.key} className="flex flex-wrap items-baseline justify-between gap-x-3 py-1.5">
                      <span className="text-foreground">{combo.label}</span>
                      <span className="whitespace-nowrap">
                        <span className="text-foreground">{price.headline}</span>
                        <span className="text-xs text-muted-foreground"> ({price.vatNote})</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <details className="rounded-lg border border-border px-3 py-2">
            <summary className="flex min-h-11 cursor-pointer items-center py-1 text-sm font-semibold text-foreground">
              פירוט ושורות למורנינג
            </summary>
            <MorningTable
              title="השירות לבד"
              lines={card.morningLines}
              totalExVat={card.exVat}
              totalInclVat={card.inclVat}
              priceFrom={card.priceFrom}
            />
            {card.combos.map((combo) => (
              <MorningTable
                key={combo.key}
                title={combo.label}
                lines={combo.lines}
                totalExVat={combo.totalExVat}
                totalInclVat={combo.totalInclVat}
                priceFrom={combo.priceFrom}
              />
            ))}
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
      ) : null}
    </article>
  );
}
