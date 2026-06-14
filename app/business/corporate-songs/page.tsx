import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { CORPORATE_SONGS_CONFIG } from "@/lib/data/corporate-songs-page";

const SLUG = "business/corporate-songs";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "שירים וקליפים לחברות",
  metaDescription:
    "שיר פרישה, הימנון חברה, הרמת כוסית. הפקה מלאה באולפן. החל מ-5,000 ₪. חשבונית מס.",
  keywords: [
    "שיר לחברה",
    "שיר פרישה",
    "הימנון חברה",
    "קליפ לערב חברה",
    "הפקת שיר לארגון",
  ],
  config: CORPORATE_SONGS_CONFIG,
});

export default function CorporateSongsPage() {
  return <BusinessServicePage slug={SLUG} config={CORPORATE_SONGS_CONFIG} />;
}
