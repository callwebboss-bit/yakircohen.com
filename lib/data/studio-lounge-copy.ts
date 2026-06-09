import brandCopy from "./closer-brand-copy.json";

export const STUDIO_LOUNGE_COPY = brandCopy.studioLounge;
export const PODCAST_FILMING_IDEAS = brandCopy.podcastFilmingIdeas;

export function formatLoungeClientBlock(): string {
  return STUDIO_LOUNGE_COPY.clientBlock;
}
