import WhatsAppIcon from "@/components/calculators/WhatsAppIcon";
import { formatCurrency } from "@/components/calculators/formatCurrency";
import { cn } from "@/lib/utils";

export type CalculatorStickyBarProps = {
  total: number;
  totalLabel?: string;
  subLabel?: string;
  whatsappHref: string;
  showCta?: boolean;
  ctaLabel?: string;
  emptyLabel?: string;
  /** When set, primary CTA is a button (e.g. next step) instead of WhatsApp link. */
  onPrimaryClick?: () => void;
  /** Validated WhatsApp send (replaces direct link when set). */
  onWhatsAppClick?: () => void;
  primaryDisabled?: boolean;
};

export default function CalculatorStickyBar({
  total,
  totalLabel = "השקעה משוערת · לפני מע״מ",
  subLabel,
  whatsappHref,
  showCta = true,
  ctaLabel = "קבעו תיאום בוואטסאפ",
  emptyLabel = "בחרו אפשרויות",
  onPrimaryClick,
  onWhatsAppClick,
  primaryDisabled = false,
}: CalculatorStickyBarProps) {
  const hasTotal = total > 0;
  const showPrimary = showCta && hasTotal && !primaryDisabled;
  const primaryClass = cn(
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-red px-4 py-3 text-sm font-semibold text-white sm:px-5",
    "transition-colors hover:bg-brand-red-light disabled:cursor-not-allowed disabled:opacity-50",
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold tracking-wider text-muted-foreground uppercase">
            {totalLabel}
          </p>
          <p className="text-xl font-bold text-brand-red sm:text-2xl">
            {hasTotal ? formatCurrency(total) : emptyLabel}
          </p>
          {subLabel ? (
            <p className="truncate text-[0.65rem] font-medium text-brand-red">{subLabel}</p>
          ) : null}
        </div>
        {showPrimary && onPrimaryClick ? (
          <button type="button" onClick={onPrimaryClick} className={primaryClass}>
            {ctaLabel}
          </button>
        ) : null}
        {showPrimary && !onPrimaryClick && onWhatsAppClick ? (
          <button type="button" onClick={onWhatsAppClick} className={primaryClass}>
            <WhatsAppIcon />
            <span className="max-w-[9rem] truncate sm:max-w-none">{ctaLabel}</span>
          </button>
        ) : null}
        {showPrimary && !onPrimaryClick && !onWhatsAppClick ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={primaryClass}
          >
            <WhatsAppIcon />
            <span className="max-w-[9rem] truncate sm:max-w-none">{ctaLabel}</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
