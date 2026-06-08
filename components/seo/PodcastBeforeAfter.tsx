"use client";

import PodcastZoomProofSection from "@/components/seo/PodcastZoomProofSection";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const whatsappHref = buildWhatsAppHref({
  text: "שלום, אשמח לשלוח קובץ הקלטה לבדיקת ניקוי רעשים ושיפור סאונד.",
  utm_source: "website",
  utm_campaign: "podcast_before_after",
});

export default function PodcastBeforeAfter() {
  return (
    <div
      id="podcast-zoom-demo"
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <PodcastZoomProofSection />

      <div className="mt-7 text-center">
        <p className="text-sm text-muted-foreground">
          הקלטות זום, חדר ביתי או פרק גולמי - שלחו קובץ ונחזור עם הצעה וזמן מסירה
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          שלחו קובץ לבדיקה מהירה בוואטסאפ ←
        </a>
      </div>
    </div>
  );
}
