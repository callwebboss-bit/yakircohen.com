import type { Metadata, Viewport } from "next";
import { Heebo, Noto_Serif_Hebrew } from "next/font/google";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SessionRescuerBar from "@/components/booking/SessionRescuerBar";
import TabRescueTitle from "@/components/marketing/TabRescueTitle";
import SiteSchema from "@/components/seo/SiteSchema";
import DeferredFloatingFabs from "@/components/layout/DeferredFloatingFabs";
import PwaInstallPrompt from "@/components/marketing/PwaInstallPrompt";
import CouponPopup from "@/components/marketing/CouponPopup";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { SITE_URL } from "@/lib/site-url";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_ROBOTS,
} from "@/lib/seo-config";
import "./globals.css";
import { cn } from "@/lib/utils";

// Variable font - single file covers all weights (100-900), one HTTP request
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heebo",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Arial Hebrew", "Arial", "Helvetica Neue", "sans-serif"],
});

const notoSerifHebrew = Noto_Serif_Hebrew({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-noto-serif-hebrew",
  preload: true,
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
    "geo.position": "31.9077;35.0068",
    ICBM: "31.9077, 35.0068",
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
    >
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://static.elfsight.com" />
      </head>
      <body className="flex min-h-dvh min-w-0 flex-col overflow-x-clip bg-background font-sans text-foreground antialiased">
        <GoogleAnalytics />
        <TabRescueTitle />
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
        <main
          id="main-content"
          className="min-w-0 flex-1 overflow-x-clip scroll-mt-[4.25rem] max-md:pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]"
        >
          {children}
        </main>
        <Footer />
        <DeferredFloatingFabs />
        <SessionRescuerBar />
        <PwaInstallPrompt />
        <CouponPopup />
      </body>
    </html>
  );
}
