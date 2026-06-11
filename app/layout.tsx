import type { Metadata, Viewport } from "next";
import { Heebo, Noto_Serif_Hebrew } from "next/font/google";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SiteSchema from "@/components/seo/SiteSchema";
import DeferredFloatingFabs from "@/components/layout/DeferredFloatingFabs";
import { SITE_URL } from "@/lib/site-url";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_ROBOTS,
} from "@/lib/seo-config";
import "./globals.css";
import { cn } from "@/lib/utils";

// OPTIMIZED: fewer font weights — saves 2–3 network requests on first paint
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heebo",
  weight: ["400", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

const notoSerifHebrew = Noto_Serif_Hebrew({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-noto-serif-hebrew",
  weight: ["400", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

const DEFAULT_TITLE =
  "יקיר כהן הפקות | אולפן, פודקאסט ואירועים במודיעין";
const DEFAULT_DESCRIPTION =
  "אולפן הקלטות, הפקת פודקאסט, קריינות, DJ ואטרקציות לאירועים - ממודיעין לירושלים והמרכז.";

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
      <body className="flex min-h-dvh min-w-0 flex-col overflow-x-clip bg-background font-sans text-foreground antialiased">
        <GoogleAnalytics />
        <SiteSchema />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-red focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
        >
          דלג לתוכן הראשי
        </a>
        <Header />
        <Breadcrumbs />
        <main
          id="main-content"
          data-pagefind-body
          className="min-w-0 flex-1 overflow-x-clip scroll-mt-[4.25rem] max-md:pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]"
        >
          {children}
        </main>
        <Footer />
        <DeferredFloatingFabs />
      </body>
    </html>
  );
}
