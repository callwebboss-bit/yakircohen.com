import type { Metadata } from "next";
import LegacyRecordingPageContent from "@/components/seo/LegacyRecordingPageContent";
import {
  LEGACY_RECORDING_DESCRIPTION,
  LEGACY_RECORDING_KEYWORDS,
  LEGACY_RECORDING_META_TITLE,
  LEGACY_RECORDING_READY,
  LEGACY_RECORDING_SLUG,
} from "@/lib/data/legacy-recording";
import { constructMetadata } from "@/lib/metadata";
import { SITE_ROBOTS } from "@/lib/seo-config";
import { buildLegacyRecordingSchema } from "@/lib/seo/legacy-recording-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

/*
 * חסום לאינדוקס כל עוד חסרה עובדה שהבעלים לא נתן (lib/data/legacy-recording.ts).
 * העמוד מציג סימוני TODO, והם לא צריכים להגיע לגוגל. הדף עצמו נפתח, כדי
 * שהבעלים יוכל לעבור עליו. כשהנתונים מלאים, LEGACY_RECORDING_READY הופך
 * ל-true והעמוד נפתח לאינדוקס ונכנס למפת האתר, בלי לגעת בקובץ הזה.
 */
export const metadata: Metadata = constructMetadata({
  title: LEGACY_RECORDING_META_TITLE,
  description: LEGACY_RECORDING_DESCRIPTION,
  slug: LEGACY_RECORDING_SLUG,
  keywords: [...LEGACY_RECORDING_KEYWORDS],
  robots: LEGACY_RECORDING_READY
    ? SITE_ROBOTS
    : { index: false, follow: false },
});

const PAGE_SCHEMA = buildLegacyRecordingSchema();

export default function LegacyRecordingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(PAGE_SCHEMA) }}
      />
      <LegacyRecordingPageContent />
    </>
  );
}
