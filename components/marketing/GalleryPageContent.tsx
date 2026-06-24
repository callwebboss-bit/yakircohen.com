"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { BLUR_DATA_URL } from "@/lib/blur";
import {
  GALLERY_CATEGORY_LABELS,
  GALLERY_ITEMS,
  type GalleryCategory,
} from "@/lib/data/gallery-items";
import { cn } from "@/lib/utils";

const FILTER_ORDER: GalleryCategory[] = [
  "all",
  "studio",
  "events",
  "podcast",
  "voiceover",
  "academy",
];

export default function GalleryPageContent() {
  const [active, setActive] = useState<GalleryCategory>("all");

  const visible =
    active === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === active);

  return (
    <article>
      <Section padding="sm" className="border-b border-border">
        <Container className="max-w-5xl">
          <p className="text-xs font-semibold text-muted-foreground">גלריה</p>
          <h1 className="text-hero mt-4 font-semibold text-foreground">
            תמונות מהאולפן, האירועים והפודקאסטים
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">
            דוגמאות מהשטח במודיעין והמרכז - אולפן, DJ, אפקטים וקריינות. לסרטונים
            מלאים ראו{" "}
            <Link href="/portfolio" className="text-brand-red hover:underline">
              תיק הוידאו
            </Link>
            .
          </p>
        </Container>
      </Section>

      <nav
        className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        aria-label="סינון גלריה"
      >
        <Container className="flex gap-2 overflow-x-auto py-3">
          {FILTER_ORDER.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                active === cat
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-border text-foreground hover:border-brand-red/40",
              )}
              aria-pressed={active === cat}
            >
              {GALLERY_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </Container>
      </nav>

      <Section padding="sm">
        <Container>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {visible.map((item) => {
              const inner = (
                <>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-normal ease-luxury group-hover:scale-[1.03] motion-reduce:transform-none"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                  {item.caption ? (
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      {item.caption}
                    </p>
                  ) : null}
                </>
              );

              return (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="group">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
    </article>
  );
}
