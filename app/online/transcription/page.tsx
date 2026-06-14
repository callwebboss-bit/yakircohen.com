import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { TRANSCRIPTION_CONFIG } from "@/lib/data/transcription-page";

const SLUG = "online/transcription";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "תמלול פודקאסט וראיונות",
  metaDescription:
    "שלחו הקלטה, קבלו טקסט נקי. AI + עריכה אנושית. גם כתוביות SRT. החל מ-180 ₪.",
  keywords: ["תמלול פודקאסט", "תמלול ראיונות", "כתוביות SRT"],
  config: TRANSCRIPTION_CONFIG,
  ogHub: "online",
});

export default function TranscriptionPage() {
  return <BusinessServicePage slug={SLUG} config={TRANSCRIPTION_CONFIG} />;
}
