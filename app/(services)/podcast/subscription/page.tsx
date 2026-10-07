import type { Metadata } from "next";
import PodcastSubscriptionPageContent from "@/components/seo/PodcastSubscriptionPageContent";
import {
  PODCAST_SUBSCRIPTION_IS_DRAFT,
  PODCAST_SUBSCRIPTION_TITLE,
} from "@/lib/data/podcast-subscription-page";
import { constructMetadata } from "@/lib/metadata";

/* טיוטה: מחוץ לאינדקס עד שהבעלים קובע מחירים ותנאי ביטול. */
export const metadata: Metadata = constructMetadata({
  title: PODCAST_SUBSCRIPTION_TITLE,
  description:
    "מסלולי מנוי חודשי להפקת פודקאסט: מספר פרקים קבוע בכל חודש, כולל עריכה, עם או בלי עריכת וידאו.",
  slug: "podcast/subscription",
  ...(PODCAST_SUBSCRIPTION_IS_DRAFT ? { robots: { index: false, follow: true } } : {}),
});

export default function PodcastSubscriptionPage() {
  return <PodcastSubscriptionPageContent />;
}
