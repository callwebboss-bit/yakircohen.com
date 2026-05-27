import { SITE_URL } from "@/lib/site-url";
import { SITE_STUDIO_IMAGE_SRC, SITE_NAME } from "@/lib/constants";

/** Default share image when a page has no dedicated OG asset */
export const DEFAULT_OG_IMAGE_PATH = SITE_STUDIO_IMAGE_SRC;

export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}${encodeURI(DEFAULT_OG_IMAGE_PATH)}`;

export const SITE_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
  },
} as const;

export const DEFAULT_OPEN_GRAPH = {
  type: "website" as const,
  locale: "he_IL",
  siteName: SITE_NAME,
  images: [
    {
      url: DEFAULT_OG_IMAGE_URL,
      width: 1200,
      height: 900,
      alt: `${SITE_NAME} - אולפן הקלטות במודיעין`,
    },
  ],
};

export const DEFAULT_TWITTER = {
  card: "summary_large_image" as const,
  images: [DEFAULT_OG_IMAGE_URL],
};
