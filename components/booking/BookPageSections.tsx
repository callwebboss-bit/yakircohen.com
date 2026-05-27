"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import BookCategoryAccordion from "@/components/booking/BookCategoryAccordion";
import DjEventsCalculator from "@/components/calculators/DjEventsCalculator";
import PhotographyCalculator from "@/components/calculators/PhotographyCalculator";
import LegalRelatedLinks from "@/components/legal/LegalRelatedLinks";
import BookingCalculator from "@/components/marketing/BookingCalculator";
import EventsBookingWizard from "@/components/marketing/EventsBookingWizard";
import FilterGate from "@/components/marketing/FilterGate";
import PodcastBookingWizard from "@/components/marketing/PodcastBookingWizard";
import { cn } from "@/lib/utils";

export type BookCategoryId =
  | "studio"
  | "podcast"
  | "events"
  | "dj"
  | "photography"
  | "clips";

type BookCategoryConfig = {
  id: BookCategoryId;
  label: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  icon: string;
  content: ReactNode;
};

const BOOK_CATEGORIES: BookCategoryConfig[] = [
  {
    id: "studio",
    label: "הקלטות באולפן",
    shortLabel: "אולפן",
    title: "הקלטות באולפן",
    subtitle: "שירים, ברכות וקריינות - בחירת מסלול מלאה",
    icon: "🎤",
    content: <FilterGate />,
  },
  {
    id: "podcast",
    label: "פודקאסט",
    shortLabel: "פודקאסט",
    title: "פודקאסט",
    subtitle: "בחירת חבילה, תאריך ושליחה בוואטסאפ",
    icon: "🎙️",
    content: <PodcastBookingWizard />,
  },
  {
    id: "events",
    label: "אטרקציות",
    shortLabel: "אטרקציות",
    title: "אטרקציות לאירועים",
    subtitle: "חבילות משולבות וחיסכון אוטומטי",
    icon: "🎉",
    content: <EventsBookingWizard />,
  },
  {
    id: "dj",
    label: "DJ",
    shortLabel: "DJ",
    title: "DJ לאירועים",
    subtitle: "חבילת פסטיבל, DJ, רגע של כוכב ואפקטים",
    icon: "🎧",
    content: <DjEventsCalculator />,
  },
  {
    id: "photography",
    label: "צילום",
    shortLabel: "צילום",
    title: "צילום אירועים",
    subtitle: "שעות, תוספות ושירותי AI - מחיר שקוף",
    icon: "📷",
    content: <PhotographyCalculator />,
  },
  {
    id: "clips",
    label: "קליפים ודיגיטל",
    shortLabel: "קליפים",
    title: "קליפים ושירותים דיגיטליים",
    subtitle: "עריכה, AI ושירותים נוספים",
    icon: "🎬",
    content: (
      <BookingCalculator excludeCategories={["recordings", "podcasts", "events"]} />
    ),
  },
];

const VALID_IDS = new Set(BOOK_CATEGORIES.map((c) => c.id));

function parseHashCategory(): BookCategoryId | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  return VALID_IDS.has(hash as BookCategoryId) ? (hash as BookCategoryId) : null;
}

export default function BookPageSections() {
  const [openId, setOpenId] = useState<BookCategoryId | null>(null);

  useEffect(() => {
    const fromHash = parseHashCategory();
    if (fromHash) setOpenId(fromHash);
  }, []);

  const openCategory = useCallback((id: BookCategoryId) => {
    setOpenId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  }, []);

  const toggleCategory = useCallback((id: BookCategoryId) => {
    setOpenId((prev) => {
      const next = prev === id ? null : id;
      if (typeof window !== "undefined") {
        window.history.replaceState(
          null,
          "",
          next ? `#${next}` : window.location.pathname,
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
            {BOOK_CATEGORIES.map((cat) => (
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
        {BOOK_CATEGORIES.map((cat) => (
          <BookCategoryAccordion
            key={cat.id}
            id={cat.id}
            title={cat.title}
            subtitle={cat.subtitle}
            icon={cat.icon}
            isOpen={openId === cat.id}
            onToggle={() => toggleCategory(cat.id)}
          >
            {cat.content}
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
