import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const linkClass =
  "inline-flex min-h-12 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

export default function PricingHesitantCta() {
  return (
    <div className="rounded-2xl border border-brand-red/20 bg-brand-red/5 px-6 py-5">
      <p className="text-sm font-semibold text-foreground">
        לא יודע איזה שירות מתאים?
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        דבר איתי - אשאל שלוש שאלות ואמליץ, בלי לחץ.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={buildWhatsAppHref({
            text: "היי, לא בטוח איזה שירות מתאים לי - אשמח לייעוץ",
            source: "pricing-hesitant",
          })}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClass} bg-brand-red text-white hover:bg-brand-red-light`}
        >
          וואטסאפ
        </a>
        <a
          href={`tel:${CONTACT_PHONE_E164}`}
          className={`${linkClass} border border-border bg-background text-foreground hover:border-brand-red/40`}
        >
          {CONTACT_PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}
