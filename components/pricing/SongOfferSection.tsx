import { GlossaryLinks } from "@/components/pricing/CatalogOfferPanel";
import SongOfferConfigurator, {
  type SongOfferVariant,
} from "@/components/pricing/SongOfferConfigurator";
import {
  getSongOfferFormData,
  getSongParticipantRules,
  normalizeSongAddons,
  SONG_OFFER_BASE_ID,
  SONG_OFFER_SECTION_ID,
  type SongAddonId,
} from "@/lib/data/song-offer";
import { getPriceTransparencyById } from "@/lib/data/pricing-catalog";
import { cn } from "@/lib/utils";

type SongOfferSectionProps = {
  /** נתיב העמוד, נכנס לתג [YC:] ולמייל לבעלים */
  source: string;
  variant?: SongOfferVariant;
  giftMode?: boolean;
  /** בחירה מסומנת מראש, למשל הקליפ בעמוד הקליפ */
  initialAddonIds?: readonly SongAddonId[];
  /** מספר משתתפים התחלתי, ברירת מחדל 1 */
  initialParticipants?: number;
  utmCampaign?: string;
  /** שורה מעל הטופס */
  intro?: string;
  pitchDemoHref?: string;
  clipExampleHref?: string;
  /** מונחון מתחת לטופס, מ-glossaryTermSlugs של הבסיס בקטלוג. רק בעמוד השיר
      ובמחירון האולפן, שם עמדו כרטיסי החבילות שנשאו את הקישורים האלה. */
  showGlossary?: boolean;
  /** ברירת מחדל song-offer. עמוד עם שני טפסים חייב מזהה שני. */
  id?: string;
  className?: string;
};

/**
 * טופס הקלטת השיר, קומפוננטת שרת. המחירים נקראים כאן מהקטלוג ועוברים
 * כנתונים פשוטים (quoteData), כך שהקטלוג לא נשלח לדפדפן בשביל הטופס. הטופס
 * מחשב כל בחירה באותה פונקציה של השרת, והקישור לוואטסאפ ב-HTML הראשוני כבר
 * נכון לבחירת ברירת המחדל.
 */
export default function SongOfferSection({
  source,
  variant = "full",
  giftMode = false,
  initialAddonIds = [],
  initialParticipants,
  utmCampaign,
  intro,
  pitchDemoHref,
  clipExampleHref,
  showGlossary = false,
  id = SONG_OFFER_SECTION_ID,
  className,
}: SongOfferSectionProps) {
  const { base, addons, quoteData, participantsExplanation } = getSongOfferFormData();
  const rules = getSongParticipantRules();
  const glossarySlugs = showGlossary
    ? (getPriceTransparencyById(SONG_OFFER_BASE_ID).glossaryTermSlugs ?? [])
    : [];

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
        quoteData={quoteData}
        participantsExplanation={participantsExplanation}
        source={source}
        utmCampaign={utmCampaign ?? (giftMode ? "song_offer_gift" : "song_offer")}
        variant={variant}
        giftMode={giftMode}
        initialAddonIds={normalizeSongAddons(initialAddonIds)}
        initialParticipants={Math.min(rules.max, Math.max(rules.included, initialParticipants ?? rules.included))}
        pitchDemoHref={pitchDemoHref}
        clipExampleHref={clipExampleHref}
      />
      {glossarySlugs.length > 0 ? (
        <div className="mx-auto mt-4 max-w-xl text-right text-sm text-muted-foreground">
          <p>מונחים שכדאי להכיר לפני הסשן:</p>
          <GlossaryLinks slugs={glossarySlugs} />
        </div>
      ) : null}
    </section>
  );
}
