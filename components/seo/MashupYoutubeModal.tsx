"use client";

import type { MashupYoutubeDemo } from "@/lib/mashup-music-theory";
import { useModalA11y } from "@/hooks/useModalA11y";

type MashupYoutubeModalProps = {
  demo: MashupYoutubeDemo | null;
  onClose: () => void;
};

export default function MashupYoutubeModal({ demo, onClose }: MashupYoutubeModalProps) {
  /* F-18, 7.10.2026: נעילת הגלילה עברה ל-hook המשותף עם מונה פניות. קודם
     overflow="" בסגירה יכול היה למחוק נעילה של שכבה אחרת (ולהפך). */
  const dialogRef = useModalA11y({ active: Boolean(demo), onEscape: onClose });

  if (!demo) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="דוגמת מאשאפ ביוטיוב"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-border bg-surface p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{demo.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {demo.source === "yakir" ? "גרסה מהאולפן" : "רפרנס מהקהילה, לא הורדה"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="סגירה"
          >
            ✕
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            title={demo.label}
            src={`https://www.youtube-nocookie.com/embed/${demo.videoId}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
