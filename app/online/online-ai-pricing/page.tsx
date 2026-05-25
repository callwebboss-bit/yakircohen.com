import type { Metadata } from "next";
import OnlineAiPricingPageContent from "@/components/seo/OnlineAiPricingPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "מחירון שירותי AI מקוונים",
  description:
    "מחירון שקוף לניקוי רעשים, שחזור קול ושיפור פודקאסט - הצעת מחיר אישית בוואטסאפ.",
  slug: "online/online-ai-pricing",
  keywords: ["מחירון AI", "שחזור קול", "עריכת פודקאסט מחיר"],
});

export default function OnlineAiPricingPage() {
  return <OnlineAiPricingPageContent />;
}
