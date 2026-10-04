import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { CORPORATE_SONGS_CONFIG } from "@/lib/data/corporate-songs-page";

const SLUG = "business/corporate-songs";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "שיר פרישה והימנון לחברה | הפקה עם קליפ - חשבונית מס",
  metaDescription:
    "שיר פרישה, הימנון חברה וקליפ לערב חברה. הפקה מלאה - כתיבה, הקלטה, מיקס. חשבונית מס. מודיעין, פתח תקווה ואזור המרכז - תגובה, בדרך כלל תוך 24 שעות.",
  keywords: [
    "שיר פרישה לסמנכ״ל",
    "הימנון חברה עם קליפ",
    "שיר לערב חברה פתח תקווה",
    "הפקת שיר לחברה",
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
