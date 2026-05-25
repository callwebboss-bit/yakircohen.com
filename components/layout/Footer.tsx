import Image from "next/image";
import Link from "next/link";
import BackToTopButton from "@/components/layout/BackToTopButton";
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
  STUDIO_ADDRESS,
  STUDIO_GOOGLE_MAPS_URL,
  STUDIO_WAZE_URL,
} from "@/lib/constants";
import { SEO_FOOTER_LINKS } from "@/lib/seo-footer-links";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-pagefind-ignore className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[72rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-12">
          <div className="sm:col-span-2 lg:col-span-1">
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
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              פודקאסט, סטודיו, קריינות, אירועים ווידאו - ממודיעין
              לירושלים והסביבה. צוות מקצועי, ציוד מתקדם ושירות אישי ללא פשרות.
            </p>
            <FooterSocialLinks />
          </div>

          <nav
            role="navigation"
            className="lg:col-span-1"
            aria-label="ניווט תחתון"
          >
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              המרכזים שלנו
            </h2>
            <ul className="mt-4 grid gap-2">
              {[...NAV_HUBS, ...FOOTER_EXTRA_LINKS].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors duration-300 ease-[var(--ease-luxury)] hover:text-brand-red"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            role="navigation"
            className="lg:col-span-1"
            aria-label="שירותים פופולריים"
          >
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              שירותים פופולריים
            </h2>
            <ul className="mt-4 grid gap-2">
              {SEO_FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={item.title}
                    className="text-sm text-muted-foreground transition-colors duration-300 ease-[var(--ease-luxury)] hover:text-brand-red"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              שעות פעילות
            </h2>
            <ul className="mt-4 space-y-2">
              {BUSINESS_HOURS.map((slot) => (
                <li
                  key={slot.days}
                  className="flex justify-between gap-4 text-sm text-muted-foreground"
                >
                  <span>{slot.days}</span>
                  <span className="font-medium text-foreground">{slot.hours}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-sm font-semibold tracking-wide text-foreground">
              יצירת קשר
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_E164}`}
                  className="text-muted-foreground transition-colors duration-300 ease-[var(--ease-luxury)] hover:text-brand-red"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
            </ul>

            <h2 className="mt-8 text-sm font-semibold tracking-wide text-foreground">
              מיקום האולפן
            </h2>
            <address className="mt-4 space-y-2 text-sm not-italic text-muted-foreground">
              <p>{STUDIO_ADDRESS}</p>
              <p className="flex flex-wrap gap-x-4 gap-y-1">
                <a
                  href={STUDIO_GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground transition-colors duration-300 ease-[var(--ease-luxury)] hover:text-brand-red"
                >
                  Google Maps
                </a>
                <a
                  href={STUDIO_WAZE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground transition-colors duration-300 ease-[var(--ease-luxury)] hover:text-brand-red"
                >
                  Waze
                </a>
              </p>
            </address>
          </div>
        </div>

        <FooterPaymentMethods />

        <FooterCta />

        <div className="mt-10 grid gap-6 border-t border-border pt-8 md:grid-cols-3 md:items-center">
          <p className="order-3 text-center text-xs text-muted-foreground md:order-1 md:text-start">
            © {currentYear} {SITE_NAME}. כל הזכויות שמורות.
          </p>
          <nav
            aria-label="מסמכים משפטיים"
            className="order-2 flex flex-wrap justify-center gap-x-4 gap-y-1"
          >
            {FOOTER_LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-muted-foreground transition-colors duration-300 ease-[var(--ease-luxury)] hover:text-brand-red"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="order-1 flex flex-col items-center gap-2 md:order-3 md:items-end">
            <BackToTopButton />
            <p className="text-center text-xs text-muted-foreground md:text-end">
              שירות בפריסה ארצית · מודיעין · ירושלים והסביבה
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
