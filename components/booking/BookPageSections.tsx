"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import BookCategoryAccordion from "@/components/booking/BookCategoryAccordion";
import DjEventsCalculator from "@/components/calculators/DjEventsCalculator";
import PhotographyCalculator from "@/components/calculators/PhotographyCalculator";
import LegalRelatedLinks from "@/components/legal/LegalRelatedLinks";
import BookingCalculator from "@/components/marketing/BookingCalculator";
import EventsBookingWizard from "@/components/marketing/EventsBookingWizard";
import FilterGate from "@/components/marketing/FilterGate";
import PodcastBookingWizard from "@/components/marketing/PodcastBookingWizard";
import SingerAmplificationBookingWizard from "@/components/marketing/SingerAmplificationBookingWizard";
import {
  type BookCategoryId,
  parseBookCategoryFromHash,
  parseBookPackageFromSearch,
} from "@/lib/book-url";
import { cn } from "@/lib/utils";

type BookCategoryConfig = {
  id: BookCategoryId;
  label: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  icon: string;
};

const BOOK_CATEGORY_META: readonly BookCategoryConfig[] = [
  {
    id: "studio",
    label: "הקלטות באולפן",
    shortLabel: "אולפן",
    title: "הקלטות באולפן",
    subtitle: "שירים, ברכות וקריינות - בחירת מסלול מלאה",
    icon: "🎤",
  },
  {
    id: "podcast",
    label: "פודקאסט",
    shortLabel: "פודקאסט",
    title: "פודקאסט",
    subtitle: "בחירת חבילה, תאריך ושליחה בוואטסאפ",
    icon: "🎙️",
  },
  {
    id: "singer",
    label: "הגברה לזמרים",
    shortLabel: "זמרים",
    title: "הגברה לזמרים",
    subtitle: "חבילות 2,800-7,800 ₪ · צ'ק סאונד וטכנאי בשטח",
    icon: "🎤",
  },
  {
    id: "events",
    label: "אטרקציות",
    shortLabel: "אטרקציות",
    title: "אטרקציות לאירועים",
    subtitle: "חבילות משולבות וחיסכון אוטומטי",
    icon: "🎉",
  },
  {
    id: "dj",
    label: "DJ",
    shortLabel: "DJ",
    title: "DJ לאירועים",
    subtitle: "חבילת פסטיבל, DJ, רגע של כוכב ואפקטים",
    icon: "🎧",
  },
  {
    id: "photography",
    label: "צילום",
    shortLabel: "צילום",
    title: "צילום אירועים",
    subtitle: "שעות, תוספות ושירותי AI - מחיר שקוף",
    icon: "📷",
  },
  {
    id: "clips",
    label: "קליפים ודיגיטל",
    shortLabel: "קליפים",
    title: "קליפים ושירותים דיגיטליים",
    subtitle: "עריכה, AI ושירותים נוספים",
    icon: "🎬",
  },
];

function renderCategoryContent(
  id: BookCategoryId,
  initialSingerPackageId: ReturnType<typeof parseBookPackageFromSearch>,
): ReactNode {
  switch (id) {
    case "studio":
      return <FilterGate />;
    case "podcast":
      return <PodcastBookingWizard />;
    case "singer":
      return (
        <SingerAmplificationBookingWizard
          initialPackageId={initialSingerPackageId}
        />
      );
    case "events":
      return <EventsBookingWizard />;
    case "dj":
      return <DjEventsCalculator />;
    case "photography":
      return <PhotographyCalculator />;
    case "clips":
      return (
        <BookingCalculator
          excludeCategories={["recordings", "podcasts", "events"]}
        />
      );
    default:
      return null;
  }
}

export default function BookPageSections() {
  const searchParams = useSearchParams();
  const pkgParam = searchParams.get("pkg");
  const initialSingerPackageId = parseBookPackageFromSearch(pkgParam);

  const [openId, setOpenId] = useState<BookCategoryId | null>(null);

  useEffect(() => {
    const fromHash = parseBookCategoryFromHash(
      typeof window !== "undefined" ? window.location.hash : "",
    );
    if (fromHash) setOpenId(fromHash);
  }, []);

  const openCategory = useCallback((id: BookCategoryId) => {
    setOpenId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (typeof window !== "undefined") {
      const qs = window.location.search;
      window.history.replaceState(null, "", `${window.location.pathname}${qs}#${id}`);
    }
  }, []);

  const toggleCategory = useCallback((id: BookCategoryId) => {
    setOpenId((prev) => {
      const next = prev === id ? null : id;
      if (typeof window !== "undefined") {
        const qs = window.location.search;
        window.history.replaceState(
          null,
          "",
          next
            ? `${window.location.pathname}${qs}#${next}`
            : `${window.location.pathname}${qs}`,
        );
      }
      return next;
    });
  }, []);

  return (
    <>
      <section
        className="border-b border-border bg-background py-6"
        aria-label="בחירת קטגוריית שירות"
      >
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-center text-sm text-muted-foreground">
            בחרו קטגוריה לפתיחת טופס ההזמנה
          </p>
          <nav
            className="flex flex-wrap justify-center gap-2"
            aria-label="קטגוריות הזמנה"
          >
            {BOOK_CATEGORY_META.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => openCategory(cat.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-fast ease-luxury",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  openId === cat.id
                    ? "bg-brand-red text-white"
                    : "bg-surface text-muted-foreground hover:bg-brand-red/10 hover:text-brand-red",
                )}
                aria-current={openId === cat.id ? "true" : undefined}
              >
                <span className="me-1.5" aria-hidden="true">
                  {cat.icon}
                </span>
                {cat.shortLabel}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-[72rem] space-y-4 px-4 py-10 sm:space-y-5 sm:px-6 sm:py-14 lg:px-8">
        {BOOK_CATEGORY_META.map((cat) => (
          <BookCategoryAccordion
            key={cat.id}
            id={cat.id}
            title={cat.title}
            subtitle={cat.subtitle}
            icon={cat.icon}
            isOpen={openId === cat.id}
            onToggle={() => toggleCategory(cat.id)}
          >
            {renderCategoryContent(
              cat.id,
              cat.id === "singer" ? initialSingerPackageId : null,
            )}
          </BookCategoryAccordion>
        ))}
      </div>

      <section className="border-t border-border bg-surface py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <LegalRelatedLinks />
        </div>
      </section>
    </>
  );
}
