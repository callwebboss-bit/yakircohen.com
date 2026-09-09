import Link from "next/link";
import {
  FIT_AUDIENCE_LABEL,
  FIT_DELIVERY_LABEL,
  FIT_GUIDANCE_LABEL,
  FIT_OUTCOME_LABEL,
  getServiceFit,
  type ServiceFitEntry,
} from "@/lib/data/service-fit-matrix";
import { cn } from "@/lib/utils";

export type ServiceFitSnapshotProps = {
  pathname: string;
  className?: string;
  /** אם כבר יש בלוק fit עשיר בדף - לא להציג */
  forceHide?: boolean;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function SnapshotBody({ fit }: { fit: ServiceFitEntry }) {
  const audience =
    fit.secondaryAudience != null
      ? `${FIT_AUDIENCE_LABEL[fit.primaryAudience]} · גם ${FIT_AUDIENCE_LABEL[fit.secondaryAudience]}`
      : FIT_AUDIENCE_LABEL[fit.primaryAudience];

  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Row label="למי זה" value={audience} />
      <Row label="מה מקבלים" value={FIT_OUTCOME_LABEL[fit.outcome]} />
      <Row label="איפה זה קורה" value={FIT_DELIVERY_LABEL[fit.delivery]} />
      <Row label="רמת ליווי" value={FIT_GUIDANCE_LABEL[fit.guidance]} />
    </dl>
  );
}

/**
 * בלוק קצר - מי / מה / איפה / ליווי + צעד הבא.
 * Additive; לא מחליף H1 או meta.
 * מוזרק אוטומטית מ-ContextualIntroParagraph כשיש רשומה במטריצה.
 */
export default function ServiceFitSnapshot({
  pathname,
  className,
  forceHide = false,
}: ServiceFitSnapshotProps) {
  if (forceHide) return null;
  const fit = getServiceFit(pathname);
  if (!fit) return null;

  const nextFit = getServiceFit(fit.nextPath);

  return (
    <aside
      aria-label="סיכום התאמה לשירות"
      className={cn(
        "rounded-2xl border border-border bg-surface/60 px-5 py-5 sm:px-6",
        className,
      )}
    >
      <SnapshotBody fit={fit} />
      <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">הצעד הבא: </span>
        <Link
          href={fit.nextPath}
          className="font-semibold text-brand-red underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          {nextFit?.titleHe ?? fit.nextPath}
        </Link>
      </p>
    </aside>
  );
}
