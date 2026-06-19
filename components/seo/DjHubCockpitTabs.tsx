"use client";

import { useEffect, useState } from "react";
import ProServiceWizard from "@/components/marketing/ProServiceWizard";
import DjFreeToolsSection from "@/components/seo/DjFreeToolsSection";
import DjMashupBundlePicker from "@/components/seo/DjMashupBundlePicker";
import DjMashupIdeasSection from "@/components/seo/DjMashupIdeasSection";
import MashupMusicOffersSection from "@/components/seo/MashupMusicOffersSection";
import ReadyMashupsCatalogSection from "@/components/seo/ReadyMashupsCatalogSection";
import type { ProService } from "@/lib/data/pro-services";
import { cn } from "@/lib/utils";

type HubTabId = "ideas" | "ready" | "tools" | "order";

type HubTab = {
  id: HubTabId;
  label: string;
  shortLabel: string;
  panelHeading: string;
  panelDescription: string;
};

const HUB_TABS: readonly HubTab[] = [
  {
    id: "ideas",
    label: "שילובים",
    shortLabel: "שילובים",
    panelHeading: "שילובים עם BPM, סולם והרמוניה",
    panelDescription:
      "לכל שילוב יש קצב, סולם Camelot והסבר למה זה מחזיק מוזיקלית. אפשר לקחת ולערוך לבד, או לבקש גרסה מהאולפן.",
  },
  {
    id: "ready",
    label: "מוכן לקנייה",
    shortLabel: "מוכן",
    panelHeading: "מאגר מוכן וחבילות",
    panelDescription:
      "גרסאות שכבר ערוכו, או חבילה של כמה שילובים במחיר נמוך. בוחרים, שולחים רשימה, מקבלים קבצים לנגן.",
  },
  {
    id: "tools",
    label: "כלים חינמיים",
    shortLabel: "כלים",
    panelHeading: "כלים לפני ערב עמוס",
    panelDescription:
      "מה שדיג'ייז באמת פותחים כשצריך לפרק שיר, לבדוק BPM או לנסות רעיון לפני האירוע.",
  },
  {
    id: "order",
    label: "הזמנה וייצור",
    shortLabel: "הזמנה",
    panelHeading: "אין זמן? נבנה ביחד",
    panelDescription:
      "בוחרים מסלול, ממלאים פרטים ושולחים. יקיר מאשר לפני ביצוע. מסירה עד 3 ימי עסקים.",
  },
] as const;

const HASH_TO_TAB: Record<string, HubTabId> = {
  "mashup-ideas": "ideas",
  "ready-mashups": "ready",
  "mashup-bundles": "ready",
  "dj-free-tools": "tools",
  "pro-offers": "order",
  "wizard-mashup-fixer": "order",
};

function tabIndexForId(id: HubTabId): number {
  return HUB_TABS.findIndex((t) => t.id === id);
}

function resolveTabFromHash(): HubTabId {
  if (typeof window === "undefined") return "ideas";
  const raw = window.location.hash.replace(/^#/, "");
  const anchor = raw.split("?")[0];
  return HASH_TO_TAB[anchor] ?? "ideas";
}

type DjHubCockpitTabsProps = {
  service: ProService;
};

export default function DjHubCockpitTabs({ service }: DjHubCockpitTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const syncFromHash = () => {
      const tabId = resolveTabFromHash();
      const idx = tabIndexForId(tabId);
      if (idx >= 0) {
        setActiveIndex(idx);
        setIsVisible(true);
      }
    };
    queueMicrotask(syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;
    setIsVisible(false);
    setTimeout(() => {
      setActiveIndex(index);
      setIsVisible(true);
    }, 120);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const total = HUB_TABS.length;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSelect((index + 1) % total);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSelect((index - 1 + total) % total);
    }
  };

  const activeTab = HUB_TABS[activeIndex]!;

  return (
    <section
      id="dj-hub-cockpit"
      className="scroll-mt-24 rounded-2xl border border-border bg-surface p-3 sm:p-6"
      aria-labelledby="dj-cockpit-heading"
    >
      <h2 id="dj-cockpit-heading" className="sr-only">
        לוח בקרה למרכז הדיג&apos;יי
      </h2>

      <div
        role="tablist"
        aria-label="אזורי מרכז הדיג'יי"
        className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-background p-1 sm:grid-cols-4"
      >
        {HUB_TABS.map((tab, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`dj-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`dj-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={cn(
                "min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold select-none",
                "transition-[background-color,color,box-shadow] duration-normal ease-luxury",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`dj-panel-${activeTab.id}`}
        role="tabpanel"
        aria-labelledby={`dj-tab-${activeTab.id}`}
        className={cn(
          "mt-4 min-h-0 transition-opacity duration-fast ease-luxury motion-reduce:transition-none sm:mt-6",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-brand-red">
            {activeTab.label}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
            {activeTab.panelHeading}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {activeTab.panelDescription}
          </p>
        </div>

        <div className="mt-6 space-y-8 sm:space-y-10">
          {activeTab.id === "ideas" ? <DjMashupIdeasSection embedded /> : null}
          {activeTab.id === "ready" ? (
            <>
              <ReadyMashupsCatalogSection embedded />
              <DjMashupBundlePicker embedded />
            </>
          ) : null}
          {activeTab.id === "tools" ? <DjFreeToolsSection embedded /> : null}
          {activeTab.id === "order" ? (
            <>
              <MashupMusicOffersSection embedded />
              <ProServiceWizard service={service} />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
