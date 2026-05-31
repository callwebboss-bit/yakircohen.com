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
  /** Green WhatsApp continue intent */
  onContinueClick?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  /** Secondary start-now intent */
  onStartNowClick?: () => void;
  startNowLabel?: string;
  startNowDisabled?: boolean;
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
  onContinueClick,
  continueLabel,
  continueDisabled = false,
  onStartNowClick,
  startNowLabel,
  startNowDisabled = false,
}: CalculatorStickyBarProps) {
  const hasTotal = total > 0;
  const dualMode = Boolean(onContinueClick || onStartNowClick);
  const showPrimary = showCta && hasTotal && !primaryDisabled;

  const greenClass = cn(
    "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white sm:w-auto sm:shrink-0 sm:px-5",
    "transition-colors hover:bg-[#1fba59] disabled:cursor-not-allowed disabled:opacity-50",
  );

  const secondaryClass = cn(
    "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground sm:w-auto sm:shrink-0 sm:px-5",
    "transition-colors hover:border-brand-red/40 hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-50",
  );

  const primaryClass = cn(
    "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-red px-4 py-3 text-sm font-semibold text-white sm:w-auto sm:shrink-0 sm:px-5",
    "transition-colors hover:bg-brand-red-light disabled:cursor-not-allowed disabled:opacity-50",
  );

  const resolvedContinueLabel = continueLabel ?? ctaLabel;
  const resolvedStartNowLabel = startNowLabel ?? "התחל תהליך והזמן עכשיו";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:justify-between sm:gap-4">
        <div className="hidden min-w-0 sm:block">
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

        {dualMode && showPrimary ? (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {onContinueClick ? (
              <button
                type="button"
                onClick={onContinueClick}
                disabled={continueDisabled}
                className={greenClass}
              >
                <WhatsAppIcon />
                <span className="max-w-[9rem] truncate sm:max-w-none">{resolvedContinueLabel}</span>
              </button>
            ) : null}
            {onStartNowClick ? (
              <button
                type="button"
                onClick={onStartNowClick}
                disabled={startNowDisabled}
                className={secondaryClass}
              >
                <span className="max-w-[9rem] truncate sm:max-w-none">{resolvedStartNowLabel}</span>
              </button>
            ) : null}
          </div>
        ) : null}

        {!dualMode && showPrimary && onPrimaryClick ? (
          <button type="button" onClick={onPrimaryClick} className={primaryClass}>
            {ctaLabel}
          </button>
        ) : null}
        {!dualMode && showPrimary && !onPrimaryClick && onWhatsAppClick ? (
          <button type="button" onClick={onWhatsAppClick} className={primaryClass}>
            <WhatsAppIcon />
            <span className="max-w-[9rem] truncate sm:max-w-none">{ctaLabel}</span>
          </button>
        ) : null}
        {!dualMode && showPrimary && !onPrimaryClick && !onWhatsAppClick ? (
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
