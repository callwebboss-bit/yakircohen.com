"use client";

import { useMemo } from "react";
import SongOfferConfigurator from "@/components/pricing/SongOfferConfigurator";
import {
  getSongOfferFormData,
  normalizeSongAddons,
  SONG_OFFER_SECTION_ID,
  type SongAddonId,
} from "@/lib/data/song-offer";

/**
 * הטופס בתוך /book. כאן אין קומפוננטת שרת מעל (BookPageSections ואשף
 * האולפן הם רכיבי לקוח), ולכן השילובים מחושבים בדפדפן. זה בסדר כי הוא נטען
 * רק דרך האשף הדינמי, ואשפי ההזמנה כבר מביאים איתם את הקטלוג.
 */
export default function SongOfferBookPanel({
  initialAddonIds = [],
  giftMode = false,
  source = "/book",
}: {
  initialAddonIds?: readonly SongAddonId[];
  giftMode?: boolean;
  source?: string;
}) {
  const data = useMemo(
    () =>
      getSongOfferFormData({
        source,
        giftMode,
        utmCampaign: "song_offer_book",
      }),
    [source, giftMode],
  );
  const initial = useMemo(() => normalizeSongAddons(initialAddonIds), [initialAddonIds]);
  return (
    <section id={SONG_OFFER_SECTION_ID} className="scroll-mt-24" data-song-offer="book">
      <SongOfferConfigurator
        base={data.base}
        addons={data.addons}
        quotes={data.quotes}
        source={source}
        variant="book"
        giftMode={giftMode}
        initialAddonIds={initial}
      />
    </section>
  );
}
