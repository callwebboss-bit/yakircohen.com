"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookAudienceCard from "@/components/booking/BookAudienceCard";
import {
  BOOK_ESCAPE_HATCH,
  BOOK_ROUTER_REASSURANCE,
  type BookAudienceRoute,
} from "@/lib/data/book-audience-routes";
import type { BookCategoryId } from "@/lib/book-url";
import type { FilterAnswers } from "@/lib/data/filter-questions";
import { persistUtmBoostFromUrl, useBookUtmBoost, type BookUtmBoostOptions } from "@/hooks/useBookUtmBoost";
import { trackConversion } from "@/lib/analytics/conversion-events";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
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

export default function BookAudienceRouter({
  onFullPath,
  activeRouteId = null,
  activeCategoryId = null,
  className,
  utmCampaign,
  utmContent,
}: BookAudienceRouterProps) {
  const { orderedRoutes, boostedRouteId } = useBookUtmBoost({ utmCampaign, utmContent });
  const [moreOpen, setMoreOpen] = useState(false);

  const isCollapsed = Boolean(activeRouteId || activeCategoryId);
  const activeRoute = isCollapsed
    ? resolveActiveRoute(orderedRoutes, activeRouteId, activeCategoryId)
    : null;
  const otherRoutes = activeRoute
    ? orderedRoutes.filter((r) => r.id !== activeRoute.id)
    : orderedRoutes;

  useEffect(() => {
    persistUtmBoostFromUrl();
  }, []);

  const showMoreOpen = !isCollapsed && moreOpen;

  function handleFullPath(route: BookAudienceRoute, emotionalLabel: string | null) {
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
              className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
            >
              הכיוון שבחרתם
            </h3>
          ) : (
            <h2
              id="book-router-heading"
              className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
            >
              בחרו את הכיוון שלכם
            </h2>
          )}
          {!isCollapsed ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                בחרו כיוון - מחיר שקוף מיד, וואטסאפ מהיר או הזמנה מפורטת עם תוספות.
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">{BOOK_ROUTER_REASSURANCE}</p>
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

        {isCollapsed && activeRoute ? (
          <div className="mt-6 space-y-4">
            <BookAudienceCard
              route={activeRoute}
              boosted={activeRoute.id === boostedRouteId}
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
                        onFullPath={handleFullPath}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
            {orderedRoutes.map((route) => (
              <BookAudienceCard
                key={route.id}
                route={route}
                boosted={route.id === boostedRouteId}
                onFullPath={handleFullPath}
              />
            ))}
          </div>
        )}

        {!isCollapsed ? (
          <div className="mt-8 text-center">
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
