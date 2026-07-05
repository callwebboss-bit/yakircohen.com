import Link from "next/link";
import { CTA_LABELS, TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const quoteWhatsAppHref = buildWhatsAppHref({
  text: `שלום, אשמח להצעת מחיר ${TIME_CLAIMS.quote24h}.`,
  utm_source: "website",
  utm_campaign: "footer_quote_cta",
});

const CTAS = [
  {
    href: "/online/vocal-fix/send-file",
    label: "שלחו קובץ",
    external: false,
    variant: "primary" as const,
  },
  {
    href: "/book",
    label: "בדקו תאריך פנוי",
    external: false,
    variant: "secondary" as const,
  },
  {
    href: quoteWhatsAppHref,
    label: TIME_CLAIMS.quote24hCta,
    external: true,
    variant: "whatsapp" as const,
  },
] as const;

export default function FooterConversionCtas() {
  return (
    <div className="footer-zone">
      <h2 className="text-sm font-semibold text-[var(--footer-fg)]">התחילו עכשיו</h2>
      <div className="mt-4 flex flex-col gap-2.5">
        {CTAS.map((cta) => {
          const className =
            cta.variant === "primary"
              ? "inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-4 text-sm font-semibold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              : cta.variant === "whatsapp"
                ? "inline-flex min-h-12 items-center justify-center rounded-xl border border-[#25D366]/60 bg-[#25D366]/10 px-4 text-sm font-semibold text-[#4ade80] transition-colors hover:bg-[#25D366]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
                : "inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--footer-border)] bg-white/5 px-4 text-sm font-semibold text-[var(--footer-fg)] transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

          if (cta.external) {
            return (
              <a
                key={cta.label}
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                aria-label={`${cta.label} בוואטסאפ`}
              >
                {cta.label}
              </a>
            );
          }

          return (
            <Link
              key={cta.label}
              href={cta.href}
              className={className}
              aria-label={
                cta.href === "/book"
                  ? CTA_LABELS.bookTransparent
                  : undefined
              }
            >
              {cta.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
