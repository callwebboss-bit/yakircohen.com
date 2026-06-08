"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import BookAudienceRouter, {
  type BookFullPathSelection,
} from "@/components/booking/BookAudienceRouter";
import DjEventsCalculator from "@/components/calculators/DjEventsCalculator";
import PhotographyCalculator from "@/components/calculators/PhotographyCalculator";
import BookStickyMobileBar from "@/components/booking/BookStickyMobileBar";
import LegalRelatedLinks from "@/components/legal/LegalRelatedLinks";
import AcademyBookingWizard from "@/components/marketing/AcademyBookingWizard";
import ClipsBookingForm from "@/components/marketing/ClipsBookingForm";
import EventsBookingWizard from "@/components/marketing/EventsBookingWizard";
import { FilterGateLazy } from "@/components/booking/lazy";
import OnlineRestoreBookingPanel from "@/components/marketing/OnlineRestoreBookingPanel";
import PodcastBookingWizard from "@/components/marketing/PodcastBookingWizard";
import SingerAmplificationBookingWizard from "@/components/marketing/SingerAmplificationBookingWizard";
import {
  type BookCategoryId,
  parseBookCategoryFromHash,
  parseBookPackageFromSearch,
} from "@/lib/book-url";
import {
  FILTER_STORAGE_KEY,
  type FilterAnswers,
} from "@/lib/data/filter-questions";
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
};

function saveFilterPreset(preset?: Partial<FilterAnswers>) {
  if (!preset?.timeline || !preset?.purpose) return;
  try {
    const answers: FilterAnswers = {
      timeline: preset.timeline,
      purpose: preset.purpose,
    };
    sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // ignore
  }
}

function renderCategoryContent(
  id: BookCategoryId,
  options: {
    initialSingerPackageId: ReturnType<typeof parseBookPackageFromSearch>;
    filterPreset?: Partial<FilterAnswers>;
    emotionalLabel: string | null;
    skipStudioGate: boolean;
  },
): ReactNode {
  switch (id) {
    case "studio":
      return (
        <FilterGateLazy
          initialFilterPreset={options.filterPreset}
          skipGate={options.skipStudioGate}
          initialEmotionalLabel={options.emotionalLabel}
        />
      );
    case "podcast":
      return <PodcastBookingWizard />;
    case "singer":
      return (
        <SingerAmplificationBookingWizard
          initialPackageId={options.initialSingerPackageId}
        />
      );
    case "events":
      return <EventsBookingWizard />;
    case "dj":
      return <DjEventsCalculator />;
    case "photography":
      return <PhotographyCalculator />;
    case "clips":
      return <ClipsBookingForm />;
    case "academy":
      return <AcademyBookingWizard initialEmotionalLabel={options.emotionalLabel} />;
    case "online":
      return <OnlineRestoreBookingPanel initialEmotionalLabel={options.emotionalLabel} />;
    default:
      return null;
  }
}

export default function BookPageSections() {
  const searchParams = useSearchParams();
  const pkgParam = searchParams.get("pkg");
  const initialSingerPackageId = parseBookPackageFromSearch(pkgParam);

  const [activeCategory, setActiveCategory] = useState<BookCategoryId | null>(null);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [filterPreset, setFilterPreset] = useState<Partial<FilterAnswers> | undefined>();
  const [emotionalLabel, setEmotionalLabel] = useState<string | null>(null);
  const [skipStudioGate, setSkipStudioGate] = useState(false);

  useEffect(() => {
    function syncFromHash() {
      const fromHash = parseBookCategoryFromHash(window.location.hash);
      if (fromHash) {
        setActiveCategory(fromHash);
        setActiveRouteId(null);
        requestAnimationFrame(() => {
          document.getElementById("book-wizard-panel")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    }

    queueMicrotask(syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const openFullPath = useCallback((selection: BookFullPathSelection) => {
    if (selection.filterPreset) {
      saveFilterPreset(selection.filterPreset);
      setFilterPreset(selection.filterPreset);
    }
    setEmotionalLabel(selection.emotionalLabel);
    setSkipStudioGate(selection.categoryId === "studio" && !!selection.filterPreset);
    setActiveCategory(selection.categoryId);
    setActiveRouteId(selection.routeId);

    if (typeof window !== "undefined") {
      const qs = window.location.search;
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs}#${selection.categoryId}`,
      );
      requestAnimationFrame(() => {
        document.getElementById("book-wizard-panel")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, []);

  const backToRouter = useCallback(() => {
    setActiveCategory(null);
    setActiveRouteId(null);
    setFilterPreset(undefined);
    setEmotionalLabel(null);
    setSkipStudioGate(false);
    if (typeof window !== "undefined") {
      const qs = window.location.search;
      window.history.replaceState(null, "", `${window.location.pathname}${qs}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const meta = activeCategory ? CATEGORY_META[activeCategory] : null;

  return (
    <>
      <BookAudienceRouter
        onFullPath={openFullPath}
        activeRouteId={activeRouteId}
        activeCategoryId={activeCategory}
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
              className="mb-6 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-red"
            >
              ← חזרה לבחירת שירות
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

            {renderCategoryContent(activeCategory, {
              initialSingerPackageId,
              filterPreset,
              emotionalLabel,
              skipStudioGate,
            })}
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
            className="shrink-0 text-xs font-semibold text-brand-red underline underline-offset-2 hover:text-brand-red-dark"
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
                className="mt-3 inline-block text-xs font-semibold text-brand-red hover:underline"
              >
                לפרטים בוואטסאפ ←
              </a>
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
  );
}
