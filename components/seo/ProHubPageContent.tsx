import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  PRO_DEPARTMENTS,
  PRO_SERVICES,
} from "@/lib/data/pro-services";
import { getExVat } from "@/lib/data/pricing-catalog";
import { buildBookHref } from "@/lib/book-url";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export default function ProHubPageContent() {
  const waHref = buildWhatsAppHref({
    text: "שלום, מעוניין/ת בשירותי B2B Pro מהאתר.",
    utm_source: "website",
    utm_campaign: "pro_hub_cta",
  });

  return (
    <article>
      <Section padding="sm" className="border-b border-border">
        <Container className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            B2B Pro
          </p>
          <h1 className="text-hero mt-4 font-semibold text-foreground">
            מרכז שירותי B2B — דיג&apos;ייז, פודקאסט והגברה
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">
            Voice Tags, מאשאפים, פס ייצור, Dry Hire ותכנון EASE — עם ויזארד AI ומחירון שקוף.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              ייעוץ בוואטסאפ
            </a>
            <Link
              href={buildBookHref("pro")}
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40"
            >
              הזמנה מקוונת
            </Link>
          </div>
        </Container>
      </Section>

      {PRO_DEPARTMENTS.map((dept) => {
        const services = PRO_SERVICES.filter((s) => s.department === dept.id);
        return (
          <Section key={dept.id} padding="sm" className="border-b border-border">
            <Container className="max-w-5xl">
              <h2 className="font-serif text-section-title font-semibold text-foreground">
                {dept.label}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {dept.description}
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {services.map((svc) => (
                  <li key={svc.id}>
                    <Link
                      href={svc.path}
                      className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand-red/40"
                    >
                      <span className="text-2xl" aria-hidden>
                        {svc.icon}
                      </span>
                      <h3 className="mt-3 font-semibold text-foreground">{svc.title}</h3>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
                        {svc.subtitle}
                      </p>
                      <p className="mt-3 text-xs font-semibold text-brand-red">
                        מ-{getExVat(svc.pricingId).toLocaleString("he-IL")} ₪ + מע״מ
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        );
      })}
    </article>
  );
}
