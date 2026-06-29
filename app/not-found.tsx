import type { Metadata } from "next";
import NotFoundContent from "@/components/not-found/NotFoundContent";
import HomeQuickPaths from "@/components/marketing/HomeQuickPaths";

export const metadata: Metadata = {
  title: "הקצב השתנה | עמוד לא נמצא",
  description: "העמוד שחיפשתם לא נמצא. חפשו שירות או צרו קשר בוואטסאפ.",
  robots: { index: false, follow: false },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "דף הבית",
      item: "https://yakircohen.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "העמוד לא נמצא (404)",
    },
  ],
};

export default function NotFound() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <NotFoundContent quickPaths={<HomeQuickPaths />} />
    </>
  );
}
