"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BLUR_DATA_URL } from "@/lib/blur";
import {
  STUDIO_VIRTUAL_TOUR_STOPS,
  STUDIO_VIRTUAL_TOUR_VIDEO,
} from "@/lib/data/studio-virtual-tour";

export default function StudioVirtualTourPageContent() {
  return (
    <>
      <Section className="border-b border-border bg-background" ariaLabelledby="virtual-tour-title">
        <Container className="py-12 text-center sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            האולפן
          </p>
          <h1 id="virtual-tour-title" className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            מיני-סטודיו וירטואלי
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            הצצה קצרה לאולפן, לציוד ולתהליך ההקלטה. בלי מונחים כבדים ובלי הבטחות
            מיותרות - רק להבין איך זה נראה לפני שמגיעים.
          </p>
        </Container>
      </Section>

      <Section className="bg-surface" ariaLabelledby="virtual-tour-video-title">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 id="virtual-tour-video-title" className="text-center font-serif text-2xl font-semibold text-foreground">
              וידאו קצר מהאולפן
            </h2>
            <LazyYouTubeEmbed
              embedUrl={STUDIO_VIRTUAL_TOUR_VIDEO.embedUrl}
              title={STUDIO_VIRTUAL_TOUR_VIDEO.title}
              className="mt-6 aspect-video overflow-hidden rounded-2xl"
            />
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {STUDIO_VIRTUAL_TOUR_STOPS.map((item) => (
              <Dialog key={item.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                  <div className="relative aspect-[4/3] w-full bg-[#e8e6e1]">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.summary}
                    </p>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                      >
                        פרטים נוספים
                      </button>
                    </DialogTrigger>
                  </div>
                </article>

                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{item.title}</DialogTitle>
                    <DialogDescription>{item.summary}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-[#e8e6e1]">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 32rem"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                    </div>
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {item.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red"
                            aria-hidden="true"
                          />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
