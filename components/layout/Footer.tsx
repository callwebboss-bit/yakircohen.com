import Link from "next/link";
import BackToTopButton from "@/components/layout/BackToTopButton";
import CompanyDetailsCard from "@/components/business/CompanyDetailsCard";
import Container from "@/components/ui/Container";
import FooterBrandContact from "@/components/layout/FooterBrandContact";
import FooterCategorySitemap from "@/components/layout/FooterCategorySitemap";
import FooterConversionCtas from "@/components/layout/FooterConversionCtas";
import FooterLegalLinks from "@/components/layout/FooterLegalLinks";
import FooterMicroFaq from "@/components/layout/FooterMicroFaq";
import FooterMobileDecisiveNav from "@/components/layout/FooterMobileDecisiveNav";
import FooterPaymentMethods from "@/components/layout/FooterPaymentMethods";
import FooterTrustPledge from "@/components/layout/FooterTrustPledge";
import FooterTrustStrip from "@/components/layout/FooterTrustStrip";
import FooterFaqSchema from "@/components/seo/FooterFaqSchema";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      data-pagefind-ignore
      className="footer-shell border-t border-[var(--footer-border)]"
    >
      <FooterFaqSchema />
      <Container className="py-12 lg:py-16">
        <FooterMobileDecisiveNav />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-none">
            <FooterBrandContact />
          </div>
          <div className="order-1 lg:order-none">
            <FooterConversionCtas />
          </div>
        </div>

        <details className="footer-more mt-10">
          <summary className="footer-more-summary flex min-h-12 cursor-pointer list-none items-center font-semibold text-[var(--footer-fg)] marker:content-none touch-manipulation [&::-webkit-details-marker]:hidden">
            מידע נוסף
          </summary>
          <div className="footer-more-body mt-6 space-y-10">
            <div className="grid gap-10 lg:grid-cols-2">
              <FooterCategorySitemap />
              <FooterLegalLinks />
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <FooterTrustPledge />
              <FooterMicroFaq />
            </div>
            <FooterPaymentMethods compact />
            <CompanyDetailsCard variant="compact" />
            <FooterTrustStrip />
          </div>
        </details>

        <div className="mt-8 grid gap-4 border-t border-[var(--footer-border)] pt-6 md:grid-cols-2 md:items-center lg:grid-cols-3">
          <div className="flex flex-wrap items-center justify-center gap-x-4 md:justify-start">
            <p className="text-center text-xs text-[var(--footer-muted)] md:text-start">
              © {currentYear} {SITE_NAME}
            </p>
            {/* F-01 (נגישות, 7.10.2026): קישור קבוע להצהרה מחוץ ל-details. שני
                הקישורים הקיימים יושבים בתוך "מידע נוסף", שסגור במובייל, והקישור
                כאן נשאר נגיש בכל רוחב גם אם הבלוק הזה לא מרונדר.
                #b0b6bc על #0f1419 = 9.05:1; ב-hover #ff6b6b = 6.67:1. */}
            <Link
              href="/accessibility"
              className="inline-flex min-h-11 items-center text-xs text-[var(--footer-muted)] underline underline-offset-4 transition-colors hover:text-[var(--footer-link-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              הצהרת נגישות
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2 md:items-end lg:col-start-3">
            <BackToTopButton />
            <p className="text-xs text-[var(--footer-muted)]">מודיעין - ירושלים - המרכז</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
