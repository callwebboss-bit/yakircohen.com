"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import BookCategoryAccordion from "@/components/booking/BookCategoryAccordion";
import DjEventsCalculator from "@/components/calculators/DjEventsCalculator";
import PhotographyCalculator from "@/components/calculators/PhotographyCalculator";
import LegalRelatedLinks from "@/components/legal/LegalRelatedLinks";
import BookingCalculator from "@/components/marketing/BookingCalculator";
import BookingDiagnosisQuiz from "@/components/booking/BookingDiagnosisQuiz";
import ClipsBookingForm from "@/components/marketing/ClipsBookingForm";
import EventsBookingWizard from "@/components/marketing/EventsBookingWizard";
import FilterGate from "@/components/marketing/FilterGate";
import PodcastBookingWizard from "@/components/marketing/PodcastBookingWizard";
import SingerAmplificationBookingWizard from "@/components/marketing/SingerAmplificationBookingWizard";
import {
  type BookCategoryId,
  parseBookCategoryFromHash,
  parseBookPackageFromSearch,
} from "@/lib/book-url";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const SOCIAL_MGMT_HREF = buildWhatsAppHref({
  text: "שלום, אשמח לשמוע על שירות ניהול סושיאל לזמרים",
  utm_source: "website",
  utm_campaign: "social_management_inquiry",
});

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
    subtitle: "בחירת חבילה, פרטים ותיאום בוואטסאפ",
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
      return <ClipsBookingForm />;
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
    queueMicrotask(() => {
      const fromHash = parseBookCategoryFromHash(
        typeof window !== "undefined" ? window.location.hash : "",
      );
      if (fromHash) setOpenId(fromHash);
    });
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
          {openId === null && (
            <div className="mb-4">
              <BookingDiagnosisQuiz onNavigate={openCategory} />
            </div>
          )}
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

      {/* Soldiers discount banner */}
      <div className="border-b border-border bg-brand-red/5 px-4 py-3">
        <div className="mx-auto flex max-w-[72rem] min-w-0 flex-wrap items-center justify-between gap-2 sm:px-6 lg:px-8">
          <p className="min-w-0 flex-1 text-sm font-medium leading-relaxed text-brand-red break-words">
            <span aria-hidden="true">🎖 </span>
            מבצע לחיילים ולחיילות — 10% הנחה על כל שירותי האולפן, הפודקאסט ואטרקציות לאירועים
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

      <div className="mx-auto min-w-0 max-w-[72rem] space-y-4 px-4 py-10 sm:space-y-5 sm:px-6 sm:py-14 lg:px-8">
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

      {/* Social management and additional services */}
      <section className="border-t border-border bg-surface py-8">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-base font-semibold text-foreground">שירותים נוספים</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-lg" aria-hidden="true">📱</p>
              <h3 className="mt-2 text-sm font-semibold text-foreground">ניהול סושיאל לזמרים</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                ניהול ואסטרטגיה לרשתות החברתיות — אינסטגרם, טיקטוק, יוטיוב. מתאים לזמרים שמחפשים נוכחות דיגיטלית מקצועית.
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
              <h3 className="mt-2 text-sm font-semibold text-foreground">וולוג יום בחיי — צלם צמוד</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                תיעוד מהכניסה לאולפן ועד שעתיים עם צלם צמוד. כולל עריכה מלאה של פרק (עד 4 גרסאות עריכה).
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
    </>
  );
}
