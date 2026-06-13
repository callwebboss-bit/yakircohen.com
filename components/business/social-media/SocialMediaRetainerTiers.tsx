import { RETAINER_TIERS, SOCIAL_MEDIA_BRAND } from "@/lib/data/social-media";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { CheckIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export default function SocialMediaRetainerTiers() {
  return (
    <section aria-labelledby="social-retainer-heading">
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id="social-retainer-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          חבילות טיקטוק וריטיינר
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          ריטיינר חודשי קבוע - {SOCIAL_MEDIA_BRAND} והצוות.
        </p>
      </header>

      <ul className="mt-10 grid gap-6 lg:grid-cols-3">
        {RETAINER_TIERS.map((tier) => {
          const isPopular = tier.badge === "popular";
          const whatsappHref = buildWhatsAppHref({
            text: buildServiceWhatsAppText(`${tier.name} - ניהול סושיאל ${SOCIAL_MEDIA_BRAND}`),
            utm_campaign: tier.utmCampaign,
          });

          return (
            <li
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-background p-6 sm:p-7",
                isPopular
                  ? "border-brand-red/50 shadow-[0_8px_32px_rgba(212,43,43,0.12)]"
                  : "border-border",
              )}
            >
              {isPopular ? (
                <span className="absolute -top-3 start-6 rounded-full bg-brand-red px-3 py-0.5 text-xs font-semibold text-white">
                  הכי פופולרי
                </span>
              ) : null}

              <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tier.summary}</p>
              <p className="mt-4 text-3xl font-semibold text-brand-red">{tier.priceLabel}</p>
              <p className="text-xs text-muted-foreground">לחודש - לפני מע״מ</p>

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
                  isPopular
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
