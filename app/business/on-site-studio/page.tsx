import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { ON_SITE_STUDIO_CONFIG } from "@/lib/data/on-site-studio-page";

const SLUG = "business/on-site-studio";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "אולפן פודקאסט נייד לחברות",
  metaDescription:
    "אולפן זמני בחדר הישיבות. 2 מיקרופונים, 2 מצלמות, תאורה. מודיעין, ירושלים, תל אביב. החל מ-6,500 ₪.",
  keywords: [
    "אולפן נייד לחברה",
    "הקלטת פודקאסט במשרד",
    "אולפן זמני בחברה",
    "צילום וידאו בחברה",
    "פודקאסט לעסק",
  ],
  config: ON_SITE_STUDIO_CONFIG,
});

export default function OnSiteStudioPage() {
  return <BusinessServicePage slug={SLUG} config={ON_SITE_STUDIO_CONFIG} />;
}
