import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";
import { STUDIO_CLIENT_HIGHLIGHTS } from "@/lib/data/studio-clients";
import {
  STUDIO_HUB_FEATURED,
  STUDIO_HUB_PORTFOLIO_NOTE,
} from "@/lib/data/youtube-showcases";
import { youtubeEmbedUrl } from "@/lib/data/youtube-embeds";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { BLUR_DATA_URL } from "@/lib/blur";
import { cn } from "@/lib/utils";

export type StudioClientsStripProps = {
  className?: string;
  /** Homepage: show the main portfolio reel above the gallery */
  showFeaturedVideo?: boolean;
};

export default function StudioClientsStrip({
  className,
  showFeaturedVideo = false,
}: StudioClientsStripProps) {
  const whatsappHref = buildWhatsAppHref({
    text: "שלום, ראיתי באתר את האולפן ואשמח לשמוע על הקלטה.",
    utm_source: "website",
    utm_campaign: "home_clients_strip",
  });

  const featuredEmbedUrl = youtubeEmbedUrl(STUDIO_HUB_FEATURED.videoId);

  return (
    <Section
      padding="sm"
      className={cn("border-y border-border bg-surface", className)}
      ariaLabelledby="studio-clients-heading"
    >
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            מהאולפן
          </p>
          <h2
            id="studio-clients-heading"
            className="mt-3 font-serif text-section-title font-semibold text-foreground"
          >
            מי הקליט אצלנו
          </h2>
          <p className="text-lead mt-4 text-muted-foreground">
            אמנים, יזמים, משפחות ועסקים - כולם באים לאותו מקום: אולפן שקט
            במודיעין עם צוות שמלווה עד לקובץ מוכן.
          </p>
        </header>

        {showFeaturedVideo && featuredEmbedUrl ? (
          <figure className="mx-auto mt-10 max-w-3xl">
            <LazyYouTubeEmbed
              embedUrl={featuredEmbedUrl}
              title={STUDIO_HUB_FEATURED.title}
              className="overflow-hidden rounded-2xl border border-border shadow-sm"
            />
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {STUDIO_HUB_PORTFOLIO_NOTE}
            </figcaption>
          </figure>
        ) : null}

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {STUDIO_CLIENT_HIGHLIGHTS.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                title={`${item.caption} — ${item.linkLabel}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-[box-shadow,border-color] duration-normal ease-luxury hover:border-brand-red/30 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="group-hover-scale-md object-cover motion-reduce:transform-none"
                  />
                </div>
                <div className="flex flex-1 flex-col items-center px-3 py-2.5 text-center">
                  <p className="text-xs font-semibold text-foreground sm:text-sm">
                    {item.caption}
                  </p>
                  <span className="mt-1 text-[0.65rem] font-semibold text-brand-red transition-colors group-hover:underline sm:text-xs">
                    {item.linkLabel}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-red transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            קראו עלינו עוד
          </Link>
          <span className="hidden text-muted-foreground sm:inline" aria-hidden>
            -
          </span>
          <Button
            as="a"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            className="text-sm font-semibold"
          >
            רוצים להקליט? דברו איתנו בוואטסאפ
          </Button>
        </div>
      </Container>
    </Section>
  );
}
