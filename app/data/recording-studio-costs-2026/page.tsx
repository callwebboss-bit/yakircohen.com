import type { Metadata } from "next";
import StudioCostPageContent from "@/components/seo/StudioCostPageContent";
import {
  STUDIO_COST_DESCRIPTION,
  STUDIO_COST_SLUG,
  STUDIO_COST_TITLE,
  STUDIO_COST_UPDATED_AT,
} from "@/lib/data/studio-cost-model";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: STUDIO_COST_TITLE,
  description: STUDIO_COST_DESCRIPTION,
  slug: STUDIO_COST_SLUG,
  article: {
    publishedTime: STUDIO_COST_UPDATED_AT,
    modifiedTime: STUDIO_COST_UPDATED_AT,
  },
  keywords: [
    "ממה מורכב מחיר הקלטת שיר",
    "ממה מורכב מחיר הקלטה באולפן",
    "כמה עולה להפעיל אולפן הקלטות",
    "עלות הקמת אולפן הקלטות",
    "למה תיקון זיופים עולה",
  ],
});

export default function RecordingStudioCostsPage() {
  return <StudioCostPageContent />;
}
