import type { Metadata } from "next";
import ServiceAreasPageContent from "@/components/seo/ServiceAreasPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "אזורי שירות והגעה | מודיעין, ירושלים, שוהם, פתח תקווה והמרכז",
  description:
    "אזורי השירות של יקיר כהן הפקות - אולפן במודיעין, הגעה לירושלים, שוהם, פתח תקווה וערים נוספות במרכז לפי תיאום.",
  slug: "areas",
  keywords: [
    "אזורי שירות אולפן הקלטות",
    "אולפן מודיעין",
    "הקלטות בירושלים",
    "אולפן שוהם",
    "שירותי אודיו פתח תקווה",
    "אזורי שירות במרכז",
  ],
});

export default function AreasPage() {
  return <ServiceAreasPageContent />;
}
