import Link from "next/link";
import type { PortfolioPlaylistCtaConfig } from "@/lib/data/portfolio-playlist-cta";
import { formatHubPriceDual } from "@/lib/data/pricing-display";
import { cn } from "@/lib/utils";

type Props = {
  cta: PortfolioPlaylistCtaConfig;
  className?: string;
};

/**
 * CTA מתחת לבלוק פלייליסט בפורטפוליו - המשך חוויה, לא מכירה מעל הווידאו.
 */
export default function PortfolioPlaylistCta({ cta, className }: Props) {
  const priceLine = formatHubPriceDual(cta.priceExVat, cta.priceFrom);

  return (
    <aside
      className={cn(
        "mt-8 rounded-2xl border border-border bg-surface px-5 py-5 sm:px-6 sm:py-6",
        className,
      )}
      aria-label={cta.prompt}
    >
      <p className="text-center font-serif text-lg font-semibold text-foreground sm:text-xl">
        {cta.prompt}
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">{priceLine}</p>
      <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Link
          href={cta.bookHref}
          className={cn(
            "inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-5 text-sm font-semibold text-white",
            "transition-colors hover:bg-brand-red-light",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
          )}
          data-utm={cta.utmCampaign}
        >
          {cta.bookLabel}
        </Link>
        <Link
          href={cta.serviceHref}
          className={cn(
            "inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground",
            "transition-colors hover:border-brand-red/40 hover:text-brand-red",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
          )}
        >
          {cta.serviceLabel}
        </Link>
      </div>
    </aside>
  );
}
