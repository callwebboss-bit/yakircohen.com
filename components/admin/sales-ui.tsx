"use client";

import { buildFollowUpIcs } from "@/lib/sales/ics";
import type { MorningInclLine } from "@/lib/sales/morning-incl";
import type { SalesCard as SalesCardData, SalesLine } from "@/lib/sales/sales-book";

/**
 * חלקים משותפים לעמדת המכירות: העתקה, תזכורת ביומן וטבלת השורות למורנינג.
 * עברו לכאן מהכרטיס הישן (SalesCard.tsx) כשהכרטיס הפך למחשבון, 12.10.2026.
 */

/* clipboard API, ואם הוא חסום (דפדפן ישן, הקשר לא מאובטח) העתקה דרך שדה זמני */
export async function copyText(text: string): Promise<boolean> {
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

/* שם קצר לאריח ולתזכורת ביומן. לשמונת הנפוצים מילה או שתיים, לשאר השם
   מהקטלוג מקוצר בגבול מילה */
const SHORT_TITLE: Readonly<Record<string, string>> = {
  song_recording: "שיר",
  blessing_recording: "ברכה",
  studio_remote: "הקלטה מרחוק",
  podcast_audio: "פודקאסט",
  mobile_podcast_at_home: "אולפן נייד",
  dj_premium: "DJ",
  event_attraction_1: "אטרקציות",
  event_sound_rental: "הגברה",
};
const SHORT_TITLE_MAX = 28;

export function shortTitle(card: Pick<SalesCardData, "id" | "title">): string {
  const known = SHORT_TITLE[card.id];
  if (known) return known;
  if (card.title.length <= SHORT_TITLE_MAX) return card.title;
  const cut = card.title.slice(0, SHORT_TITLE_MAX);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 1)).trim();
}

/** קובץ יומן לתזכורת מעקב. בכותרת רק שירות ומחיר, בלי פרטים של הלקוח */
export function downloadIcs(title: string, hoursFromNow: 24 | 48): void {
  const ics = buildFollowUpIcs({ title, now: new Date(), hoursFromNow });
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `followup-${hoursFromNow}h.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/* כמו amountText ב-pricing-display.ts: סכום לא שלם עם אגורות ("41.50"), כי
   מחיר לפני מע״מ יכול להיות לא שלם (שמירה קבועה בענן) */
export function money(amount: number): string {
  const text = Number.isInteger(amount)
    ? amount.toLocaleString("he-IL")
    : amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${text} ₪`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function MorningTable({
  inclLines,
  lines,
  totalExVat,
  totalInclVat,
  priceFrom,
}: {
  inclLines: readonly MorningInclLine[];
  lines: readonly SalesLine[];
  totalExVat: number;
  totalInclVat: number;
  priceFrom: boolean;
}) {
  /* החלטת הבעלים 12.10.2026, שורות כולל מע״מ למורנינג: כל שורה כמות 1 בסכום
     כולל מע״מ, והשורה האחרונה סופגת את העיגול, כך שהסך במורנינג שווה לוואטסאפ.
     הפירוט לפני מע״מ נשאר מתחת, ליקיר */
  return (
    <div className="mt-2">
      {priceFrom ? <p className="text-xs text-muted-foreground">מחיר התחלה</p> : null}
      <div className="mt-1 overflow-x-auto">
        <table className="w-full min-w-[18rem] text-right text-xs">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-1 pe-2 font-semibold">תיאור</th>
              <th className="py-1 pe-2 font-semibold">כמות</th>
              <th className="py-1 font-semibold">כולל מע״מ</th>
            </tr>
          </thead>
          <tbody>
            {inclLines.map((l, i) => (
              <tr key={`${l.id}-${i}`} className="border-t border-border">
                <td className="py-1 pe-2">{l.label}</td>
                <td className="py-1 pe-2 tabular-nums">{l.qty}</td>
                <td className="py-1 whitespace-nowrap tabular-nums">{money(l.amountInclVat)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border font-semibold">
              <td colSpan={2} className="py-1 pe-2">סה״כ כולל מע״מ</td>
              <td className="py-1 whitespace-nowrap tabular-nums">{money(totalInclVat)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">במורנינג: בשורה בוחרים &apos;כולל מע״מ&apos;</p>
      <details className="mt-2">
        <summary className="cursor-pointer text-xs text-muted-foreground">פירוט לפני מע״מ</summary>
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
              {lines.map((l, i) => (
                <tr key={`${l.id}-${i}`} className="border-t border-border">
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
            </tfoot>
          </table>
        </div>
      </details>
    </div>
  );
}
