import Link from "next/link";
import {
  PRODUCER_PITCH,
  PRO_BUNDLE_3_EX_VAT,
  PRO_BUNDLE_COUNT,
  formatProPriceExVat,
} from "@/lib/data/event-index-attractions-pro";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export default function EventIndexProducerPitch() {
  const waHref = buildWhatsAppHref({
    text: "שלום, אני מפיק/ה ומעוניין/ת בחבילת אטרקציות מדופק השוק — אשמח לשמוע על הפעלה מקצועית וסנכרון באירוע.",
    utm_source: "website",
    utm_campaign: "event_index_producer_bundle",
  });

  return (
    <section
      className="rounded-2xl border border-brand-red/25 bg-brand-red/5 p-6 sm:p-8"
      aria-labelledby="producer-pitch-heading"
    >
      <p className="text-xs font-semibold text-brand-red">{PRODUCER_PITCH.kicker}</p>
      <h2
        id="producer-pitch-heading"
        className="mt-2 font-serif text-xl font-semibold text-foreground sm:text-2xl"
      >
        {PRODUCER_PITCH.title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {PRODUCER_PITCH.body}
      </p>
      <ul className="mt-5 space-y-2 text-sm text-foreground">
        {PRODUCER_PITCH.bullets.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-brand-red" aria-hidden>
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm font-medium text-foreground">
        חבילת {PRO_BUNDLE_COUNT} אטרקציות:{" "}
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
          בקשת חבילה למפיקים
        </a>
        <Link
          href="/events/attractions"
          className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold hover:border-brand-red/40"
        >
          מחשבון אטרקציות מלא
        </Link>
      </div>
    </section>
  );
}
