/**
 * ייעול WhatsApp prefills על תוכן קיים - בלי mass-rewrite.
 * - שומר טקסטים ייעודיים שעובדים
 * - מוסיף מקור עמוד (source) כשחסר
 * - מתקן טקסטים ריקים / קצרים מדי
 */

import { buildServiceWhatsAppText } from "@/lib/whatsapp";

/** מחזיר טקסט וואטסאפ מוכן לשליחה - מייעל בלי למחוק ניסוח קיים */
export function resolveIntentWhatsAppText(opts: {
  existingText?: string | null;
  /** שם שירות / נושא לדף - לשימוש כשהטקסט חלש */
  serviceLabel: string;
  startingPrice?: string;
}): string {
  const raw = opts.existingText?.trim() ?? "";
  const looksStrong =
    raw.length >= 20 &&
    (raw.includes("שלום") || raw.includes("היי") || raw.includes("מעוניין"));

  if (looksStrong) return raw;

  return buildServiceWhatsAppText(opts.serviceLabel, opts.startingPrice);
}

/** UTM campaign אחיד מדף - snake_case קצר */
export function intentUtmFromPath(pagePath: string, fallback: string): string {
  const cleaned = pagePath
    .replace(/^\/+/, "")
    .replace(/\/+/g, "_")
    .replace(/[^a-zA-Z0-9_\u0590-\u05FF-]/g, "")
    .slice(0, 48);
  return cleaned || fallback;
}
