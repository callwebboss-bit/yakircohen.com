import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { VOICE_CLONING_CONFIG } from "@/lib/data/voice-cloning-page";

const SLUG = "online/voice-cloning";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "שיבוט קול לעסקים",
  metaDescription:
    "עדכוני IVR בלי להקליט מחדש. הקמת מודל קול + עדכונים מהירים. רק עם אישור בעל הקול.",
  keywords: ["שיבוט קול", "IVR אוטומטי", "קול סינתטי לעסק"],
  config: VOICE_CLONING_CONFIG,
  ogHub: "online",
});

export default function VoiceCloningPage() {
  return <BusinessServicePage slug={SLUG} config={VOICE_CLONING_CONFIG} />;
}
