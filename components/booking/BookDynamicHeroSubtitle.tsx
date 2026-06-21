"use client";

import { useBookUtmBoost } from "@/hooks/useBookUtmBoost";
import { getAudienceRouteById } from "@/lib/data/book-audience-routes";

export const BOOK_HERO_SUBTITLE_DEFAULT =
  "בחרו כיוון - מחיר שקוף מיד (כולל מע\"מ), וואטסאפ מהיר או הזמנה מפורטת עם תוספות. 4.9 כוכבים - 5,000+ לקוחות - תשובה ביום עסקים.";

type BookDynamicHeroSubtitleProps = {
  defaultText: string;
};

export default function BookDynamicHeroSubtitle({
  defaultText,
}: BookDynamicHeroSubtitleProps) {
  const { boostedRouteId } = useBookUtmBoost();
  const route = boostedRouteId ? getAudienceRouteById(boostedRouteId) : null;

  if (!route) {
    return (
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {defaultText}
      </p>
    );
  }

  return (
    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
      <span className="font-medium text-foreground">{route.valueFrame}</span>
      {" - "}
      {route.startingPriceDual.replace("כרגע: ", "")}, וואטסאפ מהיר או הזמנה מפורטת.
      {" "}
      4.9 כוכבים - תשובה ביום עסקים.
    </p>
  );
}
