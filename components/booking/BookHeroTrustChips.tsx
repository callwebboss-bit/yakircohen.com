"use client";

import Link from "next/link";
import { Star, Timer, Users } from "lucide-react";
import {
  GOOGLE_RATING_LABEL,
  SITE_TRUST_STATS,
  STUDIO_GOOGLE_MAPS_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type BookHeroTrustChipsProps = {
  className?: string;
};

const ICONS = [Star, Users, Timer] as const;

export default function BookHeroTrustChips({ className }: BookHeroTrustChipsProps) {
  return (
    <div
      className={cn(
        "mx-auto mt-6 flex w-full max-w-4xl flex-wrap items-center justify-center gap-6 border-y border-border/60 py-3 text-sm text-muted-foreground",
        className,
      )}
      aria-label="נתוני אמון"
    >
      {SITE_TRUST_STATS.map((stat, index) => {
        const Icon = ICONS[index] ?? Star;
        const isGoogle = stat.label === GOOGLE_RATING_LABEL;
        const content = (
          <>
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                isGoogle ? "fill-amber-400 text-amber-500" : "text-brand-red",
              )}
              aria-hidden="true"
            />
            <span className="font-semibold text-foreground">{stat.value}</span>
            <span>{stat.label}</span>
          </>
        );

        if (isGoogle) {
          return (
            <Link
              key={stat.label}
              href={STUDIO_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-red"
            >
              {content}
            </Link>
          );
        }

        return (
          <span key={stat.label} className="inline-flex items-center gap-1.5">
            {content}
          </span>
        );
      })}
    </div>
  );
}
