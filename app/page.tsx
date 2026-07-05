import type { Metadata } from "next";
import HomePageSections from "@/components/marketing/HomePageSections";
import EphemeralPulse from "@/components/marketing/EphemeralPulse";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_ROBOTS,
} from "@/lib/seo-config";
import { SITE_URL } from "@/lib/site-url";
import { buildFaqSchema } from "@/lib/seo/page-schema";
import { HOME_FAQ_ITEMS } from "@/lib/data/home-faq";
import { TIME_PROMISE_DISCLAIMER } from "@/lib/data/conversion-copy";

const HOME_TITLE = "אולפן הקלטות מודיעין | תיקון זיופים, פודקאסט ואטרקציות, בדרך כלל 24 שעות";
const HOME_DESCRIPTION =
  "אולפן הקלטות מקצועי במודיעין. תיקון זיופים, קריינות אנושית, פודקאסט ואטרקציות לאירועים. פתח תקווה, שוהם וכל אזור המרכז - הצעה, בדרך כלל תוך 24 שעות. " +
  TIME_PROMISE_DISCLAIMER;

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    ...DEFAULT_TWITTER,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  robots: SITE_ROBOTS,
};

const HOME_FAQ_SCHEMA = buildFaqSchema(
  HOME_FAQ_ITEMS.map((item) => ({ question: item.question, answer: item.answerPlain })),
);

export default function HomePage() {
  const heroWhatsAppHref = buildWhatsAppHref({
    text: "שלום, אשמח לייעוץ והצעת מחיר לפרויקט שלי.",
    utm_source: "website",
    utm_campaign: "hero_cta",
  });

  const bottomWhatsAppHref = buildWhatsAppHref({
    text: "שלום, אני מוכן/ה להתחיל פרויקט - אשמח לשיחה קצרה.",
    utm_source: "website",
    utm_campaign: "bottom_cta",
  });

  return (
    <>
      {HOME_FAQ_SCHEMA && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_FAQ_SCHEMA) }}
        />
      )}
      <HomePageSections
        heroWhatsAppHref={heroWhatsAppHref}
        bottomWhatsAppHref={bottomWhatsAppHref}
      />
      <EphemeralPulse />
    </>
  );
}
