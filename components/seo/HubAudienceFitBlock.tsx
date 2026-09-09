import Link from "next/link";
import {
  FIT_AUDIENCE_LABEL,
  FIT_DELIVERY_LABEL,
  FIT_OUTCOME_LABEL,
  getHubFitByAudience,
  type FitAudience,
  type ServiceFitEntry,
} from "@/lib/data/service-fit-matrix";
import { cn } from "@/lib/utils";

const AUDIENCE_ORDER: readonly FitAudience[] = [
  "families",
  "creators",
  "business",
] as const;

export type HubAudienceFitBlockProps = {
  hubPath: string;
  /** כותרת - שונה מ-HubDecisionMatrix כדי לא לכפול */
  heading?: string;
  headingId?: string;
  className?: string;
  /** כמה שירותים מקסימום לכל קהל */
  maxPerAudience?: number;
};

function formatPrice(exVat: number): string {
  return `מ-${exVat.toLocaleString("he-IL")} ₪ לפני מע״מ`;
}

function ServiceCard({ entry }: { entry: ServiceFitEntry }) {
  return (
    <li>
      <Link
        href={entry.pathname}
        className="flex min-h-12 flex-col gap-1 rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:border-brand-red/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        <span className="text-sm font-semibold text-foreground">
          {entry.titleHe}
        </span>
        <span className="text-xs text-muted-foreground">
          {FIT_DELIVERY_LABEL[entry.delivery]} ·{" "}
          {FIT_OUTCOME_LABEL[entry.outcome]}
          {entry.priceAnchorExVat != null
            ? ` · ${formatPrice(entry.priceAnchorExVat)}`
            : ""}
        </span>
      </Link>
    </li>
  );
}

/**
 * Overlay להאב - בחירה לפי קהל קודם, לא לפי קטגוריה טכנית.
 * לא מחליף HubDecisionMatrix / תוכן קיים.
 */
export default function HubAudienceFitBlock({
  hubPath,
  heading = "למי זה מתאים?",
  headingId = "hub-audience-fit-heading",
  className,
  maxPerAudience = 3,
}: HubAudienceFitBlockProps) {
  const byAudience = getHubFitByAudience(hubPath);
  const groups = AUDIENCE_ORDER.map((audience) => ({
    audience,
    entries: byAudience[audience].slice(0, maxPerAudience),
  })).filter((g) => g.entries.length > 0);

  if (groups.length === 0) return null;

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 sm:p-8",
        className,
      )}
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
      >
        {heading}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        לפי קהל - לא לפי שם טכני של שירות.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {groups.map(({ audience, entries }) => (
          <div key={audience}>
            <h3 className="text-sm font-semibold text-brand-red">
              {FIT_AUDIENCE_LABEL[audience]}
            </h3>
            <ul className="mt-3 space-y-2">
              {entries.map((entry) => (
                <ServiceCard key={entry.pathname} entry={entry} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
