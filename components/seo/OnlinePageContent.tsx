import Link from "next/link";
import CallbackLeadForm from "@/components/forms/CallbackLeadForm";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import SoundImprovementShowcase from "@/components/seo/SoundImprovementShowcase";
import {
  ONLINE_FEATURED_SERVICES,
  ONLINE_QUICK_LINKS,
  ONLINE_SERVICE_CATEGORIES,
  ONLINE_WHY_US,
} from "@/lib/data/online-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import HubDualCta from "@/components/marketing/HubDualCta";
import ShareButton from "@/components/ui/ShareButton";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";

const bookCta = resolveServiceBookCta("online");

const chipClass =
  "inline-flex min-h-11 items-center rounded-full border border-border bg-background px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

const linkClass =
  "inline-flex min-h-11 items-center text-sm font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

export default function OnlinePageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! יש לי פרויקט אונליין עם AI ואשמח לבדיקה ראשונית והצעת מחיר מהירה.",
    utm_source: "online",
    utm_campaign: "online_hub_cta",
  });

  return (
    <div className="bg-background">
      <Section
        padding="none"
        className="relative overflow-hidden border-b border-border bg-background"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <Container className="relative max-w-4xl py-16 text-center sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="text-hero mt-3 font-serif font-semibold text-foreground">
            מאגר שירותי AI אונליין - אנחנו מבצעים הכל עבורכם
          </h1>
          <h2 className="text-section-title mx-auto mt-5 max-w-3xl font-semibold text-foreground">
            האולפן מגיע אליכם: שירותי סאונד, תוכן והפקה מקצועיים מרחוק
          </h2>
          <p className="text-lead mx-auto mt-4 max-w-3xl text-muted-foreground">
            שולחים קובץ או רעיון. מקבלים תוצאה מוכנה למייל או לוואטסאפ - סאונד,
            תמונה או תוכן.
          </p>
          {bookCta ? (
            <HubDualCta
              className="mt-8"
              whatsappHref={ctaHref}
              whatsappLabel="שלחו קובץ לבדיקה ראשונית בוואטסאפ "
              bookHref={bookCta.bookHref}
              bookLabel={bookCta.bookLabel}
            />
          ) : (
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                as="a"
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="shadow-[0_0_20px_rgba(212,43,43,0.3)]"
              >
                שלחו קובץ לבדיקה ראשונית בוואטסאפ </Button>
              <Button as="link" href="#quick-quote" variant="secondary">
                השאירו פרטים להצעת מחיר מהירה
              </Button>
            </div>
          )}
        </Container>
      </Section>

      <Section padding="none" className="border-b border-border bg-surface py-8">
        <Container>
          <p className="mb-4 text-center text-sm font-medium text-foreground">
            ניווט מהיר לפי קטגוריות
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {ONLINE_SERVICE_CATEGORIES.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className={chipClass}
              >
                {category.title}
              </a>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Link href="/online/vocal-fix/send-file" className={chipClass}>
              שליחת קבצים
            </Link>
            <Link href="/business/social-media" className={chipClass}>
              שירותים לעסקים
            </Link>
          </div>
        </Container>
      </Section>

      <Section padding="sm">
        <Container>
        <h2 className="mb-8 text-center font-serif text-section-title font-semibold text-foreground">
          השירותים המובילים מרחוק
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {ONLINE_FEATURED_SERVICES.map((svc) => (
            <article
              key={svc.title}
              className="hover-lift flex flex-col rounded-2xl border border-border bg-background p-6"
            >
              <span className="text-2xl" aria-hidden>
                {svc.icon}
              </span>
              <h3 className="mt-3 font-semibold text-foreground">{svc.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{svc.intro}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">כולל: </span>
                {svc.includes}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">מתאים ל: </span>
                {svc.suited}
              </p>
              <Link
                href={svc.href}
                className={`${linkClass} mt-4`}
              >
                לפרטים </Link>
            </article>
          ))}
        </div>
        </Container>
      </Section>

      <Section padding="sm" className="border-y border-border bg-background">
        <Container>
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-section-title font-semibold text-foreground">שומעים את ההבדל</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              דוגמת שחזור אמיתית לפני/אחרי - משלבים AI ואוזן מקצועית עד תוצאה
              נקיה ומאוזנת.
            </p>
          </header>
          <div className="mx-auto mt-8 max-w-2xl">
            <SoundImprovementShowcase
              demoId="weber-restoration"
              variant="restoration"
              context="compact"
              showDisclaimer
            />
          </div>
        </Container>
      </Section>

      <ClientJourneySteps variant="online" display="compact" />

      <Section padding="sm" className="border-y border-border bg-surface">
        <Container>
          <h2 className="mb-3 font-serif text-section-title font-semibold text-foreground">
            מאגר שירותי AI אונליין - לפי קטגוריות
          </h2>
          <p className="mb-8 max-w-3xl text-sm text-muted-foreground">
            בחרו שירות והתחילו. לפרטים מלאים -{" "}
            <Link href="/start#online" className={`${linkClass} font-medium`}>
              מפת השלבים
            </Link>
            .
          </p>
          <div className="space-y-8">
            {ONLINE_SERVICE_CATEGORIES.map((category) => (
              <section
                id={category.id}
                key={category.id}
                className="rounded-2xl border border-border bg-background p-6 sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                  <Link
                    href={`/online/${category.slug}`}
                    className={linkClass}
                  >
                    לעמוד הקטגוריה </Link>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((service) => (
                    <article
                      key={`${category.id}-${service.title}`}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xl" aria-hidden>
                          {service.icon}
                        </span>
                        {service.tag ? (
                          <span className="rounded-full bg-brand-red/10 px-2.5 py-1 text-xs font-medium text-brand-red">
                            {service.tag}
                          </span>
                        ) : null}
                      </div>
                      <h4 className="mt-2 font-semibold text-foreground">{service.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{service.summary}</p>
                      {service.href ? (
                        <Link
                          href={service.href}
                          className={`${linkClass} mt-3`}
                        >
                          לפרטים </Link>
                      ) : (
                        <a
                          href={ctaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${linkClass} mt-3`}
                        >
                          בקשו התאמה אישית </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="sm">
        <Container>
        <h2 className="mb-6 font-serif text-section-title font-semibold text-foreground">
          קישורים מהירים להתחלה
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {ONLINE_QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover-lift block rounded-xl border border-border bg-background p-5 hover:border-brand-red/40"
              >
                <span className="font-semibold text-foreground">{link.label}</span>
                <p className="mt-1 text-sm text-muted-foreground">{link.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
        </Container>
      </Section>

      <Section padding="sm" className="border-t border-border bg-surface">
        <Container className="max-w-3xl">
          <h2 className="font-serif text-section-title font-semibold text-foreground">
            למה לעבוד איתנו אונליין?
          </h2>
          <ul className="mt-6 space-y-3">
            {ONLINE_WHY_US.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section padding="sm" id="quick-quote">
        <Container>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="rounded-2xl border border-border bg-surface p-8 text-center lg:text-right">
            <h2 className="font-serif text-section-title font-semibold text-foreground">רוצים להתחיל עכשיו?</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              שלחו קובץ לבדיקה ראשונית בוואטסאפ או השאירו פרטים ונחזור אליכם
              במהירות עם מסלול שירות מדויק.
            </p>
            {bookCta ? (
              <HubDualCta
                className="mt-6"
                align="start"
                whatsappHref={ctaHref}
                whatsappLabel="שלחו קובץ בוואטסאפ "
                bookHref={bookCta.bookHref}
                bookLabel={bookCta.bookLabel}
              />
            ) : null}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button as="link" href="/online/vocal-fix/send-file" variant="secondary">
                אישור תנאים ושליחה
              </Button>
            </div>
            <div className="mt-5 flex justify-center lg:justify-start">
              <ShareButton title="מאגר שירותי AI אונליין | יקיר כהן הפקות" />
            </div>
          </div>
          <CallbackLeadForm
            heading="השאירו פרטים להצעת מחיר מהירה"
            description="השאירו שם וטלפון ונחזור אליכם עם כיוון שירות ברור לפרויקט. ללא התחייבות."
            utmCampaign="online_hub_quote"
            serviceOptions={[
              "אודיו ומוזיקה",
              "פודקאסט וקריינות",
              "וידאו ותוכן",
              "תמונה ועיצוב AI",
              "התאמה אישית",
            ]}
            formLabel="טופס הצעת מחיר מהירה לשירותי אונליין"
          />
        </div>
        </Container>
      </Section>
    </div>
  );
}
