import { withVat } from "@/lib/data/pricing";
import { formatConsumerPrice } from "@/lib/data/pricing-display";
import type { LadderCell, PackageLadder as PackageLadderData } from "@/lib/data/podcast-ladder";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type PackageLadderProps = {
  ladder: PackageLadderData;
  /** שם הטבלה לקורא מסך */
  caption: string;
  /** קידומת ל-utm_campaign של כל כפתור, למשל podcast_pricing */
  utmPrefix: string;
  className?: string;
};

function Cell({ cell }: { cell: LadderCell }) {
  switch (cell.kind) {
    case "yes":
      return (
        <>
          <span aria-hidden="true" className="font-bold text-brand-red-text">✓</span>
          <span className="sr-only">כלול</span>
          {cell.text ? <span className="block text-xs text-muted-foreground">{cell.text}</span> : null}
        </>
      );
    case "no":
      /* מילים ולא סימן: מקף ארוך אסור בקופי (audit:ai-tells), ומילים ברורות יותר */
      return <span className="text-muted-foreground">לא כלול</span>;
    case "addon":
      return <span className="text-muted-foreground">בתוספת</span>;
    case "text":
      return <span>{cell.text}</span>;
  }
}

/**
 * סולם חבילות: טבלת השוואה אחת (תוכנית הבהירות, שלב 4, D103). רכיב שרת, בלי JS.
 *
 * רק מה ששונה בין החבילות נכנס לטבלה. מה שזהה בכולן יושב ברשימה אחת מתחתיה,
 * במקום שורות זהות מעומעמות: עמעום פוגע בניגודיות (WCAG 1.4.3).
 * נגישות: caption, th לעמודה ולשורה, ו"כלול" או "לא כלול" גם לקורא מסך.
 * הטבלה ברוחב מלא בלי min-width, כדי שתיכנס ב-320px בלי גלילה הצידה.
 */
export default function PackageLadder({ ladder, caption, utmPrefix, className }: PackageLadderProps) {
  const { packages, rows, inAll } = ladder;
  return (
    <div className={cn("rounded-2xl border border-border bg-background", className)}>
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col className="w-[31%]" />
          {packages.map((pkg) => (
            <col key={pkg.id} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-border bg-surface">
            <td className="p-2 sm:p-4" />
            {packages.map((pkg) => {
              /* המספר גדול ו"כולל מע״מ" בקטן מתחתיו, כדי שייכנס בעמודה צרה בטלפון */
              const price = formatConsumerPrice(pkg.exVat);
              return (
                <th key={pkg.id} scope="col" className="p-2 text-center align-bottom sm:p-4">
                  <span className="block text-sm font-semibold text-foreground sm:text-base">{pkg.title}</span>
                  <data
                    value={String(withVat(pkg.exVat))}
                    className="mt-1 block whitespace-nowrap text-base font-bold tabular-nums text-foreground sm:text-xl"
                  >
                    {price.total}
                  </data>
                  <span className="block text-[0.7rem] font-normal text-muted-foreground sm:text-xs">כולל מע״מ</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-b-0">
              <th scope="row" className="p-2 text-start text-xs font-medium leading-snug text-foreground sm:p-4 sm:text-sm">
                {row.label}
              </th>
              {row.cells.map((cell, i) => (
                <td key={packages[i].id} className="p-2 text-center text-xs leading-snug text-foreground sm:p-4 sm:text-sm">
                  <Cell cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border bg-surface">
            <td className="p-2 sm:p-4" />
            {packages.map((pkg) => (
              <td key={pkg.id} className="p-1.5 text-center sm:p-4">
                <a
                  href={buildWhatsAppHref({
                    text: pkg.whatsappText,
                    utm_source: "website",
                    utm_campaign: `${utmPrefix}_${pkg.id}`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-press inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-brand-red/40 px-1.5 py-2 text-xs font-semibold leading-tight text-brand-red-text hover:bg-brand-red/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:text-sm"
                >
                  הצעה בוואטסאפ
                  <span className="sr-only">: {pkg.name}</span>
                </a>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>

      {inAll.length > 0 ? (
        <div className="border-t border-border p-4 sm:p-5">
          <p className="text-sm font-semibold text-foreground">בכל החבילות</p>
          <ul className="mt-2 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
            {inAll.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span aria-hidden="true" className="font-bold text-brand-red-text">✓</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
