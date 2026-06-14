import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { WORKSHOPS_CONFIG } from "@/lib/data/workshops-page";

const SLUG = "academy/workshops";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "סדנאות תוכן וטיקטוק לצוותים",
  metaDescription:
    "סדנה מעשית לצוות: רילז, טיקטוק, דיבור מול מצלמה. באולפן במודיעין או בחברה. החל מ-2,800 ₪.",
  keywords: ["סדנת טיקטוק לעסק", "סדנת תוכן לצוות", "הדרכת רילז"],
  config: WORKSHOPS_CONFIG,
  ogHub: "podcast",
});

export default function WorkshopsPage() {
  return <BusinessServicePage slug={SLUG} config={WORKSHOPS_CONFIG} />;
}
