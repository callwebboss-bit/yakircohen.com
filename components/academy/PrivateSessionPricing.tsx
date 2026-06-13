import Link from "next/link";
import {
  PRIVATE_SESSION_PLANS,
  PRIVATE_SESSION_PRICE_NOTE,
} from "@/lib/data/academy-private-sessions";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export type PrivateSessionPricingProps = {
  className?: string;
  showPrivateLessonsLink?: boolean;
};

export default function PrivateSessionPricing({
  className,
  showPrivateLessonsLink = true,
}: PrivateSessionPricingProps) {
  return (
    <section
      className={cn(
        "border-y border-border bg-linear-to-b from-brand-red/[0.04] to-background py-14 sm:py-16",
        className,
      )}
      aria-labelledby="private-session-pricing-heading"
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            שיעור בודד
          </p>
          <h2
            id="private-session-pricing-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            בחרו משך - התחילו מהמפגש הראשון
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            לימוד אישי 1:1 באולפן. DJ, הפקה, קול, כלי נגינה או תיאוריה - אתם
            קובעים את הקצב, אנחנו מביאים את הציוד והניסיון.
          </p>
        </header>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          {PRIVATE_SESSION_PLANS.map((plan) => {
            const href = buildWhatsAppHref({
              text: plan.whatsappText,
              utm_source: "academy",
              utm_campaign: plan.utmCampaign,
            });
            return (
              <article
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-background p-6 shadow-sm sm:p-7",
                  plan.featured
                    ? "border-brand-red/50 shadow-[0_8px_40px_rgba(212,43,43,0.12)]"
                    : "border-border",
                )}
              >
                {plan.badge ? (
                  <span className="absolute -top-3 start-6 rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {plan.badge} 🔥
                  </span>
                ) : null}

                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-xs font-medium text-brand-red">
                    {plan.duration}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.tagline}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {plan.price.toLocaleString("he-IL")}
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    ₪
                  </span>
                  <span className="me-2 text-xs text-muted-foreground">
                    + מע״מ
                  </span>
                </div>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span
                        className="mt-1 shrink-0 text-brand-red"
                        aria-hidden
                      >
                        ✦
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-6 flex min-h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition-[background-color,box-shadow,transform] duration-normal ease-luxury active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                    plan.featured
                      ? "bg-brand-red text-white shadow-[0_0_20px_rgba(212,43,43,0.35)] hover:bg-brand-red-light hover:shadow-[0_0_28px_rgba(212,43,43,0.45)]"
                      : "border border-brand-red/40 bg-brand-red/5 text-foreground hover:border-brand-red/60 hover:bg-brand-red/10",
                  )}
                >
                  {plan.cta} </a>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-6 max-w-xl text-center text-xs text-muted-foreground">
          {PRIVATE_SESSION_PRICE_NOTE}
        </p>

        {showPrivateLessonsLink ? (
          <p className="mt-4 text-center text-sm">
            <Link
              href="/academy/private-lessons"
              className="font-medium text-brand-red hover:underline"
            >
              כל מה שכלול בשיעור הפרטי </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
