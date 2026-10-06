import { ENTITY_IDS } from "@/lib/seo/entity-ids";
import YOUTUBE_UPLOAD_DATES from "@/lib/data/youtube-upload-dates.generated.json";

/**
 * תאריך ההעלאה האמיתי של סרטון, מ-YouTube עצמו (scripts/fetch-youtube-upload-dates.mjs).
 * בלי uploadDate גוגל מסמנת את ה-VideoObject כפריט לא תקף (Search Console, 6.10.2026).
 */
export function youtubeUploadDate(videoId: string): string | undefined {
  return (YOUTUBE_UPLOAD_DATES as Record<string, string>)[videoId.trim()];
}

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
    publisher: { "@id": ENTITY_IDS.organization },
  };
  /* uploadDate מושמט כשאינו ידוע. עדיף להשמיט מאשר לפרסם תאריך מומצא -
     תאריך שגוי ב-structured data הוא טענה עובדתית לא נכונה מול Google. */
  const uploadDate = input.uploadDate ?? youtubeUploadDate(input.videoId);
  return uploadDate ? { ...schema, uploadDate } : schema;
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
