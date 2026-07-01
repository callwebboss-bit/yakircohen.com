"use client";

import { useState } from "react";
import BookDemoVideoModal from "@/components/booking/BookDemoVideoModal";
import type { BookingUpsellItem } from "@/lib/data/booking-shared";
import { cn } from "@/lib/utils";

export type BookUpsellItem = BookingUpsellItem;

type BookUpsellSectionProps = {
  title?: string;
  subtitle?: string;
  items: readonly BookingUpsellItem[];
  selected: ReadonlySet<string>;
  onToggle: (id: string) => void;
  className?: string;
};

function UpsellThumb({
  item,
  active,
}: {
  item: BookingUpsellItem;
  active: boolean;
}) {
  if (item.imageSrc) {
    return (
      <span className="relative block h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageSrc}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {active ? (
          <span className="absolute inset-0 flex items-center justify-center bg-[var(--service-accent,#d42b2b)]/20 text-lg text-white">
            ✓
          </span>
        ) : null}
      </span>
    );
  }
  if (item.youtubeVideoId) {
    return (
      <span className="relative block h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg`}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white">
          ▶
        </span>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border text-xl",
        active
          ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_8%,transparent)]"
          : "border-border bg-muted/30",
      )}
      aria-hidden="true"
    >
      +
    </span>
  );
}

function UpsellRow({
  item,
  active,
  onToggle,
}: {
  item: BookingUpsellItem;
  active: boolean;
  onToggle: () => void;
}) {
  const [videoOpen, setVideoOpen] = useState(false);
  const savings =
    item.originalPrice && item.originalPrice > item.price
      ? item.originalPrice - item.price
      : null;

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "group flex w-full min-h-[4.5rem] items-start gap-3 rounded-xl border p-3 text-start transition-[border-color,background-color,box-shadow]",
          active
            ? "border-[var(--service-accent,#d42b2b)]/50 bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_6%,transparent)] shadow-sm"
            : "border-border bg-background hover:border-[var(--service-accent,#d42b2b)]/30 hover:shadow-sm",
        )}
        aria-pressed={active}
      >
        <span
          className={cn(
            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[0.65rem] font-bold",
            active
              ? "border-[var(--service-accent,#d42b2b)] bg-[var(--service-accent,#d42b2b)] text-white"
              : "border-border group-hover:border-[var(--service-accent,#d42b2b)]/40",
          )}
          aria-hidden="true"
        >
          {active ? "✓" : ""}
        </span>

        <UpsellThumb item={item} active={active} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground">{item.name}</span>
            {item.badge ? (
              <span className="rounded bg-[var(--service-accent,#d42b2b)]/10 px-1.5 py-0.5 text-[0.6rem] font-bold text-[var(--service-accent,#d42b2b)]">
                {item.badge}
              </span>
            ) : null}
          </div>
          {item.whatYouGet ? (
            <p className="mt-0.5 text-xs font-medium text-foreground/85">{item.whatYouGet}</p>
          ) : null}
          {item.description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
          ) : null}
          {item.youtubeVideoId ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setVideoOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  setVideoOpen(true);
                }
              }}
              className="mt-1.5 inline-flex min-h-9 items-center text-xs font-semibold text-[var(--service-accent,#d42b2b)] underline-offset-2 hover:underline"
            >
              צפו בדוגמה
            </span>
          ) : null}
          {savings ? (
            <p className="mt-1 text-[0.65rem] font-medium text-emerald-700">
              חיסכון: {savings.toLocaleString("he-IL")} ₪ לעומת מחיר רגיל
            </p>
          ) : null}
        </div>

        <div className="shrink-0 pt-0.5 text-end">
          {item.originalPrice ? (
            <span className="block text-xs text-muted-foreground line-through">
              +{item.originalPrice.toLocaleString("he-IL")} ₪
            </span>
          ) : null}
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              active ? "text-[var(--service-accent,#d42b2b)]" : "text-foreground",
            )}
          >
            {item.price > 0 ? `+${item.price.toLocaleString("he-IL")} ₪` : "כלול"}
          </span>
        </div>
      </button>

      {item.youtubeVideoId ? (
        <BookDemoVideoModal
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          videoId={item.youtubeVideoId}
          title={item.name}
        />
      ) : null}
    </>
  );
}

export default function BookUpsellSection({
  title = "תוספות אופציונליות",
  subtitle = "לוחצים להוספה - אפשר לדייק בוואטסאפ לפני סגירה",
  items,
  selected,
  onToggle,
  className,
}: BookUpsellSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-5", className)}>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle ? (
          <span className="text-[0.65rem] text-muted-foreground">{subtitle}</span>
        ) : null}
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <UpsellRow
            key={item.id}
            item={item}
            active={selected.has(item.id)}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
