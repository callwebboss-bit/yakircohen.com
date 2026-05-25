import type { Metadata } from "next";
import OnlineSendFilePageContent from "@/components/seo/OnlineSendFilePageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "אישור תנאים לפני שליחת קבצים | יקיר כהן הפקות",
  description:
    "הצהרת אחריות ותנאי שירות לפני שליחת קבצים לעיבוד מרחוק. שירות טכני בלבד - האחריות על תוכן הקבצים על הלקוח.",
  slug: "online/vocal-fix/send-file",
  keywords: [
    "שליחת קבצים לעריכה",
    "תנאי שירות אודיו",
    "הצהרת אחריות הקלטה",
  ],
});

export default function SendFilePage() {
  return <OnlineSendFilePageContent />;
}
