import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";

type YouTubePlaylistSectionProps = {
  headingId: string;
  title: string;
  description?: string;
  playlistUrl: string;
  playlistEmbedUrl: string;
  iframeTitle: string;
  linkLabel?: string;
};

export default function YouTubePlaylistSection({
  headingId,
  title,
  description,
  playlistUrl,
  playlistEmbedUrl,
  iframeTitle,
  linkLabel = "צפייה בפלייליסט המלא ביוטיוב",
}: YouTubePlaylistSectionProps) {
  return (
    <section className="mt-12" aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="text-center text-lg font-semibold text-foreground sm:text-xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      <p className="mx-auto mt-3 max-w-xl text-center text-sm">
        <a
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-red hover:underline"
        >
          {linkLabel}
        </a>
      </p>
      <div className="mx-auto mt-6 max-w-3xl">
        <LazyYouTubeEmbed embedUrl={playlistEmbedUrl} title={iframeTitle} />
      </div>
    </section>
  );
}
