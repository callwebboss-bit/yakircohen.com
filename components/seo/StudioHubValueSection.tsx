import YouTube from "@/components/YouTube";
import VideoObjectSchema from "@/components/seo/VideoObjectSchema";
import {
  STUDIO_HUB_FEATURED,
  STUDIO_HUB_PORTFOLIO_NOTE,
  STUDIO_HUB_VALUE_VIDEOS,
} from "@/lib/data/youtube-showcases";

/** תיק עבודות + 3 סרטוני ערך לעמוד /studio */
export default function StudioHubValueSection() {
  const schemaVideos = [
    {
      videoId: STUDIO_HUB_FEATURED.videoId,
      name: STUDIO_HUB_FEATURED.title,
      description: STUDIO_HUB_PORTFOLIO_NOTE,
    },
    ...STUDIO_HUB_VALUE_VIDEOS.map((item) => ({
      videoId: item.videoId,
      name: item.title,
      description: item.description,
    })),
  ];

  return (
    <div className="space-y-16">
      <VideoObjectSchema videos={schemaVideos} />
      <section aria-labelledby="studio-portfolio-heading">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            תיק עבודות
          </p>
          <h2
            id="studio-portfolio-heading"
            className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            תיק עבודות מהאולפן
          </h2>
          <p className="mt-3 text-sm font-medium text-foreground">
            {STUDIO_HUB_PORTFOLIO_NOTE}
          </p>
        </header>
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="aspect-video overflow-hidden rounded-2xl bg-neutral-900">
            <YouTube
              videoId={STUDIO_HUB_FEATURED.videoId}
              title={STUDIO_HUB_FEATURED.title}
              fillParent
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="studio-value-heading">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            אמון וערך
          </p>
          <h2
            id="studio-value-heading"
            className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            ערך, אמון ואפשרויות ליוצרים
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            דוגמאות שמראות איך האולפן מלווה אמנים, פודקאסטים ושיתופי פעולה - לא רק חדר
            הקלטה, אלא מערכת שמביאה תוצאה וחשיפה.
          </p>
        </header>
        <ul className="mt-10 grid gap-10 md:grid-cols-2">
          {STUDIO_HUB_VALUE_VIDEOS.map((item) => (
            <li
              key={item.videoId + item.title}
              className="flex flex-col rounded-2xl border border-border bg-surface p-4 transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-md sm:p-5"
            >
              <div className="aspect-video overflow-hidden rounded-xl bg-neutral-900">
                <YouTube videoId={item.videoId} title={item.title} fillParent />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
