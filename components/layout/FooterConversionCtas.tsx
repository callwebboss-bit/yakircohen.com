import Link from "next/link";
import { CTA_LABELS, TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const quoteWhatsAppHref = buildWhatsAppHref({
  text: `שלום, אשמח להצעת מחיר ${TIME_CLAIMS.quote24h}.`,
  utm_source: "website",
  utm_campaign: "footer_quote_cta",
});

const PRIMARY_CTAS = [
  {
    href: "/pricing",
    label: "מחירון",
    external: false,
    variant: "secondary" as const,
  },
  {
    href: "/book",
    label: CTA_LABELS.bookOnline,
    external: false,
    variant: "primary" as const,
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
        {PRIMARY_CTAS.map((cta) => {
          const className =
            cta.variant === "primary"
              ? "inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-4 text-sm font-semibold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              : cta.variant === "whatsapp"
                ? "inline-flex min-h-12 items-center justify-center rounded-xl border border-[#178741]/60 bg-[#178741]/10 px-4 text-sm font-semibold text-[#4ade80] transition-colors hover:bg-[#178741]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#178741]"
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
            <Link key={cta.label} href={cta.href} className={className}>
              {cta.label}
            </Link>
          );
        })}
        <Link
          href="/online/vocal-fix/send-file"
          className="inline-flex min-h-11 items-center justify-center text-xs font-medium text-[var(--footer-muted)] underline-offset-2 hover:text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          שלחו קובץ
        </Link>
      </div>
    </div>
  );
}
