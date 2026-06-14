/**
 * WhatsappLeadRouter - Server Component.
 * Uses shared audience route data from book-audience-routes.ts (homepage subset).
 */

import BookPriceDual from "@/components/booking/BookPriceDual";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  BOOK_AUDIENCE_ROUTES,
  HOME_AUDIENCE_ROUTE_IDS,
  buildFastWhatsAppMessage,
  type AudienceCardVariant,
} from "@/lib/data/book-audience-routes";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const HOME_ROUTES = BOOK_AUDIENCE_ROUTES.filter((r) =>
  (HOME_AUDIENCE_ROUTE_IDS as readonly string[]).includes(r.id),
);

const V_CARD: Record<AudienceCardVariant, string> = {
  gold: "bg-background border-border hover:border-brand-red/50 hover:shadow-[0_8px_32px_rgba(212,43,43,0.12)]",
  neutral: "bg-background border-border hover:border-foreground/20 hover:shadow-md",
  luxury:
    "border-border bg-surface hover:border-brand-red/40 hover:shadow-[0_8px_32px_rgba(212,43,43,0.12)]",
  academy: "bg-background border-border hover:border-brand-red/40 hover:shadow-md",
  online: "bg-background border-border hover:border-brand-red/40 hover:shadow-md",
};

const V_ICON: Record<AudienceCardVariant, string> = {
  gold: "bg-brand-red/10",
  neutral: "bg-surface",
  luxury: "bg-white/10",
  academy: "bg-brand-red/10",
  online: "bg-brand-red/10",
};

const V_BADGE: Record<AudienceCardVariant, string> = {
  gold: "bg-brand-red/10 text-brand-red-dark",
  neutral: "bg-brand-red/10 text-brand-red-dark",
  luxury: "bg-brand-red/20 text-brand-red-dark",
  academy: "bg-brand-red/10 text-brand-red-dark",
  online: "bg-brand-red/10 text-brand-red-dark",
};

const V_TITLE: Record<AudienceCardVariant, string> = {
  gold: "text-foreground group-hover:text-brand-red",
  neutral: "text-foreground",
  luxury: "text-foreground group-hover:text-brand-red",
  academy: "text-foreground",
  online: "text-foreground",
};

const V_DESC: Record<AudienceCardVariant, string> = {
  gold: "text-muted-foreground",
  neutral: "text-muted-foreground",
  luxury: "text-muted-foreground",
  academy: "text-muted-foreground",
  online: "text-muted-foreground",
};

const V_CTA: Record<AudienceCardVariant, string> = {
  gold: "bg-brand-red/10 text-foreground border border-brand-red/30 group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red",
  neutral:
    "bg-surface text-foreground border border-border group-hover:bg-foreground group-hover:text-background group-hover:border-foreground",
  luxury:
    "bg-white/10 text-white border border-white/15 group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red",
  academy:
    "bg-surface text-foreground border border-border group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red",
  online:
    "bg-surface text-foreground border border-border group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red",
};

function WaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export type WhatsappLeadRouterProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  className?: string;
};

export default function WhatsappLeadRouter({
  eyebrow = "בואו נדבר תכלס",
  heading = "מה אנחנו מתכננים לכם?",
  description =
    "בחרו את הכיוון שלכם ונעבור ישירות לוואטסאפ לשיחה קצרה בגובה העיניים, בלי אנשי מכירות ובלי כאבי ראש.",
  className,
}: WhatsappLeadRouterProps) {
  return (
    <Section className={cn("bg-background", className)} ariaLabelledby="wa-router-heading">
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand-red/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-red-dark">
            {eyebrow}
          </span>

          <h2
            id="wa-router-heading"
            className="mt-4 font-serif text-section-title font-semibold text-foreground"
          >
            {heading}
          </h2>

          <p className="text-lead mt-4 text-muted-foreground">
            {description}
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {HOME_ROUTES.map((card) => {
            const href = buildWhatsAppHref({
              text: buildFastWhatsAppMessage(card),
              utm_source: "website",
              utm_campaign: card.utm_campaign,
            });

            return (
              <a
                key={card.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative flex min-h-[11rem] flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-sm hover-lift",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  V_CARD[card.variant],
                )}
                aria-label={`${card.title} - ${card.startingPriceDual.replace("כרגע: ", "")} - פתיחת וואטסאפ`}
              >
                {card.variant === "luxury" && (
                  <div
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/65 to-transparent"
                    aria-hidden="true"
                  />
                )}

                <div>
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl",
                        "motion-reduce:transform-none [@media(hover:hover)]:group-hover:scale-110",
                        V_ICON[card.variant],
                      )}
                      aria-hidden="true"
                    >
                      {card.icon}
                    </span>

                    <span
                      className={cn(
                        "mt-1 rounded-md px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wide",
                        V_BADGE[card.variant],
                      )}
                    >
                      {card.tag}
                    </span>
                  </div>

                  <h3
                    className={cn(
                      "font-serif text-lg font-semibold leading-snug",
                      "transition-colors duration-fast ease-luxury",
                      V_TITLE[card.variant],
                    )}
                  >
                    {card.title}
                  </h3>

                  <p className={cn("mt-3 text-sm leading-relaxed", V_DESC[card.variant])}>
                    {card.description}
                  </p>

                  <div className="mt-4 space-y-1">
                    <BookPriceDual
                      exVat={card.priceExVat}
                      dualLabel={card.startingPriceDual}
                      size="sm"
                    />
                    <p className={cn("text-xs font-medium text-foreground")}>
                      {card.valueFrame}
                    </p>
                    <p className={cn("text-xs leading-snug", V_DESC[card.variant])}>
                      {card.upsellHint}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold",
                    "transition-[background-color,color,border-color] duration-normal ease-luxury",
                    V_CTA[card.variant],
                  )}
                  aria-hidden="true"
                >
                  <WaIcon />
                  <span>קבלו הצעת מחיר בוואטסאפ</span>
                  <span
                    className="text-xs opacity-60 transition-transform duration-fast ease-luxury group-hover:-translate-x-1"
                    aria-hidden="true"
                  > </span>
                </div>
              </a>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
