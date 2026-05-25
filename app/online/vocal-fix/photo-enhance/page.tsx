import type { Metadata } from "next";
import OnlinePhotoEnhancePageContent from "@/components/seo/OnlinePhotoEnhancePageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "שדרוג תמונות ב-AI | איכות HD מרחוק",
  description:
    "שדרוג תמונות ישנות ומטושטשות ב-AI: הגדלת רזולוציה, חדות, צבעים והסרת רעשים. מ-50 ₪ לתמונה. חבילות עד 20 תמונות. דוגמה חינם.",
  slug: "online/vocal-fix/photo-enhance",
  keywords: [
    "שדרוג תמונות AI",
    "הגדלת רזולוציה תמונה",
    "תיקון תמונה ישנה",
    "upscaling תמונה",
    "שחזור תמונות משפחה",
  ],
});

export default function PhotoEnhancePage() {
  return <OnlinePhotoEnhancePageContent />;
}
