"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import GoogleRatingBadge from "@/components/marketing/GoogleRatingBadge";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { STUDIO_GOOGLE_MAPS_URL } from "@/lib/constants";
import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

type FilterId =
  | "all"
  | "studio"
  | "events"
  | "podcast"
  | "voiceover"
  | "online";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "הכול" },
  { id: "studio", label: "אולפן" },
  { id: "events", label: "אירועים" },
  { id: "podcast", label: "פודקאסט" },
  { id: "voiceover", label: "קריינות" },
  { id: "online", label: "אונליין" },
];

function matchFilter(serviceHref: string | undefined, filter: FilterId): boolean {
  if (filter === "all" || !serviceHref) return filter === "all";
  if (filter === "online") return serviceHref.startsWith("/online");
  return serviceHref.startsWith(`/${filter}`);
}

function AvatarPlaceholder({
  initials,
  name,
}: {
  initials?: string;
  name: string;
}) {
  const label = initials ?? name.slice(0, 2);
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-red/30 bg-background text-xs font-bold text-brand-red"
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

export default function TestimonialsPageContent() {
  const [active, setActive] = useState<FilterId>("all");

  const items = useMemo(
    () =>
      SITE_TESTIMONIALS.filter((t) =>
        matchFilter(t.serviceHref, active),
      ),
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
            תגובות אמיתיות מלקוחות במודיעין, ירושלים והמרכז - לפי סוג השירות.
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
                <blockquote className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    <span
                      className="me-1 font-serif text-2xl leading-none text-brand-red"
                      aria-hidden="true"
                    >
                      ״
                    </span>
                    {item.quote}
                    <span
                      className="ms-1 font-serif text-2xl leading-none text-brand-red"
                      aria-hidden="true"
                    >
                      ״
                    </span>
                  </p>
                  <footer className="mt-6 flex flex-col gap-3 border-t border-border pt-4">
                    <div className="flex items-center gap-3">
                      <AvatarPlaceholder
                        initials={item.initials}
                        name={item.name}
                      />
                      <div>
                        <cite className="not-italic text-sm font-semibold text-foreground">
                          {item.name}
                        </cite>
                        {item.role ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.role}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    {item.serviceHref && item.serviceLabel ? (
                      <Link
                        href={item.serviceHref}
                        className="inline-flex min-h-11 items-center text-xs font-semibold text-brand-red hover:underline"
                      >
                        {item.serviceLabel}
                      </Link>
                    ) : null}
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </article>
  );
}
