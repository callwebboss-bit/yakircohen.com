import Link from "@/components/ui/IntentLink";
import { getExVat, getPriceById } from "@/lib/data/pricing-catalog";
import { formatConsumerPrice } from "@/lib/data/pricing-display";
import { cn } from "@/lib/utils";

/**
 * שורה אחת: מה כלול ב-590 של הקלטת שיר, וקישור ל-/whats-included
 * (תוכנית הבהירות, שלב 4, D102). רכיב שרת.
 *
 * הבעלים בחר שורה קטנה עם קישור במקום קבלה נפרדת: הפירוט המלא כבר קיים בטופס
 * השיר וב-/whats-included. המחיר וההיקף מהקטלוג, בלי סכום כתוב.
 */
export default function SongIncludedLine({ className }: { className?: string }) {
  const price = formatConsumerPrice(getExVat("song_recording"));
  const includes = getPriceById("song_recording").scope?.includes;
  if (!includes) {
    throw new Error("song_recording scope.includes is missing (lib/data/pricing-catalog.ts)");
  }
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      הקלטת שיר: {includes}, {price.totalLabel}.{" "}
      <Link
        href="/whats-included"
        className="font-semibold text-brand-red underline underline-offset-2 hover:text-brand-red-light"
      >
        מה כלול ומה לא
      </Link>
    </p>
  );
}
