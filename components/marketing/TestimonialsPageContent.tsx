"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import GoogleRatingBadge from "@/components/marketing/GoogleRatingBadge";
import TestimonialCard from "@/components/marketing/TestimonialCard";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { STUDIO_GOOGLE_MAPS_URL } from "@/lib/constants";
import { ALL_TESTIMONIALS } from "@/lib/data/all-testimonials";
import type { TestimonialCategoryId } from "@/lib/data/testimonial-categories";
import { formatCategoryBreakdown } from "@/lib/data/testimonial-categories";
import { cn } from "@/lib/utils";

type FilterId = "all" | TestimonialCategoryId;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "הכול" },
  { id: "studio", label: "אולפן" },
  { id: "events", label: "אירועים" },
  { id: "podcast", label: "פודקאסט" },
  { id: "voiceover", label: "קריינות" },
  { id: "online", label: "אונליין" },
];

function matchFilter(
  serviceCategory: TestimonialCategoryId | undefined,
  filter: FilterId,
): boolean {
  if (filter === "all") return true;
  return serviceCategory === filter;
}

export default function TestimonialsPageContent() {
  const [active, setActive] = useState<FilterId>("all");

  const items = useMemo(
    () => ALL_TESTIMONIALS.filter((t) => matchFilter(t.serviceCategory, active)),
    [active],
  );

  return (
    <article>
      <Section padding="sm" className="border-b border-border">
        <Container className="max-w-3xl text-center">
          <p className="text-xs font-semibold text-muted-foreground">
            המלצות לקוחות
          </p>
          <h1 className="text-hero mt-4 font-semibold text-foreground">
            מה הלקוחות אומרים על השירות
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">
            תגובות אמיתיות מלקוחות במודיעין, ירושלים והמרכז, לפי סוג השירות, שנה
            וקישור לעמוד השירות.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatCategoryBreakdown(ALL_TESTIMONIALS)} · {ALL_TESTIMONIALS.length} המלצות
          </p>
          <div className="mt-6 flex justify-center">
            <GoogleRatingBadge variant="compact" />
          </div>
          <p className="mt-3 text-sm">
            <Link
              href={STUDIO_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-red hover:underline"
            >
              לכל הביקורות המאומתות ב-Google Maps
            </Link>
          </p>
        </Container>
      </Section>

      <nav
        className="border-b border-border bg-surface"
        aria-label="סינון המלצות"
      >
        <Container className="flex flex-wrap justify-center gap-2 py-4">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                active === f.id
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-border text-foreground hover:border-brand-red/40",
              )}
              aria-pressed={active === f.id}
            >
              {f.label}
            </button>
          ))}
        </Container>
      </nav>

      <Section padding="sm">
        <Container>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.id}>
                <TestimonialCard item={item} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </article>
  );
}
