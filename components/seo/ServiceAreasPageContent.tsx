import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SmartMap from "@/components/ui/SmartMap";
import ServiceAreasWhatsAppCta from "@/components/seo/ServiceAreasWhatsAppCta";
import {
  SERVICE_AREAS,
  SERVICE_AREAS_INTRO,
} from "@/lib/data/service-areas-page";
import { buildWebPageSchema } from "@/lib/seo/page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

const PAGE_SCHEMA = buildWebPageSchema({
  slug: "/areas",
  title: "אזורי שירות והגעה",
  description: SERVICE_AREAS_INTRO,
});

export default function ServiceAreasPageContent() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(PAGE_SCHEMA) }}
      />

      <Section className="border-b border-border bg-background" ariaLabelledby="areas-title">
        <Container className="py-12 text-center sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            מודיעין והמרכז
          </p>
          <h1 id="areas-title" className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            אזורי שירות והגעה
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {SERVICE_AREAS_INTRO}
          </p>
        </Container>
      </Section>

      <Section className="bg-surface" ariaLabelledby="areas-list-title">
        <Container className="py-12 sm:py-16">
          <header className="mx-auto max-w-2xl text-center">
            <h2 id="areas-list-title" className="font-serif text-2xl font-semibold text-foreground">
              אזורים עיקריים
            </h2>
          </header>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {SERVICE_AREAS.map((area) => (
              <article key={area.id} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-foreground">{area.title}</h3>
                <p className="mt-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">זמינות: </span>
                  {area.availability}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">הערות נסיעה: </span>
                  {area.travelNote}
                </p>
                <Link href={area.href} className="mt-5 inline-flex text-sm font-semibold text-brand-red hover:underline">
                  {area.hrefLabel}
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-background" ariaLabelledby="areas-map-title">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                מיקום האולפן
              </p>
              <h2 id="areas-map-title" className="mt-3 font-serif text-2xl font-semibold text-foreground">
                האולפן במודיעין, הגעה בתיאום
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                הכתובת היא עמק איילון 34, מודיעין-מכבים-רעות. לאירועים והקלטות
                בשטח בודקים זמינות לפי תאריך, מרחק וסוג השירות.
              </p>
              <SmartMap
                address="עמק איילון 34, מודיעין-מכבים-רעות"
                googleMapsUrl="https://maps.google.com/maps?q=עמק+איילון+34+מודיעין&output=embed"
                className="mt-6"
              />
            </div>

            <div>
              <ServiceAreasWhatsAppCta />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
