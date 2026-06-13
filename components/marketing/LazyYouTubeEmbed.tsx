import { parseYouTubeVideoId } from "@/lib/youtube";
import LazyClickEmbed from "@/components/marketing/LazyClickEmbed";
import LazyYouTubePlayer from "@/components/marketing/LazyYouTubePlayer";
import VideoObjectSchema from "@/components/seo/VideoObjectSchema";

export type LazyYouTubeEmbedProps = {
  embedUrl: string;
  title: string;
  className?: string;
};

/**
 * Resolves a YouTube embed URL to lazy click-to-play (single video)
 * or a generic embed facade (playlist / unknown format).
 */
export default function LazyYouTubeEmbed({
  embedUrl,
  title,
  className,
}: LazyYouTubeEmbedProps) {
  const isPlaylist =
    embedUrl.includes("videoseries") || embedUrl.includes("list=");

  if (!isPlaylist) {
    const videoId = parseYouTubeVideoId(embedUrl);
    if (videoId) {
      return (
        <>
          <VideoObjectSchema videos={[{ videoId, name: title }]} />
          <LazyYouTubePlayer
            videoId={videoId}
            title={title}
            className={className}
          />
        </>
      );
    }
  }

  return (
    <LazyClickEmbed
      src={embedUrl}
      title={title}
      className={className}
      hint="לחצו לצפייה בוידאו"
    />
  );
}
