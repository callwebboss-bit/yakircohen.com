import type { Metadata } from "next";
import Link from "next/link";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import PageBottomCta from "@/components/layout/PageBottomCta";
import { CLIENT_JOURNEY_VARIANTS } from "@/lib/data/client-journey";
import { constructMetadata } from "@/lib/metadata";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = constructMetadata({
  title: "מה קורה אחרי שפונים",
  description:
    "3 שלבים ברורים: ניתוח, ביצוע ומסירה. אולפן, אירועים, פודקאסט ועריכה מרחוק - בלי הפתעות.",
  slug: "start",
  keywords: ["איך מתחילים", "שלבי עבודה", "אולפן מודיעין", "הזמנת שירות"],
});

const whatsappHref = buildWhatsAppHref({
  text: "שלום, קראתי על השלבים ורוצה להתחיל. מה הצעד הראשון?",
  utm_source: "website",
  utm_campaign: "start_page",
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "ראשי",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "מה קורה אחרי שפונים",
      item: `${SITE_URL}/start`,
    },
  ],
};

export default function StartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-background">
        <section className="border-b border-border bg-background py-14 sm:py-18">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <nav aria-label="ניווט ארגוני" className="mb-6">
              <ol className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-brand-red">
                    ראשי
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-medium text-foreground" aria-current="page">
                  מה קורה אחרי שפונים
                </li>
              </ol>
            </nav>

            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              מה קורה מרגע הפנייה ועד הקובץ המוכן
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              3 שלבים ברורים לכל שירות: ניתוח, ביצוע ומסירה. בחרו את סוג השירות
              שלכם.
            </p>

            <nav
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
              aria-label="סוגי שירות"
            >
              {CLIENT_JOURNEY_VARIANTS.map((v) => (
                <a
                  key={v.id}
                  href={`#${v.anchor}`}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
                >
                  {v.label}
                </a>
              ))}
            </nav>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
              >
                התחילו בוואטסאפ
              </a>
              <Link
                href="/book"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-brand-red hover:underline"
              >
                הזמנה מקוונת
              </Link>
            </div>
          </div>
        </section>

        {CLIENT_JOURNEY_VARIANTS.map((variant) => (
          <section
            key={variant.id}
            id={variant.anchor}
            className="scroll-mt-20 border-b border-border py-12 sm:py-16"
          >
            <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
              <h2 className="text-center font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                {variant.label}
              </h2>
              <ClientJourneySteps
                variant={variant.id}
                display="full"
                className="py-8 sm:py-10"
              />
            </div>
          </section>
        ))}

        <PageBottomCta variant="whatsapp" layout="section" />
      </div>
    </>
  );
}
