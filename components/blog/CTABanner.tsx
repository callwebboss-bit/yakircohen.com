import Link from "next/link";
import { CTA_LABELS, buildBlogCtaWhatsAppMessage } from "@/lib/data/conversion-copy";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   CTABanner - static Server Component.
   ─────────────────────────────────────────────────────────────────────────────
   An embedded conversion block designed to appear inline within long-form
   article content. The dark zinc-900 surface creates a high-contrast island
   that halts the reader's scroll without interrupting the surrounding layout.

   Accessibility:
   - `role="complementary"` marks this as supporting content, not the main text.
   - `aria-labelledby` wires the visible heading to the landmark for screen readers.
   - The WhatsApp link has an explicit `aria-label` describing the action.
   - All contrast ratios exceed WCAG AA: white on zinc-900 ≈ 16:1, gold on
     zinc-900 ≈ 8.5:1, black text on gold button ≈ 7.6:1.
   ───────────────────────────────────────────────────────────────────────────── */

/* ─── WhatsApp icon ──────────────────────────────────────────────────────────*/

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

/* ─── Types ──────────────────────────────────────────────────────────────────*/

export type CTABannerProps = {
  heading?: string;
  body?: string;
  ctaLabel?: string;
  /** Custom WhatsApp message pre-filled into the chat. */
  whatsappMessage?: string;
  /** UTM campaign tag forwarded to `buildWhatsAppHref`. */
  utm_campaign?: string;
  /** yakir-closer service id for [YC:] tag */
  closerService?: string;
  /** Price before VAT for [YC:] tag */
  priceExVat?: number | null;
  /** Secondary CTA to /book#category */
  bookHref?: string;
  bookCtaLabel?: string;
  className?: string;
};

/* ─── Component ──────────────────────────────────────────────────────────────*/

export default function CTABanner({
  heading = "מוכנים להתחיל את הפרויקט שלכם?",
  body = "ייעוץ ראשוני ללא עלות - מענה אישי תוך 24 שעות, ללא התחייבות.",
  ctaLabel = "שוחחו איתנו בוואטסאפ",
  whatsappMessage = "שלום, הגעתי מהאתר ואשמח לשמוע על השירותים.",
  utm_campaign = "blog_cta",
  closerService,
  priceExVat,
  bookHref,
  bookCtaLabel = CTA_LABELS.bookTransparent,
  className,
}: CTABannerProps) {
  const waText =
    closerService != null
      ? buildBlogCtaWhatsAppMessage({
          body: whatsappMessage,
          closerService,
          priceExVat,
          utmCampaign: utm_campaign,
        })
      : whatsappMessage;

  const whatsappHref = buildWhatsAppHref({
    text: waText,
    utm_source: "blog",
    utm_campaign,
  });

  const headingId = "cta-banner-heading";

  return (
    <aside
      role="complementary"
      aria-labelledby={headingId}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-red/20 bg-surface px-6 py-8 sm:px-10 sm:py-10",
        className,
      )}
    >
      {/* ── Gold top-edge accent line ── */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red to-transparent"
        aria-hidden="true"
      />

      {/* ── Subtle gold radial glow in the upper-center ── */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(212,43,43,0.12),transparent_60%)]"
        aria-hidden="true"
      />

      {/* ── Content - two-column on sm+, stacked on mobile ── */}
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        {/* Text block */}
        <div className="flex-1">
          {/* Gold eyebrow */}
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-red">
            הפקות מקצועית במודיעין ✦
          </p>

          {/* Main heading */}
          <h2
            id={headingId}
            className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl"
          >
            {heading}
          </h2>

          {/* Supporting body text */}
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
        </div>

        {/* CTA buttons */}
        <div className="flex shrink-0 flex-col gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center gap-2.5 rounded-xl",
              "bg-brand-red px-6 py-3 text-sm font-semibold text-white",
              "shadow-[0_0_24px_rgba(212,43,43,0.35)]",
              "transition-[background-color,box-shadow,transform] duration-normal ease-luxury",
              "hover:bg-brand-red-light hover:shadow-[0_0_36px_rgba(212,43,43,0.5)]",
              "active:scale-[0.97]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
            )}
            aria-label={`${ctaLabel} - פתיחת שיחת וואטסאפ`}
          >
            <WhatsAppIcon />
            {ctaLabel}
          </a>

          {bookHref ? (
            <Link
              href={bookHref}
              className={cn(
                "inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground",
                "transition-colors hover:border-brand-red/40 hover:text-brand-red",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
              )}
            >
              {bookCtaLabel}
            </Link>
          ) : null}

          {/* Trust micro-copy */}
          <p className="text-center text-[0.65rem] text-zinc-500">
            מענה מהיר · ללא עלות · ללא התחייבות
          </p>
        </div>
      </div>
    </aside>
  );
}
