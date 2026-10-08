/*
 * שדה טופס אחיד לאשפי ההזמנה (נגישות, 7.10.2026):
 * - F-09: גבול border-input במקום border-border/60 (1.13:1, מתחת ל-3:1 של 1.4.11).
 * - F-48 (D4S-05): בפוקוס הגבול מלא (focus:border-brand-red) והטבעת ring-2, במקום
 *   brand-red/40 עם ring-1 (כ-1.9:1). אותו דפוס כמו בטופס יצירת הקשר.
 */
export const bookFieldClass =
  "w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-all";

export const bookSectionClass = "space-y-10";
