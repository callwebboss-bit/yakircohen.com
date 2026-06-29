import type { Metadata } from "next";
import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { CORPORATE_PODCAST_CONFIG } from "@/lib/data/corporate-podcast-page";

const SLUG = "podcast/corporate-podcast";

export const metadata: Metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "פודקאסט ארגוני לחברות | הפקה מלאה + ספוטיפיי + חשבונית מס",
  metaDescription:
    "הפקת פודקאסט לחברות וארגונים. מיתוג מעסיק, שיווק תוכן, הפצה לספוטיפיי ואפל. ריטיינר חודשי מ-4,800 ₪. חשבונית מס.",
  keywords: [
    "פודקאסט ארגוני",
    "מיתוג מעסיק פודקאסט",
    "פודקאסט לחברות",
    "employer branding podcast",
    "הפקת פודקאסט לארגונים",
  ],
  config: CORPORATE_PODCAST_CONFIG,
  ogHub: "podcast",
});

export default function CorporatePodcastPage() {
  return <BusinessServicePage slug={SLUG} config={CORPORATE_PODCAST_CONFIG} />;
}
