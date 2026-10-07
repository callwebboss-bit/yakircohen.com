import { SITE_URL } from "@/lib/site-url";
import { SITE_STUDIO_IMAGE_SRC, SITE_NAME } from "@/lib/constants";

/** Default share image when a page has no dedicated OG asset.
 * בדיקת הלוגו 7.10.2026: עד אז זו הייתה תמונת האולפן לאורך (1536x2048), שהוצהרה
 * כ-1200x900, ובחיתוך לשיתוף השלט על הקיר נחתך. home.webp נוצר ב-generate-og-images
 * עם הלוגו, ב-1200x630 */
export const DEFAULT_OG_IMAGE_PATH = "/images/og/home.webp";

export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}${encodeURI(DEFAULT_OG_IMAGE_PATH)}`;

/** תמונת האולפן של הסכמה (WebSite ו-LocalBusiness). נשארת צילום, בלי כותרת ולוגו */
export const SITE_PHOTO_URL = `${SITE_URL}${encodeURI(SITE_STUDIO_IMAGE_SRC)}`;

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
      height: 630,
      alt: `${SITE_NAME} - אולפן הקלטות במודיעין`,
    },
  ],
};

export const DEFAULT_TWITTER = {
  card: "summary_large_image" as const,
  images: [DEFAULT_OG_IMAGE_URL],
};
