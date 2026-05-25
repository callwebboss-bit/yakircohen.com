import type { Metadata } from "next";
import ClinicPageContent from "@/components/seo/ClinicPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "קליניקה לטיפול בגמגום | מודיעין",
  description:
    "פגישות אישיות לגמגום במודיעין - סביבה שקטה, התאמה לגיל ותיאום גמיש. קביעת פגישה בוואטסאפ.",
  slug: "clinic",
  keywords: ["קליניקת גמגום", "טיפול בגמגום מודיעין", "פגישת גמגום"],
});

export default function ClinicPage() {
  return <ClinicPageContent />;
}
