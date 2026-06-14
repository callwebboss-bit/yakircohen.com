import Image from "next/image";
import Link from "next/link";
import BackToTopButton from "@/components/layout/BackToTopButton";
import CompanyDetailsCard from "@/components/business/CompanyDetailsCard";
import Container from "@/components/ui/Container";
import FooterCta from "@/components/layout/FooterCta";
import FooterPaymentMethods from "@/components/layout/FooterPaymentMethods";
import FooterSocialLinks from "@/components/layout/FooterSocialLinks";
import {
  BUSINESS_HOURS,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
  FOOTER_EXTRA_LINKS,
  FOOTER_LEGAL_LINKS,
  NAV_HUBS,
  SITE_LOGO_SRC,
  SITE_NAME,
  STUDIO_ADDRESS_LINE,
  STUDIO_GOOGLE_MAPS_URL,
  STUDIO_WAZE_URL,
} from "@/lib/constants";
import { FOOTER_SEMANTIC_TREE } from "@/lib/seo-footer-links";

function FooterSemanticColumn({
  sections,
}: {
  sections: (typeof FOOTER_SEMANTIC_TREE)[number][];
}) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <nav key={section.heading} aria-label={section.heading}>
          <h2 className="text-sm font-semibold text-foreground">{section.heading}</h2>
          <ul className="mt-3 space-y-2">
            {section.links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={item.title}
                  className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const semanticColA = FOOTER_SEMANTIC_TREE.slice(0, 2);
  const semanticColB = FOOTER_SEMANTIC_TREE.slice(2, 4);

  return (
    <footer data-pagefind-ignore className="border-t border-border bg-surface">
      <Container className="py-10 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:gap-x-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 transition-opacity duration-300 ease-[var(--ease-luxury)] hover:opacity-85"
              aria-label={`${SITE_NAME} - חזרה לדף הבית`}
            >
              <Image
                src={SITE_LOGO_SRC}
                alt=""
                width={120}
                height={40}
                className="h-9 w-auto shrink-0"
              />
              <span className="text-lg font-semibold leading-tight text-foreground">
                {SITE_NAME}
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE_NAME} - אולפן הקלטות, הפקת פודקאסטים, צילום וניהול אירועים
              במודיעין, ירושלים, תל אביב ואזור המרכז.
            </p>
            <FooterSocialLinks />
          </div>

          <nav role="navigation" aria-label="ניווט תחתון">
            <h2 className="text-sm font-semibold text-foreground">ניווט</h2>
            <ul className="mt-3 space-y-2">
              {NAV_HUBS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-label={`עבור לעמוד ${item.label}`}
                    className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-4 space-y-2 border-t border-border pt-4">
              {FOOTER_EXTRA_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <FooterSemanticColumn sections={[...semanticColA]} />
          <FooterSemanticColumn sections={[...semanticColB]} />

          <div>
            <h2 className="text-sm font-semibold text-foreground">יצירת קשר</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_E164}`}
                  className="inline-flex min-h-11 items-center font-medium text-foreground transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li className="text-muted-foreground">{STUDIO_ADDRESS_LINE}</li>
              <li className="flex flex-wrap gap-x-3 gap-y-1">
                <a
                  href={STUDIO_GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  מפות
                </a>
                <a
                  href={STUDIO_WAZE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  Waze
                </a>
              </li>
            </ul>
            <div className="mt-5 space-y-1.5 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                שעות פעילות
              </p>
              {BUSINESS_HOURS.map((slot) => (
                <div
                  key={slot.days}
                  className="flex justify-between gap-3 text-xs text-muted-foreground"
                >
                  <span>{slot.days}</span>
                  <span className="font-medium text-foreground">{slot.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FooterPaymentMethods compact />

        <FooterCta />

        <CompanyDetailsCard variant="compact" className="mt-8" />

        <div className="mt-8 grid gap-4 border-t border-border pt-6 md:grid-cols-2 md:items-center lg:grid-cols-3">
          <p className="text-center text-xs text-muted-foreground md:text-start">
            © {currentYear} {SITE_NAME}
          </p>
          <nav
            aria-label="מסמכים משפטיים"
            className="flex flex-wrap justify-center gap-x-4 gap-y-1"
          >
            {FOOTER_LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center text-xs text-muted-foreground transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <BackToTopButton />
            <p className="text-xs text-muted-foreground">מודיעין - ירושלים - המרכז</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
