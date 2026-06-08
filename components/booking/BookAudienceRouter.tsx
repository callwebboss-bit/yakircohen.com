"use client";

import { useEffect } from "react";
import BookAudienceCard from "@/components/booking/BookAudienceCard";
import {
  BOOK_ESCAPE_HATCH,
  BOOK_ROUTER_REASSURANCE,
  type BookAudienceRoute,
} from "@/lib/data/book-audience-routes";
import type { BookCategoryId } from "@/lib/book-url";
import type { FilterAnswers } from "@/lib/data/filter-questions";
import { persistUtmBoostFromUrl, useBookUtmBoost } from "@/hooks/useBookUtmBoost";
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
  className?: string;
};

export default function BookAudienceRouter({
  onFullPath,
  className,
}: BookAudienceRouterProps) {
  const { orderedRoutes, boostedRouteId } = useBookUtmBoost();

  useEffect(() => {
    persistUtmBoostFromUrl();
  }, []);

  function handleFullPath(route: BookAudienceRoute, emotionalLabel: string | null) {
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
    <section className={cn("border-b border-border bg-background py-8 sm:py-10", className)} aria-labelledby="book-router-heading">
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="book-router-heading"
            className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
          >
            בחרו את הכיוון שלכם
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            בחרו כיוון — מחיר שקוף מיד, וואטסאפ מהיר או הזמנה מפורטת עם תוספות.
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">{BOOK_ROUTER_REASSURANCE}</p>
        </header>

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

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => openWhatsAppLead(escapeHref)}
            className="text-sm font-medium text-brand-red underline-offset-4 hover:underline"
          >
            {BOOK_ESCAPE_HATCH.label}
          </button>
        </div>
      </div>
    </section>
  );
}
