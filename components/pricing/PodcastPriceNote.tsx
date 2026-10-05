import { EXTRA_PERSON_COST_NOTE } from "@/lib/data/participant-cost-copy";
import {
  PODCAST_AUDIO_PACKS,
  podcastAudioPackLine,
  podcastDualPrice,
  podcastParticipantExampleLine,
  podcastParticipantPriceLine,
} from "@/lib/data/podcast-calculator";
import {
  getExVat,
  PODCAST_AUDIO_SCOPE_NOTE,
  PODCAST_GRANDPA_SAME_PRICE_NOTE,
  PODCAST_PACK_NOTE,
} from "@/lib/data/pricing-catalog";
import { cn } from "@/lib/utils";

/**
 * מחיר פודקאסט באולפן (החלטות 5.10.2026 (פודקאסט)): מה כלול בפרק אודיו,
 * משתתפים (2 כלולים, כל נוסף בתוספת, עד 12), וחבילות פרקי אודיו. בעמוד
 * פודקאסט עם סבא מוצגים גם המסלולים, באותו מחיר כמו פודקאסט רגיל. הכול
 * מהקטלוג, כולל מע״מ קודם.
 */
export default function PodcastPriceNote({
  className,
  variant = "packs",
  id,
}: {
  className?: string;
  variant?: "packs" | "grandpa";
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn("rounded-lg border border-brand-red/30 bg-brand-red/5 px-4 py-3 text-start", className)}
      data-podcast-price
    >
      {variant === "grandpa" ? (
        <>
          <p className="text-sm font-semibold text-foreground">{PODCAST_GRANDPA_SAME_PRICE_NOTE}.</p>
          <ul className="mt-1 space-y-0.5 text-sm text-foreground">
            <li>פודקאסט אודיו: {podcastDualPrice(getExVat("podcast_audio"))}</li>
            <li>פודקאסט וידאו: {podcastDualPrice(getExVat("podcast_video"))}</li>
            <li>הקלטת שיר באולפן, אם רוצים גם שיר: {podcastDualPrice(getExVat("song_recording"))}</li>
          </ul>
        </>
      ) : null}
      <p className={cn("text-sm text-foreground", variant === "grandpa" ? "mt-2" : "font-semibold")}>
        פרק אודיו: {PODCAST_AUDIO_SCOPE_NOTE}.
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{EXTRA_PERSON_COST_NOTE}.</p>
      <p className="mt-1 text-sm text-foreground">{podcastParticipantPriceLine()}.</p>
      <p className="mt-1 text-xs text-muted-foreground">{podcastParticipantExampleLine(4)}.</p>
      {variant === "packs" ? (
        <>
          <p className="mt-3 text-sm font-semibold text-foreground">חבילות פרקי אודיו</p>
          <ul className="mt-1 space-y-0.5 text-sm text-foreground">
            {PODCAST_AUDIO_PACKS.map((pack) => (
              <li key={pack.id}>{podcastAudioPackLine(pack)}</li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-muted-foreground">{PODCAST_PACK_NOTE}.</p>
        </>
      ) : null}
    </div>
  );
}
