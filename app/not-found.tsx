import type { Metadata } from "next";
import NotFoundContent from "@/components/not-found/NotFoundContent";
import HomeQuickPaths from "@/components/marketing/HomeQuickPaths";

export const metadata: Metadata = {
  title: "הקצב השתנה | עמוד לא נמצא",
  description: "העמוד שחיפשתם לא נמצא. חפשו שירות או צרו קשר בוואטסאפ.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <NotFoundContent quickPaths={<HomeQuickPaths />} />
    </>
  );
}
