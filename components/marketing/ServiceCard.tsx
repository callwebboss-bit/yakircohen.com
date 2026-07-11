// UI-EXCEPTION: premium card glow + single CTA - see docs/ui-exceptions.md
import Link from "next/link";
import type { ReactNode } from "react";
import CheckoutTrustMicro from "@/components/legal/CheckoutTrustMicro";
import ReadMoreText from "@/components/ui/ReadMoreText";
import { SERVICE_CARD_DETAILS_CTA } from "@/lib/data/conversion-copy";
import { cn } from "@/lib/utils";

const AI_BADGE_DEFAULT = "שירות AI";

export type BadgeVariant = "red" | "orange" | "green" | "default";

export type ServiceCardProps = {
  title: string;
  description: string;
  /** When provided, description becomes the teaser and descriptionFull is the expandable part. */
  descriptionFull?: string;
  href: string;
  icon: ReactNode;
  isAiService?: boolean;
  /** הדגשה ויזואלית (טבעת) בלי סטייל Premium AI */
  isFeatured?: boolean;
  badge?: string;
  badgeVariant?: BadgeVariant;
  /** תווית קהל - "מתאים ל:" */
  suitedFor?: string;
  /** מחיר התחלה, למשל "החל מ-590 ₪ + מע״מ" */
  fromPrice?: string;
  /** שורת מחיר משנית, למשל כולל מע״מ */
  fromPriceSubline?: string;
  /** תווית כפתור - ברירת מחדל "📖 לפרטים" */
  ctaLabel?: string;
  /** תבליטים קצרים (עד 4) */
  bullets?: string[];
  /** שורת אמון משפטי/תשלום, ברירת מחדל: כשיש fromPrice */
  showTrustMicro?: boolean;
  /** קישור חיצוני (וואטסאפ) - משתמש ב-<a> במקום Link פנימי */
  external?: boolean;
  className?: string;
};

const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
  orange:
    "border border-orange-200 bg-orange-100 text-orange-700",
  green:
    "border border-emerald-200 bg-emerald-100 text-emerald-800",
  red:
    "border border-brand-red/20 bg-brand-red/10 text-brand-red",
  default:
    "border border-brand-red/50 bg-foreground text-background shadow-[0_0_20px_rgba(212,43,43,0.25)]",
};

function ServiceBadge({ label, variant = "default" }: { label: string; variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide",
        BADGE_VARIANT_CLASSES[variant],
      )}
    >
      {variant === "default" && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red shadow-[0_0_6px_rgba(212,43,43,0.9)]"
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}

export default function ServiceCard({
  title,
  description,
  descriptionFull,
  href,
  icon,
  isAiService = false,
  isFeatured = false,
  badge,
  badgeVariant,
  suitedFor,
  fromPrice,
  fromPriceSubline,
  ctaLabel = SERVICE_CARD_DETAILS_CTA,
  bullets,
  showTrustMicro,
  external = false,
  className,
}: ServiceCardProps) {
  const badgeLabel = badge ?? (isAiService ? AI_BADGE_DEFAULT : undefined);
  const resolvedVariant: BadgeVariant = badgeVariant ?? "default";
  const trustMicro = showTrustMicro ?? Boolean(fromPrice);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col justify-between rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg",
        isAiService
          ? "border-brand-red ring-1 ring-brand-red/20 shadow-md"
          : isFeatured
            ? "border-brand-red/40 bg-background ring-1 ring-brand-red/20 hover:border-brand-red/60"
            : "border-border bg-background hover:border-brand-red/30",
        className,
      )}
    >
      {isAiService ? (
        <div
          className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-brand-red/5 via-brand-red/5 to-brand-red/10 opacity-50 blur-xl transition-opacity duration-300 group-hover:opacity-80"
          aria-hidden="true"
        />
      ) : null}

      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300",
              isAiService
                ? "border-brand-red/30 bg-brand-red text-white group-hover:bg-brand-red"
                : "border-border bg-surface text-brand-red group-hover:border-brand-red/40 group-hover:bg-brand-red group-hover:text-white",
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
          {badgeLabel ? (
            <ServiceBadge label={badgeLabel} variant={resolvedVariant} />
          ) : null}
        </div>

        <h3
          className={cn(
            "text-xl font-bold text-foreground transition-colors duration-200",
            "group-hover:text-brand-red",
          )}
        >
          {title}
        </h3>

        {descriptionFull ? (
          <ReadMoreText
            summary={description}
            full={descriptionFull}
            className="mt-2"
          />
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {bullets?.length ? (
          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            {bullets.slice(0, 4).map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red"
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {suitedFor ? (
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">מתאים ל: </span>
            {suitedFor}
          </p>
        ) : null}

        {fromPrice ? (
          <div className="mt-2">
            <p className="text-sm font-semibold text-brand-red">{fromPrice}</p>
            {fromPriceSubline ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{fromPriceSubline}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {trustMicro ? (
        <CheckoutTrustMicro
          variant="inline"
          className="mt-4"
          showCancellation={false}
          showLegalLinks={false}
        />
      ) : null}

      <div className="mt-6 pt-2">
        {external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${ctaLabel} - ${title}`}
            className={cn(
              "inline-flex min-h-12 w-full items-center justify-center rounded-xl text-sm font-bold transition-all duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
              isAiService
                ? "bg-brand-red text-white shadow-md shadow-brand-red/10 hover:opacity-95"
                : "bg-surface text-brand-red hover:bg-brand-red hover:text-white",
            )}
          >
            {ctaLabel}
          </a>
        ) : (
          <Link
            href={href}
            prefetch
            aria-label={`${ctaLabel} - ${title}`}
            className={cn(
              "inline-flex min-h-12 w-full items-center justify-center rounded-xl text-sm font-bold transition-all duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
              isAiService
                ? "bg-brand-red text-white shadow-md shadow-brand-red/10 hover:opacity-95"
                : "bg-surface text-brand-red hover:bg-brand-red hover:text-white",
            )}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </article>
  );
}
