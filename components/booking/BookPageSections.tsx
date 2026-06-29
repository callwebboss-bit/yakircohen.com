"use client";

import { type ReactNode } from "react";
import BookAudienceRouter from "@/components/booking/BookAudienceRouter";
import BookStudioInfoSection from "@/components/booking/BookStudioInfoSection";
import WizardErrorBoundary from "@/components/booking/WizardErrorBoundary";
import { useBookFlow } from "@/hooks/useBookFlow";
import {
  DjEventsCalculatorLazy,
  PhotographyCalculatorLazy,
} from "@/components/calculators/lazy";
import BookStickyMobileBar from "@/components/booking/BookStickyMobileBar";
import { BookWizardLivePriceProvider } from "@/components/booking/BookWizardLivePrice";
import LegalRelatedLinks from "@/components/legal/LegalRelatedLinks";
import ProBookingPanel from "@/components/booking/ProBookingPanel";
import PricingCatalogBanner from "@/components/pricing/PricingCatalogBanner";
import {
  AcademyBookingWizardLazy,
  ClipsBookingFormLazy,
  EventsBookingWizardLazy,
  FilterGateLazy,
  OnlineRestoreBookingPanelLazy,
  PodcastBookingWizardLazy,
  SingerAmplificationBookingWizardLazy,
} from "@/components/booking/lazy";
import { type BookCategoryId, parseBookEventItemFromSearch, parseBookPackageFromSearch } from "@/lib/book-url";
import type { PricingBookTarget } from "@/lib/book-url";
import type { BookUtmBoostOptions } from "@/hooks/useBookUtmBoost";
import type { FilterAnswers } from "@/lib/data/filter-questions";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const SOCIAL_MGMT_HREF = buildWhatsAppHref({
  text: "שלום, אשמח לשמוע על שירות ניהול סושיאל לזמרים",
  utm_source: "website",
  utm_campaign: "social_management_inquiry",
});

type CategoryMeta = {
  id: BookCategoryId;
  title: string;
  subtitle: string;
  icon: string;
};

const CATEGORY_META: Record<BookCategoryId, CategoryMeta> = {
  studio: {
    id: "studio",
    title: "הקלטות באולפן",
    subtitle: "שירים, ברכות וקריינות",
    icon: "🎤",
  },
  podcast: {
    id: "podcast",
    title: "פודקאסט",
    subtitle: "חבילה, פרטים ותיאום",
    icon: "🎙️",
  },
  singer: {
    id: "singer",
    title: "הגברה לזמרים",
    subtitle: "חבילות עם טכנאי בשטח",
    icon: "🎤",
  },
  events: {
    id: "events",
    title: "אטרקציות לאירועים",
    subtitle: "חבילות משולבות",
    icon: "🎉",
  },
  dj: {
    id: "dj",
    title: "DJ לאירועים",
    subtitle: "פסטיבל, אפקטים ועוד",
    icon: "🎧",
  },
  photography: {
    id: "photography",
    title: "צילום אירועים",
    subtitle: "שעות, תוספות ו-AI",
    icon: "📷",
  },
  clips: {
    id: "clips",
    title: "קליפים ודיגיטל",
    subtitle: "עריכה ושירותי AI",
    icon: "🎬",
  },
  academy: {
    id: "academy",
    title: "שיעורים פרטיים",
    subtitle: "פיתוח קול, DJ, הפקה",
    icon: "🎓",
  },
  online: {
    id: "online",
    title: "שחזור סאונד / AI",
    subtitle: "הצלת הקלטות פגומות",
    icon: "🔧",
  },
  pro: {
    id: "pro",
    title: "שירותים מקצועיים לעסקים",
    subtitle: "דיג'ייז, פודקאסט והגברה",
    icon: "💼",
  },
};

function renderCategoryContent(
  id: BookCategoryId,
  options: {
    initialSingerPackageId: ReturnType<typeof parseBookPackageFromSearch>;
    initialEventItemId: ReturnType<typeof parseBookEventItemFromSearch>;
    initialCatalogTarget: PricingBookTarget | null;
    filterPreset?: Partial<FilterAnswers>;
    emotionalLabel: string | null;
    routeId: string | null;
    skipStudioGate: boolean;
  },
): ReactNode {
  const catalog = options.initialCatalogTarget;
  const studioFilterPreset =
    options.filterPreset ?? catalog?.filterPreset;

  switch (id) {
    case "studio":
      return (
        <FilterGateLazy
          initialFilterPreset={studioFilterPreset}
          skipGate={options.skipStudioGate}
          initialEmotionalLabel={options.emotionalLabel}
          routeId={options.routeId}
          initialStudioPackageId={catalog?.studioPackageId ?? null}
          initialRecordingTypeId={catalog?.recordingTypeId ?? null}
          pricingCatalogId={catalog?.catalogId ?? null}
        />
      );
    case "podcast":
      return (
        <PodcastBookingWizardLazy
          routeId={options.routeId}
          emotionalLabel={options.emotionalLabel}
          initialPackageId={catalog?.podcastPackageId ?? null}
          initialParticipantCount={catalog?.participantCount}
          initialLocation={catalog?.podcastLocation}
          pricingCatalogId={catalog?.catalogId ?? null}
        />
      );
    case "singer":
      return (
        <SingerAmplificationBookingWizardLazy
          initialPackageId={options.initialSingerPackageId}
          routeId={options.routeId}
        />
      );
    case "events":
      return (
        <EventsBookingWizardLazy
          routeId={options.routeId}
          initialEventItemId={options.initialEventItemId}
        />
      );
    case "dj":
      return <DjEventsCalculatorLazy routeId={options.routeId} />;
    case "photography":
      return <PhotographyCalculatorLazy routeId={options.routeId} />;
    case "clips":
      return <ClipsBookingFormLazy routeId={options.routeId} />;
    case "academy":
      return (
        <AcademyBookingWizardLazy
          initialEmotionalLabel={options.emotionalLabel}
          routeId={options.routeId}
        />
      );
    case "online":
      return (
        <>
          {catalog?.catalogId ? (
            <PricingCatalogBanner catalogId={catalog.catalogId} />
          ) : null}
          <OnlineRestoreBookingPanelLazy
            initialEmotionalLabel={options.emotionalLabel}
            routeId={options.routeId}
          />
        </>
      );
    case "pro":
      return (
        <>
          {catalog?.catalogId ? (
            <PricingCatalogBanner catalogId={catalog.catalogId} />
          ) : null}
          <ProBookingPanel />
        </>
      );
    default:
      return null;
  }
}

export default function BookPageSections({
  pkgParam = null,
  itemParam = null,
  catalogParam = null,
  utmCampaign = null,
  utmContent = null,
}: {
  pkgParam?: string | null;
  itemParam?: string | null;
  catalogParam?: string | null;
} & BookUtmBoostOptions) {
  const initialSingerPackageId = parseBookPackageFromSearch(pkgParam);
  const initialEventItemId = parseBookEventItemFromSearch(itemParam);

  const {
    activeCategory,
    activeRouteId,
    filterPreset,
    emotionalLabel,
    skipStudioGate,
    initialCatalogTarget,
    openFullPath,
    backToRouter,
  } = useBookFlow({ itemParam, pkgParam, catalogParam });

  const meta = activeCategory ? CATEGORY_META[activeCategory] : null;

  return (
    <BookWizardLivePriceProvider>
    <>
      <BookAudienceRouter
        onFullPath={openFullPath}
        activeRouteId={activeRouteId}
        activeCategoryId={activeCategory}
        utmCampaign={utmCampaign}
        utmContent={utmContent}
      />

      {activeCategory && meta ? (
        <section
          id="book-wizard-panel"
          className="scroll-mt-24 min-w-0 overflow-x-clip border-b border-border bg-surface/50 py-10"
          aria-labelledby="book-wizard-heading"
        >
          <div className="mx-auto min-w-0 max-w-[72rem] px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={backToRouter}
              className="mb-6 inline-flex min-h-9 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-brand-red"
            >
              חזרה לבחירת שירות
            </button>

            <header className="mb-8 flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                {meta.icon}
              </span>
              <div>
                <h2
                  id="book-wizard-heading"
                  className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
                >
                  {meta.title}
                </h2>
                <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
              </div>
            </header>

            <WizardErrorBoundary onReset={backToRouter}>
              {renderCategoryContent(activeCategory, {
                initialSingerPackageId,
                initialEventItemId,
                initialCatalogTarget,
                filterPreset,
                emotionalLabel,
                routeId: activeRouteId,
                skipStudioGate,
              })}
            </WizardErrorBoundary>
          </div>
        </section>
      ) : null}

      <div className="border-b border-border bg-brand-red/5 px-4 py-3">
        <div className="mx-auto flex max-w-[72rem] min-w-0 flex-wrap items-center justify-between gap-2 sm:px-6 lg:px-8">
          <p className="min-w-0 flex-1 text-sm font-medium leading-relaxed text-brand-red break-words">
            <span aria-hidden="true">🎖 </span>
            מבצע לחיילים ולחיילות - 10% הנחה על כל שירותי האולפן, הפודקאסט ואטרקציות לאירועים
          </p>
          <a
            href={buildWhatsAppHref({
              text: "שלום, אני חייל/ת ואשמח לשמוע על ההנחה לחיילים",
              utm_source: "website",
              utm_campaign: "soldiers_discount",
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 shrink-0 items-center text-xs font-semibold text-brand-red underline underline-offset-2 hover:text-brand-red-dark"
          >
            לפרטים בוואטסאפ
          </a>
        </div>
      </div>

      <section className="border-t border-border bg-surface py-8">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-base font-semibold text-foreground">שירותים נוספים</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-lg" aria-hidden="true">📱</p>
              <h3 className="mt-2 text-sm font-semibold text-foreground">ניהול סושיאל לזמרים</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                ניהול ואסטרטגיה לרשתות החברתיות - אינסטגרם, טיקטוק, יוטיוב.
              </p>
              <a
                href={SOCIAL_MGMT_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-9 items-center text-xs font-semibold text-brand-red hover:underline"
              >
                לפרטים בוואטסאפ </a>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-lg" aria-hidden="true">🎥</p>
              <h3 className="mt-2 text-sm font-semibold text-foreground">וולוג יום בחיי - צלם צמוד</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                תיעוד מהכניסה לאולפן ועד שעתיים עם צלם צמוד, כולל עריכה מלאה.
              </p>
              <p className="mt-2 text-xs font-semibold text-brand-red">2,200 ₪</p>
            </div>
          </div>
        </div>
      </section>

      {activeCategory === "studio" ? <BookStudioInfoSection /> : null}

      <section className="border-t border-border bg-surface py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <LegalRelatedLinks />
        </div>
      </section>

      <BookStickyMobileBar
        activeCategory={activeCategory}
        activeRouteId={activeRouteId}
      />

      <p className="mx-auto max-w-[72rem] px-4 pb-20 text-center sm:px-6 sm:pb-8 lg:px-8">
        <a
          id="wa-fallback-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-sm font-semibold text-brand-red underline underline-offset-2 hover:text-brand-red-dark"
        >
          הדפדפן חסם את וואטסאפ - לחצו כאן לפתיחה ידנית
        </a>
      </p>
    </>
    </BookWizardLivePriceProvider>
  );
}
