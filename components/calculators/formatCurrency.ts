export function formatCurrency(n: number): string {
  return `₪${n.toLocaleString("he-IL")}`;
}

export function formatCurrencyWithVat(n: number): string {
  return formatCurrency(Math.round(n * 1.18));
}
