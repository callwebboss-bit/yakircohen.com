"use client";

import { useBookUtmBoost, type BookUtmBoostOptions } from "@/hooks/useBookUtmBoost";
import { getAudienceRouteById } from "@/lib/data/book-audience-routes";
import { GOOGLE_RATING } from "@/lib/constants";

export const BOOK_HERO_SUBTITLE_DEFAULT =
  "למטה - מה מפריע בהקלטה. אחרי זה מופיעים השירות והמחיר.";

type BookDynamicHeroSubtitleProps = {
  defaultText: string;
} & BookUtmBoostOptions;

export default function BookDynamicHeroSubtitle({
  defaultText,
  utmCampaign,
  utmContent,
}: BookDynamicHeroSubtitleProps) {
  const { boostedRouteId } = useBookUtmBoost({ utmCampaign, utmContent });
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
      {route.startingPriceDual}, וואטסאפ מהיר או הזמנה מפורטת.
      {" "}
      {GOOGLE_RATING} כוכבים ב-Google - תשובה ביום עסקים.
    </p>
  );
}
