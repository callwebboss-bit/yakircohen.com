import { metadataFromService } from "@/lib/data/service-metadata";
import type { ReactNode } from "react";
import Link from "next/link";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import ProductionCalculator from "@/components/marketing/ProductionCalculator";
import StudioClientsStrip from "@/components/marketing/StudioClientsStrip";
import StudioGearRoom from "@/components/marketing/StudioGearRoom";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import HubPageSchema from "@/components/seo/HubPageSchema";
import HubServiceIndexStatic from "@/components/seo/HubServiceIndexStatic";
import StudioHubValueSection from "@/components/seo/StudioHubValueSection";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import ShareButton from "@/components/ui/ShareButton";
import SmartMap from "@/components/ui/SmartMap";
import { hubSchemaPropsFromService } from "@/lib/seo/hub-pages";
import {
  getStudioHubLinks,
  getStudioService,
} from "@/lib/data/services";
import { PORTFOLIO_CATALOG_COUNT } from "@/lib/data/video-catalog.generated";

const service = getStudioService("studio-hub");

export const metadata = metadataFromService(service);

const STUDIO_PRICING_LINK = {
  href: "/studio/pricing",
  title: "מחירון חבילות",
  description: "שקיפות מלאה - שעת אולפן, חבילת שיר והפקת סינגל.",
} as const;

const ICON_CLASS =
  "h-6 w-6";

/** אייקון ייעודי לכל מסלול לפי ה-href, עם נפילה לאייקון ברירת מחדל. */
const STUDIO_HUB_ICONS: Record<string, ReactNode> = {
  "/studio/pricing": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden="true">
      <path d="M20.59 13.41 11 23l-8-8 9.59-9.59A2 2 0 0 1 14 4h6a1 1 0 0 1 1 1v6a2 2 0 0 1-.41 2.41z" />
      <circle cx="16.5" cy="7.5" r="1.5" />
    </svg>
  ),
  "/studio/recording-studio": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden="true">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  "/studio/recording-song-modiin": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden="true">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  "/studio/studio-jerusalem": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  "/studio/mobile-studio": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden="true">
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  "/studio/blessings": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

const DEFAULT_HUB_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden="true">
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

const ArrowIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 transition-transform duration-fast ease-luxury group-hover:-translate-x-0.5" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function StudioHubPage() {
  const hubLinks = getStudioHubLinks();
  const tracks = [STUDIO_PRICING_LINK, ...hubLinks];

  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromService(service, "studio")} />
      <HubServiceIndexStatic
        heading="מסלולי האולפן"
        links={tracks.map((track) => ({
          href: track.href,
          title: track.title,
          description: track.description,
        }))}
      />
      <ServicePageFromRegistry
      service={service}
      portfolioLabel="סביבת האולפן"
      showPortfolio={false}
      valueFrame="יוצאים עם קובץ מוכן - בלי ניחושים, בלי הפתעות"
    >
      <div className="space-y-16">
        <StudioHubValueSection />

        <ClientJourneySteps variant="studio" display="compact" />

        <p className="text-center">
          <Link
            href="/portfolio"
            className="text-sm font-semibold text-brand-red hover:underline"
          >
            לכל תיק הווידאו ({PORTFOLIO_CATALOG_COUNT} דוגמאות) </Link>
        </p>

        <TrustStatsBar className="rounded-2xl border" />

        <StudioClientsStrip className="rounded-2xl border-x" />

        <section aria-labelledby="studio-tracks-heading">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              מסלולי האולפן
            </p>
            <h2
              id="studio-tracks-heading"
              className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              שירותי האולפן
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              בחרו מסלול ממוקד או שלבו מספר שירותים לחבילה מותאמת אישית.
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track, index) => {
              const isFeatured = track.href === STUDIO_PRICING_LINK.href;
              const icon = STUDIO_HUB_ICONS[track.href] ?? DEFAULT_HUB_ICON;
              return (
                <li key={track.href}>
                  <Link
                    href={track.href}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red ${
                      isFeatured
                        ? "border-brand-red/40 ring-1 ring-brand-red/20 hover:border-brand-red/60"
                        : "border-border hover:border-brand-red/40"
                    }`}
                  >
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-right scale-x-0 bg-brand-red transition-transform duration-normal ease-luxury group-hover:scale-x-100"
                      aria-hidden
                    />
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red ring-1 ring-brand-red/20">
                        {icon}
                      </span>
                      {isFeatured ? (
                        <span className="rounded-full bg-brand-red px-2.5 py-0.5 text-[0.65rem] font-bold text-white">
                          שקיפות מחירים
                        </span>
                      ) : (
                        <span className="text-xs font-bold tracking-widest text-muted-foreground/50">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-foreground transition-colors group-hover:text-brand-red">
                      {track.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {track.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-red">
                      לפרטים {ArrowIcon}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <ProductionCalculator className="py-0" />

        <StudioGearRoom />

        <section
          className="overflow-hidden rounded-2xl border border-border bg-surface"
          aria-labelledby="studio-geo-note"
        >
          <div className="px-6 py-8 text-center sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              מיקום ונגישות
            </p>
            <h2
              id="studio-geo-note"
              className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl"
            >
              ממודיעין לירושלים והמרכז
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              האולפן ממוקם במודיעין עם נגישות מהירה מירושלים, השפלה והמרכז. חנייה
              נוחה, תיאום גמיש ושירות מקצועי לכל פרויקט.
            </p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              {[
                "חנייה חופשית בשפע",
                "15 דק׳ מירושלים",
                "נגישות מהשפלה והמרכז",
                "תיאום גמיש בערב",
              ].map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden />
                  {chip}
                </li>
              ))}
            </ul>
            <SmartMap
              address="עמק איילון 34, מודיעין-מכבים-רעות"
              googleMapsUrl="https://maps.google.com/maps?q=עמק+איילון+34+מודיעין&output=embed"
              className="mt-7 text-start"
            />
            <div className="mt-5 flex justify-center">
              <ShareButton title="אולפן הקלטות מקצועי | יקיר כהן הפקות" />
            </div>
          </div>
        </section>
      </div>
    </ServicePageFromRegistry>
    </>
  );
}
