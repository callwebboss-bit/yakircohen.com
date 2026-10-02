import SongOfferConfigurator, {
  type SongOfferVariant,
} from "@/components/pricing/SongOfferConfigurator";
import {
  getSongOfferFormData,
  normalizeSongAddons,
  SONG_OFFER_SECTION_ID,
  type SongAddonId,
} from "@/lib/data/song-offer";
import { cn } from "@/lib/utils";

type SongOfferSectionProps = {
  /** נתיב העמוד, נכנס לתג [YC:] ולמייל לבעלים */
  source: string;
  variant?: SongOfferVariant;
  giftMode?: boolean;
  /** בחירה מסומנת מראש, למשל הקליפ בעמוד הקליפ */
  initialAddonIds?: readonly SongAddonId[];
  utmCampaign?: string;
  /** שורה מעל הטופס */
  intro?: string;
  pitchDemoHref?: string;
  clipExampleHref?: string;
  /** ברירת מחדל song-offer. עמוד עם שני טפסים חייב מזהה שני. */
  id?: string;
  className?: string;
};

/**
 * טופס הקלטת השיר, קומפוננטת שרת. המחירים, ההודעות והקישורים של כל
 * השילובים מחושבים כאן ועוברים כ-props, כך שהקטלוג לא נשלח לדפדפן בשביל
 * הטופס, והקישור לוואטסאפ ב-HTML הראשוני כבר נכון לבחירת ברירת המחדל.
 */
export default function SongOfferSection({
  source,
  variant = "full",
  giftMode = false,
  initialAddonIds = [],
  utmCampaign,
  intro,
  pitchDemoHref,
  clipExampleHref,
  id = SONG_OFFER_SECTION_ID,
  className,
}: SongOfferSectionProps) {
  const { base, addons, quotes } = getSongOfferFormData({
    source,
    giftMode,
    utmCampaign: utmCampaign ?? (giftMode ? "song_offer_gift" : "song_offer"),
  });

  return (
    <section
      id={id}
      className={cn("scroll-mt-24", className)}
      data-song-offer={variant}
      aria-label={variant === "book" ? "הקלטת שיר: בוחרים ושולחים" : undefined}
    >
      {intro ? (
        <p className="mx-auto mb-4 max-w-xl text-center text-sm text-muted-foreground">
          {intro}
        </p>
      ) : null}
      <SongOfferConfigurator
        base={base}
        addons={addons}
        quotes={quotes}
        source={source}
        variant={variant}
        giftMode={giftMode}
        initialAddonIds={normalizeSongAddons(initialAddonIds)}
        pitchDemoHref={pitchDemoHref}
        clipExampleHref={clipExampleHref}
      />
    </section>
  );
}
