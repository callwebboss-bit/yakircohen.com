"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  filterSeoPortfolioMedia,
  getLocationsWithMedia,
  SEO_PORTFOLIO_LOCATION_LABELS,
  SEO_PORTFOLIO_SERVICE_LABELS,
  SEO_PORTFOLIO_SERVICES,
  type SeoPortfolioLocationId,
  type SeoPortfolioServiceId,
} from "@/lib/data/seo-portfolio-media";

type ServiceFilter = SeoPortfolioServiceId | "all";
type LocationFilter = SeoPortfolioLocationId | "all";

export default function SeoPortfolioFilterGallery() {
  const [service, setService] = useState<ServiceFilter>("all");
  const [location, setLocation] = useState<LocationFilter>("all");

  const availableLocations = useMemo(
    () => getLocationsWithMedia(service),
    [service],
  );

  const items = useMemo(
    () => filterSeoPortfolioMedia(service, location),
    [service, location],
  );

  const onServiceChange = (next: ServiceFilter) => {
    setService(next);
    const locs = getLocationsWithMedia(next);
    if (location !== "all" && !locs.includes(location)) {
      setLocation("all");
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="sticky top-16 z-10 -mx-1 flex flex-wrap gap-2 bg-background/95 px-1 py-3 backdrop-blur"
        role="group"
        aria-label="סינון לפי שירות"
      >
        <FilterChip
          active={service === "all"}
          onClick={() => onServiceChange("all")}
          label="הכול"
        />
        {SEO_PORTFOLIO_SERVICES.map((id) => (
          <FilterChip
            key={id}
            active={service === id}
            onClick={() => onServiceChange(id)}
            label={SEO_PORTFOLIO_SERVICE_LABELS[id]}
          />
        ))}
      </div>

      {availableLocations.length > 0 ? (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="סינון לפי אזור"
        >
          <FilterChip
            active={location === "all"}
            onClick={() => setLocation("all")}
            label="כל האזורים"
          />
          {availableLocations.map((id) => (
            <FilterChip
              key={id}
              active={location === id}
              onClick={() => setLocation(id)}
              label={SEO_PORTFOLIO_LOCATION_LABELS[id]}
            />
          ))}
        </div>
      ) : null}

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            {item.youtubeId ? (
              <div className="aspect-video bg-muted">
                <iframe
                  title={item.title}
                  src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.title}
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
            ) : null}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              {item.href ? (
                <Link
                  href={item.href}
                  className="mt-2 inline-flex min-h-12 items-center text-sm font-medium text-brand-red hover:underline"
                >
                  לדף השירות
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-12 rounded-full border px-4 text-sm font-medium ${
        active
          ? "border-brand-red bg-brand-red text-white"
          : "border-border bg-surface text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
