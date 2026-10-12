/**
 * שורות למורנינג כולל מע״מ.
 *
 * החלטת הבעלים 12.10.2026, שורות כולל מע״מ למורנינג: הצעת מחיר במורנינג
 * חייבת להגיע בדיוק לסכום של הוואטסאפ. כל שורה היא כמות 1 עם סכום כולל מע״מ,
 * והסכום הוא withVat המעוגל של סכום השורה לפני מע״מ. השורה האחרונה סופגת את
 * העיגול, כך שסך השורות שווה ל-catalogWithVat של הסכום לפני מע״מ, הסכום
 * שהאתר מציג. במורנינג: המסמך vatType 0, השורה vatType 1 (כולל מע״מ).
 */
import { catalogWithVat } from "@/lib/data/pricing-catalog";

/** שורה במבנה של ספר המכירות: כמות ומחיר ליחידה לפני מע״מ */
export type ExVatLine = { id: string; label: string; qty: number; unitExVat: number };

/** שורה למורנינג: כמות 1, סכום שלם כולל מע״מ */
export type MorningInclLine = { id: string; label: string; qty: 1; amountInclVat: number };

/* כמות מעל 1 נכנסת לתיאור, כי במורנינג השורה היא כמות 1 */
function inclLabel(line: ExVatLine): string {
  return line.qty > 1 ? `${line.label} ×${line.qty}` : line.label;
}

/**
 * הופך שורות לפני מע״מ לשורות כולל מע״מ שמסתכמות בדיוק ל-totalInclVat.
 * totalInclVat הוא הסכום שהאתר מציג (catalogWithVat של הסכום לפני מע״מ).
 */
export function morningInclLines(lines: readonly ExVatLine[], totalInclVat: number): MorningInclLine[] {
  if (lines.length === 0) return [];
  const out: MorningInclLine[] = lines.map((l) => ({
    id: l.id,
    label: inclLabel(l),
    qty: 1,
    amountInclVat: catalogWithVat(l.qty * l.unitExVat),
  }));
  const others = out.slice(0, -1).reduce((sum, l) => sum + l.amountInclVat, 0);
  out[out.length - 1].amountInclVat = Math.round(totalInclVat) - others;
  return out;
}
