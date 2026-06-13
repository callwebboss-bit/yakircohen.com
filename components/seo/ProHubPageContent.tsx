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
    text: "שלום, מעוניין/ת בשירותים מקצועיים לעסקים מהאתר.",
    utm_source: "website",
    utm_campaign: "pro_hub_cta",
  });

  return (
    <article>
      <Section padding="sm" className="border-b border-border">
        <Container className="max-w-5xl">
          <p className="text-xs font-semibold text-muted-foreground">
            שירותים מקצועיים לעסקים
          </p>
          <h1 className="text-hero mt-4 font-semibold text-foreground">
            מרכז שירותים לדיג&apos;ייז, פודקאסט והגברה
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">
            תגים קוליים, מאשאפים דחופים, פס ייצור לפודקאסט, השכרת ציוד ותכנון הגברה —
            עם מחשבון הצעה באתר ומחירון שקוף.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            השירותים כאן מיועדים לאנשי מקצוע: דיג&apos;ייז, חברות הפקה, יוצרי תוכן
            וחברות הגברה. בכל עמוד יש מחשבון שמעריך מחיר ומפרט — ואחרי זה אפשר להמשיך
            בוואטסאפ או בהזמנה מקוונת.
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
            <Link
              href="/pricing"
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40"
            >
              מחירון מלא
            </Link>
          </div>
        </Container>
      </Section>

      <Section padding="sm" className="border-b border-border bg-muted/20">
        <Container className="max-w-5xl">
          <Link
            href="/pro/event-index"
            className="flex flex-col rounded-2xl border border-brand-red/20 bg-background p-6 transition-colors hover:border-brand-red/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-brand-red">
                מודיעין שוק לספקים
              </p>
              <h2 className="mt-2 font-serif text-xl font-semibold">דופק השוק — מחירים וביקוש</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                ממוצעי מחיר סגור, מגמות ביקוש לאטרקציות והתרעות על חוסר במלאי — מנוי לעסקים.
              </p>
            </div>
            <span className="mt-4 text-sm font-semibold text-brand-red sm:mt-0">למדד</span>
          </Link>
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
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
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
                        החל מ-{getExVat(svc.pricingId).toLocaleString("he-IL")} שקלים לפני מע״מ
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        );
      })}

      <Section padding="sm">
        <Container className="max-w-5xl">
          <h2 className="font-serif text-section-title font-semibold text-foreground">
            איך עובד המחשבון?
          </h2>
          <ol className="mt-4 max-w-2xl space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>1. נכנסים לעמוד השירות שמתאים לכם.</li>
            <li>2. ממלאים את השדות במחשבון — תאריך, סוג אירוע, ציוד וכו׳.</li>
            <li>3. מקבלים סיכום, המלצות ומחיר משוער.</li>
            <li>4. ממשיכים בוואטסאפ או בהזמנה מקוונת — יקיר מאשר לפני סגירה.</li>
          </ol>
        </Container>
      </Section>
    </article>
  );
}
