// UI-EXCEPTION: split layout + video column — see docs/ui-exceptions.md
"use client";

import Link from "next/link";
import YouTube from "@/components/YouTube";
import Button from "@/components/ui/Button";
import type { StudioGiftIdea } from "@/lib/data/studio-gifts-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function GiftIdeaCard({
  idea,
  reverse = false,
}: {
  idea: StudioGiftIdea;
  reverse?: boolean;
}) {
  const waHref = buildWhatsAppHref({
    text: idea.whatsappText,
    utm_source: "studio",
    utm_campaign: idea.utmCampaign,
  });

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-[box-shadow,border-color] duration-normal ease-luxury hover:border-brand-red/30 hover:shadow-md",
        "grid grid-cols-1 gap-0 lg:grid-cols-2",
      )}
    >
      <div
        className={cn(
          "flex flex-col justify-center p-6 sm:p-8",
          reverse && "lg:order-2",
        )}
      >
        <span className="inline-flex w-fit rounded-full bg-brand-red/10 px-3 py-0.5 text-xs font-semibold text-brand-red">
          {idea.badge}
        </span>
        <h3 className="mt-3 font-serif text-lg font-semibold text-foreground sm:text-xl">
          {idea.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {idea.description}
        </p>
        <ul className="mt-4 space-y-2">
          {idea.highlights.map((line) => (
            <li
              key={line}
              className="flex gap-2 text-sm text-muted-foreground"
            >
              <span className="shrink-0 font-bold text-brand-red">-</span>
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            as="a"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl"
          >
            שובר מתנה בוואטסאפ
          </Button>
          <Button
            as="link"
            href={idea.href}
            variant="outline"
            className="rounded-xl"
          >
            לפרטים על השירות
          </Button>
        </div>
      </div>

      {/* IMPROVED: fixed aspect-video on all breakpoints — prevents CLS when video loads */}
      <div
        className={cn(
          "relative aspect-video min-h-[220px] bg-foreground",
          reverse && "lg:order-1",
        )}
      >
        <YouTube
          videoId={idea.videoId}
          title={idea.videoTitle}
          fillParent
        />
      </div>
    </article>
  );
}
