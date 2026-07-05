import type { PriceScope } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";

export type PriceScopeDisplayLines = {
  primary: string;
  scopeLine?: string;
  vatLine: string;
  /** שורה אחת לכרטיסים צרים */
  compactLine: string;
};

/** מחבר משך + כולל/לא כולל לשורת היקף אחת */
export function formatScopeLine(scope?: PriceScope): string | undefined {
  if (!scope) return undefined;
  const parts: string[] = [];
  if (scope.duration) parts.push(scope.duration);
  if (scope.includes) parts.push(`כולל ${scope.includes}`);
  if (scope.excludes) {
    parts.push(
      scope.excludes.startsWith("לא כולל")
        ? scope.excludes
        : `לא כולל ${scope.excludes}`,
    );
  }
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export function formatPriceScopeDisplay({
  exVat,
  scope,
  showFromPrefix = true,
}: {
  exVat: number;
  scope?: PriceScope;
  showFromPrefix?: boolean;
}): PriceScopeDisplayLines {
  const amount = exVat.toLocaleString("he-IL");
  const prefix = showFromPrefix ? "החל מ-" : "";
  const primary = `${prefix}${amount} ₪ + מע״מ`;
  const scopeLine = formatScopeLine(scope);
  const total = withVat(exVat).toLocaleString("he-IL");
  const vatLine = `כולל מע״מ: ${total} ₪`;
  const compactLine = scopeLine ? `${primary} · ${scopeLine}` : primary;
  return { primary, scopeLine, vatLine, compactLine };
}
