import Link from "next/link";
import CallbackLeadForm from "@/components/forms/CallbackLeadForm";
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
import ShareButton from "@/components/ui/ShareButton";

export default function OnlinePageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! יש לי פרויקט אונליין עם AI ואשמח לבדיקה ראשונית והצעת מחיר מהירה.",
    utm_source: "online",
    utm_campaign: "online_hub_cta",
  });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            מאגר שירותי AI אונליין - אנחנו מבצעים הכל עבורכם
          </h1>
          <h2 className="mx-auto mt-5 max-w-3xl text-lg font-semibold text-foreground sm:text-xl">
            האולפן מגיע אליכם: שירותי סאונד, תוכן והפקה מקצועיים מרחוק
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            שולחים קובץ או רעיון. מקבלים תוצאה מוכנה למייל או לוואטסאפ - סאונד,
            תמונה או תוכן.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              שלחו קובץ לבדיקה ראשונית בוואטסאפ ←
            </a>
            <Link
              href="#quick-quote"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
            >
              השאירו פרטים להצעת מחיר מהירה
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-8">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6">
          <p className="mb-4 text-center text-sm font-medium text-foreground">
            ניווט מהיר לפי קטגוריות
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {ONLINE_SERVICE_CATEGORIES.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
              >
                {category.title}
              </a>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Link
              href="/online/vocal-fix/send-file"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
            >
              שליחת קבצים
            </Link>
            <Link
              href="/business/social-media"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
            >
              שירותים לעסקים
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-xl font-semibold text-foreground sm:text-2xl">
          השירותים המובילים מרחוק
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {ONLINE_FEATURED_SERVICES.map((svc) => (
            <article
              key={svc.title}
              className="flex flex-col rounded-2xl border border-border bg-background p-6"
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
                className="mt-4 text-sm font-semibold text-brand-red hover:underline"
              >
                לפרטים ←
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-background py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-semibold text-foreground">שומעים את ההבדל</h2>
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
        </div>
      </section>

      <ClientJourneySteps variant="online" display="compact" />

      <section className="border-y border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-xl font-semibold text-foreground sm:text-2xl">
            מאגר שירותי AI אונליין - לפי קטגוריות
          </h2>
          <p className="mb-8 max-w-3xl text-sm text-muted-foreground">
            בחרו שירות והתחילו. לפרטים מלאים -{" "}
            <Link href="/start#online" className="font-medium text-brand-red hover:underline">
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
                    className="text-sm font-semibold text-brand-red hover:underline"
                  >
                    לעמוד הקטגוריה ←
                  </Link>
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
                          className="mt-3 inline-flex text-sm font-semibold text-brand-red hover:underline"
                        >
                          לפרטים ←
                        </Link>
                      ) : (
                        <a
                          href={ctaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex text-sm font-semibold text-brand-red hover:underline"
                        >
                          בקשו התאמה אישית ←
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          קישורים מהירים להתחלה
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {ONLINE_QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand-red/40"
              >
                <span className="font-semibold text-foreground">{link.label}</span>
                <p className="mt-1 text-sm text-muted-foreground">{link.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-xl font-semibold text-foreground">
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
        </div>
      </section>

      <section id="quick-quote" className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="rounded-2xl border border-border bg-surface p-8 text-center lg:text-right">
            <h2 className="text-2xl font-semibold text-foreground">רוצים להתחיל עכשיו?</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              שלחו קובץ לבדיקה ראשונית בוואטסאפ או השאירו פרטים ונחזור אליכם
              במהירות עם מסלול שירות מדויק.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                שלחו קובץ בוואטסאפ ←
              </a>
              <Link
                href="/online/vocal-fix/send-file"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
              >
                אישור תנאים ושליחה
              </Link>
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
      </section>
    </div>
  );
}
