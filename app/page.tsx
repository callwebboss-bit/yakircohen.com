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

const HOME_TITLE = "יקיר כהן הפקות | אולפן, פודקאסט ואירועים במודיעין";
const HOME_DESCRIPTION =
  "אולפן הקלטות במודיעין, פודקאסט, קריינות, DJ ואטרקציות לאירועים. שחזור סאונד ומדיה ב-AI.";

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
      <HomePageSections
        heroWhatsAppHref={heroWhatsAppHref}
        bottomWhatsAppHref={bottomWhatsAppHref}
      />
      <EphemeralPulse />
    </>
  );
}
