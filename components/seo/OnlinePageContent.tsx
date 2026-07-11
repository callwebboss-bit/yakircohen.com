import Link from "next/link";
import CallbackLeadForm from "@/components/forms/CallbackLeadForm";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import ServiceCard from "@/components/marketing/ServiceCard";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import ProposalGiftPitchProofSection from "@/components/seo/ProposalGiftPitchProofSection";
import SoundImprovementShowcase from "@/components/seo/SoundImprovementShowcase";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import FAQAccordion from "@/components/ui/FAQAccordion";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import HeroScrollCue from "@/components/marketing/HeroScrollCue";
import HeroTrackedCta from "@/components/marketing/HeroTrackedCta";
import CtaOutcomeSubline from "@/components/marketing/CtaOutcomeSubline";
import {
  ONLINE_FEATURED_SERVICES,
  ONLINE_HUB_FAQS,
  ONLINE_QUICK_LINKS,
  ONLINE_SERVICE_CATEGORIES,
  ONLINE_WHY_US,
} from "@/lib/data/online-page";
import {
  mapOnlineFeaturedToHub,
  mapOnlineQuickLinksToHub,
  mapOnlineServiceToHub,
} from "@/lib/data/online-hub-mappers";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { appendYcLeadTag } from "@/lib/yc-lead-tag";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";
import HubDualCta from "@/components/marketing/HubDualCta";
import { OUTCOME_CTA } from "@/lib/data/conversion-copy";
import { buildBookHref } from "@/lib/book-url";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";

const bookCta = resolveServiceBookCta("online");

const chipClass =
  "inline-flex min-h-11 items-center rounded-full border border-border bg-background px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

const linkClass =
  "inline-flex min-h-11 items-center text-sm font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

export default function OnlinePageContent() {
  const ctaHref = buildWhatsAppHref({
    text: appendYcLeadTag(
      "היי יקיר! יש לי פרויקט אונליין עם AI ואשמח לבדיקה ראשונית והצעת מחיר מהירה.",
      { service: "online_ai", source: "hero_cta", step: 1 },
    ),
    utm_source: "online",
    utm_campaign: "online_hub_cta",
  });

  const onlineBookHref = buildBookHref("online");

  const featuredLinks = mapOnlineFeaturedToHub(ONLINE_FEATURED_SERVICES);
  const quickLinks = mapOnlineQuickLinksToHub(ONLINE_QUICK_LINKS);

  return (
    <div className="bg-background">
      <FaqPageSchema
        items={ONLINE_HUB_FAQS.map((f) => ({ question: f.question, answer: f.answer as string }))}
      />
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
            תיקון שירה, מיקס ופודקאסט אונליין - תוך 24-48 שעות.
          </h1>
          <h2 className="text-section-title mx-auto mt-5 max-w-3xl font-semibold text-foreground">
            האולפן מגיע אליכם: שירותי סאונד, תוכן והפקה מקצועיים מרחוק
          </h2>
          <p className="text-lead mx-auto mt-4 max-w-3xl text-muted-foreground">
            תיקון זיופים, מיקס, פודקאסט ותמונה - הכל מרחוק. מ-250 ₪, עם ליווי
            אישי בוואטסאפ.
          </p>
          <ContextualIntroParagraph pathname="/online" className="mx-auto mt-4 max-w-3xl" />
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <HeroTrackedCta href={onlineBookHref}>{OUTCOME_CTA.heroSendFile}</HeroTrackedCta>
              <Button
                as="a"
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="min-h-14 w-full sm:w-auto"
              >
                שלחו קובץ לבדיקה ראשונית בוואטסאפ
              </Button>
            </div>
            <CtaOutcomeSubline />
            <HeroScrollCue href="#online-categories" />
          </div>
          <TrustStatsBar variant="compact" className="mt-8 rounded-2xl border" />
        </Container>
      </Section>

      <Section id="online-categories" padding="none" className="border-b border-border bg-surface py-8">
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
                {category.icon} {category.title}
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
          <ServiceHubLinks
            heading="השירותים המובילים מרחוק"
            subheading="שלחו קובץ, קבלו תוצאה מוכנה - סאונד, תמונה או תוכן."
            links={featuredLinks}
            headingId="online-featured-heading"
            columns={3}
          />
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

      <Section padding="sm" className="border-b border-border bg-surface">
        <Container>
          <ProposalGiftPitchProofSection
            headingId="online-pitch-proof-heading"
            heading="תיקון זיופים - שמעו לפני שמזמינים"
            intro="אותו קטע מהאולפן לפני ואחרי תיקון זיופים. מתאים גם להקלטה באולפן וגם לשליחת קובץ מרחוק."
          />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
            לפרטים ומחירון תיקון זיופים מרחוק -{" "}
            <Link href="/online/vocal-fix/pitch-correction" className={linkClass}>
              עמוד תיקון זיופים
            </Link>
            .
          </p>
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
                  <h3 className="text-lg font-semibold text-foreground">
                    {category.icon} {category.title}
                  </h3>
                  <Link
                    href={`/online/${category.slug}`}
                    className={linkClass}
                  >
                    לעמוד הקטגוריה </Link>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((service) => {
                    const item = mapOnlineServiceToHub(service, ctaHref);
                    return (
                      <li key={`${category.id}-${service.title}`} className="h-full">
                        <ServiceCard
                          title={item.title}
                          description={item.description}
                          href={item.href}
                          icon={item.icon!}
                          badge={item.badge}
                          badgeVariant={item.badgeVariant}
                          isAiService={item.isAiService}
                          ctaLabel={item.ctaLabel}
                          external={item.external}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="sm">
        <Container>
          <ServiceHubLinks
            heading="קישורים מהירים להתחלה"
            subheading="מסלולים נפוצים לשליחת קובץ או בדיקה ראשונית."
            links={quickLinks}
            headingId="online-quick-links-heading"
            columns={2}
          />
        </Container>
      </Section>

      <Section padding="sm" className="border-t border-border bg-surface">
        <Container className="max-w-3xl">
          <h2 className="font-serif text-section-title font-semibold text-foreground">
            למה לעבוד איתנו אונליין?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ONLINE_WHY_US.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <span aria-hidden>{item.icon}</span>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <FAQAccordion
        title="שאלות נפוצות, שירותי AI אונליין"
        items={ONLINE_HUB_FAQS}
      />

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
