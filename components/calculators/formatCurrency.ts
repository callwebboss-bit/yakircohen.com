import { withVat } from "@/lib/data/pricing";

export function formatCurrency(n: number): string {
  return `₪${n.toLocaleString("he-IL")}`;
}

export function formatCurrencyWithVat(n: number): string {
  /* היה כאן Math.round(n * 1.18) קשיח. שיעור המע״מ מגיע מהקטלוג בלבד. */
  return formatCurrency(withVat(n));
}
