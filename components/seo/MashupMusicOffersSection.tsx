import Link from "next/link";
import { MASHUP_MUSIC_OFFER_CATEGORIES } from "@/lib/data/mashup-music-offers";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { buildWhatsAppHref } from "@/lib/whatsapp";

function formatItemPrice(
  pricingId?: (typeof MASHUP_MUSIC_OFFER_CATEGORIES)[number]["items"][number]["pricingId"],
  priceNote?: string,
): string {
  if (priceNote) return priceNote;
  if (pricingId) return formatFromPriceDual(getExVat(pricingId));
  return "בתיאום";
}

function buildOfferWhatsAppText(title: string): string {
  return `שלום, מעוניין/ת ב${title} ממרכז הדיג'יי באתר. אשמח לפרטים ומחיר.`;
}

export default function MashupMusicOffersSection() {
  return (
    <div id="pro-offers" className="space-y-14">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold text-foreground">אין זמן? נבנה ביחד</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          בוחרים מסלול — מוכן, מותאם, חבילה — ושולחים בטופס או בוואטסאפ.
          מסירה עד 3 ימי עסקים.
        </p>
      </div>

      {MASHUP_MUSIC_OFFER_CATEGORIES.map((category) => (
        <section key={category.id} aria-labelledby={`mashup-offer-${category.id}`}>
          <h3
            id={`mashup-offer-${category.id}`}
            className="text-xl font-semibold text-foreground"
          >
            {category.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {category.intro}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {category.items.map((item) => {
              const waHref = buildWhatsAppHref({
                text: buildOfferWhatsAppText(item.title),
                utm_source: "website",
                utm_campaign: "dj_pro_offer",
              });
              return (
                <article
                  key={item.id}
                  className="flex flex-col rounded-xl border border-border bg-surface p-5"
                >
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  {item.tags?.length ? (
                    <p className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm font-semibold text-brand-red">
                    {formatItemPrice(item.pricingId, item.priceNote)}
                  </p>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-brand-red px-4 text-sm font-semibold text-white hover:bg-brand-red-light"
                  >
                    וואטסאפ
                  </a>
                  <Link
                    href="#wizard-mashup-fixer"
                    className="mt-2 inline-flex min-h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground hover:border-brand-red/40"
                  >
                    טופס
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex flex-wrap gap-4 border-t border-border pt-8 text-sm">
        <Link
          href="/events/dj/voice-tags"
          className="font-medium text-brand-red hover:underline"
        >
          תג קולי לסט
        </Link>
        <span className="text-muted-foreground" aria-hidden>
          ·
        </span>
        <Link
          href="/events/dj/pre-built-sets"
          className="font-medium text-brand-red hover:underline"
        >
          סטים מוכנים לאירוע
        </Link>
      </div>
    </div>
  );
}
