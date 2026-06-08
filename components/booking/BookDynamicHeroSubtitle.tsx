"use client";

import { useBookUtmBoost } from "@/hooks/useBookUtmBoost";
import { getAudienceRouteById } from "@/lib/data/book-audience-routes";

const DEFAULT =
  "בחרו כיוון - מחיר שקוף מיד (כולל מע״מ), וואטסאפ מהיר או הזמנה מפורטת עם תוספות. 4.9★ · 5,000+ לקוחות · תשובה תוך 15 דקות.";

export default function BookDynamicHeroSubtitle() {
  const { boostedRouteId } = useBookUtmBoost();
  const route = boostedRouteId ? getAudienceRouteById(boostedRouteId) : null;

  if (!route) {
    return (
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {DEFAULT}
      </p>
    );
  }

  return (
    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
      <span className="font-medium text-foreground">{route.valueFrame}</span>
      {" - "}
      {route.startingPriceDual.replace("כרגע: ", "")}, וואטסאפ מהיר או הזמנה מפורטת.
      {" "}
      4.9★ · תשובה תוך 15 דקות.
    </p>
  );
}
