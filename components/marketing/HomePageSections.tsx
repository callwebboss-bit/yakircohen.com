import type { ReactNode } from "react";
import Link from "next/link";
import CallbackLeadForm from "@/components/forms/CallbackLeadForm";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import HomeHero from "@/components/marketing/HomeHero";
import HomeQuickPaths from "@/components/marketing/HomeQuickPaths";
import LiveStatusBar from "@/components/marketing/LiveStatusBar";
import { HomeSocialProofSectionLazy } from "@/components/marketing/lazy";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import PremiumBundleCallout from "@/components/marketing/PremiumBundleCallout";
import ServiceCard from "@/components/marketing/ServiceCard";
import StudioClientsStrip from "@/components/marketing/StudioClientsStrip";
import Testimonials from "@/components/marketing/Testimonials";
import WhatsappLeadRouter from "@/components/marketing/WhatsappLeadRouter";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import HomeServicesDetailHub from "@/components/marketing/HomeServicesDetailHub";
import {
  PRIMARY_HOME_HUB_CARDS,
  SECONDARY_HOME_HUB_CARDS,
  getHomeHubIcon,
} from "@/lib/data/home-hub-cards";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { HOME_FAQ_ITEMS } from "@/lib/data/home-faq";

const HOME_FAQ_UI_OVERRIDES: Record<string, ReactNode> = {
  "location-parking": (
    <>
      <InlineServiceLink href="/studio">האולפן</InlineServiceLink> ממוקם בעמק
      איילון 34, מודיעין מכבים רעות. חניה פרטית בשטח.
    </>
  ),
  "ai-restoration": (
    <>
      שלחו לנו את הקובץ. אנחנו מנקים רעשים, מיישרים עוצמה, ומחזירים קול שאפשר
      להפיץ בגאווה דרך{" "}
      <InlineServiceLink href="/podcast/podcast-editing#podcast-zoom-demo">
        שחזור סאונד ב-AI
      </InlineServiceLink>
      .
    </>
  ),
  "events-attractions": (
    <>
      כן.{" "}
      <InlineServiceLink href="/events/dj-events">DJ והגברה</InlineServiceLink>
      ,{" "}
      <InlineServiceLink href="/events/attractions/wedding-smoking-machine">
        עשן כבד
      </InlineServiceLink>
      ,{" "}
      <InlineServiceLink href="/events/attractions/giant-balloons">
        בועות
      </InlineServiceLink>
      ,{" "}
      <InlineServiceLink href="/events/attractions/cold-fireworks">
        זיקוקים קרים
      </InlineServiceLink>{" "}
      ועוד - זמינים לאירועי שטח. החבילה נבנית לפי סוג האירוע ומיקומו.
    </>
  ),
  pricing: (
    <>
      ברכה / הקלטה קצרה{" "}
      {formatFromPriceDual(getExVat("blessing_recording")).replace("כרגע: ", "")}.
      פודקאסט פיילוט מ-{getExVat("podcast_pilot").toLocaleString("he-IL")} ₪ + מע״מ.
      ב
      <InlineServiceLink href="/book">הזמנה מקוונת</InlineServiceLink>{" "}
      רואים מחיר סופי מיד ושולחים בוואטסאפ - בלי לחכות לתשובה.
    </>
  ),
  "service-area": (
    <>
      האולפן במודיעין. ל
      <InlineServiceLink href="/events">אירועים</InlineServiceLink> מגיעים
      לפתח תקווה,{" "}
      <InlineServiceLink href="/studio/studio-shoham">שוהם</InlineServiceLink>,{" "}
      <InlineServiceLink href="/studio/studio-rehovot">רחובות</InlineServiceLink>, ירושלים ולכל הארץ.{" "}
      <InlineServiceLink href="/studio/studio-jerusalem">
        הקלטות בירושלים
      </InlineServiceLink>{" "}
      - בתיאום מראש. תוספת נסיעות מחוץ לאזור המרכז.
    </>
  ),
  cancellation: (
    <>
      עדכנו אותנו בהקדם בוואטסאפ. ננסה לתאם מועד חלופי. מדיניות ביטולים מפורטת
      ב
      <Link href="/terms" className="font-medium text-brand-red hover:underline">
        תנאי השירות
      </Link>
      .
    </>
  ),
  "remote-fix": (
    <>
      כן. שולחים קובץ בוואטסאפ, במייל או ב-Drive - ומחזירים קובץ מטופל תוך שעות.{" "}
      <InlineServiceLink href="/online">
        תיקון זיופים, ניקוי רעשים, מיקס ומאסטרינג
      </InlineServiceLink>{" "}
      - הכל מרחוק.
    </>
  ),
};

const HOME_FAQ: FAQItem[] = HOME_FAQ_ITEMS.map((item) => ({
  id: item.id,
  question: item.question,
  answer: HOME_FAQ_UI_OVERRIDES[item.id] ?? item.answerPlain,
}));

const VALUE_PROPS = [
  {
    title: "ציוד שעובד בשבילכם",
    description:
      "מיקרופונים, מוניטורים ותוכנות ברמה גבוהה. אתם שרים. אנחנו דואגים שהכל יישמע נקי.",
    href: "/studio",
  },
  {
    title: "ניסיון מהשטח",
    description:
      "עשרות אירועים, פודקאסטים והקלטות. יודעים מתי לדבר ומתי לתת לרגע לנשום.",
    href: "/events/attractions",
  },
  {
    title: "שגר ושכח",
    description:
      "תיאום קצר בוואטסאפ, הגעה, הפקה, מסירה. בלי בירוקרטיה. בלי כאב ראש.",
    href: "/podcast",
  },
] as const;

function ServiceHubIcon({ children }: { children: ReactNode }) {
  return <span aria-hidden="true">{children}</span>;
}

export type HomePageSectionsProps = {
  heroWhatsAppHref: string;
  bottomWhatsAppHref: string;
};

export default function HomePageSections({
  heroWhatsAppHref,
  bottomWhatsAppHref,
}: HomePageSectionsProps) {
  return (
    <>
      <LiveStatusBar />
      <HomeHero heroWhatsAppHref={heroWhatsAppHref} />
      <HomeQuickPaths />

      <section className="border-b border-brand-red/20 bg-brand-red/5 py-5">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 text-center sm:flex-row sm:justify-between sm:text-start">
          <p className="text-sm font-medium text-foreground">
            <span className="font-semibold">רוצה לשפר סאונד?</span>{" "}
            תיקון זיופים, ניקוי רעשים ומיקס - אני עושה את זה מרחוק, תוך שעות.
          </p>
          <Link
            href="/online"
            className="shrink-0 inline-flex rounded-xl bg-brand-red px-5 py-2 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            שלח קובץ עכשיו
          </Link>
        </div>
      </section>

      <Section
        className="bg-background"
        ariaLabelledby="services-heading"
      >
        <Container>
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              המרכזים שלנו
            </p>
            <h2
              id="services-heading"
              className="mt-3 font-serif text-section-title font-semibold text-foreground"
            >
              מה אתם צריכים היום?
            </h2>
            <div className="mt-5 flex flex-wrap justify-center gap-2" role="group" aria-label="בחרו את המסלול שלכם">
              {([
                { label: "מקליט שיר לאירוע", href: "/studio/recording-song-modiin" },
                { label: "מחפש DJ לחתונה", href: "/events/dj-events" },
                { label: "מפיק פודקאסט", href: "/podcast" },
                { label: "עסק מחפש תוכן", href: "/business" },
              ] as const).map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-foreground/80 transition-colors duration-fast hover:border-brand-red/40 hover:bg-brand-red/5 hover:text-brand-red"
                >
                  {label}
                  <span aria-hidden="true">›</span>
                </Link>
              ))}
            </div>
          </header>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {[...PRIMARY_HOME_HUB_CARDS, ...SECONDARY_HOME_HUB_CARDS].map(
              (card) => {
                const Icon = getHomeHubIcon(card.id);
                return (
                  <ServiceCard
                    key={card.id}
                    title={card.title}
                    description={card.description}
                    href={card.href}
                    icon={
                      <ServiceHubIcon>
                        <Icon size={22} />
                      </ServiceHubIcon>
                    }
                    utm_campaign={card.utmCampaign}
                    isAiService={card.isAiService}
                    badge={card.badge}
                    badgeVariant={card.badgeVariant}
                  />
                );
              },
            )}
            <PremiumBundleCallout />
          </div>
        </Container>
      </Section>

      <StudioClientsStrip />

      <HomeServicesDetailHub />

      <WhatsappLeadRouter />

      <Section
        padding="sm"
        className="border-y border-border bg-surface"
        ariaLabelledby="value-heading"
      >
        <Container>
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="value-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              למה לקוחות חוזרים אלינו
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <InlineServiceLink href="/studio">אולפן מקצועי</InlineServiceLink>
              ,{" "}
              <InlineServiceLink href="/events">הפקת אירועים</InlineServiceLink>{" "}
              ו
              <InlineServiceLink href="/podcast/podcast-editing">
                עריכת פודקאסט
              </InlineServiceLink>{" "}
              תחת קורת גג אחת.
            </p>
          </header>
          <ul className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {VALUE_PROPS.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 text-center hover-lift focus-within:border-brand-red/40 focus-within:shadow-md md:text-start"
                >
                  <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-brand-red/40 text-sm font-bold text-brand-red md:mx-0">
                    ✦
                  </span>
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-brand-red">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-4 text-xs font-semibold text-brand-red">
                    לפרטים </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Testimonials />

      <HomeSocialProofSectionLazy />

      <ClientJourneySteps variant="general" display="compact" className="bg-surface" />

      <Section padding="sm" className="border-b border-border bg-surface pt-2">
        <Container className="text-center">
          <p className="text-lead mx-auto mb-6 max-w-lg text-muted-foreground">
            מוכנים לשיר, ברכה או פרק ראשון? בחרו מסלול, קבלו מחיר ושלחו הזמנה בוואטסאפ.
          </p>
          <Button as="link" href="/book" className="px-8">
            הזמינו הקלטה באולפן
          </Button>
        </Container>
      </Section>

      <section className="bg-background py-16 sm:py-20" aria-labelledby="geo-heading">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface px-6 py-10 text-center sm:px-10">
            <h2
              id="geo-heading"
              className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
            >
              ממודיעין - לפתח תקווה, שוהם, ירושלים וכל הארץ
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <InlineServiceLink href="/studio">האולפן והצוות שלנו במודיעין</InlineServiceLink>
              . מגיעים ל
              <InlineServiceLink href="/events">אירועים</InlineServiceLink> בפתח תקווה,
              <InlineServiceLink href="/dj-events/cities/shoham"> שוהם</InlineServiceLink>,
              <InlineServiceLink href="/dj-events/cities/rehovot"> רחובות</InlineServiceLink>,
              ירושלים ובכל מקום שצריך{" "}
              <InlineServiceLink href="/video">הפקת וידאו</InlineServiceLink> או{" "}
              <InlineServiceLink href="/photography">צילום</InlineServiceLink> ברמה
              גבוהה.{" "}
              <Link href="/contact" className="font-medium text-brand-red hover:underline">
                דברו איתנו
              </Link>{" "}
              ונחזור אליכם מהר.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <CallbackLeadForm
            heading="מעדיפים שנחזור אליכם?"
            description="השאירו שם וטלפון - נחזור תוך שעה בשעות הפעילות. ללא התחייבות."
            utmCampaign="home_callback_form"
          />
        </div>
      </section>

      <FAQAccordion
        items={HOME_FAQ}
        title="שאלות שכדאי לשאול לפני שמתחילים"
        subtitle="תשובות קצרות. בלי מילים מסובכות."
      />
      <div className="bg-background pb-10 text-center">
        <Link
          href="/about/faq"
          className="inline-flex min-h-12 items-center text-sm font-semibold text-brand-red hover:underline"
        >
          עוד שאלות ותשובות (20) →
        </Link>
      </div>

      <Section
        className="border-t border-border bg-background text-center"
        ariaLabelledby="bottom-cta-heading"
      >
        <Container>
          <h2
            id="bottom-cta-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            מוכנים להתחיל? הצעה תוך 24 שעות
          </h2>
          <p className="text-lead mx-auto mt-4 max-w-xl text-muted-foreground">
            שלחו הודעה על{" "}
            <InlineServiceLink href="/studio">הקלטה באולפן</InlineServiceLink>,{" "}
            <InlineServiceLink href="/events">אירוע</InlineServiceLink> או{" "}
            <InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink>. נחזור
            עם הצעה ברורה תוך 24 שעות.
          </p>
          <Button
            as="a"
            href={bottomWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8"
          >
            קבלו הצעה תוך 24 שעות
          </Button>
        </Container>
      </Section>
    </>
  );
}
