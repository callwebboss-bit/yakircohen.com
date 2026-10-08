import {
  SERVICE_IMAGES_BASE,
  type ServiceEntity,
  type ServiceMediaType,
} from "@/lib/data/services";
import { isValidYouTubeEmbedUrl } from "@/lib/data/youtube-embeds";
import { resolveOgForCategory, type OgImageConfig } from "@/lib/seo/og-images";
import { DEFAULT_OG_WIDTH, DEFAULT_OG_HEIGHT } from "@/lib/seo/page-schema";
import {
  listServicePortfolioImageSet,
  type PortfolioImage,
} from "@/lib/service-portfolio-images";

/** Shared anchor for hero play button lazy video section. */
export const SERVICE_SHOWCASE_VIDEO_ID = "service-showcase-video";

/** Gallery block anchor for hero "scroll to photos". */
export const SERVICE_PORTFOLIO_GALLERY_ID = "service-portfolio-gallery";

const HERO_FILENAME_PRIORITY = /(?:^|[-_.])(?:hero|cover|banner|main|ראש|ראשי)(?:[-_.]|$)/i;

/** Shared studio cover when a service folder has no photos yet. */
const HERO_IMAGE_FALLBACK_FOLDER = "podcast";

export type HeroScrollTarget = "video" | "gallery";

export type ServicePageHeroBundle = {
  heroImageSrc?: string;
  heroImageAlt: string;
  heroScrollTarget?: HeroScrollTarget;
  heroVideoSectionId?: string;
};

export function pickPortfolioHeroImage(
  images: readonly PortfolioImage[],
  preferredPattern?: RegExp,
): PortfolioImage | null {
  if (images.length === 0) return null;

  const byPriority = images.find((img) => HERO_FILENAME_PRIORITY.test(img.filename));
  if (byPriority) return byPriority;

  if (preferredPattern) {
    const preferred = images.find((img) => preferredPattern.test(img.filename));
    if (preferred) return preferred;
  }

  const webp = images.find((img) => /\.webp$/i.test(img.filename));
  return webp ?? images[0];
}

export function inferHeroScrollTarget(
  assetsFolder: string,
  mediaType: ServiceMediaType,
  playlistEmbedUrl?: string | null,
): HeroScrollTarget | undefined {
  const hasEmbed = isValidYouTubeEmbedUrl(playlistEmbedUrl);
  const { primary, archive } = listServicePortfolioImageSet(assetsFolder);
  const hasImages = primary.length > 0 || archive.length > 0;

  if (mediaType === "video" && hasEmbed) return "video";
  if (mediaType === "audio" && hasEmbed) return "video";
  if (hasEmbed && !hasImages) return "video";
  if (
    hasImages &&
    (mediaType === "gallery" || mediaType === "video" || mediaType === "audio")
  ) {
    return "gallery";
  }
  return undefined;
}

export type ResolveServicePageHeroOptions = {
  mediaType?: ServiceMediaType;
  playlistEmbedUrl?: string | null;
  videoSectionId?: string;
};

export function resolveServicePageHero(
  assetsFolder: string,
  fallbackAlt: string,
  preferredPattern?: RegExp,
  options?: ResolveServicePageHeroOptions,
): ServicePageHeroBundle & {
  portfolioImages: PortfolioImage[];
  archiveImages: PortfolioImage[];
} {
  const { primary, archive } = listServicePortfolioImageSet(assetsFolder);
  let heroImage = pickPortfolioHeroImage(primary, preferredPattern);
  const mediaType = options?.mediaType ?? "gallery";
  const hasEmbed = isValidYouTubeEmbedUrl(options?.playlistEmbedUrl);

  if (!heroImage && hasEmbed) {
    const fallback = listServicePortfolioImageSet(HERO_IMAGE_FALLBACK_FOLDER);
    heroImage = pickPortfolioHeroImage(fallback.primary, preferredPattern);
  }

  const heroScrollTarget = options
    ? inferHeroScrollTarget(assetsFolder, mediaType, options.playlistEmbedUrl)
    : inferHeroScrollTarget(assetsFolder, "gallery", null);

  return {
    portfolioImages: primary,
    archiveImages: archive,
    heroImageSrc: heroImage?.src,
    heroImageAlt: heroImage?.alt ?? fallbackAlt,
    heroScrollTarget,
    heroVideoSectionId: options?.videoSectionId ?? SERVICE_SHOWCASE_VIDEO_ID,
  };
}

/** Hero props from a registry / service entity (media + embed aware). */
/** Shared `public/images/services/podcast/` folder across podcast landing pages. */
export function resolvePodcastFolderHero(
  fallbackAlt: string,
  playlistEmbedUrl?: string | null,
  preferredPattern?: RegExp,
): ServicePageHeroBundle {
  const hasVideo = isValidYouTubeEmbedUrl(playlistEmbedUrl);
  const resolved = resolveServicePageHero("podcast", fallbackAlt, preferredPattern, {
    mediaType: hasVideo ? "video" : "gallery",
    playlistEmbedUrl,
  });
  return {
    heroImageSrc: resolved.heroImageSrc,
    heroImageAlt: resolved.heroImageAlt,
    heroScrollTarget: resolved.heroScrollTarget,
    heroVideoSectionId: resolved.heroVideoSectionId,
  };
}

export function resolveServicePageHeroFromEntity(
  service: Pick<ServiceEntity, "assetsFolder" | "title" | "mediaType" | "playlistEmbedUrl">,
  preferredPattern?: RegExp,
  options?: Pick<ResolveServicePageHeroOptions, "videoSectionId">,
): ServicePageHeroBundle {
  const resolved = resolveServicePageHero(
    service.assetsFolder,
    service.title,
    preferredPattern,
    {
      mediaType: service.mediaType,
      playlistEmbedUrl: service.playlistEmbedUrl,
      videoSectionId: options?.videoSectionId,
    },
  );
  return {
    heroImageSrc: resolved.heroImageSrc,
    heroImageAlt: resolved.heroImageAlt,
    heroScrollTarget: resolved.heroScrollTarget,
    heroVideoSectionId: resolved.heroVideoSectionId,
  };
}

/**
 * תמונות שאסור שיופיעו כתמונת שיתוף (og:image / twitter), כי רואים בהן מותג של
 * גוף אחר ולא את יקיר כהן הפקות. בדיקת הלוגו 7.10.2026: העמוד /events ועוד שלושה
 * עמודים שיתפו צילום מהטרמינל עם השלטים JAMES RICHARDSON ו-JR/DUTY FREE | 102FM,
 * ושני עמודים שיתפו צילום חתונה שעל מסך הלד שלו כתוב ALMOG COHEN.
 * כל עותק נרשם בנפרד, כי אותו צילום שמור בכמה תיקיות (בדיקת md5 באותו יום).
 * הרשימה חלה רק על תמונת השיתוף. ההירו בעמוד נשאר כמו שהוא, כי הוא עובר דרך
 * next/image ומכסת אופטימיזציית התמונות ב-Vercel Hobby נגמרה, וכל קובץ חדש שם מחזיר 402.
 * הנתיבים יחסיים ל-public/images/services. הבדיקה בקובץ הטסט מוודאת שכל נתיב עדיין קיים.
 */
export const OG_IMAGE_BRAND_EXCLUSIONS: readonly string[] = [
  // JAMES RICHARDSON, JR/DUTY FREE ו-102FM על מסך הלד בטרמינל
  "events/attractions/led-booth/102FM בטרמינל.webp",
  "events/equipment/dj-102FM בטרמינל.webp",
  // אותו שידור 102FM בטרמינל, DUTY FREE ו-JAMES RICHARDSON על המסך
  "events/attractions/led-booth/אולפן 102FM - הקמת עמדת לד לאולפן רדיו נייד.webp",
  "events/equipment/dj-אולפן 102FM - הקמת עמדת לד לאולפן רדיו נייד.webp",
  // JR/DUTY FREE, 102FM ו-AHAVA ברקע
  "events/attractions/led-booth/עמדתשידור 102 FM.webp",
  // 102FM, NISSAN, DACIA, RENAULT ו-LEASE4U באולם תצוגה של רכבים
  "events/attractions/led-booth/כמדת שידור עמדת לד ניידת.webp",
  "events/dj-events/כמדת שידור עמדת לד ניידת.webp",
  // ALMOG COHEN על מסך הלד מאחורי זוג בסלואו
  "events/wedding-packages/חבילת סלואו יקיר כהן הפקות.webp",
  "events/attractions/confetti-cannon/חבילת סלואו יקיר כהן הפקות.webp",
  "events/attractions/cold-fireworks/חבילת סלואו יקיר כהן הפקות.webp",
  "events/attractions/led-booth/עמדת לד עם מיתוג תקליטן לריקוד סלואו מרשים.webp",
];

const OG_EXCLUDED_SRC = new Set(
  OG_IMAGE_BRAND_EXCLUSIONS.map((relativePath) =>
    `${SERVICE_IMAGES_BASE}/${relativePath}`.normalize("NFC"),
  ),
);

function isExcludedFromOgImage(image: PortfolioImage): boolean {
  return OG_EXCLUDED_SRC.has(image.src.normalize("NFC"));
}

const HEBREW_LETTER = /[א-ת]/;

/** סימנים של שם קובץ שהמצלמה או הטלפון נתנו (IMG_, BURST, DSC ודומיהם). */
const CAMERA_FILENAME_TOKEN = /(?:^|[^a-z])(?:img|dsc|dcim|pxl|vid|burst)(?:[^a-z]|$)/i;

/**
 * שם קובץ גולמי של מצלמה, בלי אף מילה שמישהו כתב: אין בו עברית, ויש בו רצף של
 * ארבע ספרות ומעלה או סימן מצלמה. בדיקת הלוגו 7.10.2026 מצאה og:image:alt כמו
 * "00000img burst20200701191123548 cover scaled" ו-"leom9008", כי ה-alt נגזר משם הקובץ.
 */
export function isRawCameraFilename(filename: string): boolean {
  const base = filename.replace(/\.[^.]+$/, "");
  if (HEBREW_LETTER.test(base)) return false;
  return /\d{4,}/.test(base) || CAMERA_FILENAME_TOKEN.test(base);
}

/**
 * מילים שנשארות ב-alt משם הקובץ ולא מתארות כלום: scaled של וורדפרס, מידות כמו
 * 1024x576, סימני מצלמה, cover שמסמן את תמונת ההירו, והקידומת eq- שסימנה עותקים
 * בתיקייה events/equipment (הקידומת dj- כבר מתורגמת ל"תקליטן" ב-deriveHebrewAlt).
 */
const OG_ALT_NOISE_TOKEN =
  /^(?:scaled|cover|eq|\d+(?:x\d+)?|(?:img|dsc|dcim|pxl|vid|burst)\d*)$/i;

function readableOgAlt(image: PortfolioImage, fallbackAlt: string): string {
  if (isRawCameraFilename(image.filename)) return fallbackAlt;
  const cleaned = image.alt
    .split(/\s+/)
    .filter((token) => token.length > 0 && !OG_ALT_NOISE_TOKEN.test(token))
    .join(" ")
    .trim();
  return HEBREW_LETTER.test(cleaned) ? cleaned : fallbackAlt;
}

/** תמונה לאורך או צרה מכרטיס שיתוף (1200 רוחב). בלי מידות ידועות לא פוסלים */
function isPoorShareFormat(image: PortfolioImage): boolean {
  if (!image.width || !image.height) return false;
  return image.height > image.width || image.width < DEFAULT_OG_WIDTH;
}

/** עמוד ראשי של קטגוריה (/events, /studio, /photography וכו'): הכתובת שלו היא שם הקטגוריה. */
function isCategoryHubPage(service: Pick<ServiceEntity, "slug" | "category">): boolean {
  return service.slug === service.category;
}

/**
 * תמונת השיתוף (og:image ו-twitter) של עמוד שירות.
 *
 * ברירת המחדל היא אותה תמונה שמוצגת בראש העמוד, כדי שהתצוגה ברשתות תתאים לעמוד.
 * בדיקת הלוגו 7.10.2026 הוסיפה שלושה כללים, ורק לתמונת השיתוף, כי ההירו עובר דרך
 * next/image ומכסת התמונות נגמרה:
 * 1. תמונה מ-OG_IMAGE_BRAND_EXCLUSIONS לא נבחרת לעולם.
 * 2. אם התמונה שנבחרה היא שם קובץ גולמי של מצלמה: בעמוד ראשי של קטגוריה עוברים
 *    לתמונת הקטגוריה (/images/og/events.webp וכו', עם הלוגו), כי תמונה מקרית
 *    מתיקייה של שירות אחד לא מייצגת את כל הקטגוריה. בעמוד שירות בוחרים קודם קובץ
 *    עם שם שמישהו כתב, ורק אם אין כזה נשארים עם הקובץ הגולמי.
 * 3. ה-alt של קובץ עם שם גולמי הוא כותרת העמוד, לא שם הקובץ.
 * 4. עמוד ראשי של קטגוריה, ותמונה לאורך או צרה מ-1200, מקבלים את כרטיס הקטגוריה
 *    (1200x630 עם הלוגו). כרטיס שיתוף הוא ביחס 1.91:1, ותמונה לאורך נחתכת בו
 *    עד שלא רואים כלום. ב-7.10.2026 זה היה המצב ב-21 מתוך 41 עמודי שירות.
 */
export function resolveServiceOgImage(
  service: Pick<ServiceEntity, "assetsFolder" | "title" | "category" | "slug">,
): OgImageConfig {
  const categoryOg = resolveOgForCategory(service.category);
  if (isCategoryHubPage(service)) return categoryOg;
  const { primary } = listServicePortfolioImageSet(service.assetsFolder);
  const allowed = primary.filter((image) => !isExcludedFromOgImage(image));
  const heroLike = pickPortfolioHeroImage(allowed);

  if (!heroLike) return categoryOg;

  let chosen = heroLike;
  const markedAsHero = HERO_FILENAME_PRIORITY.test(heroLike.filename);
  if (!markedAsHero && isRawCameraFilename(heroLike.filename)) {
    if (isCategoryHubPage(service)) return categoryOg;
    const named = allowed.filter((image) => !isRawCameraFilename(image.filename));
    chosen = named.find((image) => /\.webp$/i.test(image.filename)) ?? named[0] ?? heroLike;
  }

  if (isPoorShareFormat(chosen)) return categoryOg;

  const fallbackAlt = HEBREW_LETTER.test(service.title) ? service.title : categoryOg.alt;

  return {
    path: chosen.src,
    alt: readableOgAlt(chosen, fallbackAlt),
    width: chosen.width ?? DEFAULT_OG_WIDTH,
    height: chosen.height ?? DEFAULT_OG_HEIGHT,
  };
}
