import type { Metadata, Viewport } from "next";
import { STUDIO_GEO } from "@/lib/constants";
import { Heebo, Noto_Serif_Hebrew } from "next/font/google";
import GlossaryTooltipProvider from "@/components/glossary/GlossaryTooltipProvider";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import OutboundLeadTracker from "@/components/analytics/OutboundLeadTracker";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SessionRescuerBarLazy from "@/components/booking/SessionRescuerBarLazy";
import UtmSessionPersist from "@/components/layout/UtmSessionPersist";
import SiteSchema from "@/components/seo/SiteSchema";
import DeferredFloatingFabs from "@/components/layout/DeferredFloatingFabs";
import PwaInstallPromptLazy from "@/components/marketing/PwaInstallPromptLazy";
import GiftFinderPopupLazy from "@/components/marketing/GiftFinderPopupLazy";
import SpeculationRules from "@/components/seo/SpeculationRules";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { SITE_URL } from "@/lib/site-url";
import { A11Y_PREFS_BOOT_SCRIPT } from "@/lib/a11y-prefs-boot";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_ROBOTS,
} from "@/lib/seo-config";
import "./globals.css";
import { cn } from "@/lib/utils";

// Variable font - single file covers all weights (100-900), one HTTP request
const heebo = Heebo({
  subsets: ["hebrew"],
  display: "swap",
  variable: "--font-heebo",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Arial Hebrew", "Arial", "Helvetica Neue", "sans-serif"],
});

const notoSerifHebrew = Noto_Serif_Hebrew({
  subsets: ["hebrew"],
  display: "swap",
  variable: "--font-noto-serif-hebrew",
  preload: false,
  adjustFontFallback: true,
  fallback: ["David Libre", "Times New Roman", "serif"],
});

const DEFAULT_TITLE =
  "יקיר כהן הפקות | אולפן, פודקאסט ואירועים במודיעין";
const DEFAULT_DESCRIPTION =
  "אולפן, פודקאסט ואירועים במודיעין. קריינות, DJ ושחזור סאונד ב-AI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | יקיר כהן הפקות",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "הפקות אירועים",
    "אולפן הקלטות מודיעין",
    "הפקת פודקאסט",
    "חתונות",
    "אירועים עסקיים",
  ],
  authors: [{ name: "יקיר כהן הפקות", url: SITE_URL }],
  creator: "יקיר כהן הפקות",
  publisher: "יקיר כהן הפקות",
  alternates: {
    canonical: SITE_URL,
    languages: { "he-IL": SITE_URL },
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    ...DEFAULT_TWITTER,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: SITE_ROBOTS,
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  other: {
    "ai-content-declaration": "human-authored-business-website",
    "geo.region": "IL-M",
    "geo.placename": "Modi'in-Maccabim-Re'ut",
    "geo.position": `${STUDIO_GEO.latitude};${STUDIO_GEO.longitude}`,
    ICBM: `${STUDIO_GEO.latitude}, ${STUDIO_GEO.longitude}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={cn(heebo.variable, notoSerifHebrew.variable, "font-sans")}
      /* F-68: הסקריפט בראש ה-body מוסיף ל-<html> את מחלקות ה-a11y-* לפני ההידרציה,
         ולכן ה-className בדפדפן שונה מזה של השרת. ההתעלמות חלה על האלמנט הזה בלבד. */
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh min-w-0 flex-col overflow-x-clip bg-background font-sans text-foreground antialiased">
        {/* בגוף ולא ב-<head>: Cypress מוסיף בראש ה-head רווח וסקריפט, ו-React מצמיד
            את הילד היחיד של ה-head לצומת הראשון שם. צומת טקסט לא מתאים לתג script,
            וההידרציה של כל העמוד נכשלת (שגיאה 418). */}
        {/* F-68 (8.10.2026): החלת העדפות הנגישות השמורות לפני הציור הראשון. בגוף
            ולא ב-head, מאותה סיבה של SpeculationRules: ילד יחיד ב-head נצמד לצומת
            הראשון שם, ו-Cypress מוסיף שם רווח וסקריפט. הסקריפט יושב ראשון בגוף,
            לפני כל תוכן, ולכן מחלקות ה-a11y-* על <html> קיימות לפני הציור.
            מקור והסבר ב-lib/a11y-prefs-boot.ts. */}
        <script dangerouslySetInnerHTML={{ __html: A11Y_PREFS_BOOT_SCRIPT }} />
        <SpeculationRules />
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
        <UtmSessionPersist />
        <OutboundLeadTracker />
        <SiteSchema />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-red focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
        >
          דלג לתוכן הראשי
        </a>
        <ScrollProgressBar />
        <Header />
        <Breadcrumbs />
        <GlossaryTooltipProvider>
          {/* F-69: tabIndex=-1 כדי שה-skip link ו"חזרה למעלה" יעבירו לכאן גם את
              המיקוד ולא רק את הגלילה (ב-Chromium המיקוד נשאר על ה-body). בלי
              focus:outline-none הטבעת הגלובלית הייתה מקיפה את כל התוכן.
              F-28: scroll-mt-[4.25rem] נמחק. scroll-padding-top שעל html ב-globals.css
              הוא שמחזיק את כל הפער, ושניהם יחד היו מצטברים. */}
          <main
            id="main-content"
            tabIndex={-1}
            className="min-w-0 flex-1 overflow-x-clip focus:outline-none max-md:pb-[calc(6.25rem+env(safe-area-inset-bottom,0px))]"
          >
            {children}
          </main>
        </GlossaryTooltipProvider>
        <Footer />
        <DeferredFloatingFabs />
        <SessionRescuerBarLazy />
        <PwaInstallPromptLazy />
        <GiftFinderPopupLazy />
      </body>
    </html>
  );
}
