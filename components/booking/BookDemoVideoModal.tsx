"use client";

import { useEffect, useRef } from "react";
import { youtubeEmbedUrl } from "@/lib/data/youtube-embeds";
import { cn } from "@/lib/utils";

type BookDemoVideoModalProps = {
  open: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
};

export default function BookDemoVideoModal({
  open,
  onClose,
  videoId,
  title,
}: BookDemoVideoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  const embedUrl = youtubeEmbedUrl(videoId);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "w-[min(100%,42rem)] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-background p-0 shadow-xl backdrop:bg-black/60",
        "open:animate-in open:fade-in-0",
      )}
      aria-labelledby="demo-video-title"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 id="demo-video-title" className="text-sm font-semibold text-foreground">
          {title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-muted-foreground hover:bg-surface hover:text-foreground"
          aria-label="סגור"
        >
          ✕
        </button>
      </div>
      <div className="aspect-video w-full bg-black">
        {embedUrl && open ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            סרטון לא זמין
          </p>
        )}
      </div>
    </dialog>
  );
}
