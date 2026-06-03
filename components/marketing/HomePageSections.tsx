import type { ReactNode } from "react";
import Link from "next/link";
import CallbackLeadForm from "@/components/forms/CallbackLeadForm";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import HomeHero from "@/components/marketing/HomeHero";
import HomeSocialProofSection from "@/components/marketing/HomeSocialProofSection";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import PremiumBundleCallout from "@/components/marketing/PremiumBundleCallout";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import ServiceCard from "@/components/marketing/ServiceCard";
import StudioClientsStrip from "@/components/marketing/StudioClientsStrip";
import Testimonials from "@/components/marketing/Testimonials";
import WhatsappLeadRouter from "@/components/marketing/WhatsappLeadRouter";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import {
  MicIcon,
  MusicIcon,
  RadioIcon,
  SparklesIcon,
  VideoIcon,
  ZapIcon,
} from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

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
        המחיר תלוי בשירות, בהיקף ובתוספות. ב
        <InlineServiceLink href="/book">הזמנה מקוונת</InlineServiceLink>{" "}
        אפשר לבחור שירות, לראות טווח מחיר ולשלוח הזמנה בוואטסאפ. לייעוץ חינם -
        השאירו פרטים למטה או כתבו לנו.
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
    href: "/events",
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
      <HomeHero heroWhatsAppHref={heroWhatsAppHref} />
      <TrustStatsBar />

      <section
        className="bg-background py-16 sm:py-20 lg:py-24"
        aria-labelledby="services-heading"
      >
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              המרכזים שלנו
            </p>
            <h2
              id="services-heading"
              className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה אתם צריכים היום?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              לחצו על{" "}
              <InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink>,{" "}
              <InlineServiceLink href="/studio">אולפן</InlineServiceLink>,{" "}
              <InlineServiceLink href="/voiceover">קריינות</InlineServiceLink>,{" "}
              <InlineServiceLink href="/events">אירועים</InlineServiceLink> או{" "}
              <InlineServiceLink href="/video">וידאו וצילום</InlineServiceLink>
              . נחבר אתכם למסלול הנכון תוך דקות.
            </p>
          </header>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <ServiceCard
              title="מרכז הפודקאסט"
              description="בואו נבנה פורמט, נקליט באולפן, נערוך ונעלה."
              href="/podcast"
              icon={<ServiceHubIcon><RadioIcon size={22} /></ServiceHubIcon>}
              utm_campaign="home_podcast"
            />
            <ServiceCard
              title="סטודיו וברכות"
              description="שיר במתנה, ברכה לחתונה, קליפ קצר. הילד שלכם הוא הכוכב."
              href="/studio"
              icon={<ServiceHubIcon><MusicIcon size={22} /></ServiceHubIcon>}
              utm_campaign="home_studio"
            />
            <ServiceCard
              title="קריינות"
              description="פרסומת, מרכזיה, IVR. קול שמוכר ומסביר בביטחון."
              href="/voiceover"
              icon={<ServiceHubIcon><MicIcon size={22} /></ServiceHubIcon>}
              utm_campaign="home_voiceover"
            />
            <ServiceCard
              title="אירועים ואטרקציות"
              description="DJ, הגברה, עשן, זיקוקים קרים. רחבה שעפה."
              href="/events"
              icon={<ServiceHubIcon><SparklesIcon size={22} /></ServiceHubIcon>}
              utm_campaign="home_events"
            />
            <ServiceCard
              title="וידאו וצילום"
              description="סרט תדמית, אירוע, חתונה. תמונה וסאונד באותה נשימה."
              href="/video"
              icon={<ServiceHubIcon><VideoIcon size={22} /></ServiceHubIcon>}
              utm_campaign="home_video"
            />
            <ServiceCard
              title="שחזור סאונד ב-AI"
              description="הקלטה ישנה? ננקה, נחזק, נחזיר לחיים."
              href="/online"
              icon={<ServiceHubIcon><ZapIcon size={22} /></ServiceHubIcon>}
              isAiService
              badge="טכנולוגיית AI"
              utm_campaign="home_ai_media"
            />
            <PremiumBundleCallout />
          </div>
        </div>
      </section>

      <StudioClientsStrip />

      <WhatsappLeadRouter />

      <section
        className="border-y border-border bg-surface py-16 sm:py-20"
        aria-labelledby="value-heading"
      >
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="value-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
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
                  className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 text-center transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-md md:text-start"
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
                    לפרטים ←
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials />

      <HomeSocialProofSection />

      <ClientJourneySteps variant="general" display="compact" className="bg-surface" />

      <section className="border-b border-border bg-surface pb-16 pt-2 sm:pb-20">
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-6 lg:px-8">
          <p className="mx-auto mb-6 max-w-lg text-sm text-muted-foreground">
            מוכנים לשיר, ברכה או פרק ראשון? בחרו מסלול, קבלו מחיר ושלחו הזמנה בוואטסאפ.
          </p>
          <Link
            href="/book"
            className={cn(
              "inline-flex items-center justify-center rounded-md bg-brand-red px-8 py-3 text-sm font-semibold text-white",
              "transition-colors duration-normal ease-luxury hover:bg-brand-red-light",
            )}
          >
            הזמינו הקלטה באולפן
          </Link>
        </div>
      </section>

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

      <section
        className="border-t border-border bg-background py-16 sm:py-20"
        aria-labelledby="bottom-cta-heading"
      >
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-6 lg:px-8">
          <h2
            id="bottom-cta-heading"
            className="font-serif text-2xl font-semibold text-foreground sm:text-3xl"
          >
            מוכנים להתחיל?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            שלחו הודעה על{" "}
            <InlineServiceLink href="/studio">הקלטה באולפן</InlineServiceLink>,{" "}
            <InlineServiceLink href="/events">אירוע</InlineServiceLink> או{" "}
            <InlineServiceLink href="/podcast">פודקאסט</InlineServiceLink>. נבין
            מה אתם צריכים ונציע מסלול ברור.
          </p>
          <a
            href={bottomWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-8 inline-flex items-center justify-center rounded-md bg-brand-red px-8 py-3 text-sm font-semibold text-white transition-colors duration-normal ease-luxury hover:bg-brand-red-light",
            )}
          >
            בואו נדבר בוואטסאפ
          </a>
        </div>
      </section>
    </>
  );
}
