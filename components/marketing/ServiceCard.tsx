// UI-EXCEPTION: stretched-link overlay + nested WhatsApp CTA - see docs/ui-exceptions.md
import Link from "next/link";
import type { ReactNode } from "react";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import ReadMoreText from "@/components/ui/ReadMoreText";
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
  badge?: string;
  badgeVariant?: BadgeVariant;
  whatsappText?: string;
  utm_campaign?: string;
  /** תווית קהל — "מתאים ל:" */
  suitedFor?: string;
  /** מחיר התחלה, למשל "החל מ-590 ₪ + מע״מ" */
  fromPrice?: string;
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

function WhatsAppMiniIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ServiceCard({
  title,
  description,
  descriptionFull,
  href,
  icon,
  isAiService = false,
  badge,
  badgeVariant,
  whatsappText,
  utm_campaign = "service_card",
  suitedFor,
  fromPrice,
  className,
}: ServiceCardProps) {
  const badgeLabel = badge ?? (isAiService ? AI_BADGE_DEFAULT : undefined);
  const resolvedVariant: BadgeVariant = badgeVariant ?? "default";

  const whatsappHref = buildWhatsAppHref({
    text:
      whatsappText ?? buildServiceWhatsAppText(title),
    utm_source: "website",
    utm_campaign,
  });

  return (
    <article
      className={cn(
        // IMPROVED: hover-lift utility (pointer-fine only) replaces raw translate-y
        "group relative flex h-full flex-col rounded-xl border border-border bg-background p-6 shadow-sm hover-lift",
        isAiService && "ring-1 ring-brand-red/20",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-brand-red transition-colors duration-normal ease-luxury group-hover:border-brand-red/40",
            isAiService && "border-brand-red/30 bg-foreground text-brand-red",
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
        {badgeLabel ? <ServiceBadge label={badgeLabel} variant={resolvedVariant} /> : null}
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        <Link
          href={href}
          aria-label={`עבור לעמוד ${title}`}
          className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          {title}
        </Link>
      </h3>

      {descriptionFull ? (
        <ReadMoreText
          summary={description}
          full={descriptionFull}
          className="mt-2 flex-1"
        />
      ) : (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {suitedFor ? (
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">מתאים ל: </span>
          {suitedFor}
        </p>
      ) : null}

      {fromPrice ? (
        <p className="mt-2 text-sm font-semibold text-brand-red">{fromPrice}</p>
      ) : null}

      <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="touch-target inline-flex min-h-11 items-center gap-2 rounded-md border border-brand-red/40 bg-brand-red/10 px-3 text-xs font-semibold text-foreground transition-colors duration-normal ease-luxury hover:bg-brand-red/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          aria-label={`שליחת הודעת וואטסאפ בנוגע ל${title}`}
        >
          <WhatsAppMiniIcon />
          דברו איתנו בוואטסאפ
        </a>
        <Link
          href={href}
          aria-label={`לפרטים מלאים על ${title}`}
          className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors duration-normal ease-luxury hover:text-brand-red hover:underline"
        >
          לפרטים מלאים </Link>
      </div>
    </article>
  );
}
