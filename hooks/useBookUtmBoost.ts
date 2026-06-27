"use client";

import { useMemo, useState } from "react";
import {
  BOOK_AUDIENCE_ROUTES,
  type BookAudienceRoute,
} from "@/lib/data/book-audience-routes";

export type BookUtmBoostOptions = {
  utmCampaign?: string | null;
  utmContent?: string | null;
};

const UTM_BOOST_STORAGE_KEY = "yc_book_utm_boost";

function readUtmSignals(): string {
  if (typeof window === "undefined") return "";
  const parts: string[] = [];
  try {
    const params = new URLSearchParams(window.location.search);
    const campaign = params.get("utm_campaign");
    const content = params.get("utm_content");
    const source = params.get("utm_source");
    if (campaign) parts.push(campaign);
    if (content) parts.push(content);
    if (source) parts.push(source);

    const stored = sessionStorage.getItem(UTM_BOOST_STORAGE_KEY);
    if (stored) parts.push(stored);
  } catch {
    // ignore
  }
  return parts.join(" ").toLowerCase();
}

function scoreRoute(route: BookAudienceRoute, signals: string): number {
  if (!signals.trim()) return 0;
  let score = 0;
  for (const keyword of route.utmBoostKeywords) {
    if (signals.includes(keyword.toLowerCase())) score += 10;
  }
  if (signals.includes(route.id.replace(/-/g, "_"))) score += 5;
  if (signals.includes(route.categoryId)) score += 3;
  return score;
}

export function persistUtmBoostFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const campaign = params.get("utm_campaign");
    if (campaign) {
      sessionStorage.setItem(UTM_BOOST_STORAGE_KEY, campaign);
    }
  } catch {
    // ignore
  }
}

export function useBookUtmBoost(options?: BookUtmBoostOptions): {
  orderedRoutes: readonly BookAudienceRoute[];
  boostedRouteId: string | null;
} {
  const campaign = options?.utmCampaign?.trim() ?? "";
  const content = options?.utmContent?.trim() ?? "";
  const [clientSignals] = useState(() => {
    if (typeof window === "undefined") return "";
    persistUtmBoostFromUrl();
    try {
      const params = new URLSearchParams(window.location.search);
      return [
        params.get("utm_campaign"),
        params.get("utm_content"),
        params.get("utm_source"),
        readUtmSignals(),
      ]
        .filter(Boolean)
        .join(" ");
    } catch {
      return readUtmSignals();
    }
  });

  return useMemo(() => {
    const signals = `${campaign} ${content} ${clientSignals}`.toLowerCase();

    const scored = BOOK_AUDIENCE_ROUTES.map((route) => ({
      route,
      score: scoreRoute(route, signals),
    }));

    const maxScore = Math.max(...scored.map((s) => s.score), 0);
    const boostedRouteId =
      maxScore > 0
        ? scored.find((s) => s.score === maxScore)?.route.id ?? null
        : null;

    const orderedRoutes =
      maxScore > 0
        ? [...scored]
            .sort((a, b) => b.score - a.score)
            .map((s) => s.route)
        : BOOK_AUDIENCE_ROUTES;

    return { orderedRoutes, boostedRouteId };
  }, [campaign, content, clientSignals]);
}
