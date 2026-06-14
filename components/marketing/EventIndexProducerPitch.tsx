import Link from "next/link";
import {
  PRODUCER_PITCH,
  PRO_BUNDLE_3_EX_VAT,
  formatProPriceExVat,
} from "@/lib/data/event-index-attractions-pro";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export default function EventIndexProducerPitch() {
  const waHref = buildWhatsAppHref({
    text: "שלום, אני מפיק/ה ומעוניין/ת בחבילת אטרקציות. אשמח לשמוע על הפעלה מקצועית וסנכרון באירוע.",
    utm_source: "website",
    utm_campaign: "event_index_producer_bundle",
  });

  return (
    <section
      id="producer-services"
      className="scroll-mt-24 rounded-2xl border border-border bg-background p-6 sm:p-8"
      aria-labelledby="producer-pitch-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
        {PRODUCER_PITCH.kicker}
      </p>
      <h2
        id="producer-pitch-heading"
        className="mt-2 font-serif text-xl font-semibold text-foreground sm:text-2xl"
      >
        {PRODUCER_PITCH.title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {PRODUCER_PITCH.body}
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {PRODUCER_PITCH.benefits.map((item) => (
          <li
            key={item.title}
            className="rounded-xl border border-border bg-surface px-4 py-3.5"
          >
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-xl bg-muted/50 px-4 py-3 text-sm text-foreground">
        מחיר חבילה למפיקים:{" "}
        <span className="font-semibold text-brand-red">
          {formatProPriceExVat(PRO_BUNDLE_3_EX_VAT)} לפני מע״מ
        </span>
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          דברו איתנו בוואטסאפ
        </a>
        <Link
          href="/events/attractions"
          className="inline-flex min-h-11 items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:border-brand-red/40"
        >
          מחשבון אטרקציות מלא
        </Link>
      </div>
    </section>
  );
}
