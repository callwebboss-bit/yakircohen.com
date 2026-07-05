import type { TestimonialItem } from "@/components/marketing/Testimonials";
import { PODCAST_HUB_TESTIMONIALS } from "@/lib/data/podcast-hub-page";
import { RECORDING_SONG_TESTIMONIALS } from "@/lib/data/recording-song-modiin-page";
import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";
import { WEDDING_PHOTO_TESTIMONIALS } from "@/lib/data/wedding-photography-page";

/** כל ההמלצות באתר — מרכזי + עמודי SEO ייעודיים */
export const ALL_TESTIMONIALS: readonly TestimonialItem[] = [
  ...SITE_TESTIMONIALS,
  ...PODCAST_HUB_TESTIMONIALS,
  ...RECORDING_SONG_TESTIMONIALS,
  ...WEDDING_PHOTO_TESTIMONIALS,
] as const;
