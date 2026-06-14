import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { AUDIOBOOKS_CONFIG } from "@/lib/data/audiobooks-page";

const SLUG = "business/audiobooks";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "הפקת ספרי שמע",
  metaDescription:
    "הקלטה, עריכה ומאסטרינג לספר קולי. ACX, Spotify, אייקאסט. החל מ-990 ₪ לפרק דוגמה.",
  keywords: [
    "הפקת ספר שמע",
    "ספר קולי",
    "audiobook",
    "הקלטת ספר",
    "mastering ACX",
  ],
  config: AUDIOBOOKS_CONFIG,
});

export default function AudiobooksPage() {
  return <BusinessServicePage slug={SLUG} config={AUDIOBOOKS_CONFIG} />;
}
