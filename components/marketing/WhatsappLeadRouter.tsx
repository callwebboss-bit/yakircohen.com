/**
 * WhatsappLeadRouter - Server Component.
 * Uses shared audience route data from book-audience-routes.ts (homepage subset).
 */

import HomeTrustFeatureGrid from "@/components/marketing/HomeTrustFeatureGrid";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { CheckIcon } from "@/components/ui/Icons";
import {
  BOOK_AUDIENCE_ROUTES,
  HOME_AUDIENCE_DISPLAY_ORDER,
  buildFastWhatsAppMessage,
} from "@/lib/data/book-audience-routes";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const HOME_ROUTES = HOME_AUDIENCE_DISPLAY_ORDER.map((id) => {
  const route = BOOK_AUDIENCE_ROUTES.find((r) => r.id === id);
  if (!route) throw new Error(`Missing home audience route: ${id}`);
  return route;
});

function WaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
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
  eyebrow = "הצעת מחיר בוואטסאפ",
  heading = "בחרו שירות לקבלת הצעת מחיר",
  description =
    "בחרו חבילה, ראו מה כלול, ועברו לוואטסאפ עם הצעת מחיר ראשונית.",
  className,
}: WhatsappLeadRouterProps) {
  return (
    <Section
      className={cn("bg-surface/40", className)}
      ariaLabelledby="wa-router-heading"
    >
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-red/20 bg-brand-red/10 px-4 py-1.5 text-xs font-bold text-brand-red">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-red"
              aria-hidden="true"
            />
            {eyebrow}
          </span>

          <h2
            id="wa-router-heading"
            className="mt-4 font-serif text-section-title font-semibold text-foreground"
          >
            {heading}
          </h2>

          <p className="text-lead mt-4 text-muted-foreground">{description}</p>
        </header>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {HOME_ROUTES.map((card) => {
            const waHref = buildWhatsAppHref({
              text: buildFastWhatsAppMessage(card),
              utm_source: "website",
              utm_campaign: card.utm_campaign,
            });
            const featured = card.isFeatured === true;
            const title = card.homeCardTitle ?? card.title;
            const descriptionText = card.homeCardDescription ?? card.description;
            const features = card.homeFeatures ?? [];

            return (
              <a
                key={card.id}
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-8 transition-all duration-300",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  "motion-reduce:transform-none [@media(hover:hover)]:hover:-translate-y-2.5",
                  featured
                    ? "border-2 border-brand-red bg-background shadow-xl shadow-brand-red/5 [@media(hover:hover)]:shadow-[0_20px_40px_-15px_rgba(212,43,43,0.25)]"
                    : "border-border bg-background shadow-sm [@media(hover:hover)]:border-brand-red [@media(hover:hover)]:shadow-[0_20px_40px_-15px_rgba(212,43,43,0.12)]",
                )}
                aria-label={`${title} - החל מ-${card.priceExVat.toLocaleString("he-IL")} ₪ + מע״מ - פתיחת וואטסאפ`}
              >
                {featured ? (
                  <span className="absolute start-0 top-0 rounded-br-xl bg-brand-red px-5 py-1.5 text-xs font-bold tracking-wide text-white">
                    פופולרי
                  </span>
                ) : null}

                <div>
                  <div
                    className={cn(
                      "mb-6 flex h-14 w-14 items-center justify-center rounded-xl text-2xl transition-colors duration-300",
                      featured
                        ? "bg-brand-red text-white shadow-md shadow-brand-red/20"
                        : "bg-brand-red/5 group-hover:bg-brand-red/10",
                    )}
                    aria-hidden="true"
                  >
                    {card.icon}
                  </div>

                  <h3
                    className={cn(
                      "text-2xl font-bold text-foreground transition-colors duration-200",
                      "group-hover:text-brand-red",
                    )}
                  >
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {descriptionText}
                  </p>

                  {features.length > 0 ? (
                    <ul className="mb-8 mt-6 space-y-3 border-t border-border/50 pt-6 text-right">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-sm text-muted-foreground"
                        >
                          <CheckIcon
                            size={18}
                            className="shrink-0 font-bold text-brand-red"
                            aria-hidden="true"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {card.valueFrame ? (
                    <p className="text-xs font-medium text-muted-foreground">
                      {card.valueFrame}
                    </p>
                  ) : null}
                </div>

                <div className="w-full pt-4">
                  <div className="mb-5 flex items-baseline justify-center gap-1">
                    <span className="text-xs font-normal text-muted-foreground">
                      החל מ-
                    </span>
                    <span className="text-3xl font-black text-brand-red">
                      {card.priceExVat.toLocaleString("he-IL")} ₪
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      + מע״מ
                    </span>
                  </div>

                  <span
                    className={cn(
                      "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200",
                      featured
                        ? "bg-brand-red text-white shadow-md hover:opacity-95 group-hover:shadow-lg group-hover:shadow-brand-red/20"
                        : "border border-border bg-surface text-foreground group-hover:bg-brand-red group-hover:text-white",
                    )}
                    aria-hidden="true"
                  >
                    <span>
                      {featured ? "קבלו הצעה בוואטסאפ" : "הצעת מחיר בוואטסאפ"}
                    </span>
                    <WaIcon />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <HomeTrustFeatureGrid />
      </Container>
    </Section>
  );
}
