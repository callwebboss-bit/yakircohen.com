import type { ReactNode } from "react";
import Link from "next/link";
import CallbackLeadForm from "@/components/forms/CallbackLeadForm";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import HomeHero from "@/components/marketing/HomeHero";
import LiveStatusBar from "@/components/marketing/LiveStatusBar";
import { HomeSocialProofSectionLazy } from "@/components/marketing/lazy";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import PremiumBundleCallout from "@/components/marketing/PremiumBundleCallout";
import ServiceCard from "@/components/marketing/ServiceCard";
import StudioClientsStrip from "@/components/marketing/StudioClientsStrip";
import Testimonials from "@/components/marketing/Testimonials";
import WhatsappLeadRouter from "@/components/marketing/WhatsappLeadRouter";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import {
  PRIMARY_HOME_HUB_CARDS,
  SECONDARY_HOME_HUB_CARDS,
  getHomeHubIcon,
} from "@/lib/data/home-hub-cards";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";

const HOME_FAQ: FAQItem[] = [
  {
    id: "location-parking",
    question: "איפה האולפן ויש חנייה?",
    answer: (
      <>
        ב
        <InlineServiceLink href="/studio">אולפן במודיעין</InlineServiceLink>
        . מגיעים, חונים בנוחות, נכנסים להקלטה. פשוט.
      </>
    ),
  },
  {
    id: "ai-restoration",
    question: "יש לכם הקלטה ישנה או רועשת?",
    answer: (
      <>
        שלחו לנו את הקובץ. אנחנו מנקים רעשים, מיישרים עוצמה, ומחזירים קול שאפשר
        להפיץ בגאווה דרך{" "}
        <InlineServiceLink href="/podcast/podcast-editing#podcast-zoom-demo">
          שחזור סאונד ב-AI
        </InlineServiceLink>
        .
      </>
    ),
  },
  {
    id: "events-attractions",
    question: "אתם מגיעים לאירוע שלי?",
    answer: (
      <>
        כן.{" "}
        <InlineServiceLink href="/events/dj-events">DJ והגברה</InlineServiceLink>
        ,{" "}
        <InlineServiceLink href="/events/attractions/wedding-smoking-machine">
          עשן
        </InlineServiceLink>
        ,{" "}
        <InlineServiceLink href="/events/attractions/giant-balloons">
          בועות
        </InlineServiceLink>
        ,{" "}
        <InlineServiceLink href="/events/attractions/cold-fireworks">
          זיקוקים קרים
        </InlineServiceLink>{" "}
        ועוד. תגידו לנו מה חוגגים ונבנה חבילה שמתאימה.
      </>
    ),
  },
  {
    id: "pricing",
    question: "כמה עולה הקלטה או אירוע?",
    answer: (
      <>
        ברכה / הקלטה קצרה{" "}
        {formatFromPriceDual(getExVat("blessing_recording")).replace("כרגע: ", "")}.
        פודקאסט פיילוט מ-{getExVat("podcast_pilot").toLocaleString("he-IL")} ₪ + מע״מ.
        ב
        <InlineServiceLink href="/book">הזמנה מקוונת</InlineServiceLink>{" "}
        רואים מחיר סופי מיד ושולחים בוואטסאפ - בלי לחכות לתשובה.
      </>
    ),
  },
  {
    id: "delivery-time",
    question: "תוך כמה זמן מקבלים קובץ מוכן?",
    answer: (
      <>
        הקלטה באולפן - בדרך כלל מספר ימים עד שבועיים, תלוי בעריכה. פודקאסט ואירועים
        - לפי היקף הפרויקט. נעדכן אתכם בשיחה הראשונה על לוח זמנים ברור.
      </>
    ),
  },
  {
    id: "service-area",
    question: "לאיזה אזורים אתם מגיעים?",
    answer: (
      <>
        האולפן במודיעין. ל
        <InlineServiceLink href="/events">אירועים</InlineServiceLink> מגיעים
        לירושלים, למרכז ולכל הארץ.{" "}
        <InlineServiceLink href="/studio/studio-jerusalem">
          הקלטות בירושלים
        </InlineServiceLink>{" "}
        - בתיאום מראש.
      </>
    ),
  },
  {
    id: "payment",
    question: "איך משלמים?",
    answer: (
      <>
        אשראי, Bit, PayBox, Apple Pay ו-PayPal לפי תיאום. חשבונית מס מסודרת. פרטי
        כרטיס אשראי לא נשמרים באתר - הסליקה דרך ספק מאושר.
      </>
    ),
  },
  {
    id: "cancellation",
    question: "מה קורה אם צריך לבטל או לשנות תאריך?",
    answer: (
      <>
        עדכנו אותנו בהקדם בוואטסאפ. ננסה לתאם מועד חלופי. מדיניות ביטולים מפורטת
        ב
        <Link href="/terms" className="font-medium text-brand-red hover:underline">
          תנאי השירות
        </Link>
        .
      </>
    ),
  },
];

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
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              לחצו על{" "}
              <InlineServiceLink href="/studio" ariaLabel="עבור לעמוד אולפן הקלטות">אולפן הקלטות</InlineServiceLink>,{" "}
              <InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink>,{" "}
              <InlineServiceLink href="/events">אירועים ואטרקציות</InlineServiceLink>,{" "}
              <InlineServiceLink href="/events/dj-events">DJ לחתונות</InlineServiceLink>,{" "}
              <InlineServiceLink href="/online">שירותי AI</InlineServiceLink>{" "}
              או{" "}
              <InlineServiceLink href="/business">לעסקים</InlineServiceLink>
              . נחבר אתכם למסלול הנכון תוך דקות.
            </p>
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
                  />
                );
              },
            )}
            <PremiumBundleCallout />
          </div>
        </Container>
      </Section>

      <StudioClientsStrip />

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
              ממודיעין לכל הארץ
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <InlineServiceLink href="/studio">האולפן והצוות שלנו במודיעין</InlineServiceLink>
              . מגיעים ל
              <InlineServiceLink href="/events">אירועים</InlineServiceLink> בירושלים,
              במרכז ובכל מקום שצריך{" "}
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

      <Section
        className="border-t border-border bg-background text-center"
        ariaLabelledby="bottom-cta-heading"
      >
        <Container>
          <h2
            id="bottom-cta-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            מוכנים להתחיל?
          </h2>
          <p className="text-lead mx-auto mt-4 max-w-xl text-muted-foreground">
            שלחו הודעה על{" "}
            <InlineServiceLink href="/studio">הקלטה באולפן</InlineServiceLink>,{" "}
            <InlineServiceLink href="/events">אירוע</InlineServiceLink> או{" "}
            <InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink>. נבין
            מה אתם צריכים ונציע מסלול ברור.
          </p>
          <Button
            as="a"
            href={bottomWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8"
          >
            בואו נדבר בוואטסאפ
          </Button>
        </Container>
      </Section>
    </>
  );
}
