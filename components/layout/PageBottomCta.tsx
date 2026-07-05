import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4 shrink-0", className)}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export type PageBottomCtaProps = {
  /** Site: book + contact. WhatsApp: primary WA + optional book/contact. */
  variant?: "site" | "whatsapp";
  /** Full-width section (service pages) or compact card (footer). */
  layout?: "section" | "card";
  kicker?: string;
  heading?: string;
  description?: string;
  className?: string;
  headingId?: string;
  whatsappHref?: string;
  whatsappLabel?: string;
  whatsappAriaLabel?: string;
  /** Secondary book + contact under WhatsApp CTA (service pages). */
  showBookContact?: boolean;
  bookHref?: string;
  bookLabel?: string;
  children?: ReactNode;
};

const SITE_DEFAULTS = {
  heading: "מוכנים להתחיל?",
  description: "הזמנה מקוונת או ייעוץ חינם - נחזור אליכם בהקדם",
} as const;

const WHATSAPP_DEFAULTS = {
  heading: "מוכנים לסגור תאריך?",
  description:
    "שיחה קצרה בוואטסאפ - נציע מחיר מותאם, נסביר את כל האפשרויות ונבדוק זמינות.",
  whatsappLabel: "קבלו הצעת מחיר בוואטסאפ",
} as const;

export default function PageBottomCta({
  variant = "site",
  layout = "card",
  kicker,
  heading,
  description,
  className,
  headingId = "page-bottom-cta-heading",
  whatsappHref,
  whatsappLabel,
  whatsappAriaLabel,
  showBookContact = true,
  bookHref = "/book",
  bookLabel = "הזמנה מקוונת",
  children,
}: PageBottomCtaProps) {
  const resolvedHeading =
    heading ??
    (variant === "whatsapp" ? WHATSAPP_DEFAULTS.heading : SITE_DEFAULTS.heading);
  const resolvedDescription =
    description ??
    (variant === "whatsapp"
      ? WHATSAPP_DEFAULTS.description
      : SITE_DEFAULTS.description);
  const resolvedWaLabel =
    whatsappLabel ?? WHATSAPP_DEFAULTS.whatsappLabel;

  const actions =
    variant === "site" ? (
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-end">
        <Button as="link" href={bookHref} className="w-full sm:w-auto">
          {bookLabel}
        </Button>
        <Button
          as="link"
          href="/contact"
          variant="secondary"
          className="w-full sm:w-auto"
        >
          צור קשר
        </Button>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {whatsappHref ? (
            <Button
              as="a"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              liquid
              className="w-full gap-2 px-8 shadow-[0_0_20px_rgba(212,43,43,0.25)] hover:shadow-[0_0_32px_rgba(212,43,43,0.4)] sm:w-auto"
              aria-label={whatsappAriaLabel ?? resolvedWaLabel}
            >
              <WhatsAppIcon />
              {resolvedWaLabel}
            </Button>
          ) : null}
          {showBookContact ? (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button as="link" href={bookHref} variant="secondary" className="w-full sm:w-auto">
                {bookLabel}
              </Button>
              <Button as="link" href="/contact" variant="outline" className="w-full sm:w-auto">
                צור קשר
              </Button>
            </div>
          ) : null}
        </div>
        {whatsappHref ? (
          <p className="text-xs text-neutral-500">
            מענה אנושי מהיר, {TIME_CLAIMS.waResponse30m}, בלי שום התחייבות.
          </p>
        ) : null}
      </div>
    );

  if (layout === "section") {
    return (
      <Section
        padding="sm"
        className={cn("border-t border-border bg-background text-center", className)}
        ariaLabelledby={headingId}
      >
        <Container>
          {kicker ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              {kicker}
            </p>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              "font-serif text-section-title font-semibold text-foreground",
              kicker && "mt-3",
            )}
          >
            {resolvedHeading}
          </h2>
          <p className="text-lead mx-auto mt-3 max-w-lg text-muted-foreground">
            {resolvedDescription}
          </p>
          <div className="mt-8">{actions}</div>
          {children ? <div className="mt-6">{children}</div> : null}
        </Container>
      </Section>
    );
  }

  return (
    <section
      className={cn(
        "mt-10 rounded-2xl border border-border bg-background px-5 py-6 sm:px-8",
        className,
      )}
      aria-labelledby={headingId}
    >
      <div className="flex flex-col gap-5 text-center sm:text-start md:flex-row md:items-center md:justify-between">
        <div>
          {kicker ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              {kicker}
            </p>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              "text-base font-semibold text-foreground",
              kicker && "mt-2",
            )}
          >
            {resolvedHeading}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{resolvedDescription}</p>
        </div>
        {actions}
      </div>
      {children ? <div className="mt-5 border-t border-border pt-5">{children}</div> : null}
    </section>
  );
}
