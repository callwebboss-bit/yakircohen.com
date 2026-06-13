import { ONE_OFF_TIERS, REEL_FACTORY_BRAND } from "@/lib/data/reel-factory";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { CheckIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export default function ReelFactoryOneOffPricing() {
  return (
    <section aria-labelledby="reel-oneoff-heading">
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id="reel-oneoff-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          הזמנה לפי אירוע
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          בלי מנוי - פרומו בודד או Rave 24 שעות מ-{REEL_FACTORY_BRAND}.
        </p>
      </header>

      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {ONE_OFF_TIERS.map((tier) => {
          const isRave = tier.id === "rave-24h";
          const whatsappHref = buildWhatsAppHref({
            text: buildServiceWhatsAppText(`${tier.name} - ${REEL_FACTORY_BRAND}`),
            utm_campaign: tier.utmCampaign,
          });

          return (
            <li
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-background p-6 sm:p-7",
                isRave
                  ? "border-brand-red/50 shadow-[0_8px_32px_rgba(212,43,43,0.12)]"
                  : "border-border",
              )}
            >
              {isRave ? (
                <span className="absolute -top-3 start-6 rounded-full bg-brand-red px-3 py-0.5 text-xs font-semibold text-white">
                  הכי מבוקש
                </span>
              ) : null}

              <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
              <p className="mt-4 text-3xl font-semibold text-brand-red">{tier.priceLabel}</p>
              {tier.priceNote ? (
                <p className="text-xs text-muted-foreground">{tier.priceNote}</p>
              ) : null}

              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.deliverables.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <CheckIcon size={16} className="mt-0.5 shrink-0 text-brand-red" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-8 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  isRave
                    ? "bg-brand-red text-white hover:bg-brand-red-light"
                    : "border border-border bg-surface text-foreground hover:border-brand-red/40",
                )}
              >
                בקשת הצעה בוואטסאפ
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
