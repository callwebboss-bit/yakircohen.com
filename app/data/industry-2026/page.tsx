import type { Metadata } from "next";
import Industry2026PageContent from "@/components/seo/Industry2026PageContent";
import {
  INDUSTRY_2026_DESCRIPTION,
  INDUSTRY_2026_SLUG,
  INDUSTRY_2026_TITLE,
  INDUSTRY_2026_UPDATED_AT,
} from "@/lib/data/industry-2026";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: INDUSTRY_2026_TITLE,
  description: INDUSTRY_2026_DESCRIPTION,
  slug: INDUSTRY_2026_SLUG,
  article: {
    publishedTime: INDUSTRY_2026_UPDATED_AT,
    modifiedTime: INDUSTRY_2026_UPDATED_AT,
  },
  keywords: [
    "נתוני תעשייה 2026",
    "כמה עולה להקליט שיר 2026",
    "כמה עולה קליפ בר מצווה 2026",
    "כמה עולות אטרקציות 2026",
    "כמה עולה להקליט פודקאסט 2026",
    "כמה עולה להקים פודקאסט 2026",
    "מחירון אולפן 2026",
    "מחירי אירועים 2026",
  ],
});

export default function Industry2026Page() {
  return <Industry2026PageContent />;
}
