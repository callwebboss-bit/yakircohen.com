import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { ON_SITE_STUDIO_CONFIG } from "@/lib/data/on-site-studio-page";

const SLUG = "business/on-site-studio";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "אולפן זמני בחברה | פודקאסט ווידאו במשרד",
  metaDescription:
    "אולפן זמני בחברה - מגיעים לחדר הישיבות. הקמה כשעה וחצי, קבצים בסוף היום. החל מ-6,500 ₪.",
  keywords: [
    "אולפן זמני בחברה",
    "אולפן נייד לחברה",
    "הקלטת פודקאסט במשרד",
    "צילום וידאו בחברה",
    "פודקאסט לעסק",
  ],
  config: ON_SITE_STUDIO_CONFIG,
});

export default function OnSiteStudioPage() {
  return <BusinessServicePage slug={SLUG} config={ON_SITE_STUDIO_CONFIG} />;
}
