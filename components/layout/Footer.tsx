import BackToTopButton from "@/components/layout/BackToTopButton";
import CompanyDetailsCard from "@/components/business/CompanyDetailsCard";
import Container from "@/components/ui/Container";
import FooterBrandContact from "@/components/layout/FooterBrandContact";
import FooterCategorySitemap from "@/components/layout/FooterCategorySitemap";
import FooterConversionCtas from "@/components/layout/FooterConversionCtas";
import FooterLegalLinks from "@/components/layout/FooterLegalLinks";
import FooterMicroFaq from "@/components/layout/FooterMicroFaq";
import FooterPaymentMethods from "@/components/layout/FooterPaymentMethods";
import FooterTrustPledge from "@/components/layout/FooterTrustPledge";
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
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:grid-cols-4 xl:gap-10">
          <FooterBrandContact />
          <FooterCategorySitemap />
          <FooterLegalLinks />
          <FooterConversionCtas />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <FooterTrustPledge />
          <FooterMicroFaq />
        </div>

        <FooterPaymentMethods compact />

        <CompanyDetailsCard variant="compact" className="mt-8" />

        <div className="mt-8 grid gap-4 border-t border-[var(--footer-border)] pt-6 md:grid-cols-2 md:items-center lg:grid-cols-3">
          <p className="text-center text-xs text-[var(--footer-muted)] md:text-start">
            © {currentYear} {SITE_NAME}
          </p>
          <div className="flex flex-col items-center gap-2 md:items-end lg:col-start-3">
            <BackToTopButton />
            <p className="text-xs text-[var(--footer-muted)]">מודיעין - ירושלים - המרכז</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
