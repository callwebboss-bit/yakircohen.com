import { SITE_NAME } from "@/lib/constants";
import { SITE_URL } from "@/lib/site-url";

export type VideoSchemaInput = {
  videoId: string;
  name: string;
  description?: string;
  uploadDate?: string;
};

export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId.trim()}/maxresdefault.jpg`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId.trim()}`;
}

export function youtubeEmbedUrlFromId(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId.trim()}`;
}

export function buildVideoObjectSchema(input: VideoSchemaInput) {
  return {
    "@type": "VideoObject" as const,
    name: input.name,
    description: input.description ?? input.name,
    thumbnailUrl: youtubeThumbnailUrl(input.videoId),
    contentUrl: youtubeWatchUrl(input.videoId),
    embedUrl: youtubeEmbedUrlFromId(input.videoId),
    uploadDate: input.uploadDate ?? "2024-01-01",
    inLanguage: "he-IL",
    publisher: {
      "@type": "Organization" as const,
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildVideoObjectGraph(videos: readonly VideoSchemaInput[]) {
  if (videos.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@graph": videos.map(buildVideoObjectSchema),
  };
}

export function buildItemListSchema(
  name: string,
  items: readonly { videoId: string; name: string }[],
) {
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: youtubeWatchUrl(item.videoId),
    })),
  };
}

export function buildFaqPageSchema(
  items: readonly { question: string; answer: string }[],
) {
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
