"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BookAudienceCard from "@/components/booking/BookAudienceCard";
import BookIntakeCustomCard from "@/components/booking/BookIntakeCustomCard";
import BookSuperCategoryFilter, {
  type SuperCategoryFilter,
} from "@/components/booking/BookSuperCategoryFilter";
import {
  BOOK_ESCAPE_HATCH,
  BOOK_ROUTER_REASSURANCE,
  BOOK_SUPER_CATEGORIES,
  type BookAudienceRoute,
  type BookSuperCategory,
} from "@/lib/data/book-audience-routes";
import type { BookCategoryId } from "@/lib/book-url";
import type { FilterAnswers } from "@/lib/data/filter-questions";
import { persistUtmBoostFromUrl, useBookUtmBoost, type BookUtmBoostOptions } from "@/hooks/useBookUtmBoost";
import { trackConversion } from "@/lib/analytics/conversion-events";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { saveIntakeRouteHint } from "@/lib/book-intake/placeholders";
import { cn } from "@/lib/utils";

export type BookFullPathSelection = {
  categoryId: BookCategoryId;
  filterPreset?: Partial<FilterAnswers>;
  emotionalLabel: string | null;
  routeId: string;
};

type BookAudienceRouterProps = {
  onFullPath: (selection: BookFullPathSelection) => void;
  activeRouteId?: string | null;
  activeCategoryId?: BookCategoryId | null;
  resumeRouteId?: string | null;
  resumeQualOpen?: boolean;
  className?: string;
} & BookUtmBoostOptions;

function resolveActiveRoute(
  routes: readonly BookAudienceRoute[],
  activeRouteId: string | null | undefined,
  activeCategoryId: BookCategoryId | null | undefined,
): BookAudienceRoute | null {
  if (activeRouteId) {
    return routes.find((r) => r.id === activeRouteId) ?? null;
  }
  if (activeCategoryId) {
    return routes.find((r) => r.categoryId === activeCategoryId) ?? null;
  }
  return null;
}

function filterRoutesBySuperCategory(
  routes: readonly BookAudienceRoute[],
  filter: SuperCategoryFilter,
): readonly BookAudienceRoute[] {
  if (filter === "all") return routes;
  const group = BOOK_SUPER_CATEGORIES.find((c) => c.id === filter);
  if (!group) return routes;
  return routes.filter((r) => group.routeIds.includes(r.id));
}

function RouteGrid({
  routes,
  boostedRouteId,
  resumeRouteId,
  resumeQualOpen,
  onFullPath,
  showCustomCard = false,
}: {
  routes: readonly BookAudienceRoute[];
  boostedRouteId: string | null;
  resumeRouteId?: string | null;
  resumeQualOpen?: boolean;
  onFullPath: (route: BookAudienceRoute, emotionalLabel: string | null) => void;
  showCustomCard?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {routes.map((route) => (
        <div key={route.id} className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]">
          <BookAudienceCard
            route={route}
            boosted={route.id === boostedRouteId}
            resumeQualOpen={resumeQualOpen && route.id === resumeRouteId}
            onFullPath={onFullPath}
          />
        </div>
      ))}
      {showCustomCard ? (
        <div className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]">
          <BookIntakeCustomCard />
        </div>
      ) : null}
    </div>
  );
}

export default function BookAudienceRouter({
  onFullPath,
  activeRouteId = null,
  activeCategoryId = null,
  resumeRouteId = null,
  resumeQualOpen = false,
  className,
  utmCampaign,
  utmContent,
}: BookAudienceRouterProps) {
  const { orderedRoutes, boostedRouteId } = useBookUtmBoost({ utmCampaign, utmContent });
  const [moreOpen, setMoreOpen] = useState(false);
  const [superFilter, setSuperFilter] = useState<SuperCategoryFilter>("all");
  const [expandAll, setExpandAll] = useState(false);

  const isCollapsed = Boolean(activeRouteId || activeCategoryId);
  const activeRoute = isCollapsed
    ? resolveActiveRoute(orderedRoutes, activeRouteId, activeCategoryId)
    : null;
  const otherRoutes = activeRoute
    ? orderedRoutes.filter((r) => r.id !== activeRoute.id)
    : orderedRoutes;

  const filteredRoutes = useMemo(
    () => filterRoutesBySuperCategory(orderedRoutes, superFilter),
    [orderedRoutes, superFilter],
  );

  const routeCounts = useMemo(() => {
    const counts: Record<BookSuperCategory | "all", number> = {
      all: orderedRoutes.length,
      events: 0,
      studio: 0,
      learn: 0,
      pro: 0,
    };
    for (const cat of BOOK_SUPER_CATEGORIES) {
      counts[cat.id] = orderedRoutes.filter((r) => cat.routeIds.includes(r.id)).length;
    }
    return counts;
  }, [orderedRoutes]);

  useEffect(() => {
    persistUtmBoostFromUrl();
  }, []);

  const showMoreOpen = !isCollapsed && moreOpen;
  const showGrouped = superFilter === "all" && !expandAll;

  function handleFullPath(route: BookAudienceRoute, emotionalLabel: string | null) {
    saveIntakeRouteHint(route.id);
    trackConversion("book_router_select", {
      route_id: route.id,
      category: route.categoryId,
    });
    onFullPath({
      categoryId: route.categoryId,
      filterPreset: route.filterPreset,
      emotionalLabel,
      routeId: route.id,
    });
  }

  const escapeHref = buildWhatsAppHref({
    text: BOOK_ESCAPE_HATCH.message,
    utm_source: "website",
    utm_campaign: BOOK_ESCAPE_HATCH.utm_campaign,
  });

  return (
    <section
      className={cn("border-b border-border bg-background py-8 sm:py-10", className)}
      aria-labelledby="book-router-heading"
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          {isCollapsed ? (
            <h3
              id="book-router-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              הכיוון שבחרתם
            </h3>
          ) : (
            <h2
              id="book-router-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              בחרו את הכיוון שלכם
            </h2>
          )}
          <div
            className="mx-auto mt-3 h-1 w-12 rounded-full bg-brand-red"
            aria-hidden="true"
          />
          {!isCollapsed ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                בחרו כיוון - מחיר שקוף מיד, וואטסאפ מהיר או הזמנה מפורטת עם תוספות.
              </p>
              <p className="mt-3">
                <Link
                  href="/start"
                  className="inline-flex min-h-9 items-center text-sm font-medium text-brand-red underline-offset-4 hover:underline"
                >
                  לא בטוחים איך זה עובד? כל השלבים
                </Link>
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              ממשיכים בהזמנה המפורטת למטה. רוצים כיוון אחר?
            </p>
          )}
        </header>

        {!isCollapsed ? (
          <div className="mt-6 space-y-4">
            <BookSuperCategoryFilter
              active={superFilter}
              onChange={setSuperFilter}
              routeCounts={routeCounts}
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setExpandAll((v) => !v)}
                className="inline-flex min-h-9 items-center text-xs font-medium text-muted-foreground underline-offset-2 hover:text-brand-red hover:underline"
              >
                {expandAll ? "הצג לפי קטגוריות" : "פתחו את כל השירותים לסקירה"}
              </button>
            </div>
          </div>
        ) : null}

        {isCollapsed && activeRoute ? (
          <div className="mt-6 space-y-4">
            <BookAudienceCard
              route={activeRoute}
              boosted={activeRoute.id === boostedRouteId}
              resumeQualOpen={resumeQualOpen && activeRoute.id === resumeRouteId}
              onFullPath={handleFullPath}
              compact
            />

            {otherRoutes.length > 0 ? (
              <div className="rounded-xl border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:text-brand-red"
                  aria-expanded={showMoreOpen}
                >
                  <span>כיוונים נוספים ({otherRoutes.length})</span>
                  <span
                    className={cn(
                      "text-xs transition-transform duration-150",
                      showMoreOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>
                {showMoreOpen ? (
                  <div className="grid grid-cols-1 gap-4 border-t border-border p-4 md:grid-cols-2">
                    {otherRoutes.map((route) => (
                      <BookAudienceCard
                        key={route.id}
                        route={route}
                        boosted={route.id === boostedRouteId}
                        resumeQualOpen={resumeQualOpen && route.id === resumeRouteId}
                        onFullPath={handleFullPath}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : showGrouped ? (
          <div className="mt-8 space-y-10">
            {BOOK_SUPER_CATEGORIES.map((group) => {
              const groupRoutes = orderedRoutes.filter((r) =>
                group.routeIds.includes(r.id),
              );
              if (!groupRoutes.length) return null;
              return (
                <div key={group.id}>
                  <h3 className="mb-4 flex items-center gap-2 border-b border-border pb-3 font-serif text-lg font-semibold text-foreground">
                    <span aria-hidden="true">{group.icon}</span>
                    {group.label}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({groupRoutes.length})
                    </span>
                  </h3>
                  <RouteGrid
                    routes={groupRoutes}
                    boostedRouteId={boostedRouteId}
                    resumeRouteId={resumeRouteId}
                    resumeQualOpen={resumeQualOpen}
                    onFullPath={handleFullPath}
                    showCustomCard={group.id === "pro"}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-8">
            <RouteGrid
              routes={filteredRoutes}
              boostedRouteId={boostedRouteId}
              resumeRouteId={resumeRouteId}
              resumeQualOpen={resumeQualOpen}
              onFullPath={handleFullPath}
              showCustomCard
            />
          </div>
        )}

        {!isCollapsed ? (
          <div className="mt-8 space-y-4 text-center">
            <p className="mx-auto max-w-lg rounded-lg border border-border bg-surface/80 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              {BOOK_ROUTER_REASSURANCE}
            </p>
            <button
              type="button"
              onClick={() => openWhatsAppLead(escapeHref)}
              className="inline-flex min-h-9 items-center text-sm font-medium text-brand-red underline-offset-4 hover:underline"
            >
              {BOOK_ESCAPE_HATCH.label}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
