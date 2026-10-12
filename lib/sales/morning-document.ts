/**
 * מסמך הצעת מחיר למורנינג מתוך quote של סוכן המכירות
 * (החלטת הבעלים 12.10.2026, סוכן מכירות).
 *
 * המבנה כמו ה-JSON שהבעלים כבר מעלה עם green-invoice-export.py: המסמך vatType 0,
 * כל שורה כמות 1, vatType 1 (המחיר כולל מע״מ), והשורה האחרונה סופגת את העיגול
 * (morningInclLines). כך הסה״כ במורנינג שווה בדיוק לסה״כ באתר.
 *
 * כאן רק בונים. ה-CLI שולח את זה רק ל-preview, ויצירה אמיתית נעשית בסקריפט של
 * הבעלים אחרי "צור במורנינג" מפורש.
 */
import type { MorningInclLine } from "@/lib/sales/morning-incl";

/** 10 = הצעת מחיר במורנינג (TYPE_NAMES ב-green-invoice-export.py) */
export const MORNING_QUOTE_TYPE = 10;

/** רק שני הנתיבים האלה מותרים מה-CLI. שום נתיב שיוצר מסמך */
export const MORNING_ALLOWED_PATHS = ["/account/token", "/documents/preview"] as const;
export type MorningAllowedPath = (typeof MORNING_ALLOWED_PATHS)[number];

export function assertMorningPathAllowed(path: string): MorningAllowedPath {
  const hit = MORNING_ALLOWED_PATHS.find((p) => p === path);
  if (!hit) throw new Error(`נתיב מורנינג אסור ב-CLI: ${path}. מותר רק ${MORNING_ALLOWED_PATHS.join(", ")}`);
  return hit;
}

export type MorningDocumentInput = {
  title: string;
  lines: readonly MorningInclLine[];
  totalInclVat: number;
  clientName?: string | null;
  priceHash: string;
};

export type MorningDocument = {
  type: number;
  lang: "he";
  currency: "ILS";
  vatType: 0;
  description: string;
  client: { name: string; add: boolean; country: "IL"; emails: string[] };
  income: { description: string; quantity: 1; price: number; currency: "ILS"; vatType: 1 }[];
  remarks: string;
};

export function buildMorningQuoteDocument(input: MorningDocumentInput): MorningDocument {
  const name = input.clientName?.trim() || "לקוח";
  const total = Math.round(input.totalInclVat);
  const income = input.lines.map((l) => ({
    description: l.label,
    quantity: 1 as const,
    price: l.amountInclVat,
    currency: "ILS" as const,
    vatType: 1 as const,
  }));
  const sum = income.reduce((s, l) => s + l.price, 0);
  if (sum !== total) throw new Error(`שורות המורנינג (${sum}) לא מסתכמות לסה״כ של האתר (${total})`);
  return {
    type: MORNING_QUOTE_TYPE,
    lang: "he",
    currency: "ILS",
    vatType: 0,
    description: `הצעת מחיר: ${input.title}`,
    /* add: true כמו בקבצים שהבעלים כבר מעלה, כדי שהלקוח יישמר במורנינג ביצירה אמיתית */
    client: { name, add: true, country: "IL", emails: [] },
    income,
    /* בלי סכום בהערות: ה-CLI קורא את "סה"כ לתשלום" של מורנינג מה-PDF, ומספר שלנו היה מתבלבל איתו */
    remarks: `המחירים כוללים מע״מ. מחירון ${input.priceHash}.`,
  };
}
