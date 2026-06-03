import YouTube from "@/components/YouTube";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import ServicePortfolioMedia from "@/components/services/ServicePortfolioMedia";
import VideoObjectSchema from "@/components/seo/VideoObjectSchema";
import {
  BAT_MITZVAH_CLIP_VIDEOS,
  BAT_MITZVAH_FEATURED_VIDEO_ID,
} from "@/lib/data/bat-mitzvah-gifts-page";
import { cn } from "@/lib/utils";

const BAT_MITZVAH_ASSETS_FOLDER = "studio/bat-mitzvah";

export type BatMitzvahClipShowcaseProps = {
  className?: string;
  /** כותרת ראשית - ברירת מחדל: קליפ בת מצווה */
  heading?: string;
  /** הסתר כותרת וטקסט מבוא (לשילוב בעמודים עם כותרת משלהם) */
  showHeader?: boolean;
  /** הצג גלריית תמונות מ-studio/bat-mitzvah */
  showGallery?: boolean;
  /** הצג סרטונים נוספים מלבד הראשי */
  showMoreVideos?: boolean;
  /** סרטון ראשי גדול — ברירת מחדל: כן */
  showFeaturedVideo?: boolean;
  /** FAQ items for structured data */
  faqItems?: readonly { question: string; answer: string }[];
};

export default function BatMitzvahClipShowcase({
  className,
  heading = "קליפ בת מצווה - תמונות ילדות, סרטונים וקליפ מהאולפן",
  showHeader = true,
  showGallery = true,
  showMoreVideos = true,
  showFeaturedVideo = true,
  faqItems,
}: BatMitzvahClipShowcaseProps) {
  const featured = BAT_MITZVAH_CLIP_VIDEOS[0];
  const moreVideos = BAT_MITZVAH_CLIP_VIDEOS.slice(1);

  const schemaVideos = [
    {
      videoId: featured?.videoId ?? BAT_MITZVAH_FEATURED_VIDEO_ID,
      name: featured?.title ?? heading,
      description:
        "קליפ בת מצווה עם שילוב תמונות ילדות, סרטונים מהבית וקליפ מוקלט באולפן מקצועי במודיעין.",
    },
    ...moreVideos.map((video) => ({
      videoId: video.videoId,
      name: video.title,
    })),
  ];

  return (
    <section
      className={cn("space-y-12", className)}
      aria-labelledby={showHeader ? "bat-mitzvah-clip-heading" : undefined}
    >
      <VideoObjectSchema videos={schemaVideos} faqItems={faqItems} />

      {showHeader ? (
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            בת/בר מצווה
          </p>
          <h2
            id="bat-mitzvah-clip-heading"
            className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            קליפ מרגש שמשלב תמונות ילדות, סרטונים מהבית וקליפ מוקלט באולפן -
            הפקה מלאה עם שיר אישי, צילום, עריכה ומיקס מקצועי. מתאים גם כשובר
            מתנה לבת/בר מצווה.
          </p>
        </header>
      ) : null}

      {showFeaturedVideo ? (
        <div className="mx-auto max-w-3xl">
          <div className="aspect-video overflow-hidden rounded-2xl bg-neutral-900 shadow-lg">
            <YouTube
              videoId={featured?.videoId ?? BAT_MITZVAH_FEATURED_VIDEO_ID}
              title={featured?.title ?? heading}
              fillParent
            />
          </div>
          {featured?.title ? (
            <p className="mt-4 text-center text-sm font-medium text-foreground">
              {featured.title}
            </p>
          ) : null}
        </div>
      ) : null}

      {showGallery ? (
        <div>
          <header className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              מהשטח
            </p>
            <h3 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">
              תמונות מההפקה
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              תמונות ילדות, רגעים מהאירוע והקלטה באולפן - מעלים לתיקייה ומופיעות
              כאן אוטומטית.
            </p>
          </header>
          <ServicePortfolioMedia
            assetsFolder={BAT_MITZVAH_ASSETS_FOLDER}
            mediaType="gallery"
            label="קליפ בת מצווה"
            showEmbed={false}
            galleryLayout="masonry"
            className="px-0"
          />
        </div>
      ) : null}

      {showMoreVideos && moreVideos.length > 0 ? (
        <div>
          <header className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              עוד דוגמאות
            </p>
            <h3 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">
              קליפים נוספים מהאולפן
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              סגנונות שונים - בהפתעה, משולב עם חברים או סולו במרכז.
            </p>
          </header>
          <RecordingSongExampleVideos
            videos={moreVideos}
            initialVisible={3}
          />
        </div>
      ) : null}
    </section>
  );
}
