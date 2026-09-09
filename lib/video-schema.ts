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
  const schema = {
    "@type": "VideoObject" as const,
    name: input.name,
    description: input.description ?? input.name,
    thumbnailUrl: youtubeThumbnailUrl(input.videoId),
    contentUrl: youtubeWatchUrl(input.videoId),
    embedUrl: youtubeEmbedUrlFromId(input.videoId),
    inLanguage: "he-IL",
    publisher: {
      "@type": "Organization" as const,
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
  /* uploadDate מושמט כשאינו ידוע. עדיף להשמיט מאשר לפרסם תאריך מומצא -
     תאריך שגוי ב-structured data הוא טענה עובדתית לא נכונה מול Google. */
  return input.uploadDate ? { ...schema, uploadDate: input.uploadDate } : schema;
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
