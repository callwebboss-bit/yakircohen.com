import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { AUDIO_BRANDING_CONFIG } from "@/lib/data/audio-branding-page";

const SLUG = "business/audio-branding";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "מיתוג קולי לעסקים",
  metaDescription:
    "ג'ינגל, IVR, מוזיקת המתנה ואפקטים. חבילת סאונד למותג. החל מ-1,500 ₪ לפני מע״מ.",
  keywords: [
    "מיתוג קולי",
    "ג'ינגל לעסק",
    "IVR מקצועי",
    "הודעת המתנה",
    "audio branding",
  ],
  config: AUDIO_BRANDING_CONFIG,
});

export default function AudioBrandingPage() {
  return <BusinessServicePage slug={SLUG} config={AUDIO_BRANDING_CONFIG} />;
}
